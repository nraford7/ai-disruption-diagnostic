# AI Disruption Diagnostic — Sensitivity Analysis

---

## Section A: Executive Summary

**What we did:** We stress-tested the scoring engine that powers the AI Disruption Diagnostic. We ran 107,516 simulated scenarios — changing capability tiers, adoption speeds, time horizons, and individual data inputs — to see whether the scores the tool produces are trustworthy, meaningful, and differentiated across sectors.

**What we found:** The engine has real analytical value, but five scoring mechanics were creating distortions that inflated scores, compressed differences between sectors, and triggered structural alerts too aggressively.

### Traffic Light Summary

| Area | Status | Meaning |
|------|--------|---------|
| **Sector scores at low/mid tiers (T1–T3)** | 🟢 Green | Scores differentiate meaningfully between sectors. Relative rankings are trustworthy. |
| **Sector scores at T4–T5** | 🔴 Red | All 16 sectors converge to 100 at T5. At T4, the spread is only 11 points. The model says "everyone is equally disrupted" at high capability — that's the math, not reality. |
| **Structural shift triggers** | 🔴 Red | "Coordination costs → zero" fires in 88% of all scenarios, including at T1–T2 where it shouldn't. The triggers don't discriminate — they fire for nearly everyone. |
| **Dominant impact type** | 🟡 Yellow | Generally stable, but the co-dominance threshold is too loose. Some "single dominant" calls are actually near-ties being split by rounding. |
| **Monte Carlo robustness** | 🟡 Yellow | Individual sector scores are stable under random perturbation (CV of 4–9%). But all 16 sectors cluster in a 17-point band (66–83), meaning the model sees less difference between Financial Services and Mining than actually exists. |
| **Adoption & timeline modeling** | 🟢 Green | Adoption speed and time horizon behave as designed. No artifacts detected. |

### What this means for trust

The diagnostic's *relative* sector rankings and directional guidance are sound. A CEO can trust the model to say "your sector faces more disruption from AI than that sector" and "automation is your dominant pressure." What they *cannot* currently trust: absolute score levels at high capability tiers, the structural shift triggers ("your industry's knowledge is becoming worthless" fires for almost everyone), or fine score differences between sectors at T4–T5.

**Five targeted fixes** address these issues. No data changes required — only scoring mechanics.

---

## Section B: Technical Detail

### Methodology

Seven complementary analyses were run against the scoring engine, totaling 107,516 engine calls across 5,000 Monte Carlo iterations:

| # | Analysis | Engine Calls | What It Measures |
|---|----------|-------------|------------------|
| 1 | **Full Enumeration** | 960 | Cartesian product: 5 tiers × 4 horizons × 3 adoption levels × 16 sectors. Complete score/zone/trigger map. |
| 2 | **OAT Sensitivity** | 84 | One-at-a-time parametric sweeps from 3 baselines (low/mid/high disruption). Isolates each parameter's leverage and nonlinearity. |
| 3 | **Weight Sensitivity** | 6,810 | Sweeps individual task weights per sector. Identifies which task weightings most influence final scores. |
| 4 | **Impact Sensitivity** | 17,744 | Sweeps individual impact values (A/C/P/T/D) per task. Identifies most influential single data points. |
| 5 | **Monte Carlo** | 80,000 | 5,000 iterations of simultaneous random perturbation (weights ×[0.8,1.2], impacts ±1). Accumulates distribution statistics per sector. |
| 6 | **Threshold Map** | 80 | Margin analysis for all 3 structural triggers across all sector/tier combinations. Identifies cliff edges. |
| 7 | **Dominant Stability** | 1,838 | Minimum single-impact perturbation to flip dominant impact type per sector/tier. |

### Findings

| # | Finding | Verdict | Severity |
|---|---------|---------|----------|
| 1 | All 16 sectors converge to score 100.0 at T5 | **Artifact** | High |
| 2 | T4 scores compress to 89–100 range (10.8 spread) | **Artifact** | High |
| 3 | Monotonic floor inflates mid-tier scores | **Artifact** | Medium |
| 4 | Triggers fire universally at T3+ | **Amplified Signal** | High |
| 5 | Co-dominance threshold produces false single-dominant calls | **Amplified Signal** | Medium |
| 6 | Tier is dominant parameter (73 leverage vs sector at 12) | **Genuine** | Informational |
| 7 | Monte Carlo CV of 4–9% per sector | **Genuine** | Informational |

### Finding 1: T5 Score Convergence (Artifact)

**Mechanism:** `computeTaskScore` normalizes by dividing `impactSum(task, selectedTier)` by `peakSum` — the maximum impact sum that task achieves across *any* tier. At T5, most tasks hit their peak, so `sum / peakSum = 1.0`. Every task scores 1.0, every weighted sum equals the sum of weights (≈1.0), and cross-sector normalization maps the highest raw score to 100.

**Evidence:**
- T5 high adoption: all 16 sectors = 100.00 (spread = 0.00)
- T5 all adoption levels: all 192 scenarios = Restructuring zone

**Root cause:** Dynamic `peakSum` normalization guarantees convergence. The theoretical maximum should be fixed at 15 (5 dimensions × 3 max intensity), not the task's own peak.

### Finding 2: T4 Score Compression (Artifact)

**Mechanism:** Combination of dynamic `peakSum` (which inflates scores toward 1.0 as tasks approach their peak) and the monotonic floor (which prevents scores from decreasing). By T4, most tasks are near their peak, and the floor locks them there.

**Evidence:**
- T4 high adoption: range 89.16–100.00, spread 10.84
- T4 zone distribution: 180 Restructuring, 12 Disrupting (out of 192)

### Finding 3: Monotonic Floor Inflation (Artifact)

**Mechanism:** Line 147: `Math.max(raw, prevScore)` ensures a task's score at tier N is always ≥ its score at tier N−1. If a task genuinely has lower impact at a higher tier (e.g., a task that peaks at T3 and declines), the floor hides this. Combined with peak normalization, the floor accelerates convergence.

**Evidence:**
- Zone distribution shows no "Resilient" or "Adapting" scenarios at T3+ for any sector
- T3 minimum score (high adoption): 63.68 — already in Disrupting zone

### Finding 4: Trigger Over-Firing (Amplified Signal)

The three structural shift triggers fire far too aggressively:

| Trigger | Firing Rate | Expected Behavior |
|---------|------------|-------------------|
| Coordination costs → zero | 840/960 (87.5%) | Should fire for coordination-heavy sectors at high tiers |
| Scarce knowledge → zero value | 504/960 (52.5%) | Should fire for knowledge-intensive sectors at high tiers |
| Unbundling & new bottlenecks | 432/960 (45.0%) | Should fire when automation is high but verification/strategy remain low |

**Firing by tier:**
| Tier | Coordination | Scarce Knowledge | Unbundling |
|------|-------------|-----------------|------------|
| T1 | fires in some sectors | — | — |
| T2 | fires in most sectors | fires in some | — |
| T3 | universal | widespread | widespread |
| T4 | universal | universal | universal |
| T5 | universal | universal | universal |

**74 cliff edges** detected — scenarios where a single impact point change (±1) flips a trigger on or off.

**Root cause:** Thresholds set too low:
- `hwmAvgT >= 2.0` triggers scarce knowledge with moderate talent disruption
- `avgMaxAP >= 2.0` triggers coordination zero with moderate automation/productivity
- `avgA >= 1.5` triggers unbundling with low-moderate automation

These thresholds are met by typical T2–T3 impact profiles, removing their discriminating power.

### Finding 5: Co-Dominance Threshold Too Loose (Amplified Signal)

**Mechanism:** Line 451: two impact types are reported as "co-dominant" only if the gap between them is ≥ 0.3. On a 0–3 scale, a 0.3 gap is small — the engine calls impacts "single dominant" when they're essentially tied.

**Evidence from dominant stability analysis:**
- Multiple sector/tier combinations show margins of 0.27–0.29 classified as single-dominant
- Example: Financial Services T3 shows T/A co-dominant with margin 0.27, but many similar margins are called single-dominant

### Finding 6: Tier Dominance (Genuine)

**OAT parameter ranking:**
| Parameter | Average Leverage |
|-----------|-----------------|
| Tier | 73.1 |
| Adoption | 12.4 |
| Sector | 12.0 |
| Horizon | 0.0 |

Tier choice explains ~73% of score variation. This is partially genuine (capability tier *should* be the strongest driver) and partially inflated by Findings 1–3 (score compression at high tiers amplifies the tier-to-tier jump).

### Finding 7: Monte Carlo Stability (Genuine)

Per-sector Monte Carlo distributions (T3/H2/medium baseline, 5,000 iterations):

| Sector | Mean | StDev | CV | Range |
|--------|------|-------|-----|-------|
| Financial Services | 82.3 | 3.7 | 4.5% | 67.6–92.4 |
| Healthcare | 68.9 | 5.1 | 7.4% | 46.5–86.9 |
| IT & Software | 78.7 | 3.6 | 4.6% | 59.6–89.1 |
| Media & Creative | 81.2 | 3.5 | 4.2% | 66.3–91.6 |
| Professional Services | 76.9 | 4.2 | 5.4% | 61.1–90.6 |
| Education | 71.8 | 6.3 | 8.8% | 49.3–89.6 |
| Government | 78.4 | 3.8 | 4.9% | 62.0–91.5 |
| Manufacturing | 69.9 | 5.8 | 8.3% | 43.1–87.1 |
| Energy | 68.4 | 4.8 | 7.0% | 49.6–83.3 |
| Construction | 69.9 | 5.7 | 8.2% | 47.9–87.4 |
| Transportation | 72.0 | 5.8 | 8.1% | 47.8–89.3 |
| Retail | 79.5 | 3.8 | 4.8% | 61.4–90.6 |
| Agriculture | 68.6 | 6.0 | 8.7% | 45.5–86.2 |
| Mining | 66.8 | 5.9 | 8.8% | 44.7–83.9 |
| Telecom | 76.2 | 3.9 | 5.1% | 59.4–90.0 |
| Defense & Aerospace | 70.5 | 4.7 | 6.6% | 53.1–85.7 |

Cross-sector mean range: 66.8–82.3 (15.5-point band). Scores are individually stable but collectively compressed — genuine sector differences exist but are understated by the normalization mechanics.

### Normalization Boundary Analysis

The cross-sector normalization in `computeGlobalRange()` maps the lowest raw sector score (at T1) to 0 and the highest (at T5) to 100. Because T5 scores converge to 1.0 (Finding 1), the maximum boundary is essentially fixed. This means the 0–100 scale is anchored to an artificial ceiling, compressing all scores upward.

**Effect chain:** Dynamic peak norm → T5 convergence → global max ≈ 1.0 → normalization scale compressed → mid-tier scores inflated → cross-sector differentiation reduced.

### Trigger Cliff Inventory

74 cliff edges detected across all sector/tier combinations. A cliff edge is a scenario where a single impact value change (±1 on a 0–3 scale) flips a trigger on or off.

Notable cliff edges:
- **Coordination zero** fires at T2 for Financial Services, Manufacturing, Professional Services (margin = 0)
- **Scarce knowledge** is at exact threshold for Healthcare T2, Media T1, Government T1
- At T3+, most triggers have positive margins (already triggered), making them unfalsifiable

This density of cliff edges at low tiers indicates thresholds are set near the natural resting point of the data, creating noisy on/off behavior rather than meaningful structural signals.
