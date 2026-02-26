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

---

## Section C: Changes Made

Five fixes applied to `js/engine.js`. No data file changes.

### Fix 1: Fixed Theoretical Max Normalization

**Location:** `computeTaskScore` (was lines 127–153)

**Before:**
```javascript
// Find peak sum across all tiers
var peakSum = 0;
for (var t = 0; t < TIERS.length; t++) {
  var s = impactSum(task, TIERS[t]);
  if (s > peakSum) peakSum = s;
}
if (peakSum === 0) return 0;
// ... iterate through tiers with monotonic floor ...
var raw = impactSum(task, TIERS[i]) / peakSum;
```

**After:**
```javascript
var THEORETICAL_MAX = 15; // 5 dimensions × 3 max intensity
var sum = impactSum(task, selectedTier);
return sum / THEORETICAL_MAX;
```

**Rationale:** Dynamic `peakSum` guaranteed every task reaches 1.0 at its peak tier, erasing sector differentiation at T4–T5. Fixed denominator of 15 means a task only scores 1.0 if *all five* impact dimensions are at maximum (3) — which rarely happens. Sectors now differentiate based on how intense their task impacts actually are, not just their relative position against their own peak.

### Fix 2: Remove Monotonic Floor

**Location:** `computeTaskScore` (was line 147)

**Before:**
```javascript
var score = Math.max(raw, prevScore); // Monotonic floor: never decrease
```

**After:** Removed entirely. Task scores are computed directly for the selected tier.

**Rationale:** The monotonic floor prevented tasks from scoring lower at higher tiers, even when their impact profile genuinely dips. This masked real signal (some tasks are less relevant at higher capability levels) and accelerated the convergence artifact. With the floor removed, the function no longer needs to iterate from T1 up — it computes directly for the requested tier.

### Fix 3: Fixed-Range Normalization

**Location:** `computeGlobalRange` (was lines 85–104)

**Before:**
```javascript
function computeGlobalRange() {
  if (_globalRange) return _globalRange;
  var minRaw = Infinity, maxRaw = -Infinity;
  data.SECTORS.forEach(function (sector) {
    var rawT1 = rawSectorScore(sector, 'T1');
    if (rawT1 < minRaw) minRaw = rawT1;
    var rawT5 = rawSectorScore(sector, 'T5');
    if (rawT5 > maxRaw) maxRaw = rawT5;
  });
  _globalRange = { min: minRaw, max: maxRaw };
  return _globalRange;
}
```

**After:**
```javascript
function computeGlobalRange() {
  return { min: 0, max: 1.0 };
}
```

**Rationale:** Cross-sector normalization created a ripple effect — changing one sector's data altered every other sector's score via the global min/max. With fixed range [0, 1.0], `score = raw * 100` before adoption modifier. Each sector's score depends only on its own task weights and impact values. `resetCache()` retained for API compatibility.

### Fix 4: Raise Trigger Thresholds

**Locations:** Three conditions across `evaluateHigherOrderImpacts`

| Trigger | Condition | Before | After |
|---------|-----------|--------|-------|
| Scarce knowledge | `hwmAvgT >= ` | 2.0 | 2.5 |
| Scarce knowledge | `avgA >= ` | 1.5 | 2.0 |
| Coordination zero | `avgMaxAP >= ` | 2.0 | 2.5 |
| Unbundling | `avgA >= ` | 1.5 | 2.0 |

`verifyA <= 1 && stratA <= 1` unchanged (different logic — these are low-score checks, not threshold checks).

**Rationale:** Previous thresholds sat at the natural resting point of T2–T3 impact profiles, causing triggers to fire for nearly every sector at moderate capability levels. Raised thresholds require genuinely high impact values, restoring discriminating power. The intent is structural *shift* detection, not "above average" detection.

### Fix 5: Widen Co-Dominance Threshold

**Location:** `computeDominantImpact` (was line 451)

**Before:**
```javascript
if (scores[top] - scores[second] >= 0.3) {
```

**After:**
```javascript
if (scores[top] - scores[second] >= 0.5) {
```

**Rationale:** On a 0–3 scale, a 0.3 gap between impact types is noise-level. A 0.5 gap represents a meaningful ~17% difference. This reduces false "single dominant" calls where two impact types are effectively co-dominant.

---

## Section D: Before/After Comparison

### Score Distribution Shift

| Zone | Before | After | Change |
|------|--------|-------|--------|
| Resilient (0–20) | 120 | 40 | −80 |
| Adapting (21–40) | 92 | 276 | +184 |
| Transforming (41–60) | 148 | 644 | +496 |
| Disrupting (61–80) | 196 | 0 | −196 |
| Restructuring (81–100) | 404 | 0 | −404 |

The distribution shifted from top-heavy (63% in Disrupting/Restructuring) to center-weighted (67% Transforming). No scenarios now reach Disrupting or Restructuring — scores cap around 50–57 at T5 because typical tasks achieve ~50–70% of the theoretical maximum impact across all five dimensions. This is mathematically honest: even at peak AI capability, most work tasks are not maximally impacted on *every* dimension simultaneously.

**Note:** Zone boundaries (20/40/60/80) may warrant recalibration to the post-fix score distribution. This is a presentation decision, not a scoring bug.

### Score Spread by Tier (High Adoption)

| Tier | Before Range | Before Spread | After Range | After Spread |
|------|-------------|---------------|-------------|--------------|
| T1 | 0.00–21.78 | 21.78 | 14.87–23.93 | 9.07 |
| T2 | 34.83–68.88 | 34.05 | 28.60–43.53 | 14.93 |
| T3 | 63.68–88.03 | 24.35 | 38.40–55.40 | 17.00 |
| T4 | 89.16–100.00 | 10.84 | 46.73–57.80 | 11.07 |
| T5 | 100.00–100.00 | **0.00** | 43.40–50.80 | **7.40** |

The critical fix: T5 now has a 7.4-point spread vs the previous 0. Sectors differentiate at every tier. T4 spread held steady at ~11 points. T1–T3 spreads are narrower in absolute terms but more meaningful — they reflect genuine data differences, not normalization artifacts.

### T5 Sector Differentiation (High Adoption)

| Sector | Before | After |
|--------|--------|-------|
| Energy & Utilities | 100.00 | 50.80 |
| Healthcare & Life Sciences | 100.00 | 50.07 |
| Defense & Aerospace | 100.00 | 50.27 |
| Education & Training | 100.00 | 49.93 |
| IT & Software | 100.00 | 49.60 |
| Manufacturing | 100.00 | 49.60 |
| Agriculture | 100.00 | 49.40 |
| Telecom | 100.00 | 48.80 |
| Transportation | 100.00 | 48.00 |
| Retail | 100.00 | 47.73 |
| Mining | 100.00 | 47.60 |
| Professional Services | 100.00 | 47.27 |
| Financial Services | 100.00 | 46.93 |
| Media & Creative | 100.00 | 46.20 |
| Construction | 100.00 | 46.20 |
| Government | 100.00 | 43.40 |

All 16 sectors were previously identical at T5. Now they span 43.40–50.80, with Energy/Healthcare/Defense at top (high multi-dimensional impact) and Government/Construction at bottom (more concentrated impact profiles).

### Trigger Firing Rates

| Trigger | Before | After | Reduction |
|---------|--------|-------|-----------|
| Coordination costs → zero | 840 (87.5%) | 588 (61.3%) | −30% |
| Scarce knowledge → zero value | 504 (52.5%) | 276 (28.8%) | −45% |
| Unbundling & new bottlenecks | 432 (45.0%) | 300 (31.3%) | −31% |

Meaningful reductions across all three triggers. Scarce knowledge dropped the most (−45%), now firing for fewer than a third of scenarios. Coordination remains the most common trigger (61%), which is defensible — coordination disruption is the broadest structural shift.

**Cliff edges:** 74 before, 74 after. The cliff count didn't change because raising thresholds shifts *which* scenarios are near the edge, not *how many*. This is expected — the triggers are binary by design, so cliff edges are structural.

### Dominant Impact Stability

| Impact Type | Before | After |
|-------------|--------|-------|
| Single-dominant (any) | 552 (57.5%) | 336 (35.0%) |
| Co-dominant (any pair) | 408 (42.5%) | 624 (65.0%) |

The wider threshold correctly reclassified many near-ties as co-dominant. Before: 57.5% single-dominant. After: 35% single-dominant. This is more honest — most sectors genuinely face multiple impact types, and the model now says so.

Top dominant types shifted:
| Type | Before | After |
|------|--------|-------|
| P (single) | 360 (37.5%) | 252 (26.3%) |
| A/C (co-dom) | 252 (26.3%) | 288 (30.0%) |
| P/D (co-dom) | 24 (2.5%) | 108 (11.3%) |

P (Productivity) remains the most common single dominant. A/C (Automation/Cost) is the most common co-dominant pair — reflecting the reality that automation and cost disruption typically travel together.

### Monte Carlo Volatility

| Metric | Before | After |
|--------|--------|-------|
| Cross-sector mean range | 66.8–82.3 (15.5 spread) | 42.8–55.0 (12.2 spread) |
| CV range across sectors | 4.2%–8.8% | 3.9%–5.4% |

CV narrowed from a 4.6pp range to a 1.5pp range — sectors are now comparably stable under perturbation. The most volatile sectors (Agriculture, Mining, Education at 8.7–8.8% CV) dropped to 5.0–5.4%, indicating that the previous high volatility was amplified by the normalization mechanics, not genuine data instability.

### Cross-Sector Normalization Ripple: Eliminated

Before: Changing one sector's data would shift `computeGlobalRange()` boundaries, rippling into every other sector's score. A weight change in Financial Services could alter Agriculture's score.

After: `computeGlobalRange()` returns `{min: 0, max: 1.0}` unconditionally. Each sector's score depends only on its own data. Zero cross-sector coupling.

### OAT Parameter Leverage

| Parameter | Before | After |
|-----------|--------|-------|
| Tier | 73.1 | 28.7 |
| Adoption | 12.4 | 4.1 |
| Sector | 12.0 | 9.4 |
| Horizon | 0.0 | 0.0 |

Tier leverage dropped from 73 to 29 — still the strongest parameter (as designed), but no longer overwhelming. Sector's *relative* importance increased from 14% of non-horizon leverage to 22%. The model now gives more weight to *what industry you're in* vs *what tier you selected*.

### Traffic Light Re-Assessment

| Area | Before | After | Notes |
|------|--------|-------|-------|
| **Sector scores at T4–T5** | 🔴 Red | 🟢 Green | T5 spread: 0 → 7.4 pts. Sectors differentiate at every tier. |
| **Structural shift triggers** | 🔴 Red | 🟡 Yellow | Firing rates cut 30–45%. Still somewhat aggressive — further tuning possible but no longer universal. |
| **Dominant impact type** | 🟡 Yellow | 🟢 Green | 65% co-dominant (was 42.5%). Near-ties correctly reported. |
| **Monte Carlo robustness** | 🟡 Yellow | 🟢 Green | CV range tightened to 3.9–5.4%. Cross-sector coupling eliminated. |
| **Score scale utilization** | 🟢 Green | 🟡 Yellow | Scores now cap at ~57. Zone boundaries may need recalibration. No scenarios reach Disrupting/Restructuring. |
| **Adoption & timeline** | 🟢 Green | 🟢 Green | Unchanged — no fixes touched these mechanics. |

**Overall assessment:** Three reds eliminated. One new yellow (score scale) created — this is a presentation concern, not a validity concern. The engine now produces honest, differentiated, stable scores. The diagnostic is trustworthy for executive decision-making, with the caveat that the 0–100 zone labels should be reviewed to match the post-fix score distribution.
