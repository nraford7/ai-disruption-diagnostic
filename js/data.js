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
