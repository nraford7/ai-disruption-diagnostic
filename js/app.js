/**
 * AI Disruption Diagnostic — App Controller (v4: View Router)
 * Single-view-at-a-time architecture with animated transitions.
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

  // ─── View Router ────────────────────────────────────────────

  var VIEW_ORDER = ['landing', 'capability', 'horizon', 'adoption', 'sector', 'results'];
  var currentView = 'landing';

  function showView(viewName) {
    showViewDirect(viewName);

    // Update history
    if (viewName === 'landing') {
      history.pushState({ view: viewName }, '', '/');
    } else {
      history.pushState({ view: viewName }, '', '#' + viewName);
    }
  }

  function showViewDirect(viewName) {
    var currentEl = document.querySelector('.view--active');
    var targetEl = document.getElementById('view-' + viewName);
    if (!targetEl || (currentEl && currentEl === targetEl)) return;

    // Animate out
    if (currentEl) {
      currentEl.classList.add('view--leaving');
      currentEl.classList.remove('view--active');
      setTimeout(function () {
        currentEl.classList.remove('view--leaving');
      }, 300);
    }

    // Animate in
    targetEl.classList.add('view--active', 'view--entering');
    setTimeout(function () {
      targetEl.classList.remove('view--entering');
    }, 300);

    // Scroll to top
    window.scrollTo(0, 0);

    currentView = viewName;

    // Update progress indicators on all question views
    updateProgress(viewName);
  }

  window.addEventListener('popstate', function (e) {
    if (e.state && e.state.view) {
      showViewDirect(e.state.view);
    } else {
      showViewDirect('landing');
    }
  });

  // ─── Progress Indicator ─────────────────────────────────────

  function updateProgress(viewName) {
    var stepMap = { capability: 1, horizon: 2, adoption: 3, sector: 4 };
    var activeStep = stepMap[viewName] || 0;

    // Update step numbers
    $$('.progress-step').forEach(function (el) {
      var step = parseInt(el.dataset.step, 10);
      el.classList.remove('progress-step--active', 'progress-step--completed');
      if (step === activeStep) {
        el.classList.add('progress-step--active');
      } else if (step < activeStep) {
        el.classList.add('progress-step--completed');
      }
    });

    // Update separators between completed steps
    $$('.progress-indicator').forEach(function (indicator) {
      var steps = indicator.querySelectorAll('.progress-step');
      var seps = indicator.querySelectorAll('.progress-separator');
      seps.forEach(function (sep, i) {
        var beforeStep = parseInt(steps[i].dataset.step, 10);
        sep.classList.toggle('progress-separator--completed', beforeStep < activeStep);
      });
    });
  }

  // ─── Init ───────────────────────────────────────────────────

  function init() {
    bindCardClicks();
    bindBackButtons();
    bindGetStarted();
    bindChangeAssumptions();

    // Handle initial hash
    var hash = window.location.hash.slice(1);
    if (hash && hash !== 'results') {
      showView(hash);
    } else if (hash === 'results' && !state.results) {
      showView('landing');
    }
    // Default: landing is already visible via view--active class
  }

  // ─── Card Click Handlers ────────────────────────────────────

  function bindCardClicks() {
    // Capability cards
    $$('#capability-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.capability = card.dataset.capability;
        highlightCard('#capability-cards .input-card', card);
        showView('horizon');
      });
    });

    // Horizon cards
    $$('#horizon-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.horizon = card.dataset.horizon;
        highlightCard('#horizon-cards .input-card', card);
        showView('adoption');
      });
    });

    // Adoption cards
    $$('#adoption-cards .input-card').forEach(function (card) {
      card.addEventListener('click', function () {
        state.adoption = card.dataset.adoption;
        highlightCard('#adoption-cards .input-card', card);
        showView('sector');
      });
    });

    // Sector cards
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

  // ─── Back Buttons ───────────────────────────────────────────

  function bindBackButtons() {
    $$('.btn--back').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.dataset.back;
        if (target) showView(target);
      });
    });
  }

  // ─── Get Started ────────────────────────────────────────────

  function bindGetStarted() {
    var btn = $('#btn-get-started');
    if (btn) {
      btn.addEventListener('click', function () {
        showView('capability');
      });
    }
  }

  // ─── Change Assumptions ─────────────────────────────────────

  function bindChangeAssumptions() {
    var btn = $('#btn-change-assumptions');
    if (btn) {
      btn.addEventListener('click', function () {
        // Clear briefing
        $('#briefing-text').innerHTML = '';
        var titleEl = $('#briefing-title');
        if (titleEl) titleEl.textContent = '';

        // Go back to landing
        showView('landing');
      });
    }

    // Retry button
    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'btn-retry') {
        if (state.results) streamBriefing(state.results);
      }
    });
  }

  // ─── Run Diagnostic ─────────────────────────────────────────

  function runDiagnostic() {
    if (!state.capability || !state.horizon || !state.adoption || !state.sector) return;

    var results = Engine.computeAll(state.sector, state.capability, state.horizon, state.adoption);
    state.results = results;

    // Inject briefing title
    var titleEl = $('#briefing-title');
    if (titleEl) {
      titleEl.textContent = 'AI Disruption Briefing: ' + results.sectorName;
    }

    // Show results view
    showView('results');

    // Render pills and start streaming
    renderScenarioPills(results);
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

  // ─── Stream Briefing ────────────────────────────────────────

  function appendMethodologyLink(textEl) {
    var methodLink = document.createElement('div');
    methodLink.className = 'briefing-methodology-link';
    methodLink.innerHTML = '<a href="/methodology.html">Learn about our Methodology &rarr;</a>';
    textEl.appendChild(methodLink);
  }

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
            appendMethodologyLink(textEl);
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
              appendMethodologyLink(textEl);
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

  // ─── Markdown Renderer ──────────────────────────────────────

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

  // ─── Boot ───────────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
