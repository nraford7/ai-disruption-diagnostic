import Anthropic from "@anthropic-ai/sdk";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const client = new Anthropic();
const PORT = process.env.PORT || 3000;

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const SYSTEM_PROMPT = `You are a senior strategy partner writing an AI disruption briefing for a CEO. You receive computed diagnostic data about how AI impacts their specific industry sector.

Write a structured strategic briefing with these exact sections, using markdown headers:

## The Verdict
One bold opening sentence. The headline finding. No hedging.

## What Happens to Your Industry
2-3 paragraphs. How AI rewrites this sector's value chain. Be specific about WHICH activities get automated, accelerated, or commoditized. Reference the actual work that gets disrupted — not abstract categories. Write like you're explaining to someone who runs a company in this sector, not someone who studies AI. Each paragraph must open with a bold headline on its own line — a specific, punchy claim — followed by a blank line, then the paragraph body.

## Who Wins, Who Loses
Which types of firms gain advantage? Which business models break? Which competitive positions strengthen or collapse? Be concrete and directional. Name the archetypes (the boutique, the incumbent, the platform player, the specialist). Each paragraph must open with a bold headline on its own line — a specific, punchy claim — followed by a blank line, then the paragraph body.

## Three Plausible Futures
Present 3 named scenarios based on the data. Each scenario gets a bold title on its own line — that IS the paragraph-level headline — followed by a blank line, then 2-3 sentences of prose. These should feel like real strategic scenarios a board would discuss, not abstract possibilities. Draw from the scenario severity data provided.

## What To Do About It
3-5 concrete strategic imperatives, prioritized. Not generic AI advice. Specific to this sector, this score profile, these dominant impact dimensions. Each imperative should be actionable within 12 months.

STYLE RULES:
- Write for a CEO who has 5 minutes. Dense, specific, no filler.
- Never use the word "landscape" or "leverage" or "paradigm."
- No bullet points in the narrative sections. Prose only. Bullets OK in "What To Do."
- Bold key phrases for scanning.
- Every paragraph in narrative sections opens with a bold headline on its own line — a specific, punchy claim (e.g., **The talent pipeline breaks completely**). Then a blank line, then the paragraph body. This makes the briefing scannable. The headline is NOT a section header — it's a paragraph-level lead.
- Reference specific activities and roles from the data — not abstract "tasks."
- The tone is authoritative but not academic. Think senior partner at McKinsey writing a private memo, not a blog post.
- Do not explain what AI is. The reader knows.
- Do not include disclaimers about uncertainty. The reader selected their own assumptions.
- Use dashes (-) for any lists. Never use numbered lists.`;

function buildUserMessage(data) {
  const dims = data.dominantImpact.scores;
  const dimNames = { H: "Headcount", M: "Margins", V: "Velocity/Speed", B: "Barrier/Moat Erosion", R: "Restructuring" };
  const dominantArr = Array.isArray(data.dominantImpact.dominant)
    ? data.dominantImpact.dominant
    : [data.dominantImpact.dominant];
  const dominant = dominantArr.join(" and ");
  const dominantLabel = dominantArr.map(k => dimNames[k] || k).join(" and ");

  const tierLabels = { T1: 'Narrow Assistants', T2: 'Skilled Specialists', T3: 'Autonomous Professionals', T4: 'Cross-Domain Experts', T5: 'Superhuman Intelligence' };

  let msg = `SECTOR: ${data.sectorName}
DISRUPTION SCORE: ${Math.round(data.score)}/100 (Zone: ${data.zone})
ASSUMPTIONS: ${tierLabels[data.selectedTier] || data.selectedTier} capability, ${data.horizon} horizon, ${data.adoptionLevel} adoption

DOMINANT IMPACT DIMENSION: ${dominant} (${dominantLabel})

DIMENSION SCORES (0-3 scale):
- Headcount pressure: ${dims.H.toFixed(1)}
- Margin compression: ${dims.M.toFixed(1)}
- Velocity gains: ${dims.V.toFixed(1)}
- Moat erosion: ${dims.B.toFixed(1)}
- Restructuring pressure: ${dims.R.toFixed(1)}

TIMELINE PROJECTION:
${data.timeline.map(t => `  ${t.year}yr: ${Math.round(t.score)}/100`).join("\n")}

SCENARIO ANALYSIS:
${data.scenarios.map(s => `  ${s.label}: ${s.severity} (score: ${s.score.toFixed(1)})${s.severity !== "none" ? " — " + s.description : ""}`).join("\n")}

TOP TASKS MOST AFFECTED (by weighted impact):
${data.taskDetails.slice(0, 8).map(t => {
    const pct = (t.weight * 100).toFixed(0);
    return `  ${t.name} (${pct}% of sector effort) — H:${t.impacts.H} M:${t.impacts.M} V:${t.impacts.V} B:${t.impacts.B} R:${t.impacts.R}`;
  }).join("\n")}

MOST RESILIENT TASKS:
${data.taskDetails.slice(-3).reverse().map(t => {
    const pct = (t.weight * 100).toFixed(0);
    return `  ${t.name} (${pct}% of sector effort) — total impact: ${(t.score * 15).toFixed(0)}/15`;
  }).join("\n")}

Write the strategic briefing now.`;

  return msg;
}

const server = createServer(async (req, res) => {
  // API endpoint
  if (req.method === "POST" && req.url === "/api/briefing") {
    let body = "";
    for await (const chunk of req) body += chunk;

    let data;
    try {
      data = JSON.parse(body);
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    try {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const stream = client.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserMessage(data) }],
      });

      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`);
        }
      }

      res.write("data: [DONE]\n\n");
      res.end();
    } catch (err) {
      console.error("Claude API error:", err.message);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Analysis unavailable. Try again." }));
      } else {
        res.write(`data: ${JSON.stringify({ error: "Analysis interrupted." })}\n\n`);
        res.end();
      }
    }
    return;
  }

  // Static files
  const filePath = join(__dirname, req.url === "/" ? "index.html" : req.url);
  const ext = extname(filePath);
  const contentType = MIME[ext] || "application/octet-stream";

  try {
    const fileData = await readFile(filePath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(fileData);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
