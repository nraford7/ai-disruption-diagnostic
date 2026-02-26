/**
 * AI Disruption Diagnostic — Data Layer
 *
 * All data transcribed from the design spec (2026-02-26).
 * Academic grounding: Autor/Levy/Murnane (2003), Acemoglu (2024),
 * Hampole et al. (2025), Catalini/Hui/Wu (2026).
 *
 * Exports: window.DiagnosticData
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Helper: build an impacts object for all five tiers.
  // Each tier is { A, C, P, T, D } defaulting to 0.
  // ---------------------------------------------------------------------------
  function impacts(t1, t2, t3, t4, t5) {
    var base = { A: 0, C: 0, P: 0, T: 0, D: 0 };
    function merge(obj) {
      return Object.assign({}, base, obj);
    }
    return {
      T1: merge(t1),
      T2: merge(t2),
      T3: merge(t3),
      T4: merge(t4),
      T5: merge(t5)
    };
  }

  // ---------------------------------------------------------------------------
  // TASKS — 35 universal tasks
  // ---------------------------------------------------------------------------
  var TASKS = [
    // ---- Routine Cognitive (1-7) ----
    {
      id: 1,
      name: 'Data entry & record-keeping',
      category: 'routine_cognitive',
      measurability: 'High',
      verificationCost: 'Low',
      impacts: impacts(
        { A: 2, C: 2, P: 1 },           // T1
        { A: 3, C: 3 },                  // T2
        { A: 3, C: 3 },                  // T3
        { A: 3, C: 3 },                  // T4
        { A: 3, C: 3 }                   // T5
      )
    },
    {
      id: 2,
      name: 'Transaction processing',
      category: 'routine_cognitive',
      measurability: 'High',
      verificationCost: 'Low',
      impacts: impacts(
        { A: 2, C: 2 },                  // T1
        { A: 3, C: 3, P: 1 },            // T2
        { A: 3, C: 3 },                  // T3
        { A: 3, C: 3 },                  // T4
        { A: 3, C: 3 }                   // T5
      )
    },
    {
      id: 3,
      name: 'Scheduling & resource allocation',
      category: 'routine_cognitive',
      measurability: 'High',
      verificationCost: 'Low-Med',
      impacts: impacts(
        { P: 2, D: 1 },                  // T1
        { P: 3, D: 2 },                  // T2
        { A: 2, D: 3, C: 2 },            // T3
        { A: 3, D: 3, C: 3 },            // T4
        { A: 3, D: 3, C: 3 }             // T5
      )
    },
    {
      id: 4,
      name: 'Regulatory compliance filing',
      category: 'routine_cognitive',
      measurability: 'High',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 2, T: 1 },                  // T1
        { P: 3, T: 2, A: 1 },            // T2
        { A: 2, C: 2, T: 3 },            // T3
        { A: 3, C: 3, T: 3 },            // T4
        { A: 3, C: 3 }                   // T5
      )
    },
    {
      id: 5,
      name: 'Bookkeeping & financial reporting',
      category: 'routine_cognitive',
      measurability: 'High',
      verificationCost: 'Low-Med',
      impacts: impacts(
        { A: 2, C: 2, P: 1 },            // T1
        { A: 3, C: 3, P: 1 },            // T2
        { A: 3, C: 3 },                  // T3
        { A: 3, C: 3 },                  // T4
        { A: 3, C: 3 }                   // T5
      )
    },
    {
      id: 6,
      name: 'Quality control / inspection (standard)',
      category: 'routine_cognitive',
      measurability: 'High',
      verificationCost: 'Low',
      impacts: impacts(
        { P: 2, D: 1 },                  // T1
        { P: 3, D: 2, A: 1 },            // T2
        { A: 2, C: 2, D: 2 },            // T3
        { A: 3, C: 3, D: 3 },            // T4
        { A: 3, C: 3, D: 3 }             // T5
      )
    },
    {
      id: 7,
      name: 'Document review & classification',
      category: 'routine_cognitive',
      measurability: 'High',
      verificationCost: 'Low-Med',
      impacts: impacts(
        { P: 2, T: 2 },                  // T1
        { P: 3, T: 3, A: 1 },            // T2
        { A: 2, C: 2, T: 3 },            // T3
        { A: 3, C: 3 },                  // T4
        { A: 3, C: 3 }                   // T5
      )
    },

    // ---- Routine Manual (8-12) ----
    {
      id: 8,
      name: 'Assembly & fabrication',
      category: 'routine_manual',
      measurability: 'High',
      verificationCost: 'Low',
      impacts: impacts(
        { P: 1 },                         // T1
        { P: 2, C: 1 },                   // T2
        { A: 1, P: 2, C: 2 },             // T3
        { A: 2, C: 2, P: 2 },             // T4
        { A: 3, C: 3 }                    // T5
      )
    },
    {
      id: 9,
      name: 'Material handling & warehousing',
      category: 'routine_manual',
      measurability: 'High',
      verificationCost: 'Low',
      impacts: impacts(
        { P: 1, D: 1 },                   // T1
        { P: 2, A: 1, C: 1 },             // T2
        { A: 2, C: 2, D: 2 },             // T3
        { A: 3, C: 3 },                   // T4
        { A: 3, C: 3 }                    // T5
      )
    },
    {
      id: 10,
      name: 'Vehicle / equipment operation (fixed route)',
      category: 'routine_manual',
      measurability: 'High',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 1, D: 1 },                   // T1
        { P: 2, D: 2 },                   // T2
        { A: 2, C: 2 },                   // T3
        { A: 3, C: 3 },                   // T4
        { A: 3, C: 3 }                    // T5
      )
    },
    {
      id: 11,
      name: 'Cleaning, maintenance & facility ops',
      category: 'routine_manual',
      measurability: 'Med',
      verificationCost: 'Low',
      impacts: impacts(
        { P: 1 },                          // T1
        { P: 1, D: 1 },                   // T2
        { P: 2, A: 1 },                   // T3
        { A: 2, C: 1 },                   // T4
        { A: 3, C: 3 }                    // T5
      )
    },
    {
      id: 12,
      name: 'Harvesting & extraction',
      category: 'routine_manual',
      measurability: 'Med',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 1, D: 1 },                   // T1
        { P: 2, D: 1 },                   // T2
        { A: 1, P: 2, D: 2 },             // T3
        { A: 2, C: 2 },                   // T4
        { A: 3, C: 3 }                    // T5
      )
    },

    // ---- Non-Routine Analytical (13-20) ----
    {
      id: 13,
      name: 'Data analysis & business intelligence',
      category: 'non_routine_analytical',
      measurability: 'High',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 2, T: 2, D: 1 },             // T1
        { P: 3, T: 3, D: 2 },             // T2
        { A: 2, T: 3, D: 3, C: 2 },       // T3
        { A: 3, C: 3, D: 3 },             // T4
        { A: 3, C: 3, D: 3 }              // T5
      )
    },
    {
      id: 14,
      name: 'Software development & engineering',
      category: 'non_routine_analytical',
      measurability: 'Med-High',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 2, T: 2 },                   // T1
        { P: 3, T: 3, D: 1 },             // T2
        { A: 2, P: 3, T: 3, C: 2 },       // T3
        { A: 3, C: 3, T: 3 },             // T4
        { A: 3, C: 3 }                    // T5
      )
    },
    {
      id: 15,
      name: 'Research & knowledge synthesis',
      category: 'non_routine_analytical',
      measurability: 'Med',
      verificationCost: 'Med-High',
      impacts: impacts(
        { P: 2, T: 1 },                   // T1
        { P: 3, T: 2, D: 1 },             // T2
        { P: 3, T: 3, D: 2 },             // T3
        { A: 2, D: 3, T: 3, C: 2 },       // T4
        { A: 3, C: 3, D: 3 }              // T5
      )
    },
    {
      id: 16,
      name: 'Financial analysis & risk modeling',
      category: 'non_routine_analytical',
      measurability: 'Med-High',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 2, D: 2, T: 1 },             // T1
        { P: 3, D: 3, T: 2 },             // T2
        { A: 2, D: 3, T: 3, C: 2 },       // T3
        { A: 3, C: 3, D: 3 },             // T4
        { A: 3, C: 3, D: 3 }              // T5
      )
    },
    {
      id: 17,
      name: 'Engineering design & simulation',
      category: 'non_routine_analytical',
      measurability: 'Med',
      verificationCost: 'Med-High',
      impacts: impacts(
        { P: 2, D: 1 },                   // T1
        { P: 3, D: 2, T: 1 },             // T2
        { P: 3, D: 3, T: 2, A: 1 },       // T3
        { A: 2, C: 2, D: 3, T: 3 },       // T4
        { A: 3, C: 3, D: 3 }              // T5
      )
    },
    {
      id: 18,
      name: 'Diagnostics & troubleshooting',
      category: 'non_routine_analytical',
      measurability: 'Med',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 1, D: 2, T: 1 },             // T1
        { P: 2, D: 3, T: 2 },             // T2
        { A: 1, D: 3, T: 3 },             // T3
        { A: 2, D: 3, C: 2, T: 3 },       // T4
        { A: 3, C: 3, D: 3 }              // T5
      )
    },
    {
      id: 19,
      name: 'Market research & competitive analysis',
      category: 'non_routine_analytical',
      measurability: 'Med',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 2, T: 2, D: 1 },             // T1
        { P: 3, T: 3, D: 2 },             // T2
        { A: 2, D: 3, C: 2, T: 3 },       // T3
        { A: 3, C: 3, D: 3 },             // T4
        { A: 3, C: 3, D: 3 }              // T5
      )
    },
    {
      id: 20,
      name: 'Supply chain optimization',
      category: 'non_routine_analytical',
      measurability: 'High',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 2, D: 2 },                   // T1
        { P: 3, D: 3, C: 1 },             // T2
        { A: 2, D: 3, C: 2 },             // T3
        { A: 3, C: 3, D: 3 },             // T4
        { A: 3, C: 3, D: 3 }              // T5
      )
    },

    // ---- Non-Routine Interactive (21-28) ----
    {
      id: 21,
      name: 'Sales & client relationship management',
      category: 'non_routine_interactive',
      measurability: 'Med',
      verificationCost: 'Med-High',
      impacts: impacts(
        { P: 1, T: 1 },                   // T1
        { P: 2, T: 2, D: 1 },             // T2
        { P: 3, T: 3, D: 2 },             // T3
        { A: 1, P: 3, T: 3, D: 3 },       // T4
        { A: 2, C: 2, D: 3 }              // T5
      )
    },
    {
      id: 22,
      name: 'Negotiation & deal structuring',
      category: 'non_routine_interactive',
      measurability: 'Low',
      verificationCost: 'High',
      impacts: impacts(
        { D: 1 },                          // T1
        { P: 1, D: 2, T: 1 },             // T2
        { P: 2, D: 3, T: 2 },             // T3
        { P: 3, D: 3, T: 3 },             // T4
        { A: 2, D: 3, C: 2 }              // T5
      )
    },
    {
      id: 23,
      name: 'Teaching, training & mentoring',
      category: 'non_routine_interactive',
      measurability: 'Low',
      verificationCost: 'High',
      impacts: impacts(
        { P: 1, T: 1 },                   // T1
        { P: 2, T: 2 },                   // T2
        { P: 3, T: 3, A: 1 },             // T3
        { A: 2, T: 3, P: 3 },             // T4
        { A: 3, C: 2, T: 3 }              // T5
      )
    },
    {
      id: 24,
      name: 'Customer service & support',
      category: 'non_routine_interactive',
      measurability: 'Med-High',
      verificationCost: 'Low-Med',
      impacts: impacts(
        { A: 1, P: 2, C: 1 },             // T1
        { A: 2, P: 3, C: 2, T: 1 },       // T2
        { A: 3, C: 3, T: 2 },             // T3
        { A: 3, C: 3 },                   // T4
        { A: 3, C: 3 }                    // T5
      )
    },
    {
      id: 25,
      name: 'People management & team leadership',
      category: 'non_routine_interactive',
      measurability: 'Low',
      verificationCost: 'High',
      impacts: impacts(
        { D: 1 },                          // T1
        { P: 1, D: 2 },                   // T2
        { P: 2, D: 2, T: 1 },             // T3
        { P: 3, D: 3, T: 2 },             // T4
        { A: 1, D: 3, T: 3 }              // T5
      )
    },
    {
      id: 26,
      name: 'Stakeholder communication & PR',
      category: 'non_routine_interactive',
      measurability: 'Low-Med',
      verificationCost: 'Med-High',
      impacts: impacts(
        { P: 2, T: 1 },                   // T1
        { P: 3, T: 2 },                   // T2
        { P: 3, T: 3, A: 1 },             // T3
        { A: 2, T: 3, C: 1 },             // T4
        { A: 3, C: 2 }                    // T5
      )
    },
    {
      id: 27,
      name: 'Strategic planning & executive decision-making',
      category: 'non_routine_interactive',
      measurability: 'Low',
      verificationCost: 'Very High',
      impacts: impacts(
        { D: 1 },                          // T1
        { D: 2, P: 1 },                   // T2
        { D: 3, P: 2 },                   // T3
        { D: 3, P: 3, T: 2 },             // T4
        { A: 1, D: 3, T: 3 }              // T5
      )
    },
    {
      id: 28,
      name: 'Creative direction & content creation',
      category: 'non_routine_interactive',
      measurability: 'Low-Med',
      verificationCost: 'Med-High',
      impacts: impacts(
        { P: 2, T: 2, C: 1 },             // T1
        { P: 3, T: 3, C: 2 },             // T2
        { A: 2, C: 2, T: 3, P: 3 },       // T3
        { A: 3, C: 3, T: 3 },             // T4
        { A: 3, C: 3 }                    // T5
      )
    },

    // ---- Non-Routine Manual (29-33) ----
    {
      id: 29,
      name: 'Surgical / clinical procedures',
      category: 'non_routine_manual',
      measurability: 'Med',
      verificationCost: 'High',
      impacts: impacts(
        { D: 1, P: 1 },                   // T1
        { D: 2, P: 2 },                   // T2
        { D: 3, P: 2, A: 1 },             // T3
        { A: 2, D: 3, P: 3 },             // T4
        { A: 3, C: 2, D: 3 }              // T5
      )
    },
    {
      id: 30,
      name: 'Skilled trades & craft work',
      category: 'non_routine_manual',
      measurability: 'Med',
      verificationCost: 'Med',
      impacts: impacts(
        { P: 1 },                          // T1
        { P: 1, D: 1 },                   // T2
        { P: 2, D: 2, T: 1 },             // T3
        { A: 1, P: 3, D: 2 },             // T4
        { A: 2, C: 2 }                    // T5
      )
    },
    {
      id: 31,
      name: 'Emergency response & crisis operations',
      category: 'non_routine_manual',
      measurability: 'Low',
      verificationCost: 'Very High',
      impacts: impacts(
        { D: 1 },                          // T1
        { D: 2, P: 1 },                   // T2
        { D: 3, P: 2 },                   // T3
        { D: 3, P: 3, A: 1 },             // T4
        { A: 2, D: 3 }                    // T5
      )
    },
    {
      id: 32,
      name: 'Field work in unstructured environments',
      category: 'non_routine_manual',
      measurability: 'Low',
      verificationCost: 'High',
      impacts: impacts(
        { D: 1, P: 1 },                   // T1
        { D: 2, P: 1 },                   // T2
        { D: 2, P: 2, A: 1 },             // T3
        { A: 2, P: 2, D: 3 },             // T4
        { A: 3, C: 2, D: 3 }              // T5
      )
    },
    {
      id: 33,
      name: 'Caregiving & patient interaction',
      category: 'non_routine_manual',
      measurability: 'Low',
      verificationCost: 'High',
      impacts: impacts(
        { P: 1 },                          // T1
        { P: 1, D: 1 },                   // T2
        { P: 2, T: 1, D: 2 },             // T3
        { P: 3, T: 2, D: 3 },             // T4
        { A: 1, T: 3, D: 3 }              // T5
      )
    },

    // ---- Cross-Cutting / Meta (34-35) ----
    {
      id: 34,
      name: 'Verification & audit',
      category: 'cross_cutting',
      measurability: 'Med',
      verificationCost: 'High',
      impacts: impacts(
        { P: 2, D: 1 },                   // T1
        { P: 3, D: 2, T: 1 },             // T2
        { P: 3, D: 3, T: 2 },             // T3
        { D: 3, T: 3, P: 3 },             // T4
        { A: 1, D: 3, T: 3 }              // T5
      )
    },
    {
      id: 35,
      name: 'Cybersecurity & threat monitoring',
      category: 'cross_cutting',
      measurability: 'Med-High',
      verificationCost: 'Med-High',
      impacts: impacts(
        { P: 2, D: 2 },                   // T1
        { P: 3, D: 3, A: 1 },             // T2
        { A: 2, D: 3, P: 3 },             // T3
        { A: 3, D: 3, C: 2 },             // T4
        { A: 3, C: 3, D: 3 }              // T5
      )
    }
  ];

  // ---------------------------------------------------------------------------
  // SECTORS — 16 sectors with task weight profiles
  // Weights are decimals (0.15 = 15%). Tasks not listed have weight 0.
  // ---------------------------------------------------------------------------
  var SECTORS = [
    {
      id: 1,
      name: 'Financial Services & Insurance',
      weights: {
        2: 0.15,   // Transaction processing
        16: 0.14,  // Financial analysis & risk modeling
        4: 0.12,   // Regulatory compliance filing
        34: 0.10,  // Verification & audit
        21: 0.09,  // Sales & client relationship mgmt
        13: 0.08,  // Data analysis & business intelligence
        7: 0.07,   // Document review & classification
        5: 0.07,   // Bookkeeping & financial reporting
        22: 0.06,  // Negotiation & deal structuring
        24: 0.05,  // Customer service & support
        25: 0.04,  // People management & team leadership
        35: 0.03   // Cybersecurity & threat monitoring
      },
      narratives: {
        dominant: {
          A: 'Your underwriters, claims adjusters, and compliance analysts are being replaced by models that process applications, flag fraud, and file regulatory reports without coffee breaks or error rates. The humans become exception handlers for the machines.',
          C: 'AI is consolidating what used to take a team of junior analysts, a compliance officer, and an underwriter into a single automated pipeline. Your org chart is about to compress by two layers.',
          P: 'Every portfolio manager, loan officer, and relationship banker now has an AI co-pilot that drafts risk memos, pre-fills KYC checks, and models deal structures in seconds. The ones who adopt it double their book. The ones who don\'t become expensive bottlenecks.',
          T: 'Your credit risk models, actuarial tables, and fraud detection systems are being rebuilt from scratch by AI that spots patterns no human quant ever could. The old models aren\'t just outdated — they\'re liabilities.',
          D: 'AI is enabling fintech startups to offer underwriting, lending, and insurance products that bypass your entire institutional infrastructure. Your moat was regulatory complexity. AI just drained it.'
        },
        shifts: {
          scarce_knowledge: 'Actuarial expertise, credit risk modeling, and regulatory interpretation — the knowledge that took decades to accumulate and commanded $400/hour — is being encoded into systems that any competitor can deploy. Your senior analysts\' institutional memory is no longer a competitive advantage; it\'s a training dataset.',
          coordination_zero: 'Deal structuring that required a banker, a lawyer, a compliance officer, and an underwriter in a room can now be orchestrated by a single person with AI tools. The coordination cost that justified your headcount just evaporated.',
          unbundling: 'AI lets a solo financial advisor offer institutional-grade risk modeling, compliance filing, and portfolio optimization. The bundled service model — where clients paid for the firm\'s infrastructure — collapses when a two-person shop can match your output.'
        },
        exposure: {
          2: 'Transaction processing — payment reconciliation, trade settlement, claims intake — runs 24/7 with near-zero error rates. Your operations floor becomes a monitoring dashboard.',                           // Transaction processing
          16: 'AI builds credit risk models, stress-tests portfolios, and prices derivatives faster than your quant team can open their Jupyter notebooks. The analyst who spent three days on a risk memo watches AI do it in three minutes.',  // Financial analysis & risk modeling
          4: 'Regulatory filings, SAR reports, and compliance documentation get auto-generated from transaction data. Your compliance team shifts from producing reports to auditing AI output.',                          // Regulatory compliance filing
          34: 'Financial audits, KYC/AML verification, and internal controls run continuously instead of quarterly. AI doesn\'t just find discrepancies — it finds them before they compound.',                            // Verification & audit
          21: 'Client relationship management gets supercharged: AI pre-briefs your bankers with portfolio insights, flags cross-sell opportunities, and drafts pitch materials. The best RMs adopt it instantly. The rest wonder why their pipeline dried up.'  // Sales & client relationship mgmt
        },
        shifting: {
          scarce_knowledge: 'Actuarial and credit risk expertise — your $400/hour advantage — becomes a commodity overnight.',
          coordination_zero: 'Deal teams of five collapse to one person with AI orchestrating the rest.',
          unbundling: 'Two-person shops deliver institutional-grade financial services. Your overhead becomes your obituary.'
        },
        shiftingFallback: {
          A: 'Routine financial operations — transaction processing, compliance filing, claims adjudication — are being automated at a pace that will halve your operations headcount within three years.',
          C: 'AI is compressing the layers between raw financial data and executive decisions. Middle-office roles that existed to translate, verify, and route information are being eliminated.',
          P: 'AI tools are making every financial professional 3-5x more productive, which means you need 3-5x fewer of them to maintain current output levels.',
          T: 'The analytical frameworks your firm was built on — risk models, valuation methods, compliance heuristics — are being rebuilt by AI systems that learn and adapt faster than any team.',
          D: 'New entrants with AI-native architectures are offering financial services at a fraction of your cost structure. Your legacy infrastructure isn\'t heritage — it\'s drag.'
        },
        recommendations: {
          A: 'Redeploy your operations and compliance staff now — not after the quarterly review. Build an internal AI operations center where former analysts become AI supervisors, exception handlers, and model validators. The transition window is 18 months, not 5 years.',
          C: 'Redesign your org around AI-augmented pods: one senior professional + AI tools replacing teams of 4-6. Start with credit analysis and compliance, where the ROI is immediate and measurable. Your middle management layer needs a new reason to exist — find it or lose it.',
          P: 'Mandate AI tool adoption across your advisory and analysis teams within 90 days. Track AI-assisted vs. unassisted productivity per banker. The gap will be so stark it makes the business case for you. Bankers who resist aren\'t being traditional — they\'re being uncompetitive.',
          T: 'Commission an AI rebuild of your core risk models, pricing engines, and fraud detection systems. Run them in parallel with legacy systems for one quarter, then cut over. Every month you wait, your models drift further from reality.',
          D: 'Launch a skunkworks fintech unit that operates with AI-native infrastructure and zero legacy constraints. Let it cannibalize your own products. Better you than the startup that\'s already building it.',
          scarce_knowledge: 'Your actuaries and senior risk analysts need to become AI model trainers and validators, not manual calculators. Capture their expertise in AI systems now, while they\'re still on payroll. Once they retire, that knowledge walks out the door — or into a competitor\'s training data.',
          coordination_zero: 'Restructure deal teams around AI-orchestrated workflows where one senior professional manages what five people used to coordinate. Retrain coordinators as AI workflow designers. The alternative is paying five salaries for one person\'s output.',
          unbundling: 'Build modular service offerings that can compete at every price point — from AI-automated basic services to human-led premium advisory. If you only sell the bundle, unbundlers will cherry-pick your most profitable lines.',
          verification: 'Deploy continuous AI-powered audit and compliance monitoring. Move from quarterly reviews to real-time assurance. Your regulators will love it. Your competitors will be forced to match it.',
          physical: null,
          adoption_high: 'Your competitors are already deploying AI across trading, underwriting, and compliance. You\'re not early — you\'re on time. Accelerate hard or watch market share erode quarterly.',
          adoption_medium: 'AI adoption in financial services is accelerating fast. The firms moving now will lock in talent, data advantages, and client trust. Second movers in this space don\'t catch up — they get acquired.',
          adoption_low: 'Your sector hasn\'t moved yet, which means the first mover advantage is enormous. The firm that deploys AI-native financial services first will set the standard everyone else has to match.'
        }
      }
    },
    {
      id: 2,
      name: 'Healthcare & Life Sciences',
      weights: {
        18: 0.14,  // Diagnostics & troubleshooting
        29: 0.12,  // Surgical / clinical procedures
        33: 0.12,  // Caregiving & patient interaction
        1: 0.10,   // Data entry & record-keeping
        15: 0.09,  // Research & knowledge synthesis
        4: 0.08,   // Regulatory compliance filing
        7: 0.06,   // Document review & classification
        34: 0.05,  // Verification & audit
        23: 0.05,  // Teaching, training & mentoring
        3: 0.05,   // Scheduling & resource allocation
        25: 0.04,  // People management & team leadership
        6: 0.04,   // Quality control / inspection
        27: 0.03,  // Strategic planning & executive decision
        26: 0.03   // Stakeholder communication & PR
      }
    },
    {
      id: 3,
      name: 'Information Technology & Software',
      weights: {
        14: 0.25,  // Software development & engineering
        13: 0.12,  // Data analysis & business intelligence
        18: 0.10,  // Diagnostics & troubleshooting
        35: 0.08,  // Cybersecurity & threat monitoring
        24: 0.07,  // Customer service & support
        15: 0.06,  // Research & knowledge synthesis
        21: 0.06,  // Sales & client relationship mgmt
        25: 0.05,  // People management & team leadership
        27: 0.05,  // Strategic planning & executive decision
        23: 0.04,  // Teaching, training & mentoring
        34: 0.04,  // Verification & audit
        3: 0.04,   // Scheduling & resource allocation
        26: 0.04   // Stakeholder communication & PR
      },
      narratives: {
        dominant: {
          A: 'AI writes production code, resolves support tickets, patches vulnerabilities, and deploys to prod — all without a standup. Your junior and mid-level engineers aren\'t being augmented. They\'re being outperformed by their own tools.',
          C: 'The roles that stitched your engineering org together — project managers, QA testers, DevOps engineers, tier-1 support — are being absorbed into AI-powered pipelines. Your 50-person team delivers what used to require 200.',
          P: 'Senior engineers with AI tools are shipping features at 5-10x the velocity of entire teams without them. Sprint planning becomes a formality when one person can do the sprint.',
          T: 'AI isn\'t just writing code — it\'s designing architectures, identifying security vulnerabilities, and refactoring technical debt faster than your best staff engineers. The craft of software engineering is being redefined in real time.',
          D: 'A solo developer with AI ships a production SaaS product in a weekend. Your 18-month roadmap with 40 engineers just became a competitive joke. The barrier to building software collapsed and took your moat with it.'
        },
        shifts: {
          scarce_knowledge: '10x engineers, principal architects, and security specialists — the people you couldn\'t hire and couldn\'t afford to lose — their pattern recognition is now embedded in AI tools available to everyone. Your talent moat just became a public utility.',
          coordination_zero: 'Cross-functional teams with PMs, designers, frontend, backend, QA, and DevOps collapse into single engineers orchestrating AI agents. The coordination overhead that justified your org structure vanishes.',
          unbundling: 'AI enables solo developers and micro-teams to build, ship, and operate software that previously required full engineering orgs. Your enterprise clients don\'t need your 200-person team when a 5-person startup delivers the same product in half the time.'
        },
        exposure: {
          14: 'AI writes, reviews, tests, and deploys code. Your engineers\' job shifts from writing software to directing AI that writes software. The ones who can\'t make that shift are writing code that\'s slower and buggier than what the machine produces.',  // Software development & engineering
          13: 'Data pipelines, dashboards, and analytical queries that took your BI team days get built in minutes. The data engineer who spent a week on an ETL pipeline watches AI do it during a coffee break.',  // Data analysis & business intelligence
          18: 'Incident response, root cause analysis, and system diagnostics run on AI that correlates logs, traces, and metrics faster than your best SRE. Mean time to resolution drops from hours to minutes.',  // Diagnostics & troubleshooting
          35: 'AI-powered security scanning finds vulnerabilities, writes patches, and monitors threat surfaces continuously. Your penetration testers are competing with tools that never sleep and never miss a CVE.',  // Cybersecurity & threat monitoring
          24: 'Tier-1 and tier-2 support tickets get resolved by AI that reads docs, reproduces issues, and pushes fixes — all before a human sees the ticket. Your support engineers handle only the cases that actually require a brain.'  // Customer service & support
        },
        shifting: {
          scarce_knowledge: '10x engineers and principal architects — your unfillable roles — become AI-accessible commodities.',
          coordination_zero: 'Cross-functional teams of 8 collapse into one engineer orchestrating AI agents.',
          unbundling: 'Solo devs ship production SaaS in a weekend. Your 40-engineer roadmap is a punchline.'
        },
        shiftingFallback: {
          A: 'Code generation, testing, deployment, and support resolution are being automated. The roles that made up 60% of your engineering headcount are being absorbed into AI pipelines.',
          C: 'AI is eliminating the coordination layers in software development — PMs, QA, DevOps, tier-1 support — by consolidating their functions into automated workflows that a single engineer can manage.',
          P: 'Engineers with AI tools are 5-10x more productive. That math means you need 80% fewer engineers — or you ship 5x more product with the same team. Either way, the org chart changes.',
          T: 'AI is rewriting how software gets built — from architecture design to code review to security hardening. The engineering practices you spent years perfecting are being superseded by AI-native workflows.',
          D: 'The cost and complexity of building software just dropped by an order of magnitude. Every non-tech company can now build what they used to buy from you. Your addressable market is shrinking from the bottom up.'
        },
        recommendations: {
          A: 'Restructure your engineering org around AI-augmented development now. Redefine roles: junior engineers become AI code reviewers, mid-levels become AI orchestrators, seniors become system architects. The old career ladder doesn\'t exist anymore — build the new one before your best people leave for companies that already have.',
          C: 'Collapse your cross-functional teams into AI-augmented pods. One senior engineer + AI replaces the PM/dev/QA/DevOps squad. Retrain your PMs as product strategists and your QA engineers as AI output validators. The people who coordinated work need new work to do.',
          P: 'Set a 90-day mandate: every engineer uses AI coding tools for every task. Measure output per engineer before and after. The productivity gains will be so dramatic they\'ll reshape your headcount planning, your hiring strategy, and your competitive positioning simultaneously.',
          T: 'Rebuild your development pipeline around AI-native practices: AI-generated code, AI-reviewed PRs, AI-monitored production, AI-driven incident response. Run legacy and AI pipelines in parallel for 30 days, then cut over. Technical debt that would take your team years to fix gets resolved in weeks.',
          D: 'Launch AI-native product lines that compete with your own offerings at 10x lower cost. If a two-person startup can build your product in a month, you need to be that startup — inside your own company — before someone else is.',
          scarce_knowledge: 'Capture your senior engineers\' architectural knowledge and security expertise in AI-accessible systems before the talent market reprices their skills downward. Their value shifts from doing the work to teaching AI to do the work.',
          coordination_zero: 'Redesign your team topology for AI-native coordination: async AI handoffs replace standups, AI-generated status reports replace PM check-ins, automated testing replaces QA sprints. The humans focus on judgment calls, not information routing.',
          unbundling: 'Build and sell modular AI-powered development tools alongside your monolithic products. If customers can unbundle your offering, be the one selling the pieces. Your platform advantage only lasts if you weaponize it before someone routes around it.',
          verification: 'Deploy AI-powered code review, security scanning, and production monitoring as continuous automated processes. Shift your verification culture from periodic audits to real-time assurance. Bugs and vulnerabilities found in production are now inexcusable.',
          physical: null,
          adoption_high: 'AI-assisted development is already table stakes in your sector. If your engineers aren\'t using AI tools daily, they\'re competing with one hand tied behind their back against engineers at every other company who are.',
          adoption_medium: 'The best engineering orgs are adopting AI aggressively. Within 12 months, AI-augmented teams will be the baseline expectation. Companies still debating adoption will be hiring from companies that already adopted — and losing.',
          adoption_low: 'Your sector hasn\'t fully embraced AI-native development yet. The first engineering org to go all-in will set velocity standards that force everyone else to follow or fall behind. Be the standard-setter.'
        }
      }
    },
    {
      id: 4,
      name: 'Media, Entertainment & Creative',
      weights: {
        28: 0.25,  // Creative direction & content creation
        19: 0.10,  // Market research & competitive analysis
        21: 0.09,  // Sales & client relationship mgmt
        26: 0.09,  // Stakeholder communication & PR
        13: 0.08,  // Data analysis & business intelligence
        22: 0.07,  // Negotiation & deal structuring
        25: 0.06,  // People management & team leadership
        3: 0.05,   // Scheduling & resource allocation
        14: 0.05,  // Software development & engineering
        27: 0.05,  // Strategic planning & executive decision
        24: 0.04,  // Customer service & support
        5: 0.04,   // Bookkeeping & financial reporting
        23: 0.03   // Teaching, training & mentoring
      }
    },
    {
      id: 5,
      name: 'Professional Services (Legal, Consulting, Accounting)',
      weights: {
        7: 0.15,   // Document review & classification
        15: 0.14,  // Research & knowledge synthesis
        22: 0.10,  // Negotiation & deal structuring
        34: 0.10,  // Verification & audit
        21: 0.09,  // Sales & client relationship mgmt
        13: 0.08,  // Data analysis & business intelligence
        4: 0.07,   // Regulatory compliance filing
        5: 0.06,   // Bookkeeping & financial reporting
        25: 0.05,  // People management & team leadership
        27: 0.05,  // Strategic planning & executive decision
        23: 0.04,  // Teaching, training & mentoring
        26: 0.04,  // Stakeholder communication & PR
        24: 0.03   // Customer service & support
      },
      narratives: {
        dominant: {
          A: 'AI reviews contracts, drafts legal briefs, completes audit workpapers, and generates consulting deliverables at a pace that makes your junior associates look like they\'re working in slow motion. The billable hour model collapses when the work takes minutes instead of weeks.',
          C: 'The pyramid staffing model — partners on top, armies of associates and paralegals below — gets crushed when AI does the base work. You\'re paying for 50 associates to produce what AI delivers before lunch.',
          P: 'Partners and senior consultants with AI tools produce client-ready work at 5x the pace. Due diligence that took a team of eight now takes one lawyer and an afternoon. The question isn\'t whether to adopt — it\'s whether your best people leave for firms that already have.',
          T: 'AI is rewriting how professional judgment gets applied — synthesizing case law, identifying audit risks, modeling tax scenarios, and pressure-testing consulting hypotheses faster and more thoroughly than any human team. The expertise isn\'t obsolete, but the old way of deploying it is.',
          D: 'AI-powered legal tech, automated audit platforms, and algorithmic consulting tools let clients do in-house what they used to hire you for. Your $800/hour partner rate now competes with a $200/month subscription.'
        },
        shifts: {
          scarce_knowledge: 'Decades of legal precedent knowledge, audit methodology expertise, and consulting frameworks — the institutional wisdom that justified partner-track compensation — is being encoded into AI systems that any first-year associate can access. The knowledge asymmetry that built your firm\'s pricing power is dissolving.',
          coordination_zero: 'A due diligence process that required partners, associates, paralegals, and support staff coordinating across weeks now gets orchestrated by one senior professional with AI tools in days. The coordination overhead that justified your staffing pyramid just disappeared.',
          unbundling: 'Clients no longer need to buy the full-service engagement. AI lets them unbundle: automated contract review here, AI-assisted tax filing there, algorithmic audit for routine entities. Your premium pricing depended on bundled complexity. The bundle is breaking apart.'
        },
        exposure: {
          7: 'Contract review, document classification, and due diligence document processing — the work that kept your junior associates billing 80-hour weeks — gets done by AI in hours. The associate who spent two weeks reviewing a data room watches AI surface every red flag in an afternoon.',  // Document review & classification
          15: 'Legal research, case law synthesis, regulatory analysis, and consulting knowledge work — the intellectual core of professional services — gets turbocharged by AI that reads and synthesizes faster than any team. Your researchers become curators, not hunters.',  // Research & knowledge synthesis
          22: 'AI pre-structures deals, models negotiation scenarios, and drafts term sheets before your partners sit down at the table. The preparation that used to take a team a week happens overnight.',  // Negotiation & deal structuring
          34: 'Audit workpapers, compliance verification, and quality reviews run continuously with AI flagging anomalies in real time. Annual audits start to look like a quaint artifact when AI monitors everything, always.',  // Verification & audit
          21: 'AI pre-briefs your partners with client intelligence, drafts proposals, and identifies cross-sell opportunities before the client meeting. The partner who walks in cold loses to the one whose AI already mapped the engagement.'  // Sales & client relationship mgmt
        },
        shifting: {
          scarce_knowledge: 'Partner-level expertise — your $800/hour moat — becomes an AI-accessible commodity.',
          coordination_zero: 'Due diligence teams of 10 collapse to one senior professional with AI. Your pyramid inverts.',
          unbundling: 'Clients cherry-pick automated legal, audit, and consulting modules. Your bundled engagement model fractures.'
        },
        shiftingFallback: {
          A: 'Document review, research synthesis, audit procedures, and compliance filing — the work that occupied 70% of your professional staff hours — is being automated. The pyramid model doesn\'t survive when the base disappears.',
          C: 'AI is eliminating the coordination layers in professional services — the associates who gathered information, the managers who synthesized it, the support staff who formatted it. Those layers don\'t get thinner. They get deleted.',
          P: 'AI-augmented professionals are 5x more productive across research, drafting, analysis, and client preparation. Your top performers will adopt or leave. Your average performers will be outproduced by AI before they notice.',
          T: 'AI is fundamentally changing how professional judgment gets applied — from case law analysis to audit risk assessment to consulting diagnostics. The methodologies your firm spent decades refining are being rebuilt in months.',
          D: 'AI-native competitors are offering professional services at a fraction of your cost with comparable quality. The market is learning that it doesn\'t need a white-shoe firm for every engagement. It just needs AI and a senior expert.'
        },
        recommendations: {
          A: 'Redesign your staffing model now. Junior associates and paralegals need to become AI-output reviewers and client-facing advisors, not manual document processors. Every month you delay, your cost structure becomes more indefensible against AI-native competitors.',
          C: 'Flatten your pyramid. Build AI-augmented practice groups where one partner and one senior associate, backed by AI, deliver what a team of eight used to. Redeploy displaced professionals into client advisory, AI oversight, and business development — roles the machines can\'t fill.',
          P: 'Mandate AI adoption across all practice areas within 60 days. Track AI-assisted billable output vs. traditional methods. The productivity gap will force a billing model conversation: move to value-based pricing before clients demand it.',
          T: 'Rebuild your practice methodologies around AI-native workflows: AI-drafted briefs reviewed by partners, AI-generated audit workpapers verified by seniors, AI-modeled consulting scenarios validated by experts. The human role shifts from production to judgment.',
          D: 'Launch a separate AI-native service line that competes at lower price points. Offer AI-automated contract review, compliance monitoring, and audit services directly. Cannibalize your own commodity work before legal tech startups do it for you.',
          scarce_knowledge: 'Capture your partners\' expertise in AI systems immediately. Build proprietary AI tools trained on your firm\'s institutional knowledge — your case histories, audit findings, consulting frameworks. That knowledge becomes exponentially more valuable as AI training data than as partner intuition.',
          coordination_zero: 'Redesign engagement models for AI-orchestrated delivery. One senior professional managing AI workflows replaces the multi-tier team. Retrain your coordination layer — project managers, senior associates who managed junior teams — as AI workflow architects.',
          unbundling: 'Build modular service offerings at every price point: fully automated for routine work, AI-augmented for complex matters, partner-led for bet-the-company situations. If you only sell the premium bundle, unbundlers will take your bread-and-butter work first.',
          verification: 'Deploy continuous AI-powered quality assurance across all client deliverables. Every brief, workpaper, and slide deck gets AI-reviewed for accuracy, consistency, and risk before it leaves the building. Quality becomes a differentiator when AI makes it cheap.',
          physical: null,
          adoption_high: 'AI is already reshaping legal tech, audit automation, and consulting delivery. Firms that haven\'t adopted are losing associates to firms that have, and losing clients to platforms that cost less.',
          adoption_medium: 'The professional services firms moving on AI now will lock in a structural advantage in talent, efficiency, and client trust. The window to be a leader instead of a follower is measured in quarters, not years.',
          adoption_low: 'Your sector has been slow to adopt AI, which means the first firm to go all-in will redefine client expectations for every competitor. That firm sets the new standard for speed, cost, and quality. Be that firm.'
        }
      }
    },
    {
      id: 6,
      name: 'Education & Training',
      weights: {
        23: 0.30,  // Teaching, training & mentoring
        15: 0.15,  // Research & knowledge synthesis
        33: 0.08,  // Caregiving & patient interaction
        1: 0.07,   // Data entry & record-keeping
        3: 0.06,   // Scheduling & resource allocation
        28: 0.06,  // Creative direction & content creation
        25: 0.05,  // People management & team leadership
        26: 0.05,  // Stakeholder communication & PR
        34: 0.05,  // Verification & audit
        27: 0.04,  // Strategic planning & executive decision
        5: 0.03,   // Bookkeeping & financial reporting
        4: 0.03,   // Regulatory compliance filing
        13: 0.03   // Data analysis & business intelligence
      }
    },
    {
      id: 7,
      name: 'Government & Public Administration',
      weights: {
        1: 0.12,   // Data entry & record-keeping
        4: 0.12,   // Regulatory compliance filing
        7: 0.10,   // Document review & classification
        26: 0.08,  // Stakeholder communication & PR
        34: 0.08,  // Verification & audit
        25: 0.07,  // People management & team leadership
        27: 0.06,  // Strategic planning & executive decision
        3: 0.06,   // Scheduling & resource allocation
        31: 0.05,  // Emergency response & crisis operations
        2: 0.05,   // Transaction processing
        5: 0.05,   // Bookkeeping & financial reporting
        24: 0.05,  // Customer service & support
        22: 0.04,  // Negotiation & deal structuring
        13: 0.04,  // Data analysis & business intelligence
        35: 0.03   // Cybersecurity & threat monitoring
      }
    },
    {
      id: 8,
      name: 'Manufacturing & Industrial',
      weights: {
        8: 0.18,   // Assembly & fabrication
        6: 0.12,   // Quality control / inspection
        17: 0.10,  // Engineering design & simulation
        20: 0.10,  // Supply chain optimization
        9: 0.08,   // Material handling & warehousing
        18: 0.07,  // Diagnostics & troubleshooting
        3: 0.06,   // Scheduling & resource allocation
        30: 0.06,  // Skilled trades & craft work
        11: 0.05,  // Cleaning, maintenance & facility ops
        13: 0.04,  // Data analysis & business intelligence
        25: 0.04,  // People management & team leadership
        5: 0.03,   // Bookkeeping & financial reporting
        34: 0.03,  // Verification & audit
        4: 0.02,   // Regulatory compliance filing
        27: 0.02   // Strategic planning & executive decision
      }
    },
    {
      id: 9,
      name: 'Energy & Utilities',
      weights: {
        18: 0.12,  // Diagnostics & troubleshooting
        11: 0.10,  // Cleaning, maintenance & facility ops
        4: 0.10,   // Regulatory compliance filing
        10: 0.08,  // Vehicle / equipment operation (fixed route)
        17: 0.08,  // Engineering design & simulation
        13: 0.07,  // Data analysis & business intelligence
        32: 0.07,  // Field work in unstructured environments
        20: 0.06,  // Supply chain optimization
        3: 0.05,   // Scheduling & resource allocation
        6: 0.05,   // Quality control / inspection
        34: 0.05,  // Verification & audit
        35: 0.04,  // Cybersecurity & threat monitoring
        31: 0.04,  // Emergency response & crisis operations
        25: 0.03,  // People management & team leadership
        27: 0.03,  // Strategic planning & executive decision
        5: 0.03    // Bookkeeping & financial reporting
      }
    },
    {
      id: 10,
      name: 'Construction & Real Estate',
      weights: {
        30: 0.18,  // Skilled trades & craft work
        17: 0.12,  // Engineering design & simulation
        3: 0.10,   // Scheduling & resource allocation
        32: 0.08,  // Field work in unstructured environments
        22: 0.07,  // Negotiation & deal structuring
        4: 0.07,   // Regulatory compliance filing
        9: 0.06,   // Material handling & warehousing
        6: 0.05,   // Quality control / inspection
        21: 0.05,  // Sales & client relationship mgmt
        5: 0.04,   // Bookkeeping & financial reporting
        25: 0.04,  // People management & team leadership
        34: 0.04,  // Verification & audit
        11: 0.04,  // Cleaning, maintenance & facility ops
        27: 0.03,  // Strategic planning & executive decision
        13: 0.03   // Data analysis & business intelligence
      }
    },
    {
      id: 11,
      name: 'Transportation & Logistics',
      weights: {
        10: 0.20,  // Vehicle / equipment operation (fixed route)
        9: 0.15,   // Material handling & warehousing
        20: 0.12,  // Supply chain optimization
        3: 0.10,   // Scheduling & resource allocation
        18: 0.07,  // Diagnostics & troubleshooting
        11: 0.06,  // Cleaning, maintenance & facility ops
        24: 0.06,  // Customer service & support
        13: 0.05,  // Data analysis & business intelligence
        4: 0.04,   // Regulatory compliance filing
        25: 0.04,  // People management & team leadership
        5: 0.03,   // Bookkeeping & financial reporting
        6: 0.03,   // Quality control / inspection
        34: 0.03,  // Verification & audit
        27: 0.02   // Strategic planning & executive decision
      }
    },
    {
      id: 12,
      name: 'Retail & Consumer Services',
      weights: {
        24: 0.18,  // Customer service & support
        21: 0.14,  // Sales & client relationship mgmt
        9: 0.10,   // Material handling & warehousing
        20: 0.09,  // Supply chain optimization
        19: 0.08,  // Market research & competitive analysis
        3: 0.07,   // Scheduling & resource allocation
        2: 0.07,   // Transaction processing
        13: 0.06,  // Data analysis & business intelligence
        28: 0.05,  // Creative direction & content creation
        5: 0.04,   // Bookkeeping & financial reporting
        25: 0.04,  // People management & team leadership
        11: 0.04,  // Cleaning, maintenance & facility ops
        6: 0.02,   // Quality control / inspection
        27: 0.02   // Strategic planning & executive decision
      }
    },
    {
      id: 13,
      name: 'Agriculture & Food Production',
      weights: {
        12: 0.18,  // Harvesting & extraction
        32: 0.14,  // Field work in unstructured environments
        10: 0.10,  // Vehicle / equipment operation (fixed route)
        6: 0.10,   // Quality control / inspection
        20: 0.08,  // Supply chain optimization
        11: 0.06,  // Cleaning, maintenance & facility ops
        13: 0.05,  // Data analysis & business intelligence
        18: 0.05,  // Diagnostics & troubleshooting
        3: 0.05,   // Scheduling & resource allocation
        4: 0.04,   // Regulatory compliance filing
        9: 0.04,   // Material handling & warehousing
        17: 0.03,  // Engineering design & simulation
        5: 0.03,   // Bookkeeping & financial reporting
        34: 0.03,  // Verification & audit
        27: 0.02   // Strategic planning & executive decision
      }
    },
    {
      id: 14,
      name: 'Mining & Natural Resources',
      weights: {
        12: 0.16,  // Harvesting & extraction
        32: 0.14,  // Field work in unstructured environments
        10: 0.12,  // Vehicle / equipment operation (fixed route)
        18: 0.08,  // Diagnostics & troubleshooting
        17: 0.07,  // Engineering design & simulation
        11: 0.07,  // Cleaning, maintenance & facility ops
        6: 0.06,   // Quality control / inspection
        4: 0.05,   // Regulatory compliance filing
        13: 0.05,  // Data analysis & business intelligence
        3: 0.04,   // Scheduling & resource allocation
        31: 0.04,  // Emergency response & crisis operations
        30: 0.04,  // Skilled trades & craft work
        34: 0.03,  // Verification & audit
        25: 0.03,  // People management & team leadership
        27: 0.02   // Strategic planning & executive decision
      }
    },
    {
      id: 15,
      name: 'Telecommunications',
      weights: {
        24: 0.15,  // Customer service & support
        18: 0.12,  // Diagnostics & troubleshooting
        35: 0.10,  // Cybersecurity & threat monitoring
        14: 0.09,  // Software development & engineering
        11: 0.08,  // Cleaning, maintenance & facility ops
        21: 0.08,  // Sales & client relationship mgmt
        13: 0.07,  // Data analysis & business intelligence
        3: 0.05,   // Scheduling & resource allocation
        4: 0.05,   // Regulatory compliance filing
        17: 0.05,  // Engineering design & simulation
        25: 0.04,  // People management & team leadership
        5: 0.03,   // Bookkeeping & financial reporting
        27: 0.03,  // Strategic planning & executive decision
        34: 0.03,  // Verification & audit
        26: 0.03   // Stakeholder communication & PR
      }
    },
    {
      id: 16,
      name: 'Defense & Aerospace',
      weights: {
        17: 0.14,  // Engineering design & simulation
        32: 0.10,  // Field work in unstructured environments
        35: 0.10,  // Cybersecurity & threat monitoring
        31: 0.08,  // Emergency response & crisis operations
        14: 0.08,  // Software development & engineering
        34: 0.07,  // Verification & audit
        18: 0.07,  // Diagnostics & troubleshooting
        4: 0.06,   // Regulatory compliance filing
        20: 0.05,  // Supply chain optimization
        27: 0.05,  // Strategic planning & executive decision
        8: 0.05,   // Assembly & fabrication
        15: 0.04,  // Research & knowledge synthesis
        25: 0.04,  // People management & team leadership
        3: 0.04,   // Scheduling & resource allocation
        30: 0.03   // Skilled trades & craft work
      }
    }
  ];

  // ---------------------------------------------------------------------------
  // TIER_LABELS — capability tier definitions
  // ---------------------------------------------------------------------------
  var TIER_LABELS = {
    T1: {
      label: 'Current Tools',
      description: 'Better autocomplete, chatbots, narrow ML \u2014 improved versions of today\'s tools'
    },
    T2: {
      label: 'Enhanced Copilots',
      description: 'AI assists across domains, human drives all decisions'
    },
    T3: {
      label: 'Domain-Autonomous Agents',
      description: 'AI executes whole tasks independently in bounded domains'
    },
    T4: {
      label: 'AGI',
      description: 'Human-level capability across all cognitive domains'
    },
    T5: {
      label: 'Superintelligence',
      description: 'Beyond human capability across everything'
    }
  };

  // ---------------------------------------------------------------------------
  // HORIZON_LABELS — time horizon brackets
  // ---------------------------------------------------------------------------
  var HORIZON_LABELS = {
    H1: { label: '2\u20135 years' },
    H2: { label: '5\u201310 years' },
    H3: { label: '10\u201320 years' },
    H4: { label: '20+ years' }
  };

  // ---------------------------------------------------------------------------
  // ADOPTION_LABELS — adoption speed levels
  // ---------------------------------------------------------------------------
  var ADOPTION_LABELS = {
    Low: {
      label: 'Slow adoption',
      description: 'Regulatory friction, organizational inertia, trust barriers'
    },
    Medium: {
      label: 'Moderate adoption',
      description: 'Competitive pressure drives steady rollout'
    },
    High: {
      label: 'Rapid adoption',
      description: 'First-mover dynamics, low switching costs, market pressure'
    }
  };

  // ---------------------------------------------------------------------------
  // RISK_ZONES — score range to label mapping
  // ---------------------------------------------------------------------------
  var RISK_ZONES = [
    {
      min: 0,
      max: 20,
      label: 'Resilient',
      description: 'Task profile weighted toward low-automatable work'
    },
    {
      min: 21,
      max: 40,
      label: 'Adapting',
      description: 'Meaningful efficiency gains, core work persists'
    },
    {
      min: 41,
      max: 60,
      label: 'Transforming',
      description: 'Majority of tasks significantly impacted, business model pressure'
    },
    {
      min: 61,
      max: 80,
      label: 'Disrupting',
      description: 'Core value chain being rewritten, strategic pivot required'
    },
    {
      min: 81,
      max: 100,
      label: 'Restructuring',
      description: 'Fundamental task base automated, new value proposition needed'
    }
  ];

  // ---------------------------------------------------------------------------
  // TIMELINE_PERCENTAGES — adoption speed x time point percentage table
  //
  // Rows: adoption speed. Columns: time point index (0=2yr, 1=5yr, 2=10yr, 3=20yr).
  // Horizon shifts push columns right; off-table entries score 0%.
  // ---------------------------------------------------------------------------
  var TIMELINE_PERCENTAGES = {
    Low:    [5, 15, 40, 75],
    Medium: [15, 35, 70, 90],
    High:   [30, 65, 90, 98]
  };

  // ---------------------------------------------------------------------------
  // DOMINANT_IMPACT_SENTENCES — template sentences by dominant impact type
  // ---------------------------------------------------------------------------
  var DOMINANT_IMPACT_SENTENCES = {
    A: 'Most core work faces direct automation \u2014 the tasks your people spend the most hours on are the tasks AI does best.',
    C: 'The cost basis of your operations is compressing \u2014 work that required teams will require tools.',
    P: 'Your workforce will do dramatically more with dramatically fewer people \u2014 headcount pressure is the primary risk.',
    T: 'The expertise premium is collapsing \u2014 AI makes your juniors perform like your seniors, flattening the value of experience.',
    D: 'Decision quality improves radically \u2014 but competitive advantage shifts from who has the best analysts to who acts on better decisions fastest.'
  };

  // ---------------------------------------------------------------------------
  // RECOMMENDATION_RULES — array of { condition, recommendation } objects
  //
  // Each `condition` is a function receiving a context object with:
  //   tier          - selected tier key (e.g. "T3")
  //   adoptionSpeed - "Low" | "Medium" | "High"
  //   sectorId      - numeric sector id
  //   dominantImpacts - array of dominant impact codes (e.g. ["A"] or ["P","T"])
  //   tasks         - the TASKS array (for score lookups)
  //   sectorWeights - the sector's weight map
  //   higherOrder   - { scarceKnowledge: bool, coordinationZero: bool, unbundling: bool }
  //   physicalWeight - sum of weights for tasks 8-12, 29-32
  // ---------------------------------------------------------------------------
  var RECOMMENDATION_RULES = [
    // --- Dominant impact recommendations ---
    {
      id: 'automates_dominant',
      condition: function (ctx) {
        return ctx.dominantImpacts.indexOf('A') !== -1;
      },
      recommendation: 'Restructure workforce around non-automatable tasks; plan headcount transition.'
    },
    {
      id: 'cost_dominant',
      condition: function (ctx) {
        return ctx.dominantImpacts.indexOf('C') !== -1;
      },
      recommendation: 'Re-baseline operating cost models now \u2014 the teams-to-tools transition compresses your cost structure faster than budgets adjust.'
    },
    {
      id: 'productivity_dominant',
      condition: function (ctx) {
        return ctx.dominantImpacts.indexOf('P') !== -1;
      },
      recommendation: 'Prepare for dramatic headcount-to-output ratio changes \u2014 fewer people producing more means restructuring org design, not just layoffs.'
    },
    {
      id: 'talent_dominant',
      condition: function (ctx) {
        return ctx.dominantImpacts.indexOf('T') !== -1;
      },
      recommendation: 'Compress talent pyramid; redefine role boundaries; fewer mid-level specialists.'
    },
    {
      id: 'decision_dominant',
      condition: function (ctx) {
        return ctx.dominantImpacts.indexOf('D') !== -1;
      },
      recommendation: 'Invest in AI-augmented strategy; don\'t replace strategists, arm them.'
    },

    // --- Verification bottleneck ---
    {
      id: 'verification_bottleneck',
      condition: function (ctx) {
        var task34 = ctx.tasks[33]; // id 34, zero-indexed at 33
        return task34.impacts[ctx.tier].A <= 1;
      },
      recommendation: 'Invest in verification infrastructure \u2014 this becomes your most defensible capability.'
    },

    // --- Higher-order impact triggers ---
    {
      id: 'unbundling',
      condition: function (ctx) {
        return ctx.higherOrder.unbundling;
      },
      recommendation: 'Shift competitive moat from knowledge to judgment, trust, and risk management.'
    },
    {
      id: 'scarce_knowledge',
      condition: function (ctx) {
        return ctx.higherOrder.scarceKnowledge;
      },
      recommendation: 'Protect proprietary data; build differentiation beyond expertise.'
    },
    {
      id: 'coordination_zero',
      condition: function (ctx) {
        return ctx.higherOrder.coordinationZero;
      },
      recommendation: 'Rethink firm boundaries \u2014 what you outsource vs. build changes when coordination is free.'
    },

    // --- Physical-task intensive sector ---
    {
      id: 'physical_intensive',
      condition: function (ctx) {
        return ctx.physicalWeight >= 0.30;
      },
      recommendation: 'Develop robotics/automation roadmap; timeline is longer, invest in transition.'
    },

    // --- Adoption speed recommendations ---
    {
      id: 'high_adoption',
      condition: function (ctx) {
        return ctx.adoptionSpeed === 'High';
      },
      recommendation: 'Act now \u2014 competitive pressure leaves no runway for delayed response.'
    },
    {
      id: 'medium_adoption',
      condition: function (ctx) {
        return ctx.adoptionSpeed === 'Medium';
      },
      recommendation: 'Build capability steadily \u2014 competitive pressure is real but you have some time to be strategic about deployment.'
    },
    {
      id: 'low_adoption',
      condition: function (ctx) {
        return ctx.adoptionSpeed === 'Low';
      },
      recommendation: 'Build capability over 3\u20135 years \u2014 you have time but not unlimited time.'
    }
  ];

  // ---------------------------------------------------------------------------
  // ADOPTION_MODIFIERS — score modifiers by adoption speed
  // Applied as: score * multiplier + offset
  // ---------------------------------------------------------------------------
  var ADOPTION_MODIFIERS = {
    Low:    { multiplier: 0.70, offset: 15 },
    Medium: { multiplier: 0.85, offset: 8 },
    High:   { multiplier: 1.00, offset: 0 }
  };

  // ---------------------------------------------------------------------------
  // HIGHER_ORDER_TRIGGERS — definitions for Step 4 structural shift evaluation
  // ---------------------------------------------------------------------------
  var HIGHER_ORDER_TRIGGERS = {
    scarceKnowledge: {
      label: 'Scarce knowledge \u2192 zero value',
      description: 'The expertise premium collapses as AI makes specialized knowledge universally available.',
      analyticalTaskIds: [13, 14, 15, 16, 17, 18, 19, 20]
    },
    coordinationZero: {
      label: 'Coordination costs \u2192 zero',
      description: 'Organizational friction dissolves \u2014 whether through automation or productivity gains, coordination becomes free.',
      taskIds: [3, 20, 21, 22, 23, 24]
    },
    unbundling: {
      label: 'Unbundling & new bottlenecks',
      description: 'Execution is broadly automated but judgment and verification remain human \u2014 the Measurability Gap made visible.'
    }
  };

  // ---------------------------------------------------------------------------
  // TIME_POINTS — the four time points used in timeline curves
  // ---------------------------------------------------------------------------
  var TIME_POINTS = [2, 5, 10, 20];

  // ---------------------------------------------------------------------------
  // HORIZON_SHIFT — number of columns to shift right for each horizon
  // ---------------------------------------------------------------------------
  var HORIZON_SHIFT = {
    H1: 0,
    H2: 1,
    H3: 2,
    H4: 3
  };

  // ---------------------------------------------------------------------------
  // DOMINANT_MARGIN — minimum margin for single dominance (spec: 0.3)
  // ---------------------------------------------------------------------------
  var DOMINANT_MARGIN = 0.3;

  // ---------------------------------------------------------------------------
  // PHYSICAL_TASK_IDS — tasks 8-12 (routine manual) + 29-32 (non-routine manual)
  // Used for the physical-task-intensive sector check
  // ---------------------------------------------------------------------------
  var PHYSICAL_TASK_IDS = [8, 9, 10, 11, 12, 29, 30, 31, 32];

  // ---------------------------------------------------------------------------
  // Export everything
  // ---------------------------------------------------------------------------
  window.DiagnosticData = {
    TASKS: TASKS,
    SECTORS: SECTORS,
    TIER_LABELS: TIER_LABELS,
    HORIZON_LABELS: HORIZON_LABELS,
    ADOPTION_LABELS: ADOPTION_LABELS,
    RISK_ZONES: RISK_ZONES,
    TIMELINE_PERCENTAGES: TIMELINE_PERCENTAGES,
    DOMINANT_IMPACT_SENTENCES: DOMINANT_IMPACT_SENTENCES,
    RECOMMENDATION_RULES: RECOMMENDATION_RULES,
    ADOPTION_MODIFIERS: ADOPTION_MODIFIERS,
    HIGHER_ORDER_TRIGGERS: HIGHER_ORDER_TRIGGERS,
    TIME_POINTS: TIME_POINTS,
    HORIZON_SHIFT: HORIZON_SHIFT,
    DOMINANT_MARGIN: DOMINANT_MARGIN,
    PHYSICAL_TASK_IDS: PHYSICAL_TASK_IDS
  };

})();
