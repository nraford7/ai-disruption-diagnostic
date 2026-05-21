import Anthropic from "@anthropic-ai/sdk";
import { createServer } from "http";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Lazy client init: a missing key shouldn't stop the server from booting and
// serving static files / passing healthchecks. The API route reports it instead.
let client;
function getClient() {
  if (!client) client = new Anthropic();
  return client;
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

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
3-5 concrete strategic imperatives, prioritized. Not generic AI advice. Specific to this sector, this score profile, these dominant impact dimensions, and the regulatory environment. Each imperative should be actionable within 12 months. At least one imperative should directly address the regulatory environment — how to exploit it, defend against it, or position for its evolution.

REGULATORY CONTEXT RULES:
- The user selected a regulatory environment. It shapes WHICH dimensions of disruption hit hardest — it is NOT a uniform speed modifier.
- "Fortress regulation" dampens velocity and moat erosion but barely slows headcount pressure — compliance becomes the moat.
- "Patchwork/arbitrageable" amplifies moat erosion and restructuring — jurisdiction-shopping becomes a strategic capability.
- "Open field" amplifies everything evenly — market forces dominate, first movers win.
- "State-backed acceleration" amplifies velocity and headcount pressure but suppresses restructuring — the government absorbs transition costs.
- Weave regulatory implications into every section, not just "What To Do." How regulation shapes winners/losers, which futures become more likely, which activities are shielded or exposed.

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
- Use dashes (-) for any lists. Never use numbered lists.
- Do NOT start with a title or top-level heading (# ...). The title is already displayed in the UI. Begin directly with the first section (## The Verdict).`;

function buildUserMessage(data) {
  const dims = data.dominantImpact.scores;
  const dimNames = { H: "Headcount", M: "Margins", V: "Velocity/Speed", B: "Barrier/Moat Erosion", R: "Restructuring" };
  const dominantArr = Array.isArray(data.dominantImpact.dominant)
    ? data.dominantImpact.dominant
    : [data.dominantImpact.dominant];
  const dominant = dominantArr.join(" and ");
  const dominantLabel = dominantArr.map(k => dimNames[k] || k).join(" and ");

  const tierLabels = { T1: 'Narrow Assistants', T2: 'Very Good at a Few Things', T3: 'Average Human Professional', T4: 'Genius Level', T5: 'Superhuman Intelligence' };
  const regulationLabels = { restrictive: 'fortress (strict compliance)', fragmented: 'patchwork (arbitrageable)', permissive: 'open field (minimal rules)', supportive: 'state-backed acceleration' };

  let msg = `SECTOR: ${data.sectorName}
DISRUPTION SCORE: ${Math.round(data.score)}/100 (Zone: ${data.zone})
ASSUMPTIONS: ${tierLabels[data.selectedTier] || data.selectedTier} capability, ${data.horizon} horizon, ${data.adoptionLevel} adoption, ${regulationLabels[data.regulationLevel] || data.regulationLevel} regulation

REGULATORY ENVIRONMENT: ${regulationLabels[data.regulationLevel] || data.regulationLevel}
${data.regulationLevel === 'restrictive' ? 'Strict compliance regimes, precautionary principle, high liability exposure. Slows deployment velocity and moat erosion but barely touches headcount pressure. Compliance infrastructure becomes a competitive advantage.' : data.regulationLevel === 'fragmented' ? 'Rules vary by jurisdiction — companies shop for favorable regimes. Amplifies moat erosion and restructuring pressure as firms arbitrage across borders. Favors scale players who can navigate complexity.' : data.regulationLevel === 'permissive' ? 'Minimal AI-specific rules, market forces dominate. All disruption dimensions amplified roughly evenly. First movers and fast movers win. No regulatory shield for incumbents.' : data.regulationLevel === 'supportive' ? 'Government subsidizes AI deployment, builds regulatory sandboxes, handles liability frameworks. Accelerates velocity and headcount impact but suppresses restructuring pressure — the state absorbs transition costs.' : 'Unknown regulatory environment.'}

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
  // Health check — cheap, no file I/O or API key needed. Gives the platform a
  // reliable probe target so it doesn't recycle a healthy instance.
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("ok");
    return;
  }

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

    let activeClient;
    try {
      activeClient = getClient();
    } catch {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Server not configured: ANTHROPIC_API_KEY is missing." }));
      return;
    }

    try {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      });

      const stream = activeClient.messages.stream({
        model: "claude-sonnet-4-6",
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

server.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

server.listen(PORT, HOST, () => console.log(`Listening on ${HOST}:${PORT}`));

// Graceful shutdown so platform restarts/deploys don't surface as SIGTERM crashes.
// SSE streams hold sockets open, so force-exit if close() stalls.
function shutdown(signal) {
  console.log(`Received ${signal}, shutting down.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 5000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => console.error("Unhandled rejection:", reason));
