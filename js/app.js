/**
 * AI Disruption Diagnostic — App Controller (v3: Strategic Briefing)
 * Wires inputs, engine, and streaming briefing together.
 */
(function () {
  'use strict';

  var Engine = window.DiagnosticEngine;

  // ─── State ──────────────────────────────────────────────────
  var state = {
    capability: null,
    horizon: null,
    adoption: null,
    sector: null,
    results: null
  };

  // ─── DOM Refs ───────────────────────────────────────────────
  var $ = function (sel) { return document.querySelector(sel); };
  var $$ = function (sel) { return document.querySelectorAll(sel); };

  // ─── Init ───────────────────────────────────────────────────
  function init() {
    bindInputCards();
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

  // ─── Change Assumptions ────────────────────────────────────

  function bindChangeAssumptions() {
    var btn = $('#btn-change-assumptions');
    if (btn) {
      btn.addEventListener('click', function () {
        $('#results-section').style.display = 'none';
        $('#briefing-text').innerHTML = '';
        scrollTo('#input-section');
      });
    }

    // Retry button
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'btn-retry') {
        if (state.results) streamBriefing(state.results);
      }
    });
  }

  // ─── Run Diagnostic ────────────────────────────────────────

  function runDiagnostic() {
    if (!state.capability || !state.horizon || !state.adoption || !state.sector) return;

    var results = Engine.computeAll(state.sector, state.capability, state.horizon, state.adoption);
    state.results = results;

    // Show results section
    var resultsSection = $('#results-section');
    resultsSection.style.display = '';
    setTimeout(function () {
      resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Render assumption pills
    renderScenarioPills(results);

    // Start streaming briefing
    streamBriefing(results);
  }

  // ─── Scenario Pills ────────────────────────────────────────

  function renderScenarioPills(r) {
    var container = $('#scenario-pills');
    if (!container) return;
    container.innerHTML = '';

    var tierLabels = { T1: 'Narrow Assistants', T2: 'Skilled Specialists', T3: 'Autonomous Professionals', T4: 'Cross-Domain Experts', T5: 'Superhuman Intelligence' };
    var horizonLabels = { H1: '2\u20135 years', H2: '5\u201310 years', H3: '10\u201320 years', H4: '20+ years' };
    var adoptionLabels = { low: 'slow', medium: 'moderate', high: 'rapid' };

    var pills = [
      { key: 'Capability', value: tierLabels[r.selectedTier] || r.selectedTier },
      { key: 'Horizon', value: horizonLabels[r.horizon] || r.horizon },
      { key: 'Adoption', value: adoptionLabels[r.adoptionLevel] || r.adoptionLevel },
      { key: 'Sector', value: r.sectorName }
    ];

    pills.forEach(function (p) {
      var pill = document.createElement('span');
      pill.className = 'scenario-pill';
      pill.innerHTML = '<span class="scenario-pill__key">' + p.key + ':</span> ' + p.value;
      container.appendChild(pill);
    });
  }

  // ─── Stream Briefing ───────────────────────────────────────

  function streamBriefing(results) {
    var textEl = $('#briefing-text');
    var loadingEl = $('#briefing-loading');
    var errorEl = $('#briefing-error');

    // Reset
    textEl.innerHTML = '';
    loadingEl.style.display = '';
    errorEl.style.display = 'none';

    // Add cursor
    var cursor = document.createElement('span');
    cursor.className = 'briefing-cursor';

    fetch('/api/briefing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(results)
    }).then(function (response) {
      if (!response.ok) throw new Error('API error');

      loadingEl.style.display = 'none';
      textEl.appendChild(cursor);

      var reader = response.body.getReader();
      var decoder = new TextDecoder();
      var fullText = '';
      var buffer = '';

      function processStream() {
        return reader.read().then(function (result) {
          if (result.done) {
            cursor.remove();
            textEl.innerHTML = renderMarkdown(fullText);
            return;
          }

          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (!line.startsWith('data: ')) continue;
            var payload = line.slice(6);
            if (payload === '[DONE]') {
              cursor.remove();
              textEl.innerHTML = renderMarkdown(fullText);
              return;
            }
            try {
              var parsed = JSON.parse(payload);
              if (parsed.error) {
                showError(parsed.error);
                return;
              }
              if (parsed.text) {
                fullText += parsed.text;
                textEl.innerHTML = renderMarkdown(fullText);
                textEl.appendChild(cursor);
              }
            } catch (e) {}
          }

          return processStream();
        });
      }

      return processStream();
    }).catch(function (err) {
      loadingEl.style.display = 'none';
      showError('Analysis unavailable. Try again.');
    });

    function showError(msg) {
      errorEl.style.display = '';
      errorEl.querySelector('#briefing-error-msg').textContent = msg;
    }
  }

  // ─── Markdown Renderer ─────────────────────────────────────

  function renderMarkdown(text) {
    return text
      // Headers
      .replace(/^## (.+)$/gm, '<h2 class="briefing-h2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="briefing-h3">$1</h3>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Horizontal rules
      .replace(/^---$/gm, '<hr class="briefing-hr">')
      // Bullet lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul class="briefing-list">$&</ul>')
      // Paragraphs (double newline)
      .replace(/\n\n/g, '</p><p>')
      // Single newlines within paragraphs
      .replace(/\n/g, '<br>')
      // Wrap in paragraph
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      // Clean up empty paragraphs and paragraph-wrapped headers
      .replace(/<p>(<h[23])/g, '$1')
      .replace(/(<\/h[23]>)<\/p>/g, '$1')
      .replace(/<p>(<hr[^>]*>)<\/p>/g, '$1')
      .replace(/<p>(<ul)/g, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1')
      .replace(/<p>\s*<\/p>/g, '');
  }

  // ─── Boot ──────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
