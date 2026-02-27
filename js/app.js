/**
 * AI Disruption Diagnostic — App Controller (v2: Executive-Native)
 * Wires inputs, engine, charts, and DOM together.
 * Dimensions: H(eadcount) / M(argin) / V(elocity) / B(arrier) / R(estructuring)
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
    $$('#capability-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.capability = card.dataset.capability;
        highlightCard('#capability-cards .input-card', card);
        unlockStep('step-horizon');
        scrollTo('#step-horizon');
      });
    });

    $$('#horizon-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.horizon = card.dataset.horizon;
        highlightCard('#horizon-cards .input-card', card);
        unlockStep('step-adoption');
        scrollTo('#step-adoption');
      });
    });

    $$('#adoption-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.adoption = card.dataset.adoption;
        highlightCard('#adoption-cards .input-card', card);
        unlockStep('step-sector');
        scrollTo('#step-sector');
      });
    });

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
    renderScenarios(r.scenarios, r.sectorId);
    renderWhatChanges(r);
    renderActions(r);
  }

  // ─── Gauge (SVG animation) ─────────────────────────────────

  function renderGauge(score, zone) {
    var fill = $('#gauge-fill');
    var needle = $('#gauge-needle');
    var scoreEl = $('#gauge-score-value');
    var zoneEl = $('#gauge-zone-label');

    var totalLen = 251.2;
    var targetOffset = totalLen * (1 - score / 100);
    var targetAngle = -90 + (score / 100) * 180;

    var duration = 1200;
    var start = null;

    function animate(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);

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

    fill.setAttribute('stroke-dashoffset', totalLen);
    needle.setAttribute('transform', 'rotate(-90, 100, 100)');
    scoreEl.textContent = '0';

    zoneEl.textContent = zone;
    zoneEl.setAttribute('data-zone', zone.toLowerCase());

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
    var labels = { T1: "Today's Tools", T2: 'Reliable Analysts', T3: 'Autonomous Operators', T4: 'Strategic Partners', T5: 'Beyond Human' };
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
      H: 'The primary pressure is on headcount \u2014 the roles your people fill today are the roles AI fills tomorrow.',
      M: 'Your margin structure is compressing \u2014 AI makes the work cheaper, and competitors will pass those savings to your customers.',
      V: 'Speed is the story \u2014 AI accelerates your core work so dramatically that organizations running at human pace become competitively irrelevant.',
      B: 'Your defensible advantages are eroding \u2014 the expertise, knowledge, and specialized capability that made you hard to compete with is becoming available to everyone.',
      R: 'The org chart is the casualty \u2014 AI doesn\'t just change what gets done, it changes how many people and layers you need to do it.'
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

    years.forEach(function (yr) {
      var point = timeline.find(function (t) { return t.year === yr; });
      var score = point ? point.score : 0;
      var pct = Math.max(2, (score / 100) * 100);

      var bar = $('#spark-' + yr + 'yr');
      var val = $('#spark-val-' + yr + 'yr');

      if (bar) {
        bar.style.height = '0%';
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
    if (radarChart) {
      radarChart.destroy();
      radarChart = null;
    }

    var canvas = $('#radar-chart');
    if (!canvas) return;

    var labels = ['Headcount', 'Margins', 'Speed', 'Moat', 'Reorg'];
    var data = [scores.H || 0, scores.M || 0, scores.V || 0, scores.B || 0, scores.R || 0];

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

  // ─── Scenarios (replaces Structural Shifts) ────────────────

  function renderScenarios(scenarios, sectorId) {
    var container = $('#scenarios-container');
    if (!container) return;
    container.innerHTML = '';

    var active = scenarios.filter(function (s) { return s.severity !== 'none'; });

    if (active.length === 0) {
      container.innerHTML = '<div class="shifts-empty">No structural scenarios triggered under this capability level. Your sector\'s task profile doesn\'t cross the thresholds yet.</div>';
      return;
    }

    active.forEach(function (scenario) {
      var sectorDesc = getNarrative(sectorId, 'scenarios', scenario.id);
      var desc = sectorDesc || scenario.description;

      var card = document.createElement('div');
      card.className = 'scenario-card';
      card.innerHTML =
        '<div class="scenario-card__header">' +
          '<span class="scenario-card__title">' + scenario.label + '</span>' +
          '<span class="scenario-card__badge scenario-card__badge--' + scenario.severity + '">' + scenario.severity + '</span>' +
        '</div>' +
        '<div class="scenario-card__desc">' + desc + '</div>';
      container.appendChild(card);
    });
  }

  // ─── What Changes Cards (replaces Task Table + Risk Blocks) ──

  function renderWhatChanges(r) {
    var wc = r.whatChanges;

    renderWhatChangesCard('#changes-first', 'Changes First', 'What gets faster immediately', wc.changesFirst, r, 'V');
    renderWhatChangesCard('#changes-most', 'Changes Most', 'Where the people pressure is', wc.changesMost, r, 'H');
    renderWhatChangesCard('#stays-human', 'Stays Human', 'Where your moat actually lives', wc.staysHuman, r, null);
  }

  function renderWhatChangesCard(selector, title, subtitle, tasks, r, highlightDim) {
    var container = $(selector);
    if (!container) return;
    container.innerHTML = '';

    tasks.forEach(function (task) {
      var sectorNarrative = null;
      if (highlightDim === 'V') {
        sectorNarrative = getNarrative(r.sectorId, 'changesFirst', task.id);
      } else if (highlightDim === 'H') {
        sectorNarrative = getNarrative(r.sectorId, 'changesMost', task.id);
      } else {
        sectorNarrative = getNarrative(r.sectorId, 'staysHuman', task.id);
      }

      var item = document.createElement('div');
      item.className = 'what-changes__item';

      var taskName = document.createElement('div');
      taskName.className = 'what-changes__task-name';
      taskName.textContent = task.name;
      item.appendChild(taskName);

      if (highlightDim) {
        var badge = document.createElement('span');
        badge.className = 'what-changes__dim-badge';
        var dimVal = task.impacts[highlightDim] || 0;
        badge.setAttribute('data-intensity', String(dimVal));
        var dimLabels = { H: 'Headcount', M: 'Margins', V: 'Speed', B: 'Moat', R: 'Reorg' };
        badge.textContent = (dimLabels[highlightDim] || highlightDim) + ': ' + dimVal + '/3';
        item.appendChild(badge);
      }

      if (sectorNarrative) {
        var desc = document.createElement('div');
        desc.className = 'what-changes__desc';
        desc.textContent = sectorNarrative;
        item.appendChild(desc);
      } else {
        // Generate a generic sentence
        var generic = document.createElement('div');
        generic.className = 'what-changes__desc';
        var pct = (task.weight * 100).toFixed(0);
        if (highlightDim === 'V') {
          var vScore = task.impacts.V || 0;
          var vWord = vScore >= 3 ? 'transformative' : vScore >= 2 ? 'significant' : 'emerging';
          generic.textContent = task.name + ' (' + pct + '% of effort) faces ' + vWord + ' velocity gains under this scenario.';
        } else if (highlightDim === 'H') {
          var hScore = task.impacts.H || 0;
          var hWord = hScore >= 3 ? 'severe' : hScore >= 2 ? 'significant' : 'emerging';
          generic.textContent = task.name + ' (' + pct + '% of effort) faces ' + hWord + ' headcount pressure.';
        } else {
          var total = task.total || 0;
          generic.textContent = task.name + ' (' + pct + '% of effort) remains relatively protected \u2014 low overall AI impact at this capability level.';
        }
        item.appendChild(generic);
      }

      container.appendChild(item);
    });
  }

  // ─── Actions ───────────────────────────────────────────────

  function renderActions(r) {
    var ul = $('#risk-actions');
    if (!ul) return;
    ul.innerHTML = '';

    // Check if sector has narrative recommendations
    var sectorHasRecs = getNarrative(r.sectorId, 'recommendations', 'H') !== null;

    if (sectorHasRecs) {
      var recs = [];

      // Dominant impact recs
      var dom = r.dominantImpact.dominant;
      var domArr = Array.isArray(dom) ? dom : [dom];
      domArr.forEach(function (d) {
        var rec = getNarrative(r.sectorId, 'recommendations', d);
        if (rec) recs.push(rec);
      });

      // Scenario recs
      r.scenarios.forEach(function (s) {
        if (s.severity !== 'none') {
          var rec = getNarrative(r.sectorId, 'recommendations', s.id);
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

      recs.forEach(function (rec) {
        var li = document.createElement('li');
        li.textContent = rec;
        ul.appendChild(li);
      });
    } else {
      r.recommendations.forEach(function (rec) {
        var li = document.createElement('li');
        li.textContent = rec;
        ul.appendChild(li);
      });
    }
  }

  // ─── Boot ──────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
