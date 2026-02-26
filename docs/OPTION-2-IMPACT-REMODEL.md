# Option 2: Executive-Native Impact Remodel

## Status
**Not implemented.** Documented here for consideration if Option 1 (narrative layer on top of existing A/C/P/T/D engine) hits a ceiling.

## The Problem Option 2 Solves

The current engine models disruption through five abstract academic dimensions:
- **A** (Automates) — task replacement
- **C** (Compresses Costs) — cost structure changes
- **P** (Productivity) — output-per-person multiplier
- **T** (Augments Talent) — expertise democratization
- **D** (Decision-making) — decision quality improvement

These are analytically clean but not how executives think. A CEO doesn't ask "What's my Automation score?" They ask: "How many people do I need next year?" "What happens to my margins?" "Where's my competitive moat?"

Option 1 adds a narrative layer that translates A/C/P/T/D into vivid, sector-specific language. This works well when the mapping is clear. But some executive-native concerns don't map cleanly to a single dimension:

- **Headcount impact** = f(A, P, adoption speed) — not just Automation
- **Margin pressure** = f(C, competitive dynamics, sector pricing) — not just Cost Compression
- **Competitive moat erosion** = f(T, D, knowledge barriers) — cross-dimensional

If concrete language bolted onto abstract dimensions starts feeling forced, it's because the abstraction is wrong for the audience.

## What Changes

### New Impact Dimensions

Replace A/C/P/T/D with executive-native dimensions:

| Current (Abstract) | Proposed (Executive-Native) | What It Answers |
|---|---|---|
| A (Automates) | **Headcount Exposure** | "How many roles are at risk?" |
| C (Compresses Costs) | **Margin Dynamics** | "What happens to my cost structure and pricing power?" |
| P (Productivity) | **Cycle Time Compression** | "How fast can work get done with fewer people?" |
| T (Augments Talent) | **Competitive Moat** | "Where does my defensible advantage actually live?" |
| D (Decision-making) | **Org Structure Pressure** | "Does my org chart still make sense?" |

### New Trigger Labels

Replace trigger IDs with named scenarios that tell a story:

| Current | Proposed |
|---|---|
| `scarce_knowledge` | "The $400/hr Associate Becomes a $40/hr Workflow" |
| `coordination_zero` | "The Firm Boundary Dissolves" |
| `unbundling` | "The Verification Bottleneck" |

### New Task Data

Each of the 35 tasks would need re-scored against the 5 new dimensions. The impact intensities (0-3) would need to reflect the new framing. This is the most labor-intensive part — roughly 35 tasks × 5 tiers × 5 dimensions = 875 data points to author.

### New Scoring Model

The engine math stays similar (weighted averages, normalization, adoption modifiers), but:
- Trigger logic would change to reflect new dimensions
- Recommendation rules would reference new dimension keys
- Co-dominance logic would need re-calibration against new score distributions

### New UI

- Radar chart labels change
- Structural shift cards get new titles and descriptions
- Risk blocks language changes throughout
- Scenario pills may need new vocabulary

## Scope Estimate

| Component | Effort |
|---|---|
| New task impact data (875 cells) | 2-3 days of careful authoring |
| Engine modifications | 1 day |
| UI/rendering updates | 1 day |
| Sensitivity analysis re-run | 0.5 days |
| Testing & calibration | 1-2 days |
| **Total** | **~6-8 days** |

## When to Consider This

Trigger for revisiting Option 2:
1. **Narrative layer feels forced** — if authoring sector narratives consistently requires awkward mapping from A/C/P/T/D to what executives actually care about
2. **User testing feedback** — if executives understand the narrative text but find the radar chart / dimension labels confusing
3. **Expansion to new verticals** — if adding sectors 17+ reveals that the A/C/P/T/D framing doesn't accommodate their reality
4. **Stakeholder request** — if the tool is being pitched to boards/C-suite and the abstract framing creates credibility friction

## What NOT to Do

- Don't mix frameworks. Either run A/C/P/T/D with narrative overlays (Option 1) or run executive-native dimensions (Option 2). Hybrid = confusion.
- Don't start Option 2 before Option 1 has been tested with real users. The narrative layer may be sufficient.
- Don't assume Option 2 is "better." It trades analytical precision for executive legibility. That's a tradeoff, not an upgrade.

## Dependencies

- Option 1 must be fully deployed and tested first
- User feedback from at least 3-5 executive-level users
- Buy-in on the specific dimension names (Headcount Exposure, Margin Dynamics, etc.)
- Academic grounding for the new dimensions — the current A/C/P/T/D framework has citations (Autor, Acemoglu, etc.), the new one would need equivalent rigor
