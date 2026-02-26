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
      },
      narratives: {
        dominant: {
          A: 'AI reads radiology scans faster than your radiologists, transcribes clinical notes in real time, auto-codes medical records for billing, and triages patient intake before a nurse touches a chart. The diagnostic and administrative backbone of your hospital is being replaced by systems that never take a shift off.',
          C: 'Medical coders, transcriptionists, scheduling coordinators, and insurance pre-authorization staff — the administrative layer that consumed 30% of healthcare spending — are being absorbed into AI pipelines. Your back office is shrinking while your patient volume stays the same.',
          P: 'Physicians with AI-assisted diagnostics read imaging studies in a third of the time. Clinical researchers synthesize trial data in hours instead of months. Lab technicians get AI-flagged anomalies before they even look at the slide. Output per clinician is climbing — and staffing models built for the old pace are breaking.',
          T: 'AI is democratizing specialist-level diagnostic capability to general practitioners, rural clinics, and nurse practitioners. A community health center with AI reads a chest X-ray as accurately as a fellowship-trained radiologist. The expertise moat around tertiary care centers is crumbling.',
          D: 'AI-powered clinical decision support is catching drug interactions, flagging sepsis risk, and recommending treatment protocols faster and more consistently than human judgment alone. The physician who ignores AI recommendations is practicing medicine with one eye closed.'
        },
        shifts: {
          scarce_knowledge: 'Specialist physicians, rare-disease researchers, and senior pharmacologists — the clinicians you waited 18 months to recruit — their diagnostic pattern recognition is now embedded in AI tools accessible to every provider. The knowledge scarcity that justified $600K salaries is dissolving.',
          coordination_zero: 'Care coordination across hospitalists, specialists, pharmacists, social workers, and discharge planners collapses into AI-orchestrated care pathways. The case manager who spent hours on the phone coordinating handoffs watches AI do it in seconds.',
          unbundling: 'Patients no longer need the full hospital system for every encounter. AI-powered remote monitoring, at-home diagnostics, and virtual triage unbundle primary care, chronic disease management, and routine diagnostics from the physical facility. Your census drops while the care still gets delivered.'
        },
        exposure: {
          18: 'AI reads imaging studies, interprets lab panels, and correlates symptoms against millions of clinical cases faster than any diagnostician. Your radiologists and pathologists are being outpaced by tools that never fatigue and never miss a finding.',  // Diagnostics & troubleshooting
          29: 'Surgical planning gets AI-generated 3D models, procedure simulations, and real-time intraoperative guidance. The surgeon still holds the scalpel, but AI is mapping every cut before it happens.',  // Surgical / clinical procedures
          33: 'Patient interaction and bedside care remain human — but AI is triaging, scheduling, documenting, and following up around every human touchpoint. The nurse spends less time charting and more time caring, but the AI is doing the work that used to fill the rest of the shift.',  // Caregiving & patient interaction
          1: 'EHR data entry, medical coding, and clinical documentation — the paperwork that consumed 40% of a physician\'s day — gets auto-generated from ambient listening and structured into billing-ready records without a keystroke.',  // Data entry & record-keeping
          15: 'Clinical trial literature reviews, drug interaction research, and treatment protocol synthesis that took research teams weeks now take AI hours. Your clinical researchers are curating AI output, not generating primary analysis.'  // Research & knowledge synthesis
        },
        shifting: {
          scarce_knowledge: 'Specialist diagnostic expertise — your unfillable fellowship-trained roles — becomes AI-accessible to every provider.',
          coordination_zero: 'Care teams of 8 coordinating across departments collapse into AI-orchestrated pathways managed by one clinician.',
          unbundling: 'Remote diagnostics, AI triage, and virtual monitoring pull routine care out of the hospital. Your facility becomes the last resort, not the first stop.'
        },
        shiftingFallback: {
          A: 'Diagnostic imaging interpretation, medical coding, clinical documentation, and insurance pre-authorization are being automated. The administrative and diagnostic workflows that defined hospital operations are running without human hands.',
          C: 'AI is eliminating the coordination overhead in healthcare — the schedulers, coders, transcriptionists, and case managers who stitched the system together. Those roles don\'t shrink. They disappear into automated pipelines.',
          P: 'Clinicians with AI tools diagnose faster, document instantly, and manage larger patient panels. The math means fewer physicians handle more patients — or the same team dramatically improves outcomes. Either way, the staffing model changes.',
          T: 'AI is redistributing specialist expertise to every point of care — from rural clinics to urgent care centers to home health. The referral chain that funneled patients to tertiary centers is being short-circuited by AI that brings the specialist to the screen.',
          D: 'AI clinical decision support is catching what humans miss — drug interactions, early sepsis indicators, rare diagnoses hiding in common symptoms. The standard of care is being redefined by what AI makes possible, and providers who don\'t adopt will face both clinical and legal exposure.'
        },
        recommendations: {
          A: 'Deploy AI-powered ambient documentation, automated medical coding, and intelligent scheduling across every department within 90 days. Physicians should never touch a chart again. The 40% of their day spent on paperwork becomes 40% more patient-facing time — or 40% fewer physicians needed.',
          C: 'Eliminate the administrative middle layer. Medical coders, transcriptionists, prior-auth staff, and scheduling coordinators need to be retrained as AI workflow managers or redeployed to patient-facing roles. Every dollar spent on manual administration is a dollar wasted.',
          P: 'Mandate AI-assisted diagnostics for every imaging study, lab panel, and clinical encounter. Track diagnostic accuracy and time-to-diagnosis before and after. The productivity gains will reshape your staffing ratios, your patient throughput, and your financial model simultaneously.',
          T: 'Extend AI diagnostic tools to every access point — community clinics, telehealth platforms, nursing facilities, home health. The specialist shortage doesn\'t get solved by training more specialists. It gets solved by distributing their expertise through AI to every provider.',
          D: 'Integrate AI clinical decision support into every order set, every prescription, and every discharge plan. Make it the default — physicians opt out of AI recommendations, not into them. The liability landscape is shifting: not using available AI will become the negligence claim.',
          scarce_knowledge: 'Capture your specialists\' diagnostic patterns, treatment protocols, and clinical judgment in AI training data now. Their expertise is more valuable as a scalable AI asset than as a single clinician\'s intuition. Build proprietary clinical AI that reflects your institution\'s standards of care.',
          coordination_zero: 'Redesign care pathways around AI-orchestrated coordination. Automated handoffs, AI-generated discharge plans, and real-time bed management replace the case managers and coordinators who spent their days on the phone. The humans focus on complex cases and patient relationships.',
          unbundling: 'Build your own AI-powered remote care platform before your patients find someone else\'s. Offer AI-triaged virtual visits, remote monitoring with AI-analyzed biometrics, and at-home diagnostic kits with AI interpretation. If you only deliver care inside your walls, you\'ll watch your patient volume migrate to platforms that don\'t have walls.',
          verification: 'Deploy AI-powered clinical quality monitoring across every care pathway — real-time medication error detection, protocol adherence tracking, and outcomes analysis. Shift from retrospective chart audits to continuous AI assurance. Patient safety becomes a data problem, and AI solves data problems.',
          physical: 'Surgical procedures, bedside care, and physical rehabilitation remain irreducibly human — but AI transforms everything around the physical act. Invest in AI-assisted surgical planning, robotic procedure support, and AI-optimized recovery protocols. The hands stay human; everything else gets smarter.',
          adoption_high: 'AI-assisted diagnostics and clinical documentation are already standard at leading health systems. If your clinicians are still hand-coding and manually triaging, they\'re practicing at a disadvantage against institutions where AI catches what humans miss.',
          adoption_medium: 'The health systems adopting AI now will set the standard of care within 24 months. Those still running pilots will be defending malpractice claims about why they didn\'t use tools that were available and proven.',
          adoption_low: 'Healthcare has been cautious about AI adoption, but the regulatory and clinical evidence base is catching up fast. The first system to deploy AI at scale across diagnostics, documentation, and care coordination will force every competitor to follow. Be the benchmark, not the laggard.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'AI generates campaign copy, produces social media assets, edits video, and builds storyboards faster than your creative team can brief each other on the project. The junior copywriter, the production assistant, the stock-footage researcher — their workflows are being swallowed whole by generative tools that never miss a deadline.',
          C: 'The production pipeline that required copywriters, designers, editors, motion graphics artists, and post-production houses collapses into a creative director and an AI stack. Your 30-person content team delivers what used to take 100 — and the freelance bench you relied on is pricing against free.',
          P: 'A single content strategist with AI tools produces more campaign variations, more platform-specific assets, and more A/B test iterations in a day than your entire creative department produced in a week. The bottleneck shifts from production to judgment.',
          T: 'AI puts professional-grade design, video editing, and copywriting capability in the hands of every marketing coordinator and social media manager. The creative craft that took a decade to master is now accessible to anyone with taste and a prompt. Your mid-tier creatives are squeezed from both sides.',
          D: 'AI-native content platforms let brands produce and distribute campaigns without agencies, without production companies, without media buyers. Your clients are realizing they don\'t need your 15% commission when AI gives them the same output for a subscription fee.'
        },
        shifts: {
          scarce_knowledge: 'Elite creative directors, award-winning copywriters, and senior producers — the talent that defined your agency\'s voice — their aesthetic instincts and storytelling frameworks are being absorbed into AI systems that any brand manager can wield. The taste gap is narrowing.',
          coordination_zero: 'A campaign launch that required a creative director, art director, copywriter, designer, video editor, media planner, and account manager coordinating across six weeks now gets orchestrated by two people and AI in six days. The agency model was built on coordination overhead. That overhead just evaporated.',
          unbundling: 'Brands no longer need the full-service agency. AI lets them unbundle: automated social content here, AI-generated ad creative there, algorithmic media buying everywhere. Your retainer model depended on bundled complexity. The bundle is shattering.'
        },
        exposure: {
          28: 'AI generates ad copy, social posts, brand imagery, video scripts, and design assets at a pace that makes your creative team\'s output look artisanal. The question isn\'t quality — it\'s volume. When AI produces 200 variations while your team debates one, the economics force a reckoning.',  // Creative direction & content creation
          19: 'Audience analytics, competitive intelligence, and trend forecasting that required your research team to compile for weeks get synthesized by AI overnight. Your strategists walk into the room already knowing what took a department to figure out.',  // Market research & competitive analysis
          21: 'AI pre-briefs your sales team with client intelligence, drafts pitch decks, and identifies upsell opportunities before the meeting starts. The account executive who still relies on relationship alone loses to the one whose AI already mapped the client\'s entire digital footprint.',  // Sales & client relationship mgmt
          26: 'Press releases, media kits, stakeholder updates, and crisis communications get AI-drafted in minutes. Your PR team shifts from writing to editing, from producing to curating — and the ones who can\'t make that shift become redundant.',  // Stakeholder communication & PR
          13: 'Campaign performance analysis, ROI modeling, and audience segmentation that kept your analytics team busy all quarter get automated. AI spots the patterns your data analysts were hired to find — and finds them before the campaign even finishes running.'  // Data analysis & business intelligence
        },
        shifting: {
          scarce_knowledge: 'Elite creative talent — your differentiator — becomes AI-augmented commodity. Taste still matters, but production doesn\'t.',
          coordination_zero: 'Campaign teams of 12 coordinating across weeks collapse to 2 people with AI in days. Your agency model loses its structural justification.',
          unbundling: 'Brands cherry-pick AI content tools instead of buying your full-service retainer. The pieces are cheaper than the package.'
        },
        shiftingFallback: {
          A: 'Content creation, campaign production, media buying, and performance analysis are being automated. The production roles that formed the backbone of agencies and studios are being absorbed into generative AI workflows.',
          C: 'AI is collapsing the creative production pipeline — copywriters, designers, editors, and production assistants are being replaced by AI tools a creative director can operate alone. The staffing model that justified your overhead is dissolving.',
          P: 'Creative professionals with AI tools produce 10x more content across more platforms and more formats. Your top creatives are adopting or leaving. Your average ones are being outproduced by machines before they notice.',
          T: 'AI is democratizing professional-grade creative production — design, video, copy, strategy — to anyone with a vision and a laptop. The skill barriers that protected your creative team\'s value are being dismantled in real time.',
          D: 'AI-native content platforms are enabling brands to go direct, bypassing agencies, production houses, and media buyers entirely. Your competitive moat depends on judgment and relationships that AI is actively eroding.'
        },
        recommendations: {
          A: 'Restructure your creative team now. Junior copywriters and production assistants become AI-output curators. Designers become art directors who steer AI generation. The old production roles don\'t exist anymore — rebuild the org around AI-augmented creative direction before your clients figure out they can do it themselves.',
          C: 'Collapse your production pipeline. One creative director with AI tools replaces the copywriter-designer-editor-producer chain. Retrain your producers as AI workflow architects and your account managers as strategic consultants. The people who coordinated production need to add value somewhere AI can\'t.',
          P: 'Mandate AI-assisted content creation across every client engagement within 30 days. Measure output volume, turnaround time, and client satisfaction before and after. The productivity explosion will force a pricing conversation: move to value-based fees before clients demand it.',
          T: 'Rebuild your creative process around AI-native workflows: AI-generated concept variations reviewed by creative directors, AI-produced assets refined by art directors, AI-drafted copy polished by senior writers. The human role shifts from making to choosing.',
          D: 'Launch AI-native content services that compete at price points your traditional agency model can\'t touch. If a brand can produce 80% of their content with AI tools, sell them the 20% that requires human judgment — and the AI infrastructure to handle the rest.',
          scarce_knowledge: 'Codify your best creative directors\' instincts — brand voice guidelines, aesthetic frameworks, storytelling patterns — into AI-accessible systems. Their taste becomes exponentially more valuable as AI training data than as individual intuition locked in one person\'s head.',
          coordination_zero: 'Redesign your agency operations for AI-native coordination: AI-generated creative briefs, AI-produced first drafts, AI-assembled media plans. The humans focus on strategic judgment and client relationships — not routing information between departments.',
          unbundling: 'Build modular creative offerings at every price point: fully AI-automated for social content, AI-augmented for campaigns, human-led for brand strategy. If clients can unbundle your retainer, be the one selling the pieces. Your brand expertise only matters if you deploy it before someone routes around it.',
          verification: 'Deploy AI-powered brand consistency checking across every asset — logo usage, tone of voice, visual identity, legal compliance. Every piece of content gets AI-reviewed before it ships. Quality control becomes automated, not a bottleneck.',
          physical: null,
          adoption_high: 'AI-generated content is already flooding your competitive landscape. If your creative team isn\'t using AI tools daily, they\'re producing less, slower, and at higher cost than every competitor who is.',
          adoption_medium: 'The agencies and studios moving on AI now will lock in a structural advantage in speed, volume, and cost. Within 12 months, AI-augmented creative will be the baseline. Shops still debating adoption will be losing pitches to shops that already adopted.',
          adoption_low: 'Your sector has been surprisingly slow to adopt AI at scale despite being one of the most disrupted. The first agency to rebuild its entire pipeline around AI will redefine what clients expect for speed, cost, and creative volume. Set the standard before someone else does.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'AI generates lesson plans, grades essays, creates assessments, builds personalized learning paths, and answers student questions 24/7 with infinite patience. The adjunct professor grading 150 papers over a weekend is competing with a system that does it in minutes — and provides better feedback.',
          C: 'The administrative scaffolding of education — registrars, admissions processors, academic advisors, financial aid officers — is being absorbed into AI-powered student service platforms. Your 200-person administrative staff does what used to require 500.',
          P: 'Professors with AI tools create entire courses — lectures, readings, assessments, discussion prompts — in days instead of months. Instructional designers build adaptive learning modules at 10x the pace. The bottleneck in education was always content production. That bottleneck just disappeared.',
          T: 'AI puts world-class instruction within reach of every student regardless of institution. A community college student gets AI-powered tutoring as sophisticated as what a Harvard student gets from office hours. The prestige gap in educational quality is collapsing.',
          D: 'AI-native learning platforms deliver personalized education at scale — adaptive pacing, real-time comprehension assessment, custom remediation — that no human instructor can match for a class of 300. The lecture hall model isn\'t just outdated. It\'s pedagogically indefensible against what AI makes possible.'
        },
        shifts: {
          scarce_knowledge: 'Tenured professors, distinguished researchers, and master teachers — the faculty you spent years recruiting — their pedagogical expertise and subject-matter depth are being encoded into AI tutoring systems that any institution can license. The faculty hiring arms race loses its point.',
          coordination_zero: 'A course launch that required a professor, instructional designer, LMS administrator, TA coordinator, and department chair coordinating over months now gets assembled by one educator with AI tools in weeks. The administrative overhead that justified your staffing model just evaporated.',
          unbundling: 'Students no longer need the full university experience for every learning goal. AI-powered micro-credentials, adaptive skill platforms, and personalized tutoring unbundle the degree into components. Your four-year residential model competes with targeted, AI-delivered alternatives that cost a fraction.'
        },
        exposure: {
          23: 'AI tutors provide unlimited one-on-one instruction, grade assignments with detailed feedback, and adapt to each student\'s learning pace. Your teaching assistants and adjuncts are being outperformed by systems that never cancel office hours and never run out of patience.',  // Teaching, training & mentoring
          15: 'Literature reviews, grant proposal research, and academic knowledge synthesis that took researchers months get compressed to days. AI reads, cross-references, and synthesizes the entire corpus of published work faster than any doctoral student.',  // Research & knowledge synthesis
          33: 'Student mentoring, academic advising, and pastoral care remain human — but AI handles the triage, the scheduling, the follow-up, and the early-warning detection of struggling students. The counselor focuses on the conversations that matter, not the administrative tracking.',  // Caregiving & patient interaction
          1: 'Student records, enrollment processing, grade entry, transcript management, and accreditation documentation — the paperwork that consumed registrars and administrative staff — gets automated end to end.',  // Data entry & record-keeping
          28: 'AI generates course materials, lecture slides, interactive exercises, and multimedia learning content at a pace that makes your instructional design team look like a cottage industry. Curriculum development becomes curation, not creation.'  // Creative direction & content creation
        },
        shifting: {
          scarce_knowledge: 'Distinguished faculty expertise — your recruitment trophy — becomes AI-accessible to every institution and every student.',
          coordination_zero: 'Course development teams of 6 coordinating over months collapse to one educator with AI in weeks. Your academic bureaucracy loses its justification.',
          unbundling: 'Students cherry-pick AI-powered courses and micro-credentials instead of buying the four-year bundle. The degree model fractures.'
        },
        shiftingFallback: {
          A: 'Grading, lesson planning, academic advising, enrollment processing, and content creation are being automated. The work that occupied 60% of faculty and staff time is being absorbed into AI systems.',
          C: 'AI is eliminating the administrative layers in education — registrars, admissions processors, academic advisors, and financial aid officers. Those positions don\'t get reduced. They get replaced by platforms.',
          P: 'Educators with AI tools create courses, grade assessments, and advise students at 5-10x the pace. The productivity math means fewer faculty handle more students — or the same faculty dramatically improve educational outcomes.',
          T: 'AI is distributing world-class educational expertise to every institution, every classroom, and every student. The quality gap between elite and average institutions is being compressed by AI that makes great teaching universally accessible.',
          D: 'AI-native learning platforms deliver adaptive, personalized education that no lecture hall can match. The institutions that don\'t integrate AI aren\'t just less efficient — they\'re pedagogically inferior.'
        },
        recommendations: {
          A: 'Deploy AI-powered grading, lesson planning, and student advising across every department within one academic year. Faculty should never spend another weekend grading papers by hand. The hours recovered go to research, mentoring, and the irreplaceable human elements of teaching.',
          C: 'Consolidate administrative functions into AI-powered student service platforms. Admissions, financial aid, registration, and academic advising can be 80% automated. Retrain displaced staff as student success coaches and AI system managers — roles that add value machines can\'t.',
          P: 'Mandate AI-assisted course development and assessment creation for all faculty. Track time-to-course-launch and student outcomes before and after. The productivity gains will reshape your faculty workload models, your adjunct dependency, and your cost per student.',
          T: 'Build AI-powered tutoring and adaptive learning into every course offering. Give every student access to personalized instruction that adapts in real time. The institution that makes AI tutoring universal becomes the one that actually delivers on the promise of personalized education.',
          D: 'Launch AI-native learning programs — adaptive micro-credentials, personalized skill pathways, AI-tutored professional development — that compete at price points your traditional degree can\'t touch. If students can get the skills without the degree, sell the skills before someone else does.',
          scarce_knowledge: 'Capture your best professors\' pedagogical methods, subject expertise, and advising approaches in AI-accessible systems. Their teaching becomes exponentially more valuable as AI training data than as one section of one course. A single master teacher\'s methods can reach millions.',
          coordination_zero: 'Redesign academic operations for AI-native workflows: AI-generated syllabi, AI-assembled reading lists, AI-managed LMS administration, AI-coordinated TA scheduling. Faculty focus on teaching and research — not logistics that a machine handles better.',
          unbundling: 'Build modular learning offerings at every price point: fully AI-delivered for skill acquisition, AI-augmented for degree programs, faculty-led for research and graduate education. If students can unbundle the degree, be the one selling the modules. Your brand carries farther in pieces than it does locked behind a four-year commitment.',
          verification: 'Deploy AI-powered academic integrity monitoring, learning outcome assessment, and accreditation compliance tracking. Shift from end-of-semester evaluations to continuous AI-driven learning analytics. Student success becomes predictable and actionable, not retrospective.',
          physical: null,
          adoption_high: 'AI-powered learning tools are already reshaping student expectations. If your institution isn\'t integrating AI into instruction and administration, students and faculty will adopt it anyway — without your oversight or quality control.',
          adoption_medium: 'The institutions adopting AI now will define the next era of education. Within two years, AI-augmented teaching and automated administration will be the baseline. Schools still piloting will be recruiting from schools that already deployed.',
          adoption_low: 'Higher education has been slow to adopt AI at institutional scale. The first university to rebuild its entire academic and administrative operation around AI will set a standard that forces every peer to follow. That institution captures the best faculty, the best students, and the narrative.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'AI processes permit applications, reviews benefit claims, classifies FOIA requests, and drafts regulatory correspondence faster than your case workers can open the file. The backlog that defined government service delivery is being cleared by systems that never take a sick day.',
          C: 'The clerical backbone of government — data entry clerks, records processors, permit reviewers, and scheduling coordinators — is being absorbed into AI-powered case management systems. Your agency accomplishes with 200 staff what used to require 600.',
          P: 'Policy analysts with AI tools synthesize legislative research, model regulatory impacts, and draft policy memos in hours instead of weeks. Procurement officers process vendor evaluations at 5x the pace. The bureaucratic speed that citizens complained about is being replaced by AI-driven velocity.',
          T: 'AI puts senior policy expertise within reach of every case worker, every field inspector, and every constituent services representative. A junior analyst with AI tools produces policy briefs as thorough as a 20-year veteran. The expertise gap across GS levels is flattening.',
          D: 'AI-powered decision support helps administrators allocate budgets, prioritize enforcement actions, and route constituent services based on data-driven analysis rather than institutional inertia. The government decisions that affected millions based on gut instinct now run through models that surface what the data actually says.'
        },
        shifts: {
          scarce_knowledge: 'Senior policy analysts, experienced inspectors, and veteran procurement officers — the institutional knowledge holders you couldn\'t replace when they retired — their expertise is being captured in AI systems that any new hire can access on day one. The knowledge drain of government retirement waves just found a fix.',
          coordination_zero: 'Inter-agency coordination that required weeks of memos, meetings, and liaison officers collapses into AI-orchestrated workflows that route information, flag dependencies, and track compliance across agencies automatically. The bureaucratic friction that defined government is being automated away.',
          unbundling: 'Citizens no longer need to navigate the full government apparatus for every service. AI-powered self-service portals, automated eligibility determination, and intelligent case routing unbundle the agency experience. Your office visit becomes a last resort, not a first step.'
        },
        exposure: {
          1: 'Permit applications, benefit enrollment forms, tax filings, and public records management — the paperwork mountain that defined government operations — gets processed by AI that reads, validates, routes, and files without human intervention. Your data entry backlog ceases to exist.',  // Data entry & record-keeping
          4: 'Regulatory compliance reviews, licensing verifications, and enforcement documentation that consumed your compliance officers\' weeks get AI-processed continuously. The regulatory backlog that let violations slide for months gets cleared in days.',  // Regulatory compliance filing
          7: 'FOIA requests, legal document review, contract classification, and records management — the document-heavy work that kept your clerks and paralegals buried — gets AI-sorted, classified, and routed automatically. Response times drop from months to days.',  // Document review & classification
          3: 'Meeting coordination, hearing scheduling, resource allocation across departments, and facility booking — the administrative logistics that consumed your support staff\'s time — runs on AI that optimizes across constraints no human scheduler could track.',  // Scheduling & resource allocation
          24: 'Constituent inquiries, benefit status checks, permit questions, and complaint intake — the front-line citizen interaction that overwhelmed your call centers — gets handled by AI that provides accurate answers 24/7 and escalates only the cases that need human judgment.'  // Customer service & support
        },
        shifting: {
          scarce_knowledge: 'Veteran institutional knowledge — your retiring GS-15s — becomes AI-accessible to every new hire on day one.',
          coordination_zero: 'Inter-agency coordination that took weeks of memos collapses into automated workflows. Bureaucratic friction becomes optional.',
          unbundling: 'Citizens self-serve through AI portals instead of navigating your agency structure. The office visit becomes the exception.'
        },
        shiftingFallback: {
          A: 'Data entry, permit processing, document review, compliance filing, and constituent services are being automated. The clerical and administrative functions that comprised 60% of government payroll are being absorbed into AI systems.',
          C: 'AI is eliminating the coordination layers in government — the clerks who routed paperwork, the liaisons who connected agencies, the schedulers who managed hearings. Those positions don\'t thin out. They get consolidated into platforms.',
          P: 'Government workers with AI tools process cases, draft policies, and manage compliance at 5-10x the pace. The productivity math means either dramatically faster service delivery or significantly leaner agencies. Probably both.',
          T: 'AI is redistributing institutional expertise across every level of government. Junior case workers get AI-powered decision support as good as a senior colleague\'s guidance. The knowledge gap that slowed onboarding and hurt service quality is closing.',
          D: 'AI-powered analytics are exposing inefficiencies, identifying fraud patterns, and optimizing resource allocation in ways that political intuition and institutional habit never could. The data-driven government isn\'t aspirational anymore — it\'s operational.'
        },
        recommendations: {
          A: 'Deploy AI-powered case management across every citizen-facing agency within 12 months. Permit processing, benefit determination, and records management should be 80% automated. Retrain displaced clerks as AI system monitors and exception handlers — the humans handle the edge cases, not the routine.',
          C: 'Consolidate administrative functions across agencies into shared AI-powered service platforms. Five agencies don\'t need five separate data entry teams when one AI system processes all their intake. Break the agency-by-agency staffing model that multiplied headcount for decades.',
          P: 'Mandate AI-assisted policy analysis, procurement evaluation, and regulatory review across all departments. Track case processing times and policy output before and after. The efficiency gains will reshape your FTE models, your budget requests, and your service delivery commitments.',
          T: 'Build AI-powered knowledge management systems that capture retiring employees\' institutional expertise before they walk out the door. Every inspection protocol, every policy interpretation, every procurement best practice needs to be AI-accessible to the next generation of civil servants.',
          D: 'Implement AI-powered decision analytics for budget allocation, enforcement prioritization, and program evaluation. Make data-driven the default — not a special initiative, but the way government operates. The decisions that affect millions of citizens deserve the rigor that AI makes possible.',
          scarce_knowledge: 'Capture your senior policy analysts\' and veteran inspectors\' expertise in AI training systems before the retirement wave takes it out the door. Their institutional knowledge is a public asset — encode it, scale it, and make it available to every new hire and every citizen-facing system.',
          coordination_zero: 'Redesign inter-agency workflows around AI-orchestrated coordination: automated data sharing, AI-routed case referrals, and real-time compliance tracking across agencies. The liaison officers and coordination staff become AI workflow architects who design the automated handoffs.',
          unbundling: 'Build AI-powered citizen self-service portals that handle 80% of routine interactions — permit applications, benefit checks, records requests, scheduling. Design for the citizen who never wants to visit your office. The ones who do visit get faster service because the queue is shorter.',
          verification: 'Deploy AI-powered fraud detection, compliance monitoring, and audit analytics across every program. Shift from periodic audits and random sampling to continuous AI surveillance. Waste and fraud that hid in volume get surfaced in real time.',
          physical: null,
          adoption_high: 'Leading government agencies are already deploying AI for case management and citizen services. Agencies that haven\'t adopted are delivering slower service, processing larger backlogs, and losing talent to agencies and private sector employers that offer modern tools.',
          adoption_medium: 'The agencies adopting AI now will set the benchmark for government efficiency within 18 months. Those still running pilots will face budget scrutiny from legislators who see peer agencies delivering more with less.',
          adoption_low: 'Government has been historically slow to adopt new technology, but AI adoption pressure from citizens, legislators, and competing agencies is accelerating. The first agency to deploy AI at scale will reset expectations for every other agency — and create political momentum that forces system-wide adoption.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'AI-driven vision systems inspect welds, measure tolerances, and flag defects on the production line faster and more consistently than your best quality inspectors. Predictive maintenance algorithms schedule CNC machine servicing before breakdowns happen. Your plant floor is being re-staffed by software.',
          C: 'The layers between your process engineers and the factory floor — shift supervisors tracking OEE metrics, quality techs pulling samples, planners updating the MES — are being compressed into AI dashboards that one plant manager monitors. Three roles become one screen.',
          P: 'Your industrial designers iterate CAD/CAM models with AI-generated design alternatives in hours instead of weeks. Process engineers simulate production line changes before a single bolt moves. The plant that adopts this ships 3x more product variants with the same headcount.',
          T: 'Lean manufacturing expertise that took process engineers a decade to internalize — Kanban flow optimization, six-sigma defect analysis, bill-of-materials rationalization — is now embedded in AI systems that any production supervisor can query. The black belt is a chatbot.',
          D: 'AI enables contract manufacturers to offer just-in-time delivery, custom fabrication, and real-time quality reporting that used to require massive vertically integrated operations. A 50-person shop with AI competes with your 500-person plant on precision and speed.'
        },
        shifts: {
          scarce_knowledge: 'Your veteran process engineers who can diagnose a CNC tolerance drift by ear, your supply chain managers who know which vendors will miss delivery windows before the vendors do — that pattern recognition is being captured in AI models trained on years of production data. The institutional knowledge that made your plant hum is becoming transferable software.',
          coordination_zero: 'Coordinating a production run used to require a planner, a procurement lead, a quality manager, and a shift supervisor all in sync. AI now orchestrates the bill of materials, schedules the floor, triggers supplier orders, and monitors quality in one integrated loop. One person oversees what five managed.',
          unbundling: 'AI lets small specialty manufacturers offer the quality control, supply chain optimization, and predictive maintenance that only large operations could afford. Your scale advantage erodes when a 20-person shop runs AI-optimized production with better defect rates than your legacy line.'
        },
        exposure: {
          8: 'Robotic cells with AI-guided assembly handle repetitive fabrication tasks with sub-millimeter precision and zero fatigue. Your assembly workers shift from doing the work to supervising the machines that do it.',   // Assembly & fabrication
          6: 'Computer vision inspects every unit on the line in real time — no sampling, no subjective judgment, no missed shifts. Your defect rate drops and your quality inspectors become vision system calibrators.',         // Quality control / inspection
          20: 'AI models forecast demand, optimize inventory levels, and reroute supply chains around disruptions before your procurement team finishes reading the morning email. Just-in-time delivery actually works now.',     // Supply chain optimization
          17: 'AI generates and stress-tests engineering designs, simulates thermal and mechanical loads, and suggests material substitutions — all before your engineers finish their first sketch. Design cycles compress from months to days.',  // Engineering design & simulation
          3: 'Production scheduling becomes a continuous AI optimization problem: machine utilization, labor availability, material arrivals, and customer priorities all balanced in real time. Your Gantt charts are obsolete.'    // Scheduling & resource allocation
        },
        shifting: {
          scarce_knowledge: 'Veteran process engineers\' pattern recognition — the tribal knowledge of your plant — becomes transferable AI.',
          coordination_zero: 'Production coordination across five roles collapses into one AI-orchestrated loop.',
          unbundling: 'Small shops with AI match your quality and speed. Scale stops being a moat.'
        },
        shiftingFallback: {
          A: 'Quality inspection, production scheduling, and supply chain management are being automated at a pace that will reshape your plant floor within two years. The roles that kept the line running are being absorbed into AI systems.',
          C: 'AI is compressing the management layers between engineering and the factory floor. Shift supervisors, quality techs, and production planners are being consolidated into AI-monitored workflows.',
          P: 'Engineers and plant managers with AI tools are optimizing production output, defect rates, and changeover times at levels that make non-AI-equipped competitors look like they\'re running a generation behind.',
          T: 'The lean manufacturing expertise and process engineering knowledge that took decades to build is being encoded into AI systems that any plant can deploy. Your operational advantage is becoming a commodity.',
          D: 'AI-equipped contract manufacturers are offering custom fabrication, quality assurance, and just-in-time delivery that undermines the scale advantages of large industrial operations.'
        },
        recommendations: {
          A: 'Deploy AI-powered visual inspection and predictive maintenance on your highest-volume production lines within 90 days. Retrain quality inspectors as vision system operators and maintenance techs as AI-monitored reliability engineers. The ROI shows up in defect rates and unplanned downtime — both will drop fast enough to fund the next phase.',
          C: 'Redesign your plant management structure around AI-augmented roles: one production manager overseeing AI-optimized scheduling, quality, and supply chain instead of separate teams for each. The middle layer of your operations org exists to coordinate — AI coordinates better.',
          P: 'Equip every process engineer and industrial designer with AI-powered CAD/CAM and simulation tools. Measure design iteration speed, first-pass yield, and changeover time before and after. The engineers who embrace it will deliver 3-5x more design variants and optimizations.',
          T: 'Capture your veteran engineers\' process knowledge into AI-accessible systems now, while they\'re still on the floor. Run AI-assisted production alongside legacy processes for one quarter, then transition. Every month you wait, institutional knowledge retires without being digitized.',
          D: 'Launch an AI-native manufacturing service line — rapid prototyping, smart quality, predictive supply chain — that competes with the contract manufacturers eating your lunch. If a 50-person shop can match your precision with AI, you need to be that shop at 10x scale.',
          scarce_knowledge: 'Your senior process engineers and master machinists hold knowledge that no manual has captured. Build AI apprenticeship programs that pair them with ML engineers to encode their expertise into production AI systems. This is a 12-month window before retirements make it impossible.',
          coordination_zero: 'Implement AI-orchestrated production workflows that integrate scheduling, procurement, quality, and floor management into a single system. Retrain your coordinators as AI workflow managers. The five-person coordination chain becomes one person monitoring an AI loop.',
          unbundling: 'Develop modular AI-powered manufacturing services — quality-as-a-service, predictive-maintenance-as-a-service — that you can sell to smaller manufacturers while using internally. If your operational capabilities are being unbundled, be the one selling the pieces.',
          verification: 'Deploy continuous AI quality monitoring across every production line. Move from statistical sampling to 100% inspection with computer vision. Your customers will demand AI-verified quality certificates — be ready to provide them.',
          physical: 'Map your factory floor for robotics integration: identify the 20% of manual tasks that account for 80% of labor hours and build a phased automation roadmap. Start with pick-and-place and welding cells, then expand to flexible robotic assembly. Budget for cobot deployment alongside AI — the software and the hardware are a package deal.',
          adoption_high: 'Your competitors are already running AI-optimized production lines. If your OEE metrics aren\'t improving quarterly from AI interventions, you\'re falling behind in real time. Accelerate deployment across all lines, not just the pilot.',
          adoption_medium: 'Smart manufacturing is transitioning from pilot phase to standard practice. Plants that deploy AI-integrated production now will lock in efficiency advantages that late movers can\'t close. The gap compounds every quarter.',
          adoption_low: 'Most manufacturers in your segment are still running traditional operations. The first plant to go AI-native will set quality and cost benchmarks that force the rest to follow or lose contracts. Be the benchmark.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'AI monitors SCADA systems, predicts transformer failures, and files FERC and NERC regulatory reports while your grid engineers are still reviewing yesterday\'s outage logs. Predictive maintenance schedules turbine servicing weeks before a fault cascades. Your power plant operators are becoming supervisors of AI that runs the plant.',
          C: 'The chain from pipeline inspector to field report to engineering review to maintenance dispatch is being collapsed into AI that reads sensor data, generates the inspection report, prioritizes the repair, and dispatches the crew — all before your pipeline integrity manager finishes their morning briefing.',
          P: 'Renewable energy engineers model solar farm layouts, wind turbine placements, and grid integration scenarios with AI that evaluates thousands of configurations overnight. Your substation operators monitor twice the assets with AI-augmented control rooms. Output per engineer doubles without adding a single headcount.',
          T: 'Grid management expertise — load balancing across substations, energy trading optimization, outage response sequencing — knowledge that took utility veterans twenty years to master is now embedded in AI systems that any control room operator can leverage. Smart meters and AI make the grid self-diagnosing.',
          D: 'AI-enabled distributed energy companies are offering microgrid management, predictive maintenance, and regulatory compliance as services that bypass your centralized utility model. The barriers to entry were capital and expertise. AI just eliminated the expertise part.'
        },
        shifts: {
          scarce_knowledge: 'Your senior grid engineers who can balance load across a dozen substations by intuition, your drilling supervisors who read formation pressure like a language — that operational wisdom is being captured by AI trained on decades of SCADA data and field reports. The expertise that justified six-figure salaries is becoming a deployable algorithm.',
          coordination_zero: 'An outage response that required a dispatcher, a field crew lead, a grid engineer, and a regulatory liaison coordinating in real time now gets orchestrated by AI that diagnoses the fault, routes the crew, reroutes power, and drafts the incident report simultaneously. Four coordination handoffs become one automated workflow.',
          unbundling: 'AI enables small energy service companies to offer grid monitoring, predictive maintenance, and compliance filing that used to require a full utility back office. Your integrated service model loses its cost advantage when a 10-person firm with AI delivers the same reliability metrics.'
        },
        exposure: {
          18: 'AI correlates SCADA telemetry, vibration data, and thermal imaging to diagnose turbine faults, pipeline anomalies, and transformer degradation weeks before failure. Your field technicians arrive with the diagnosis already confirmed and the parts already ordered.',  // Diagnostics & troubleshooting
          17: 'AI designs renewable installations, models grid interconnection impacts, and simulates load scenarios faster than your engineering team can set up the spreadsheet. Substation layout and pipeline routing get optimized through thousands of AI-generated alternatives.',  // Engineering design & simulation
          11: 'Predictive maintenance powered by AI sensor analysis replaces calendar-based maintenance schedules. Your cleaning and facility ops crews deploy when the data says to, not when the calendar does — cutting maintenance costs while improving uptime.',  // Cleaning, maintenance & facility ops
          3: 'Crew scheduling, outage response sequencing, and preventive maintenance windows are continuously optimized by AI that balances labor availability, weather forecasts, equipment status, and regulatory deadlines in real time.',    // Scheduling & resource allocation
          4: 'FERC filings, NERC compliance reports, environmental impact documentation, and safety certifications get auto-generated from operational data. Your regulatory team shifts from drafting reports to reviewing AI output for accuracy.'  // Regulatory compliance filing
        },
        shifting: {
          scarce_knowledge: 'Grid management intuition and drilling expertise — your unfillable senior roles — become AI-deployable algorithms.',
          coordination_zero: 'Outage response coordination across four roles collapses into one AI-orchestrated workflow.',
          unbundling: 'Small energy service firms with AI match your reliability metrics. Integration stops being a moat.'
        },
        shiftingFallback: {
          A: 'Diagnostics, maintenance scheduling, and regulatory compliance filing are being automated across the energy sector. The field and control room roles that kept the grid running are being augmented — and in some cases replaced — by AI systems.',
          C: 'AI is compressing the operational layers between sensor data and executive decisions. Field inspection teams, regulatory compliance staff, and dispatch coordinators are being consolidated into AI-managed workflows.',
          P: 'Engineers and plant operators with AI tools are managing more assets, diagnosing problems faster, and filing compliance reports in a fraction of the time. The productivity gap between AI-equipped and traditional utilities is widening every quarter.',
          T: 'The grid management, pipeline integrity, and energy trading expertise that took decades to develop is being embedded in AI systems that any utility can deploy. Your operational knowledge advantage is becoming a commodity.',
          D: 'AI-native energy service companies are offering distributed grid management, predictive maintenance, and regulatory compliance that challenges the centralized utility model from every direction.'
        },
        recommendations: {
          A: 'Deploy AI-powered predictive maintenance on your most critical assets — turbines, transformers, pipeline segments — within 90 days. Retrain field technicians as AI-informed diagnosticians who arrive at every job with the root cause already identified. The reduction in unplanned outages will justify the investment within two quarters.',
          C: 'Consolidate your field operations, grid monitoring, and regulatory compliance into AI-integrated command centers. One operator managing AI dashboards replaces the separate dispatch, monitoring, and reporting teams. The coordination overhead that justified your headcount is being automated.',
          P: 'Equip every grid engineer and renewable energy designer with AI-powered modeling and simulation tools. Mandate adoption for all new project designs within 60 days. The engineers who use AI will evaluate 10x more design alternatives and catch problems that manual analysis misses entirely.',
          T: 'Capture your senior operators\' grid management and field diagnostic expertise in AI training programs now. Partner your most experienced engineers with ML teams to encode institutional knowledge before retirement waves hit. This expertise is perishable — digitize it or lose it.',
          D: 'Build AI-native energy service offerings — microgrid management, predictive maintenance as a service, automated compliance — that compete with the distributed energy companies entering your market. If you only defend the centralized model, the unbundlers will take your most profitable service lines.',
          scarce_knowledge: 'Your veteran grid operators and drilling supervisors hold operational knowledge that no training manual captures. Build structured AI knowledge-capture programs that translate their intuition into deployable models. The retirement wave is coming — every month of delay is permanent knowledge loss.',
          coordination_zero: 'Redesign outage response and maintenance workflows around AI orchestration: automated fault diagnosis, AI-dispatched crews, real-time regulatory documentation. Retrain dispatchers and coordinators as AI workflow managers. The multi-handoff coordination model is already obsolete.',
          unbundling: 'Develop modular AI-powered utility services that can be sold independently — grid monitoring, compliance filing, predictive maintenance — alongside your integrated offerings. If distributed energy companies are unbundling your value chain, be the supplier of the pieces.',
          verification: 'Deploy AI-powered continuous compliance monitoring across all regulatory domains — FERC, NERC, EPA, state PUC. Move from periodic audits to real-time assurance. Regulators are moving toward continuous reporting — be ready before they mandate it.',
          physical: 'Build a phased automation roadmap for your most hazardous and repetitive field operations: pipeline inspection drones, robotic substation maintenance, autonomous vehicle-based line patrols. Pair AI diagnostics with physical automation — the AI identifies the problem, the robot fixes it. Prioritize safety-critical tasks where removing humans from harm reduces both risk and liability.',
          adoption_high: 'AI-powered grid management and predictive maintenance are becoming industry standard. Utilities that haven\'t deployed are falling behind on reliability metrics, regulatory compliance speed, and cost efficiency. Accelerate across all operating divisions.',
          adoption_medium: 'The utilities adopting AI now are building data advantages and operational efficiencies that compound over time. Second movers will face higher implementation costs and a talent market already picked over by early adopters.',
          adoption_low: 'Energy and utilities has been slow to adopt AI beyond pilot programs. The first utility to go enterprise-wide with AI-integrated operations will set reliability and cost benchmarks that regulators may eventually require everyone to meet.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'AI generates BIM clash detections, auto-produces cost estimates from blueprints, and files permit applications while your project managers are still reviewing the punch list from last week. Scheduling algorithms optimize subcontractor sequencing across dozens of trades in minutes. The GC\'s back office is being hollowed out by software.',
          C: 'The coordination stack between architects, structural engineers, site superintendents, and subcontractors — the layers of project managers, estimators, and schedulers who kept the build on track — collapses when AI handles clash detection, change order pricing, and schedule optimization in a single integrated model.',
          P: 'Architects iterate BIM designs with AI-generated structural alternatives, energy simulations, and code compliance checks in hours instead of weeks. Your project managers track punch lists, safety inspections, and subcontractor progress through AI dashboards that flag problems before the site super notices them.',
          T: 'Cost estimation expertise that took senior estimators decades to calibrate — knowing which subcontractors will run over, which materials will spike, which change orders will cascade — is being embedded in AI models trained on thousands of completed projects. A junior estimator with AI outperforms your best veteran on accuracy.',
          D: 'AI-enabled construction tech firms are offering integrated design-to-build services that compress the traditional developer-architect-GC-subcontractor chain. A lean crew with AI-driven project management competes with your 200-person operation on budget and timeline.'
        },
        shifts: {
          scarce_knowledge: 'Your master electricians who can read a building\'s wiring from the panel, your senior estimators who price a change order by gut and get it right within 3% — that experiential knowledge is being captured by AI trained on decades of project data, inspection records, and cost histories. The expertise that built your reputation is becoming downloadable.',
          coordination_zero: 'A commercial build that required an architect, a GC, a dozen subcontractor leads, an inspector, and a permit expediter all choreographed through weekly meetings now gets orchestrated by AI that sequences trades, flags conflicts in the BIM model, auto-generates change orders, and tracks inspections in real time. One project manager replaces five.',
          unbundling: 'AI enables small specialty contractors to offer the project management, cost estimation, and compliance capabilities that only large GCs could afford. Your scale advantage dissolves when a five-person firm runs AI-optimized construction management with better on-time and on-budget rates than your legacy operation.'
        },
        exposure: {
          17: 'AI generates structural designs, runs energy simulations, performs code compliance checks, and produces construction-ready BIM models that used to take an engineering team weeks. Architects and structural engineers become curators of AI-generated alternatives.',  // Engineering design & simulation
          30: 'While skilled trades remain hands-on, AI is reshaping how tradespeople work — optimizing cut lists, sequencing installations, diagnosing electrical faults from photos, and pre-fabricating components with CNC precision. The craft stays human; the planning goes AI.',  // Skilled trades & craft work
          32: 'Site surveys, safety inspections, and progress documentation are being augmented by AI-equipped drones and computer vision that map a jobsite in hours and flag safety violations, schedule deviations, and quality defects automatically.',  // Field work in unstructured environments
          3: 'Construction scheduling — sequencing dozens of trades, accounting for weather, material deliveries, inspector availability, and change orders — becomes a continuous AI optimization that updates in real time instead of weekly.',  // Scheduling & resource allocation
          9: 'Material tracking from supplier to jobsite gets AI-optimized: automated reorder points, just-in-time delivery scheduling, and waste reduction algorithms that cut material costs by 10-15% on a typical commercial build.'  // Material handling & warehousing
        },
        shifting: {
          scarce_knowledge: 'Master tradespeople\'s intuition and senior estimators\' pricing instincts become AI-accessible pattern matching.',
          coordination_zero: 'Multi-trade build coordination collapses from weekly meetings to real-time AI orchestration.',
          unbundling: 'Small contractors with AI match your project management capabilities. Scale stops justifying overhead.'
        },
        shiftingFallback: {
          A: 'Design generation, cost estimation, scheduling, and compliance filing are being automated at a pace that will reshape construction project management within two years. The back-office roles that kept builds on track are being absorbed into AI systems.',
          C: 'AI is compressing the coordination layers between design and construction. Project managers, estimators, and schedulers are being consolidated into AI-integrated workflows that one superintendent can oversee.',
          P: 'Architects, engineers, and project managers with AI tools are delivering designs, estimates, and schedules at 3-5x the speed of traditional methods. The firms that adopt will bid more projects and win more of them.',
          T: 'The construction estimation, project management, and code compliance expertise that took decades to develop is being embedded in AI systems that any contractor can deploy. Your experience advantage is becoming a commodity.',
          D: 'AI-enabled construction tech firms are offering integrated design-to-build services that compress the traditional multi-party project delivery chain and undercut established players on speed and cost.'
        },
        recommendations: {
          A: 'Deploy AI-powered BIM clash detection, automated cost estimation, and permit filing on your next three projects. Retrain your estimators as AI model validators and your project coordinators as AI workflow managers. The accuracy improvements in cost estimation alone — fewer change orders, tighter bids — will fund the transformation.',
          C: 'Restructure your project delivery teams around AI-augmented pods: one senior PM with AI tools managing what previously required separate estimating, scheduling, and compliance teams. Your overhead ratio is your vulnerability — compress it before competitors do.',
          P: 'Mandate AI-assisted design and scheduling tools for every architect, engineer, and PM in your organization within 90 days. Track bid-to-win ratios, schedule variance, and cost accuracy before and after. The firms that move fastest will dominate project pipelines.',
          T: 'Capture your senior estimators\' and superintendents\' project knowledge into AI-accessible systems immediately. Pair your most experienced people with AI training teams to encode decades of construction judgment — pricing patterns, risk factors, subcontractor reliability — before that expertise retires.',
          D: 'Launch an AI-native construction services division that offers design-to-build delivery with AI-optimized scheduling, estimation, and project management. If a lean tech-enabled contractor can match your delivery quality at lower overhead, you need to be that contractor before someone else is.',
          scarce_knowledge: 'Your master tradespeople and senior estimators hold irreplaceable project knowledge. Build structured apprenticeship-to-AI programs that capture their expertise in deployable models. The skilled trades shortage makes this urgent — AI-captured knowledge scales where human mentorship doesn\'t.',
          coordination_zero: 'Implement AI-orchestrated project management that integrates BIM, scheduling, procurement, and inspection into a single real-time system. Retrain your coordination staff as AI workflow managers. The weekly coordination meeting becomes a continuous AI feed that one PM monitors.',
          unbundling: 'Develop modular AI-powered construction services — estimation-as-a-service, scheduling optimization, compliance management — that you can sell to smaller contractors while using internally. If your project management capabilities are being unbundled by tech-enabled startups, sell the pieces yourself.',
          verification: 'Deploy AI-powered continuous quality and safety monitoring across all jobsites. Drone-based progress tracking, computer vision safety compliance, and automated inspection documentation should replace periodic manual walkthroughs. Insurance carriers will reward it; regulators will eventually require it.',
          physical: 'Develop a phased robotics and prefabrication roadmap: start with AI-optimized prefab for repetitive structural and MEP components, then expand to on-site robotic bricklaying, concrete printing, and automated material handling. The skilled trades shortage isn\'t a temporary labor market blip — it\'s structural. Robotics is the only path to scaling construction output without proportional headcount growth.',
          adoption_high: 'Construction tech adoption is accelerating fast. The GCs and developers using AI-powered project management are winning bids with tighter estimates and delivering with fewer change orders. If you\'re not there yet, you\'re already bidding against firms that are.',
          adoption_medium: 'AI adoption in construction is moving from early adopter to mainstream. Firms that deploy AI-integrated project delivery now will build data advantages from completed projects that late movers can\'t replicate. Every project is training data.',
          adoption_low: 'Construction has been one of the slowest sectors to adopt AI, which means the first firm in your market to go all-in will set project delivery benchmarks that force everyone else to follow or lose bids. Be the firm that raises the bar.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'AI optimizes delivery routes in real time, matches freight to carriers algorithmically, and manages warehouse picking sequences while your dispatchers are still working yesterday\'s load board. Autonomous vehicle pilots are running fixed-route corridors. Your fleet managers are becoming software operators.',
          C: 'The layers between a shipper\'s order and a driver\'s cab — dispatchers, freight brokers, route planners, customs agents — are being compressed into AI platforms that match loads, optimize routes, clear customs paperwork, and track containers in a single workflow. Five middlemen become one algorithm.',
          P: 'Fleet managers with AI telematics monitor twice the vehicles, warehouse managers with AI-directed picking move 3x the volume, and logistics coordinators with AI-powered freight matching fill more trucks per day. The output-per-person jump makes traditional operations look like they\'re running at half speed.',
          T: 'Route optimization expertise that took veteran dispatchers years to develop — reading weather patterns, knowing which weigh stations to avoid, predicting port congestion — is being encoded in AI systems that any logistics coordinator can deploy. The dispatcher\'s intuition is now a real-time algorithm.',
          D: 'AI-native logistics platforms are offering end-to-end freight matching, route optimization, and customs clearance that bypass traditional freight brokers and 3PLs entirely. A two-person digital broker with AI handles the volume of a 50-person brokerage. Your relationship advantage evaporates when the algorithm is faster and cheaper.'
        },
        shifts: {
          scarce_knowledge: 'Your veteran dispatchers who can route around a snowstorm before the weather service issues a warning, your port operators who know which container ships will miss their berth window — that operational intuition is being replicated by AI trained on GPS telemetry, port data, and years of shipping patterns. The knowledge that made your logistics operation efficient is becoming a commodity API.',
          coordination_zero: 'Moving a container from factory to retail shelf used to require a freight forwarder, a customs broker, a port operator, a trucking dispatcher, and a warehouse manager all in sync. AI now orchestrates the entire chain — booking, routing, clearing, tracking, and scheduling — in one automated workflow that one logistics manager oversees.',
          unbundling: 'AI enables small carriers and micro-logistics firms to offer the route optimization, freight matching, and compliance filing that only large 3PLs could provide. Your network advantage erodes when a five-truck operation with AI-powered dispatch competes on delivery speed and cost efficiency.'
        },
        exposure: {
          10: 'Autonomous vehicle technology is advancing on fixed routes — long-haul highway corridors, port terminal yards, warehouse aisles — while AI co-pilots assist drivers on complex routes with real-time navigation, fuel optimization, and DOT compliance monitoring. The CDL driver\'s role is being redefined from operator to supervisor.',  // Vehicle / equipment operation (fixed route)
          20: 'AI models optimize entire supply chains in real time: predicting demand, rerouting around disruptions, balancing inventory across distribution centers, and matching freight to the cheapest available carrier. Your supply chain managers shift from reactive problem-solving to strategic exception handling.',  // Supply chain optimization
          3: 'Fleet scheduling, driver assignment, dock appointment booking, and maintenance windows are continuously optimized by AI that balances hours-of-service regulations, vehicle availability, delivery windows, and fuel costs simultaneously.',  // Scheduling & resource allocation
          18: 'AI correlates fleet telematics — engine diagnostics, tire pressure, brake wear, fuel consumption patterns — to predict vehicle failures before they strand a driver. Your maintenance techs get dispatch orders with the diagnosis and parts list already attached.',  // Diagnostics & troubleshooting
          24: 'Customer service for shipment tracking, delivery exceptions, and claims processing runs on AI that provides real-time container visibility, auto-resolves common issues, and escalates only genuine exceptions. Your customer service team handles the cases that require judgment, not status updates.'  // Customer service & support
        },
        shifting: {
          scarce_knowledge: 'Veteran dispatchers\' routing intuition and port operators\' congestion instincts become real-time AI algorithms.',
          coordination_zero: 'End-to-end logistics coordination across five handoffs collapses into one AI-orchestrated workflow.',
          unbundling: 'Small carriers with AI match your dispatch and optimization capabilities. Network scale stops being a moat.'
        },
        shiftingFallback: {
          A: 'Route optimization, freight matching, fleet scheduling, and compliance documentation are being automated at a pace that will reshape logistics operations within two years. The coordination roles that kept freight moving are being absorbed into AI platforms.',
          C: 'AI is compressing the intermediary layers in logistics — dispatchers, freight brokers, customs agents, and route planners are being consolidated into AI-managed workflows that one logistics manager can oversee.',
          P: 'Fleet managers and logistics coordinators with AI tools are managing more vehicles, moving more freight, and resolving more exceptions with dramatically less overhead. The productivity gap between AI-equipped and traditional operations widens every quarter.',
          T: 'The routing, dispatching, and supply chain optimization expertise that took logistics veterans decades to develop is being embedded in AI systems that any carrier can deploy. Your operational knowledge advantage is dissolving.',
          D: 'AI-native logistics platforms are offering freight matching, route optimization, and end-to-end supply chain visibility that challenges traditional 3PLs, freight brokers, and carrier networks from every angle.'
        },
        recommendations: {
          A: 'Deploy AI-powered route optimization and freight matching across your fleet within 90 days. Retrain dispatchers as AI logistics managers who handle exceptions and strategic decisions while the algorithm handles routine routing. The fuel savings and load utilization improvements will be measurable within the first quarter.',
          C: 'Consolidate your dispatch, routing, compliance, and customer service functions into an AI-integrated logistics command center. One operator managing AI dashboards replaces the separate teams that coordinated freight movement. Your overhead structure is your biggest vulnerability — compress it.',
          P: 'Equip every fleet manager, warehouse supervisor, and logistics coordinator with AI-powered optimization tools. Mandate adoption for all routing and scheduling decisions within 60 days. Track loads per driver, warehouse throughput, and on-time delivery rates before and after. The numbers will make the case.',
          T: 'Capture your veteran dispatchers\' and port operators\' operational knowledge in AI training programs now. Their intuition about weather routing, port congestion, and carrier reliability is perishable expertise — digitize it before the next wave of retirements eliminates it permanently.',
          D: 'Build an AI-native digital logistics platform that competes with the freight-tech startups entering your market. If a two-person digital brokerage with AI can match your freight volume, you need to be running that platform at 100x their scale. Your network is the asset — AI is how you weaponize it.',
          scarce_knowledge: 'Your senior dispatchers and logistics planners hold routing and operational knowledge that no training manual captures. Build structured AI knowledge-transfer programs that encode their expertise into your optimization algorithms. Every retirement without knowledge capture is a permanent loss of competitive intelligence.',
          coordination_zero: 'Redesign your logistics workflows around AI orchestration: automated load matching, AI-routed dispatching, real-time customs processing, and predictive exception handling in one integrated system. Retrain your coordinators as AI workflow managers. The multi-handoff model is already obsolete.',
          unbundling: 'Develop modular AI-powered logistics services — route optimization as a service, freight matching APIs, compliance automation — that you sell to smaller carriers while using internally. If your logistics capabilities are being unbundled by tech platforms, be the platform.',
          verification: 'Deploy AI-powered continuous compliance monitoring for DOT hours-of-service, vehicle inspection, customs documentation, and safety standards. Move from periodic audits to real-time assurance. Regulators are increasing automated monitoring — be ahead of it, not scrambling to catch up.',
          physical: 'Build a phased autonomous vehicle roadmap starting with the lowest-risk, highest-ROI applications: autonomous yard trucks at distribution centers, platooning on fixed highway corridors, and automated guided vehicles in warehouses. Pair AI route optimization with physical automation — the software decides the route, the hardware drives it. The driver shortage is structural and worsening; autonomy is the only way to scale capacity.',
          adoption_high: 'AI-powered logistics optimization is becoming table stakes. Carriers and 3PLs that aren\'t using AI for routing, matching, and scheduling are competing with one hand tied behind their back. If your cost-per-mile isn\'t improving from AI, your competitors\' is.',
          adoption_medium: 'The logistics companies adopting AI now are building data and efficiency advantages that compound with every load. Second movers will face a market where AI-optimized competitors have locked in the best carrier relationships and customer contracts.',
          adoption_low: 'Transportation and logistics has been adopting AI unevenly — warehouse automation ahead of fleet optimization, large carriers ahead of small. The first full-stack AI logistics operation in your segment will set cost and speed benchmarks that force everyone to follow or lose contracts.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'Your customer service reps, cashiers, and category buyers are being replaced by chatbots that resolve complaints, self-checkout kiosks that never call in sick, and demand-forecasting engines that auto-replenish shelves. The store manager becomes an exception handler for systems that already made the decision.',
          C: 'AI collapses what used to take a merchandising team, a scheduling coordinator, and three floor supervisors into a single automated loop \u2014 from POS data to planogram to labor allocation. Your district office is about to lose half its desks.',
          P: 'Every e-commerce manager, visual merchandiser, and supply chain planner now has AI generating demand forecasts, A/B testing product pages, and optimizing last-mile fulfillment routes before the morning huddle. The ones who lean in double their sell-through. The ones who don\'t become expensive inventory mistakes.',
          T: 'Your loyalty program analytics, seasonal planning models, and shrinkage detection systems are being rebuilt by AI that spots basket patterns, predicts churn, and flags loss prevention events no human merchandiser ever could. The old playbook isn\'t just stale \u2014 it\'s costing you margin.',
          D: 'AI-native DTC brands are offering personalized shopping experiences, real-time pricing, and same-day fulfillment that make your omnichannel strategy look like a slideshow. Your moat was physical footprint. AI just made it a liability.'
        },
        shifts: {
          scarce_knowledge: 'Category management expertise, seasonal buying instincts, and store-level merchandising judgment \u2014 the knowledge that took a buyer twenty years to develop and commanded premium comp \u2014 is being encoded into demand-forecasting models that any competitor can license. Your senior merchants\' gut feel is no longer a competitive advantage; it\'s a feature in someone else\'s SaaS.',
          coordination_zero: 'A promotional campaign that required a buyer, a merchandiser, a marketing coordinator, a supply chain planner, and a store ops manager in a conference room can now be orchestrated by one category lead with AI tools. The coordination cost that justified your corporate headcount just evaporated.',
          unbundling: 'AI lets a Shopify store with two employees offer personalized recommendations, dynamic pricing, and predictive inventory management that rivals your 200-store chain. The bundled retail model \u2014 where customers paid for your infrastructure through markup \u2014 collapses when a micro-brand matches your experience at half the price.'
        },
        exposure: {
          24: 'Customer service inquiries \u2014 returns, order tracking, product questions, complaint resolution \u2014 get handled by AI that reads purchase history, checks inventory, and resolves issues before a human agent even clocks in. Your call center becomes a skeleton crew managing escalations.',  // Customer service & support
          21: 'AI pre-qualifies leads, personalizes outreach, drafts follow-up sequences, and scores every prospect in your CRM before your sales team finishes their coffee. The rep who works without AI is pitching blind while competitors are pitching with a dossier.',  // Sales & client relationship mgmt
          9: 'Warehouse picking, stock replenishment, and back-room inventory management are increasingly directed by AI that optimizes placement, predicts demand spikes, and routes fulfillment orders in real time. Your material handlers follow the algorithm or fall behind.',  // Material handling & warehousing
          20: 'Supply chain optimization \u2014 demand forecasting, vendor negotiations, reorder timing, and last-mile routing \u2014 runs on AI models that see patterns across millions of transactions. Your supply chain planner reviews exceptions; the machine runs the chain.',  // Supply chain optimization
          19: 'Market research, competitive pricing analysis, and consumer sentiment tracking happen in real time via AI scraping, NLP, and trend modeling. The insights your research team delivered quarterly now refresh hourly.'  // Market research & competitive analysis
        },
        shifting: {
          scarce_knowledge: 'Category buyers\' twenty-year instincts \u2014 your merchandising edge \u2014 become an AI model anyone can deploy.',
          coordination_zero: 'Promo campaigns that took five departments and a conference room collapse into one person with AI.',
          unbundling: 'Two-person Shopify stores match your 200-store experience. Your overhead is showing.'
        },
        shiftingFallback: {
          A: 'Customer service, transaction processing, inventory management, and demand forecasting \u2014 the work that kept your stores staffed and your supply chain moving \u2014 are being automated at a pace that will reshape your labor model within two years.',
          C: 'AI is compressing the layers between the shelf and the C-suite. Middle-management roles that existed to aggregate store data, coordinate merchandising, and route operational decisions are being eliminated by systems that do it faster.',
          P: 'AI tools are making every e-commerce manager, buyer, and supply chain planner 3-5x more productive. That math means fewer people per store, fewer people per region, and a fundamentally different org chart.',
          T: 'The merchandising frameworks, seasonal playbooks, and pricing strategies your company was built on are being rebuilt by AI that learns from every transaction in real time. The old models aren\'t tradition \u2014 they\'re drift.',
          D: 'AI-native retailers and DTC brands are offering personalized, dynamic shopping experiences at a fraction of your cost structure. Your stores\' square footage isn\'t heritage \u2014 it\'s overhead unless you make it earn its keep.'
        },
        recommendations: {
          A: 'Deploy AI-powered customer service, self-checkout, and inventory management across all locations within 12 months. Retrain your best service reps as customer experience specialists who handle high-value interactions AI can\'t. The rest of the service floor becomes a monitoring role.',
          C: 'Redesign your store and district operations around AI-augmented pods: one store manager + AI tools replacing a team of supervisors, schedulers, and coordinators. Start with scheduling and inventory replenishment, where the ROI is immediate. Your regional management layer needs reinvention or removal.',
          P: 'Mandate AI tool adoption across merchandising, e-commerce, and supply chain teams within 90 days. Measure sell-through, shrinkage, and fulfillment speed before and after. The performance gap will be so obvious it eliminates the debate.',
          T: 'Commission an AI rebuild of your demand forecasting, planogram optimization, and loyalty analytics systems. Run them alongside legacy systems for one season, then cut over. Every quarter you wait, your competitors\' models get smarter while yours stay static.',
          D: 'Launch an AI-native DTC channel that operates with zero legacy retail constraints \u2014 dynamic pricing, personalized experiences, predictive fulfillment. Let it compete with your own stores. Better you cannibalize yourself than watch a startup do it.',
          scarce_knowledge: 'Your senior category buyers and merchandising leads need to become AI model trainers and exception handlers, not manual spreadsheet jockeys. Encode their expertise now, while they\'re still on payroll. Retirement takes the knowledge; AI keeps it.',
          coordination_zero: 'Restructure promotional and seasonal planning workflows around AI orchestration where one category lead manages what five departments used to coordinate. Retrain coordinators as AI workflow managers. The alternative is five salaries for one outcome.',
          unbundling: 'Build modular retail experiences \u2014 AI-powered personal shopping, automated basics fulfillment, and premium in-store consultation \u2014 that compete at every price point. If you only sell the full-service bundle, DTC brands will cherry-pick your best margins.',
          verification: 'Deploy AI-powered shrinkage detection, inventory accuracy monitoring, and pricing compliance checks as continuous automated processes. Quarterly audits are a relic when AI watches every transaction in real time.',
          physical: null,
          adoption_high: 'Your competitors are already deploying AI across e-commerce, supply chain, and customer service. You\'re not early \u2014 you\'re on the clock. Accelerate or watch basket size and loyalty erode quarter over quarter.',
          adoption_medium: 'AI adoption in retail is accelerating through competitive pressure. The chains moving now lock in vendor partnerships, customer data advantages, and operational efficiency that second movers can\'t replicate \u2014 they can only imitate at higher cost.',
          adoption_low: 'Your sector hasn\'t fully committed yet, which means first-mover advantage is massive. The retailer that deploys AI-native operations first sets the customer expectation everyone else has to match or explain away.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'Your harvest crews, food safety inspectors, and grain elevator operators are being augmented by AI that optimizes combine routes via GPS-guided equipment, predicts crop yields from satellite imagery, and auto-generates FSMA compliance documentation. The agronomist who used to walk fields with a clipboard now reviews AI-generated soil analysis dashboards.',
          C: 'AI collapses what used to take a farm manager, an agronomist, a logistics coordinator, and a compliance officer into integrated precision agriculture platforms that one operator can run. Your per-acre overhead is about to crater.',
          P: 'Every farmer, rancher, and food production manager now has AI analyzing soil moisture, predicting pest outbreaks, optimizing irrigation schedules, and routing cold chain logistics before dawn. The operations that adopt produce 30% more per acre. The ones that don\'t are farming against algorithms.',
          T: 'Your crop rotation models, commodity pricing strategies, and pest management protocols are being rebuilt by AI that processes weather data, soil chemistry, satellite imagery, and market feeds simultaneously. The old extension service playbook isn\'t just outdated \u2014 it\'s leaving yield on the table.',
          D: 'AI-enabled agtech startups are offering precision agriculture services \u2014 variable-rate seeding, drone-based scouting, predictive harvest timing \u2014 that make your traditional farming operation look like it\'s working from a 1990s almanac. Your moat was land and experience. AI just made experience downloadable.'
        },
        shifts: {
          scarce_knowledge: 'Agronomic expertise, livestock management instincts, and decades of field experience \u2014 the knowledge that made the difference between a profitable harvest and a loss \u2014 is being encoded into precision agriculture platforms that any first-generation farmer can access. Your veteran farmers\' intuition is no longer a competitive advantage; it\'s a feature in a SaaS subscription.',
          coordination_zero: 'A planting-to-harvest operation that required a farm manager, an agronomist, equipment operators, a logistics coordinator, and a commodity broker working in sequence can now be orchestrated by one operator with AI managing the workflow from soil prep to sale. The coordination overhead that justified your management layer just evaporated.',
          unbundling: 'AI lets a 500-acre operation access the same precision agriculture, compliance automation, and market analytics that used to require a 50,000-acre corporate farm\'s infrastructure. The scale advantage that justified consolidation weakens when technology equalizes the information gap.'
        },
        exposure: {
          12: 'Harvesting operations get AI-optimized timing, routing, and equipment allocation that maximizes yield recovery and minimizes loss. Your harvest crews work with AI-generated field maps that tell them exactly where, when, and how aggressively to cut.',  // Harvesting & extraction
          32: 'Field work in unstructured environments \u2014 irrigation repair, fence line maintenance, livestock checks in rough terrain \u2014 gets AI-assisted planning with drone surveys, predictive equipment failure alerts, and optimized route scheduling. Your field hands spend less time searching and more time fixing.',  // Field work in unstructured environments
          10: 'GPS-guided tractors, autonomous combines, and AI-routed grain trucks are transforming equipment operation from a skilled labor bottleneck to a supervised automation workflow. Your best operators become fleet managers overseeing AI-driven machines.',  // Vehicle / equipment operation
          6: 'Food safety inspections, USDA compliance checks, and quality grading get AI-powered computer vision and sensor analysis that catches contamination, grades product, and documents compliance continuously \u2014 not just when the inspector shows up.',  // Quality control / inspection
          20: 'Supply chain optimization \u2014 cold chain routing, commodity timing, storage allocation, and distribution planning \u2014 runs on AI that tracks spoilage risk, market prices, and logistics capacity in real time. Your supply chain planner reviews exceptions; the algorithm runs the chain.'  // Supply chain optimization
        },
        shifting: {
          scarce_knowledge: 'Veteran farmers\' decades of field intuition \u2014 your agronomic edge \u2014 become a precision agriculture subscription.',
          coordination_zero: 'Planting-to-harvest coordination that took five people and a whiteboard collapses into one operator with AI.',
          unbundling: '500-acre farms access corporate-grade precision agriculture. Scale advantages erode when information equalizes.'
        },
        shiftingFallback: {
          A: 'Harvesting optimization, equipment routing, food safety inspection, and supply chain logistics \u2014 the operational backbone of agriculture \u2014 are being automated at a pace that will reshape labor requirements within three years.',
          C: 'AI is compressing the layers between the field and the market. Management roles that existed to coordinate planting schedules, equipment allocation, compliance documentation, and commodity sales are being absorbed into platforms that handle all of it.',
          P: 'AI tools are making every farmer, agronomist, and food production manager 2-4x more productive per acre. That math means fewer people per operation or dramatically higher yields with the same crew. Either way, the economics change.',
          T: 'The agronomic models, pest management protocols, and commodity timing strategies your operation was built on are being rebuilt by AI that learns from every sensor reading, satellite pass, and market tick in real time.',
          D: 'AI-enabled agtech competitors are offering precision services that let smaller operations match your per-acre efficiency. Your scale advantage holds only if you adopt the same technology faster and better.'
        },
        recommendations: {
          A: 'Deploy precision agriculture AI across your operations within 12 months: GPS-guided equipment optimization, AI-powered crop scouting, and automated FSMA compliance documentation. Retrain your best field managers as precision agriculture supervisors who manage AI-driven workflows instead of manual operations.',
          C: 'Redesign your farm management structure around AI-augmented operations: one manager with AI tools replacing the agronomist-coordinator-compliance triangle. Start with planting optimization and compliance documentation, where the ROI is immediate and measurable.',
          P: 'Mandate AI tool adoption across agronomy, equipment operation, and supply chain management within one growing season. Measure yield per acre, input costs, and compliance time before and after. The productivity gains will be visible in the first harvest.',
          T: 'Commission an AI rebuild of your crop planning, pest management, and commodity timing systems. Run them alongside traditional methods for one season, then transition. Every season you wait, competitors using precision agriculture pull further ahead on yield and cost.',
          D: 'Launch an AI-native precision agriculture services division that offers your technology stack to smaller regional operations. If agtech startups are democratizing your capabilities anyway, be the platform they buy from instead of the incumbent they disrupt.',
          scarce_knowledge: 'Your veteran farmers and agronomists need to become AI model trainers, encoding their decades of field knowledge into precision agriculture systems before they retire. Every experienced operator who leaves without transferring knowledge to AI is institutional memory lost forever.',
          coordination_zero: 'Restructure planting-to-harvest workflows around AI orchestration where one farm manager oversees what multiple coordinators used to handle. Retrain coordinators as AI workflow operators. The alternative is paying for coordination layers your competitors eliminated.',
          unbundling: 'Build modular precision agriculture services \u2014 AI-powered crop planning, automated compliance, predictive maintenance \u2014 that you can use internally and sell to smaller operations. If your scale advantage is eroding, monetize the technology that replaces it.',
          verification: 'Deploy AI-powered continuous food safety monitoring, USDA compliance tracking, and quality assurance as automated sensor-driven processes. FSMA compliance becomes a real-time dashboard, not a quarterly scramble.',
          physical: 'Develop a phased automation roadmap for physical agricultural tasks: start with GPS-guided equipment and drone-based scouting, then expand to autonomous harvesting and robotic sorting. The agricultural labor shortage is structural and worsening \u2014 automation isn\'t optional, it\'s the only path to maintaining production levels as the workforce ages out.',
          adoption_high: 'Precision agriculture adoption is accelerating fast among large operations. If your competitors are already using AI-optimized planting, scouting, and harvesting, you\'re not early \u2014 you\'re behind. Every season without AI is a season of lost yield optimization.',
          adoption_medium: 'AI adoption in agriculture is moving from early adopter to mainstream among commercial operations. Farms that deploy precision agriculture now build data advantages from every growing season that late adopters can\'t replicate.',
          adoption_low: 'Agriculture has been slower to adopt AI than other sectors, which means first-mover advantage in your region is significant. The operation that deploys precision agriculture first sets the yield and efficiency benchmarks that neighbors will be forced to match or sell.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'Your geologists, drilling engineers, and mine planners are being augmented by AI that models ore bodies from drill core data, optimizes blast patterns for maximum recovery, and generates mine plans that human engineers take weeks to produce. The blasting specialist who relied on experience and rules of thumb watches AI design a fragmentation pattern that improves recovery by 15%.',
          C: 'AI collapses what used to take a geology team, a mine planning department, a safety compliance office, and an environmental monitoring group into integrated digital mine platforms that a fraction of the workforce can operate. Your cost per ton is about to drop \u2014 or your competitor\'s will.',
          P: 'Every geologist, heavy equipment operator, and safety officer now has AI analyzing geological surveys, optimizing haul truck routes, and predicting equipment failures before they strand a $5M truck in the pit. The operations that adopt move more material with fewer people. The ones that don\'t are mining at yesterday\'s cost structure.',
          T: 'Your resource estimation models, blast pattern designs, and tailings management systems are being rebuilt by AI that processes geological, environmental, and operational data simultaneously. The old mine planning methods aren\'t just conservative \u2014 they\'re leaving recoverable reserves in the ground.',
          D: 'AI-native mining tech companies are offering exploration analysis, mine optimization, and environmental compliance services that make your in-house capabilities look like they\'re running on spreadsheets. Your moat was geological IP and operational experience. AI just made both transferable.'
        },
        shifts: {
          scarce_knowledge: 'Geological interpretation expertise, blast engineering knowledge, and decades of operational judgment \u2014 the knowledge that took a mining engineer a career to develop \u2014 is being encoded into AI systems that compress years of learning into months. Your senior geologists\' ability to read a drill core and estimate reserves is no longer a scarce skill; it\'s an AI feature.',
          coordination_zero: 'A mine expansion project that required geologists, drilling engineers, environmental consultants, safety officers, and regulatory specialists to coordinate across months can now be orchestrated by a lean team with AI managing the planning, compliance, and optimization workflow. The coordination overhead that justified your technical services headcount just became a cost disadvantage.',
          unbundling: 'AI lets a junior mining company with a small technical team access resource estimation, mine planning, and environmental impact assessment capabilities that previously required a major miner\'s in-house engineering department. The technical barriers to entry that protected your position are dissolving.'
        },
        exposure: {
          12: 'Extraction operations get AI-optimized drill-and-blast patterns, real-time ore grade tracking, and automated processing adjustments that maximize recovery rates. Your extraction engineers review AI recommendations instead of designing every pattern from scratch.',  // Harvesting & extraction
          32: 'Field work in remote, unstructured mine environments \u2014 geological mapping, environmental sampling, infrastructure inspection \u2014 gets AI-assisted drone surveys, sensor networks, and predictive modeling that reduces the human hours spent in hazardous conditions.',  // Field work in unstructured environments
          10: 'Haul truck routing, drill rig positioning, and heavy equipment scheduling run on AI that optimizes for fuel consumption, road conditions, and pit geometry in real time. Your equipment operators follow AI-generated routes that save hours per shift.',  // Vehicle / equipment operation
          18: 'Equipment diagnostics \u2014 predicting hydraulic failures, tracking engine wear, identifying structural fatigue \u2014 run on AI sensor analysis that catches failures weeks before they happen. Your maintenance team shifts from reactive repairs to planned interventions.',  // Diagnostics & troubleshooting
          17: 'Mine design, ventilation modeling, and pit optimization run on AI that explores thousands of design alternatives your engineering team couldn\'t evaluate manually. A mine plan that took three months to develop gets generated in days with better NPV outcomes.'  // Engineering design & simulation
        },
        shifting: {
          scarce_knowledge: 'Senior geologists\' ore body intuition \u2014 your geological IP advantage \u2014 becomes an AI model any explorer can license.',
          coordination_zero: 'Mine expansion teams of 15 specialists collapse to lean crews with AI managing the technical workflow.',
          unbundling: 'Junior miners access major-grade resource estimation and mine planning. Your technical barriers dissolve.'
        },
        shiftingFallback: {
          A: 'Extraction optimization, equipment routing, geological analysis, and environmental compliance \u2014 the technical core of mining operations \u2014 are being automated at a pace that will reshape how mines are staffed and operated within three years.',
          C: 'AI is compressing the layers between the ore body and the balance sheet. Technical roles that existed to interpret data, plan operations, and coordinate logistics are being absorbed into platforms that do all three.',
          P: 'AI tools are making every geologist, mining engineer, and equipment operator 2-4x more productive. That math means fewer technical staff per ton of production \u2014 or dramatically better resource recovery with the same team.',
          T: 'The geological models, mine planning methods, and extraction techniques your operation was built on are being rebuilt by AI that learns from every drill hole, every blast, and every ton of material moved.',
          D: 'AI-native mining tech competitors are offering technical services that let smaller operators match your engineering capabilities. Your scale advantage holds only if you adopt faster and integrate deeper.'
        },
        recommendations: {
          A: 'Deploy AI-powered mine planning, extraction optimization, and predictive maintenance across your operations within 18 months. Retrain your best mining engineers as AI-human teaming leads who validate AI-generated plans and manage exception workflows. The transition window is one mine plan cycle \u2014 miss it and your cost per ton becomes uncompetitive.',
          C: 'Redesign your technical services around AI-augmented teams: smaller geology and engineering pods with AI handling resource modeling, blast design, and compliance documentation. Start with mine planning and equipment maintenance, where the cost reduction is immediate. Your technical overhead needs to reflect AI productivity.',
          P: 'Mandate AI tool adoption across geology, mine engineering, and equipment operations within 12 months. Measure resource recovery, equipment utilization, and planning cycle time before and after. The productivity gains will reshape your operating model and your competitive position.',
          T: 'Commission an AI rebuild of your resource estimation, mine planning, and environmental monitoring systems. Run AI alongside legacy methods for one planning cycle, then transition. Every cycle you wait, your resource models and mine plans fall further behind what AI-optimized competitors are achieving.',
          D: 'Launch an AI-native exploration and technical services division that offers your analytical capabilities to junior miners and exploration companies. If mining tech startups are democratizing your engineering expertise, be the platform they buy from.',
          scarce_knowledge: 'Your senior geologists and mining engineers need to become AI model trainers, encoding their geological interpretation skills and operational judgment into AI systems before they retire. The mining workforce is aging fast \u2014 every experienced engineer who leaves without transferring knowledge to AI is an irreversible loss of institutional capability.',
          coordination_zero: 'Restructure mine development and expansion workflows around AI orchestration where lean teams manage what large technical departments used to coordinate. Retrain your technical coordinators as AI workflow managers.',
          unbundling: 'Build modular AI-powered mining services \u2014 resource estimation, blast optimization, environmental compliance \u2014 that you use internally and license externally. If your technical barriers are eroding, monetize the AI that replaces them.',
          verification: 'Deploy AI-powered continuous environmental monitoring, MSHA compliance tracking, and tailings management as automated sensor-driven processes. Compliance becomes a real-time dashboard, not a quarterly audit scramble.',
          physical: 'Develop a phased automation roadmap for physical mining tasks: start with autonomous haul trucks and AI-guided drilling, then expand to remote-operated equipment in hazardous zones. The safety and productivity case for mine automation is already proven \u2014 every year of delay is measurable in incident rates and cost per ton.',
          adoption_high: 'The major miners are already deploying autonomous haul trucks, AI-optimized blast patterns, and predictive maintenance. If you\'re not there yet, your cost per ton is already uncompetitive against operations that are. Move now.',
          adoption_medium: 'AI adoption in mining is accelerating through cost pressure and the workforce shortage. Operations that deploy AI-optimized mine planning and autonomous equipment now build operational data advantages that late movers can\'t replicate.',
          adoption_low: 'Mining has been cautious about AI adoption, but the economics are forcing the issue. The operation that demonstrates AI-native mining first in your commodity sets the cost benchmark everyone else has to match or exit.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'Your NOC technicians, customer service reps, and field dispatch coordinators are being replaced by AI that detects network outages before customers notice, resolves tier-1 tickets through conversational AI, and auto-dispatches tower crews based on real-time fault correlation. The human in the loop becomes the exception, not the rule.',
          C: 'AI collapses what used to take a NOC team, a field dispatch office, a customer care center, and an RF planning group into an integrated operations platform that a skeleton crew can supervise. Your headcount per subscriber ratio is about to halve.',
          P: 'Every network engineer, cybersecurity analyst, and sales engineer now has AI correlating alarms across the RAN, modeling 5G coverage gaps, and pre-building proposals with SLA-specific pricing before the customer meeting starts. The ones who adopt close deals in days. The ones who don\'t lose to carriers whose AI already solved the prospect\'s problem.',
          T: 'Your spectrum management models, network planning algorithms, and churn prediction systems are being rebuilt by AI that optimizes across millions of variables \u2014 cell density, traffic patterns, interference, customer behavior \u2014 in ways your best RF engineers never could. The old planning tools aren\'t just slow; they\'re leaving capacity on the table.',
          D: 'AI-native MVNOs and fixed-wireless competitors are offering enterprise connectivity with AI-driven provisioning, predictive SLA management, and zero-touch operations at a fraction of your cost. Your moat was infrastructure. AI just made the infrastructure commoditized.'
        },
        shifts: {
          scarce_knowledge: 'RF engineering expertise, network architecture knowledge, and spectrum optimization skills \u2014 the knowledge that took a decade of field experience to develop and commanded premium salaries \u2014 is being encoded into AI planning tools that any competitor can deploy. Your senior network engineers\' tribal knowledge is no longer a competitive advantage; it\'s a training dataset for the vendor\'s next product release.',
          coordination_zero: 'A network upgrade that required an RF engineer, a construction manager, a regulatory coordinator, a NOC planner, and a field crew dispatcher in a war room can now be orchestrated by one project lead with AI tools managing the workflow. The coordination overhead that justified your operations headcount just evaporated.',
          unbundling: 'AI lets a regional ISP with 10 employees offer enterprise-grade network monitoring, predictive maintenance, and customer experience management that rivals your national operation. The bundled telecom model \u2014 where enterprise customers paid for your infrastructure through long-term contracts \u2014 fractures when lean competitors match your service quality at half the price.'
        },
        exposure: {
          24: 'Customer service \u2014 billing inquiries, outage reports, service changes, technical troubleshooting \u2014 gets handled by AI that reads account history, checks real-time network status, and resolves issues before the customer finishes describing the problem. Your call centers become escalation-only operations.',  // Customer service & support
          18: 'Network diagnostics and fault isolation that used to require a senior NOC engineer correlating alarms across multiple systems now runs on AI that pinpoints root cause in seconds, auto-generates trouble tickets, and recommends fixes before the on-call engineer picks up the phone.',  // Diagnostics & troubleshooting
          35: 'AI-powered cybersecurity monitors your network perimeter, detects anomalous traffic patterns, and neutralizes threats in real time. Your security analysts shift from hunting threats to validating AI decisions \u2014 and the AI never misses a 3 AM intrusion attempt.',  // Cybersecurity & threat monitoring
          14: 'Software development for OSS/BSS systems, provisioning platforms, and network automation gets AI-assisted coding that compresses development cycles from quarters to weeks. Your dev team ships features at the pace your network evolution demands instead of three releases behind.',  // Software development & engineering
          11: 'Cell tower maintenance scheduling, facility operations, and infrastructure upkeep get AI-optimized routing and predictive maintenance that fixes equipment before it fails. Your field ops budget shifts from reactive truck rolls to planned interventions.'  // Cleaning, maintenance & facility ops
        },
        shifting: {
          scarce_knowledge: 'RF engineering and network architecture expertise \u2014 your decade-to-build workforce advantage \u2014 becomes an AI module anyone can license.',
          coordination_zero: 'Network upgrade war rooms of 8 collapse to one project lead with AI managing the workflow.',
          unbundling: 'Regional ISPs with 10 people match your enterprise service quality. Your national scale is overhead unless it\'s earning its keep.'
        },
        shiftingFallback: {
          A: 'Customer service, network diagnostics, cybersecurity monitoring, and field dispatch \u2014 the operational backbone of your network \u2014 are being automated at a pace that will reshape your staffing model within two years.',
          C: 'AI is compressing the layers between the network and the customer. Operations roles that existed to monitor, triage, coordinate, and communicate are being absorbed into platforms that handle all four simultaneously.',
          P: 'AI tools are making every network engineer, security analyst, and sales engineer 3-5x more productive. The math means fewer people per million subscribers \u2014 or dramatically better service with the same headcount. Either way, the org changes.',
          T: 'The network planning models, spectrum optimization techniques, and customer experience frameworks your company was built on are being superseded by AI that learns from every packet, every alarm, and every customer interaction in real time.',
          D: 'AI-native competitors are offering connectivity and managed services at a fraction of your cost with comparable reliability. The market is learning it doesn\'t need a legacy carrier for every use case.'
        },
        recommendations: {
          A: 'Deploy AI-powered NOC automation, customer service resolution, and field dispatch optimization across your operations within 12 months. Retrain your best NOC engineers as AI operations supervisors who manage exception handling and model tuning. The transition window is two years \u2014 after that, your cost-per-subscriber makes you uncompetitive.',
          C: 'Redesign your operations around AI-augmented pods: one senior network engineer + AI tools replacing the NOC team, dispatch office, and tier-1 support center. Start with alarm correlation and customer service, where the cost reduction is immediate. Your operations management layer needs to shrink or reinvent itself.',
          P: 'Mandate AI tool adoption across network engineering, cybersecurity, and sales engineering within 90 days. Measure mean time to resolution, threat detection speed, and proposal turnaround before and after. The productivity gains will be so clear they rewrite your operating model.',
          T: 'Commission an AI rebuild of your network planning, spectrum optimization, and churn prediction systems. Run AI models alongside legacy tools for one quarter, then cut over. Every quarter you wait, your network planning falls further behind the AI-optimized competitors.',
          D: 'Launch an AI-native managed services offering that competes with your own enterprise products at a lower price point. Let it cannibalize your legacy contracts before an MVNO or cloud provider does it for you.',
          scarce_knowledge: 'Your senior RF engineers and network architects need to become AI model trainers and validators, not manual planners. Capture their expertise in AI systems now, while they\'re still on payroll. When they retire, that spectrum optimization knowledge either lives in your AI or it lives nowhere.',
          coordination_zero: 'Restructure network upgrade and deployment workflows around AI orchestration where one project lead manages what five coordinators used to handle. Retrain coordinators as AI workflow managers. The alternative is paying for coordination overhead your competitors eliminated.',
          unbundling: 'Build modular service offerings \u2014 AI-managed connectivity, automated security monitoring, self-service provisioning \u2014 that compete at every price point. If you only sell the full-service enterprise bundle, lean competitors will cherry-pick your most profitable segments.',
          verification: 'Deploy AI-powered SLA compliance monitoring, network audit, and FCC regulatory compliance as continuous automated processes. Quarterly compliance reviews are a relic when AI monitors every metric in real time.',
          physical: null,
          adoption_high: 'Your competitors are already deploying AI across network operations, customer service, and cybersecurity. You\'re not early \u2014 you\'re behind schedule. Accelerate or watch churn rates climb as competitors offer better service at lower cost.',
          adoption_medium: 'AI adoption in telecom is accelerating through competitive pressure and margin compression. The carriers moving now lock in operational efficiencies and customer experience advantages that second movers can\'t replicate quickly enough to matter.',
          adoption_low: 'Your sector hasn\'t fully committed to AI-native operations yet, which means first-mover advantage is significant. The carrier that deploys AI across its operations stack first sets the cost and service benchmarks everyone else has to match.'
        }
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
      },
      narratives: {
        dominant: {
          A: 'Your weapons systems engineers, intelligence analysts, and logistics officers are watching AI design flight control systems, correlate threat intelligence feeds, and optimize supply chains for readiness levels that human planners never achieved. The defense contractor who still staffs programs the old way is bidding against firms whose AI already passed the CDR.',
          C: 'AI is collapsing what used to require a systems engineering team, a test squadron, a cybersecurity division, and a program management office into integrated digital threads that a fraction of the headcount can operate. Your program overhead rates are about to become uncompetitive.',
          P: 'Every aerospace engineer, program manager, and cybersecurity operator now has AI running simulations, drafting ITAR-compliant documentation, and scanning classified networks for anomalies before the morning brief. The teams that adopt ship hardware on schedule. The teams that don\'t blow past Milestone C by years.',
          T: 'Your threat assessment models, mission planning algorithms, and satellite communications architectures are being rebuilt by AI that processes intelligence, models adversary behavior, and optimizes kill chains faster than any operations center. The old doctrine isn\'t just outdated — it\'s a vulnerability.',
          D: 'AI-enabled adversaries and AI-native defense startups are rewriting the competitive landscape. Your CMMC-certified, ITAR-compliant, 18-month procurement cycle looks like a handicap when a startup delivers an AI-powered ISR capability in six months for a tenth of the cost.'
        },
        shifts: {
          scarce_knowledge: 'Weapons systems expertise, flight test engineering knowledge, and classified threat analysis — the institutional knowledge that took decades to develop and required security clearances to access — is being encoded into AI systems that compress years of domain learning into weeks. Your greybeard engineers\' retirement isn\'t just a talent risk; it\'s a race to capture their knowledge in AI before it walks out the gate.',
          coordination_zero: 'A program that required systems engineers, test pilots, cybersecurity teams, logistics planners, and a PMO to coordinate across three time zones can now be orchestrated by a lean team with AI managing the digital thread. The coordination overhead that justified your program office headcount just became your competitor\'s margin advantage.',
          unbundling: 'AI lets a 50-person defense tech startup deliver mission-ready capabilities that previously required a prime contractor with 5,000 engineers. The bundled defense services model — where the government paid for your infrastructure through cost-plus contracts — fractures when agile competitors deliver faster at firm-fixed-price.'
        },
        exposure: {
          17: 'AI runs CFD simulations, structural analyses, and systems integration checks that used to occupy your engineering team for months. An aerospace engineer who spent six weeks on a design trade study watches AI explore the entire parameter space overnight.',  // Engineering design & simulation
          32: 'Field operations, base maintenance, and forward-deployed logistics in unstructured environments get AI-assisted planning, route optimization, and threat detection. Your field teams operate with decision support that headquarters couldn\'t provide fast enough before.',  // Field work in unstructured environments
          35: 'AI-powered cyber defense scans classified and unclassified networks continuously, detects advanced persistent threats, and patches vulnerabilities before your SOC analysts finish triaging yesterday\'s alerts. Adversary dwell time drops from months to minutes.',  // Cybersecurity & threat monitoring
          31: 'Emergency response and crisis operations — from missile defense to disaster relief logistics — get AI that models scenarios, pre-positions assets, and coordinates multi-domain responses faster than any command center watch floor. Reaction time becomes a software problem.',  // Emergency response & crisis operations
          14: 'Mission-critical software development — avionics, weapons systems, C4ISR platforms — gets AI-assisted coding, testing, and verification that compresses development timelines and catches defects that manual code reviews miss. Your DO-178C compliance process gets faster, not looser.'  // Software development & engineering
        },
        shifting: {
          scarce_knowledge: 'Weapons systems and flight test expertise — your cleared workforce advantage — becomes AI-capturable institutional memory.',
          coordination_zero: 'Program offices of 200 collapse to lean teams with AI managing the digital thread.',
          unbundling: 'Defense tech startups deliver mission-ready systems at firm-fixed-price. Your cost-plus model is the vulnerability.'
        },
        shiftingFallback: {
          A: 'Engineering design, threat analysis, cybersecurity monitoring, and logistics planning — the cognitive backbone of defense programs — are being automated at a pace that will reshape how programs are staffed and proposals are priced within three years.',
          C: 'AI is compressing the layers between operational requirements and delivered capability. Program management, systems engineering, and test organizations that existed to coordinate complexity are being streamlined by AI that manages the digital thread end-to-end.',
          P: 'AI tools are making every engineer, analyst, and operator 3-5x more productive, which means your next proposal either prices in that efficiency or loses to the competitor who does.',
          T: 'The engineering methods, threat models, and mission planning frameworks your organization was built on are being rebuilt by AI that learns from every simulation, every flight test, and every intelligence feed in real time. Legacy doctrine is technical debt.',
          D: 'AI-native defense companies are delivering capabilities faster and cheaper. Your competitive moat was cleared personnel, classified IP, and procurement relationships. AI is eroding all three simultaneously.'
        },
        recommendations: {
          A: 'Stand up an AI integration office that embeds AI tools into your engineering, cybersecurity, and logistics workflows within 12 months. Retrain your best systems engineers as AI-human teaming leads who validate AI-generated designs and analyses. The transition window aligns with your next major program bid — miss it and you\'re bidding with yesterday\'s cost structure.',
          C: 'Redesign your program execution model around AI-augmented teams: smaller engineering pods with AI handling simulation, documentation, and compliance checking. Start with proposal development and systems engineering, where the overhead reduction is immediate and quantifiable. Your indirect rates need to reflect AI productivity or your bids won\'t be competitive.',
          P: 'Mandate AI tool adoption across engineering, intelligence analysis, and cybersecurity teams within 180 days. Measure engineering output per labor hour before and after. The productivity gains will reshape your staffing models and make your next LPTA bid dramatically more competitive.',
          T: 'Commission an AI rebuild of your mission planning tools, threat assessment models, and systems engineering frameworks. Run them alongside legacy tools for one program phase, then transition. Every program phase you wait, your methods drift further from what the threat environment demands.',
          D: 'Launch an AI-native rapid prototyping division that operates outside your traditional program structure — small teams, commercial tools, sprint-based delivery. Let it compete for OTA and SBIR contracts that your main organization is too slow to pursue. Better you disrupt your own cost model than watch a defense tech startup do it.',
          scarce_knowledge: 'Your senior systems engineers and weapons specialists need to become AI knowledge engineers, encoding their decades of classified expertise into AI systems before they retire. This isn\'t a nice-to-have — it\'s a national security imperative. Every grey-haired engineer who retires without transferring knowledge to AI is an irreversible loss.',
          coordination_zero: 'Restructure program execution around AI-orchestrated digital threads where lean teams manage what large program offices used to coordinate. Retrain your program managers as AI workflow architects. The DoD is moving toward digital engineering mandates — be ahead of the requirement, not scrambling to comply.',
          unbundling: 'Build modular, AI-enabled capabilities that can be delivered independently or as integrated systems. If you only bid the monolithic program, agile competitors will win the pieces. Your platform advantage only holds if you can deliver at the speed and price point the new acquisition model demands.',
          verification: 'Deploy AI-powered verification and validation across your engineering lifecycle — from requirements traceability to test coverage to CMMC compliance monitoring. Continuous automated assurance beats quarterly program reviews and satisfies DCMA before they ask.',
          physical: null,
          adoption_high: 'The threat environment and acquisition reform are both pushing rapid AI adoption in defense. Your competitors and adversaries are moving now. Delay isn\'t caution — it\'s a readiness gap.',
          adoption_medium: 'AI adoption in defense is accelerating through DoD mandates and competitive pressure from non-traditional contractors. The primes that integrate AI into their engineering and operations processes now will win the next generation of programs. Second movers inherit the subcontractor role.',
          adoption_low: 'Defense AI adoption has been slower than commercial sectors, but the dam is breaking. The contractor that demonstrates AI-native program execution first will reshape how the DoD evaluates proposals. Set the standard before someone else does.'
        }
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
