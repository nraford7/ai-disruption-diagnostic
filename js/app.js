/**
 * AI Disruption Diagnostic — App Controller
 * Wires inputs, engine, charts, and DOM together.
 */
(function () {
  'use strict';

  var Data = window.DiagnosticData;
  var Engine = window.DiagnosticEngine;
  var Charts = window.DiagnosticCharts;

  // ─── State ──────────────────────────────────────────────────
  var state = {
    capability: null,
    horizon: null,
    adoption: null,
    sector: null,
    results: null
  };

  var radarChart = null;

  // ─── DOM Refs ───────────────────────────────────────────────
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return document.querySelectorAll(sel); };

  // ─── Init ───────────────────────────────────────────────────
  function init() {
    bindInputCards();
    bindCollapseToggles();
    bindChangeAssumptions();
  }

  // ─── Input Binding ──────────────────────────────────────────

  function bindInputCards() {
    // Capability
    $$('#capability-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.capability = card.dataset.capability;
        highlightCard('#capability-cards .input-card', card);
        unlockStep('step-horizon');
        scrollTo('#step-horizon');
      });
    });

    // Horizon
    $$('#horizon-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.horizon = card.dataset.horizon;
        highlightCard('#horizon-cards .input-card', card);
        unlockStep('step-adoption');
        scrollTo('#step-adoption');
      });
    });

    // Adoption
    $$('#adoption-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.adoption = card.dataset.adoption;
        highlightCard('#adoption-cards .input-card', card);
        unlockStep('step-sector');
        scrollTo('#step-sector');
      });
    });

    // Sector
    $$('#sector-cards .sector-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.sector = parseInt(card.dataset.sector, 10);
        highlightCard('#sector-cards .sector-card', card);
        runDiagnostic();
      });
    });
  }

  function highlightCard(allSelector, selectedEl) {
    $$(allSelector).forEach(function (c) { c.classList.remove('selected'); });
    selectedEl.classList.add('selected');
  }

  function unlockStep(stepId) {
    var step = $('#' + stepId);
    if (!step) return;
    if (step.classList.contains('step--locked')) {
      step.classList.remove('step--locked');
      step.classList.add('step--unlocking');
      setTimeout(function () { step.classList.remove('step--unlocking'); }, 600);
    }
  }

  function scrollTo(sel) {
    var el = $(sel);
    if (el) {
      setTimeout(function () {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }

  // ─── Narrative Resolution ───────────────────────────────────────

  function getNarrative(sectorId, category, key) {
    if (!sectorId) return null;
    var sector = Data.SECTORS.find(function (s) { return s.id === sectorId; });
    if (!sector || !sector.narratives) return null;
    var cat = sector.narratives[category];
    if (!cat) return null;
    var val = cat[key];
    return (val !== undefined && val !== null) ? val : null;
  }

  // ─── Collapse Toggles ──────────────────────────────────────

  function bindCollapseToggles() {
    $$('.collapse-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = btn.dataset.target;
        var content = $('#' + targetId);
        if (!content) return;
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        content.classList.toggle('collapse-content--open');
      });
    });
  }

  // ─── Change Assumptions ────────────────────────────────────

  function bindChangeAssumptions() {
    var btn = $('#btn-change-assumptions');
    if (btn) {
      btn.addEventListener('click', function () {
        $('#results-section').style.display = 'none';
        scrollTo('#input-section');
      });
    }
  }

  // ─── Run Diagnostic ────────────────────────────────────────

  function runDiagnostic() {
    if (!state.capability || !state.horizon || !state.adoption || !state.sector) return;

    var results = Engine.computeAll(state.sector, state.capability, state.horizon, state.adoption);
    state.results = results;

    renderResults(results);

    var resultsSection = $('#results-section');
    resultsSection.style.display = '';
    setTimeout(function () {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  // ─── Render Results ────────────────────────────────────────

  function renderResults(r) {
    renderGauge(r.score, r.zone);
    renderNarrative(r);
    renderSparkline(r.timeline, r.score);
    renderScenarioPills(r);
    renderRadar(r.dominantImpact.scores);
    renderStructuralShifts(r.higherOrderImpacts, r.sectorId);
    renderRiskBlocks(r);
    renderTaskTable(r.taskDetails, r.selectedTier);
  }

  // ─── Gauge (SVG animation) ─────────────────────────────────

  function renderGauge(score, zone) {
    var fill = $('#gauge-fill');
    var needle = $('#gauge-needle');
    var scoreEl = $('#gauge-score-value');
    var zoneEl = $('#gauge-zone-label');

    // Arc total length = pi * 80 (radius) = ~251.2
    var totalLen = 251.2;
    var targetOffset = totalLen * (1 - score / 100);

    // Needle: -90 deg = score 0 (left), +90 deg = score 100 (right)
    var targetAngle = -90 + (score / 100) * 180;

    // Animate
    var duration = 1200;
    var start = null;

    function animate(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic

      var currentOffset = totalLen - (totalLen - targetOffset) * eased;
      fill.setAttribute('stroke-dashoffset', currentOffset);

      var currentAngle = -90 + (targetAngle + 90) * eased;
      needle.setAttribute('transform', 'rotate(' + currentAngle + ', 100, 100)');

      var currentScore = Math.round(score * eased);
      scoreEl.textContent = currentScore;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        scoreEl.textContent = Math.round(score);
      }
    }

    // Reset before animating
    fill.setAttribute('stroke-dashoffset', totalLen);
    needle.setAttribute('transform', 'rotate(-90, 100, 100)');
    scoreEl.textContent = '0';

    // Zone label
    zoneEl.textContent = zone;
    zoneEl.setAttribute('data-zone', zone.toLowerCase());

    // Score color on the number
    scoreEl.style.color = Charts.getZoneColor(score);

    requestAnimationFrame(animate);
  }

  // ─── Narrative ─────────────────────────────────────────────

  function renderNarrative(r) {
    var el = $('#narrative-text');
    if (!el) return;

    var tierLabel = getTierLabel(r.selectedTier);
    var horizonLabel = getHorizonLabel(r.horizon);
    var adoptionLabel = getAdoptionLabel(r.adoptionLevel);

    var sentence = 'Under your scenario (<strong>' + tierLabel + '</strong> arriving in <strong>' +
      horizonLabel + '</strong> with <strong>' + adoptionLabel + '</strong> adoption), ' +
      '<strong>' + r.sectorName + '</strong> faces a Disruption score of <strong>' +
      Math.round(r.score) + '</strong>. ';

    // Try sector-specific dominant narrative first
    var dom = r.dominantImpact.dominant;
    var domKey = Array.isArray(dom) ? dom[0] : dom;
    var sectorNarrative = getNarrative(r.sectorId, 'dominant', domKey);
    if (sectorNarrative) {
      sentence += sectorNarrative;
      if (Array.isArray(dom) && dom[1]) {
        var second = getNarrative(r.sectorId, 'dominant', dom[1]);
        if (second) {
          sentence += ' Meanwhile, ' + second.charAt(0).toLowerCase() + second.slice(1);
        }
      }
    } else {
      sentence += getDominantSentence(r.dominantImpact.dominant);
    }

    el.innerHTML = sentence;
  }

  function getTierLabel(tier) {
    var labels = { T1: 'Current Tools', T2: 'Enhanced Copilots', T3: 'Domain-Autonomous Agents', T4: 'AGI', T5: 'Superintelligence' };
    return labels[tier] || tier;
  }

  function getHorizonLabel(h) {
    var labels = { H1: '2\u20135 years', H2: '5\u201310 years', H3: '10\u201320 years', H4: '20+ years' };
    return labels[h] || h;
  }

  function getAdoptionLabel(a) {
    var labels = { low: 'slow', medium: 'moderate', high: 'rapid' };
    return labels[a] || a;
  }

  function getDominantSentence(dominant) {
    var sentences = {
      A: 'Most core work faces direct automation \u2014 the tasks your people spend the most hours on are the tasks AI does best.',
      C: 'The cost basis of your operations is compressing \u2014 work that required teams will require tools.',
      P: 'Your workforce will do dramatically more with dramatically fewer people \u2014 headcount pressure is the primary risk.',
      T: 'The expertise premium is collapsing \u2014 AI makes your juniors perform like your seniors, flattening the value of experience.',
      D: 'Decision quality improves radically \u2014 but competitive advantage shifts from who has the best analysts to who acts on better decisions fastest.'
    };

    if (Array.isArray(dominant)) {
      return (sentences[dominant[0]] || '') + ' Meanwhile, ' +
        (sentences[dominant[1]] || '').charAt(0).toLowerCase() +
        (sentences[dominant[1]] || '').slice(1);
    }
    return sentences[dominant] || '';
  }

  // ─── Sparkline ─────────────────────────────────────────────

  function renderSparkline(timeline, maxScore) {
    var years = [2, 5, 10, 20];
    var maxVal = Math.max(maxScore, 1);

    years.forEach(function (yr) {
      var point = timeline.find(function (t) { return t.year === yr; });
      var score = point ? point.score : 0;
      var pct = Math.max(2, (score / 100) * 100);

      var bar = $('#spark-' + yr + 'yr');
      var val = $('#spark-val-' + yr + 'yr');

      if (bar) {
        bar.style.height = '0%';
        // Trigger reflow for animation
        bar.offsetHeight;
        bar.style.height = pct + '%';
        bar.style.background = 'linear-gradient(180deg, ' + Charts.getZoneColor(score) + ' 0%, ' + Charts.getZoneColor(score) + '66 100%)';
      }
      if (val) {
        val.textContent = Math.round(score);
      }
    });
  }

  // ─── Scenario Pills ───────────────────────────────────────

  function renderScenarioPills(r) {
    var container = $('#scenario-pills');
    if (!container) return;

    container.innerHTML = '';
    var pills = [
      { key: 'Capability', value: getTierLabel(r.selectedTier) },
      { key: 'Horizon', value: getHorizonLabel(r.horizon) },
      { key: 'Adoption', value: getAdoptionLabel(r.adoptionLevel) },
      { key: 'Sector', value: r.sectorName }
    ];

    pills.forEach(function (p) {
      var pill = document.createElement('span');
      pill.className = 'scenario-pill';
      pill.innerHTML = '<span class="scenario-pill__key">' + p.key + ':</span> ' + p.value;
      container.appendChild(pill);
    });
  }

  // ─── Radar Chart ───────────────────────────────────────────

  function renderRadar(scores) {
    // Destroy existing
    if (radarChart) {
      radarChart.destroy();
      radarChart = null;
    }

    var canvas = $('#radar-chart');
    if (!canvas) return;

    var labels = ['Automates', 'Compresses Costs', 'Productivity', 'Augments Talent', 'Decision-making'];
    var data = [scores.A || 0, scores.C || 0, scores.P || 0, scores.T || 0, scores.D || 0];

    radarChart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [{
          label: 'AI Impact',
          data: data,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: '#3b82f6',
          borderWidth: 2,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#3b82f6',
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 3,
            ticks: {
              stepSize: 1,
              color: '#475569',
              backdropColor: 'transparent',
              font: { size: 11 }
            },
            grid: { color: '#334155', lineWidth: 1 },
            angleLines: { color: '#334155', lineWidth: 1 },
            pointLabels: {
              color: '#e2e8f0',
              font: { size: 13, weight: '600' }
            }
          }
        }
      }
    });
  }

  // ─── Structural Shifts ─────────────────────────────────────

  function renderStructuralShifts(higherOrder, sectorId) {
    var container = $('#structural-shifts');
    if (!container) return;
    container.innerHTML = '';

    var triggered = higherOrder.filter(function (h) { return h.triggered; });

    if (triggered.length === 0) {
      container.innerHTML = '<div class="shifts-empty">No structural shifts triggered under this scenario. Your sector\'s task profile doesn\'t cross the thresholds at this capability level.</div>';
      return;
    }

    var descriptions = {
      scarce_knowledge: 'What your senior specialists know is becoming available to anyone with AI tools. The expertise premium that underpinned your talent strategy and pricing power is dissolving. Knowledge scarcity no longer equals value.',
      coordination_zero: 'The cost of coordinating work across people, teams, and organizations is collapsing. Firm boundaries drawn around coordination advantages will need to be redrawn. What you outsource vs. build in-house changes fundamentally.',
      unbundling: 'Execution is being broadly automated, but judgment and verification remain human. Your value chain is unbundling \u2014 the bottleneck shifts from "who can do the work" to "who can verify the work was done right."'
    };

    triggered.forEach(function (h) {
      var desc = getNarrative(sectorId, 'shifts', h.id) || descriptions[h.id] || '';
      var card = document.createElement('div');
      card.className = 'shift-card';
      card.innerHTML = '<div class="shift-card__title">' + h.label + '</div>' +
        '<div class="shift-card__desc">' + desc + '</div>';
      container.appendChild(card);
    });
  }

  // ─── Risk Blocks ───────────────────────────────────────────

  function renderRiskBlocks(r) {
    renderExposed(r);
    renderShifting(r);
    renderActions(r);
  }

  function renderExposed(r) {
    var ul = $('#risk-exposed');
    if (!ul) return;
    ul.innerHTML = '';

    var sorted = r.taskDetails.slice().sort(function (a, b) {
      return (b.score * b.weight) - (a.score * a.weight);
    });
    var top = sorted.slice(0, 3);

    top.forEach(function (task) {
      var sectorNarrative = getNarrative(r.sectorId, 'exposure', task.id);
      var li = document.createElement('li');
      if (sectorNarrative) {
        li.textContent = sectorNarrative;
      } else {
        var pct = (task.weight * 100).toFixed(0);
        var impactSum = task.impacts.A + task.impacts.C + task.impacts.P + task.impacts.T + task.impacts.D;
        var impactWord = impactSum >= 10 ? 'near-complete disruption' : impactSum >= 6 ? 'significant disruption' : 'meaningful impact';
        li.textContent = task.name + ' represents ' + pct + '% of workforce time and faces ' + impactWord + ' under this scenario.';
      }
      ul.appendChild(li);
    });
  }

  function renderShifting(r) {
    var ul = $('#risk-shifting');
    if (!ul) return;
    ul.innerHTML = '';

    var shiftMessages = {
      scarce_knowledge: 'The expertise premium is collapsing \u2014 what your senior analysts know is becoming available to anyone with access to AI tools.',
      coordination_zero: 'Coordination costs are approaching zero \u2014 the boundaries between firms, teams, and roles are being redrawn by free coordination.',
      unbundling: 'Execution is automating but verification isn\'t \u2014 the bottleneck is shifting from doing work to proving it was done right.'
    };

    var triggered = r.higherOrderImpacts.filter(function (h) { return h.triggered; });

    if (triggered.length === 0) {
      var dom = r.dominantImpact.dominant;
      var domArr = Array.isArray(dom) ? dom : [dom];
      var fallbacks = {
        A: 'Core tasks are being directly replaced \u2014 the question isn\'t whether roles change, but which roles survive.',
        C: 'Cost structures are compressing industry-wide \u2014 margin advantages built on labor costs are evaporating.',
        P: 'Productivity per person is multiplying \u2014 the same output requires fewer people, reshaping headcount assumptions.',
        T: 'The talent hierarchy is flattening \u2014 juniors armed with AI perform at senior levels, eroding seniority-based value.',
        D: 'Decision quality is improving faster than decision-making culture \u2014 the bottleneck shifts from analysis to action.'
      };
      domArr.forEach(function (d) {
        var sectorMsg = getNarrative(r.sectorId, 'shiftingFallback', d);
        var msg = sectorMsg || fallbacks[d];
        if (msg) {
          var li = document.createElement('li');
          li.textContent = msg;
          ul.appendChild(li);
        }
      });
    } else {
      triggered.forEach(function (h) {
        var sectorMsg = getNarrative(r.sectorId, 'shifting', h.id);
        var msg = sectorMsg || shiftMessages[h.id];
        if (msg) {
          var li = document.createElement('li');
          li.textContent = msg;
          ul.appendChild(li);
        }
      });
    }
  }

  function renderActions(r) {
    var ul = $('#risk-actions');
    if (!ul) return;
    ul.innerHTML = '';

    // Check if this sector has narrative recommendations
    var sectorHasRecs = getNarrative(r.sectorId, 'recommendations', 'A') !== null;

    if (sectorHasRecs) {
      // Build rec list from signals, using sector-specific text
      var recs = [];

      // Dominant impact recs
      var dom = r.dominantImpact.dominant;
      var domArr = Array.isArray(dom) ? dom : [dom];
      domArr.forEach(function (d) {
        var rec = getNarrative(r.sectorId, 'recommendations', d);
        if (rec) recs.push(rec);
      });

      // Higher-order trigger recs
      r.higherOrderImpacts.forEach(function (h) {
        if (h.triggered) {
          var rec = getNarrative(r.sectorId, 'recommendations', h.id);
          if (rec) recs.push(rec);
        }
      });

      // Verification rec
      var verRec = getNarrative(r.sectorId, 'recommendations', 'verification');
      if (verRec) recs.push(verRec);

      // Adoption speed rec
      var adoptionKey = 'adoption_' + (r.adoptionLevel || 'medium').toLowerCase();
      var adoptionRec = getNarrative(r.sectorId, 'recommendations', adoptionKey);
      if (adoptionRec) recs.push(adoptionRec);

      // Render sector recs
      recs.forEach(function (rec) {
        var li = document.createElement('li');
        li.textContent = rec;
        ul.appendChild(li);
      });
    } else {
      // Fallback: use engine recommendations
      r.recommendations.forEach(function (rec) {
        var li = document.createElement('li');
        li.textContent = rec;
        ul.appendChild(li);
      });
    }
  }

  // ─── Task Table ────────────────────────────────────────────

  function renderTaskTable(taskDetails) {
    var tbody = $('#task-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    var catLabels = {
      routine_cognitive: 'Routine Cognitive',
      routine_manual: 'Routine Manual',
      non_routine_analytical: 'Non-Routine Analytical',
      non_routine_interactive: 'Non-Routine Interactive',
      non_routine_manual: 'Non-Routine Manual',
      cross_cutting: 'Cross-Cutting'
    };

    // Find the task category from data
    var taskMap = {};
    if (Data && Data.TASKS) {
      Data.TASKS.forEach(function (t) { taskMap[t.id] = t; });
    }

    taskDetails.forEach(function (task) {
      var tr = document.createElement('tr');
      var fullTask = taskMap[task.id];
      var category = fullTask ? (catLabels[fullTask.category] || fullTask.category) : '\u2014';
      var totalImpact = task.impacts.A + task.impacts.C + task.impacts.P + task.impacts.T + task.impacts.D;

      // Task name
      var tdName = document.createElement('td');
      tdName.textContent = task.name;
      tr.appendChild(tdName);

      // Category
      var tdCat = document.createElement('td');
      tdCat.textContent = category;
      tr.appendChild(tdCat);

      // Weight
      var tdWeight = document.createElement('td');
      tdWeight.className = 'task-table__num';
      tdWeight.textContent = (task.weight * 100).toFixed(0) + '%';
      tr.appendChild(tdWeight);

      // Impact dimensions
      ['A', 'C', 'P', 'T', 'D'].forEach(function (dim) {
        var td = document.createElement('td');
        td.className = 'impact-cell task-table__num';
        td.setAttribute('data-intensity', String(task.impacts[dim]));
        td.textContent = task.impacts[dim];
        tr.appendChild(td);
      });

      // Total
      var tdTotal = document.createElement('td');
      tdTotal.className = 'total-cell task-table__num';
      tdTotal.textContent = totalImpact;
      var level = totalImpact <= 3 ? 'low' : totalImpact <= 6 ? 'moderate' : totalImpact <= 9 ? 'high' : totalImpact <= 12 ? 'very-high' : 'extreme';
      tdTotal.setAttribute('data-level', level);
      tr.appendChild(tdTotal);

      tbody.appendChild(tr);
    });

    // Bind sorting
    bindTableSort(taskDetails, taskMap, catLabels);
  }

  function bindTableSort(taskDetails, taskMap, catLabels) {
    var currentSort = { col: null, asc: true };

    $$('#task-table .task-table__sortable').forEach(function (th) {
      // Remove old listeners by cloning
      var newTh = th.cloneNode(true);
      th.parentNode.replaceChild(newTh, th);

      newTh.addEventListener('click', function () {
        var col = newTh.dataset.sort;
        if (currentSort.col === col) {
          currentSort.asc = !currentSort.asc;
        } else {
          currentSort.col = col;
          currentSort.asc = true;
        }

        // Update sort indicators
        $$('#task-table .task-table__sortable').forEach(function (h) {
          h.classList.remove('sort-active', 'sort-asc', 'sort-desc');
        });
        newTh.classList.add('sort-active', currentSort.asc ? 'sort-asc' : 'sort-desc');

        // Sort data
        var sorted = taskDetails.slice().sort(function (a, b) {
          var va, vb;
          if (col === 'name') {
            va = a.name; vb = b.name;
            return currentSort.asc ? va.localeCompare(vb) : vb.localeCompare(va);
          } else if (col === 'category') {
            var ftA = taskMap[a.id]; var ftB = taskMap[b.id];
            va = ftA ? (catLabels[ftA.category] || '') : '';
            vb = ftB ? (catLabels[ftB.category] || '') : '';
            return currentSort.asc ? va.localeCompare(vb) : vb.localeCompare(va);
          } else if (col === 'weight') {
            va = a.weight; vb = b.weight;
          } else if (col === 'total') {
            va = a.impacts.A + a.impacts.C + a.impacts.P + a.impacts.T + a.impacts.D;
            vb = b.impacts.A + b.impacts.C + b.impacts.P + b.impacts.T + b.impacts.D;
          } else {
            va = 0; vb = 0;
          }
          return currentSort.asc ? va - vb : vb - va;
        });

        // Re-render with sorted data
        renderTaskTable(sorted);
      });
    });
  }

  // ─── Boot ──────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
