/**
 * DiagnosticCharts — Visualization layer for AI Disruption Diagnostic
 * Renders gauge, radar, timeline, and task table using Canvas API + Chart.js
 */
(function () {
  'use strict';

  // ── Color System ──────────────────────────────────────────────────────
  const COLORS = {
    bg: '#0a0a0f',
    accent: '#3b82f6',
    text: '#e2e8f0',
    subtle: '#475569',
    grid: '#334155',
    zones: [
      { max: 20, color: '#10b981', label: 'Resilient' },
      { max: 40, color: '#84cc16', label: 'Adapting' },
      { max: 60, color: '#f59e0b', label: 'Transforming' },
      { max: 80, color: '#f97316', label: 'Disrupting' },
      { max: 100, color: '#ef4444', label: 'Restructuring' },
    ],
  };

  const IMPACT_COLORS = [
    'rgba(71, 85, 105, 0.4)',   // 0 — dim
    'rgba(59, 130, 246, 0.35)', // 1 — subtle
    'rgba(59, 130, 246, 0.6)',  // 2 — moderate
    'rgba(59, 130, 246, 1)',    // 3 — bright
  ];

  const DIMENSION_LABELS = {
    H: 'Headcount',
    M: 'Margins',
    V: 'Speed',
    B: 'Moat',
    R: 'Reorg',
  };

  // ── Chart.js Instance Registry ────────────────────────────────────────
  const chartInstances = {};

  function destroyChart(id) {
    if (chartInstances[id]) {
      chartInstances[id].destroy();
      delete chartInstances[id];
    }
  }

  // ── Utility ───────────────────────────────────────────────────────────

  function getZoneColor(score) {
    const s = Math.max(0, Math.min(100, score));
    for (const z of COLORS.zones) {
      if (s <= z.max) return z.color;
    }
    return COLORS.zones[COLORS.zones.length - 1].color;
  }

  function getZoneLabel(score) {
    const s = Math.max(0, Math.min(100, score));
    for (const z of COLORS.zones) {
      if (s <= z.max) return z.label;
    }
    return COLORS.zones[COLORS.zones.length - 1].label;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function clearContainer(id) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
    return el;
  }

  // ── Gauge (Canvas API) ────────────────────────────────────────────────

  function renderGauge(containerId, score, riskZone) {
    const container = clearContainer(containerId);
    if (!container) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 400;
    const H = 250;

    const canvas = document.createElement('canvas');
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = '100%';
    canvas.style.maxWidth = W + 'px';
    canvas.style.height = 'auto';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H - 30;
    const outerR = 150;
    const arcWidth = 28;
    const innerR = outerR - arcWidth;

    const startAngle = Math.PI;
    const endAngle = 2 * Math.PI;

    // Draw arc segments (risk-zone colored)
    function drawArc() {
      ctx.clearRect(0, 0, W, H);

      const zones = COLORS.zones;
      let prevFrac = 0;
      for (const z of zones) {
        const frac = z.max / 100;
        const a0 = startAngle + prevFrac * Math.PI;
        const a1 = startAngle + frac * Math.PI;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, a0, a1);
        ctx.arc(cx, cy, innerR, a1, a0, true);
        ctx.closePath();
        ctx.fillStyle = z.color;
        ctx.globalAlpha = 0.35;
        ctx.fill();
        ctx.globalAlpha = 1;
        prevFrac = frac;
      }

      // Active fill up to score
      prevFrac = 0;
      const scoreFrac = Math.max(0, Math.min(100, score)) / 100;
      for (const z of zones) {
        const zoneFrac = z.max / 100;
        if (prevFrac >= scoreFrac) break;
        const a0 = startAngle + prevFrac * Math.PI;
        const endFrac = Math.min(zoneFrac, scoreFrac);
        const a1 = startAngle + endFrac * Math.PI;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, a0, a1);
        ctx.arc(cx, cy, innerR, a1, a0, true);
        ctx.closePath();
        ctx.fillStyle = z.color;
        ctx.fill();
        prevFrac = zoneFrac;
      }
    }

    // Draw needle at a given normalized position (0-1)
    function drawNeedle(frac) {
      const angle = startAngle + frac * Math.PI;
      const needleLen = outerR - 12;
      const nx = cx + Math.cos(angle) * needleLen;
      const ny = cy + Math.sin(angle) * needleLen;

      // Needle shadow
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(cx - 4 * Math.cos(angle + Math.PI / 2), cy - 4 * Math.sin(angle + Math.PI / 2));
      ctx.lineTo(cx + 4 * Math.cos(angle + Math.PI / 2), cy + 4 * Math.sin(angle + Math.PI / 2));
      ctx.lineTo(nx, ny);
      ctx.closePath();
      ctx.fillStyle = COLORS.text;
      ctx.fill();
      ctx.restore();

      // Center cap
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fillStyle = COLORS.text;
      ctx.fill();
    }

    // Draw text labels
    function drawLabels(displayScore) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Score number
      ctx.font = 'bold 48px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = getZoneColor(score);
      ctx.fillText(Math.round(displayScore), cx, cy - 50);

      // Zone label
      ctx.font = '600 16px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = COLORS.text;
      const label = riskZone || getZoneLabel(score);
      ctx.fillText(label.toUpperCase(), cx, cy - 20);

      // Min/max labels
      ctx.font = '12px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = COLORS.subtle;
      ctx.textAlign = 'left';
      ctx.fillText('0', cx - outerR + 4, cy + 18);
      ctx.textAlign = 'right';
      ctx.fillText('100', cx + outerR - 4, cy + 18);
    }

    // Animate
    const duration = 1200;
    const targetFrac = Math.max(0, Math.min(100, score)) / 100;
    let startTime = null;

    function frame(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(t);
      const currentFrac = eased * targetFrac;
      const displayScore = eased * score;

      drawArc();
      drawNeedle(currentFrac);
      drawLabels(displayScore);

      if (t < 1) {
        requestAnimationFrame(frame);
      }
    }

    requestAnimationFrame(frame);
  }

  // ── Radar (Chart.js) ─────────────────────────────────────────────────

  function renderRadar(containerId, impactScores) {
    const container = clearContainer(containerId);
    if (!container) return;

    destroyChart(containerId);

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const labels = ['H', 'M', 'V', 'B', 'R'];
    const data = labels.map(k => impactScores[k] || 0);
    const fullLabels = labels.map(k => DIMENSION_LABELS[k]);

    const chart = new Chart(canvas, {
      type: 'radar',
      data: {
        labels: fullLabels,
        datasets: [{
          label: 'AI Impact',
          data: data,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          borderColor: COLORS.accent,
          borderWidth: 2,
          pointBackgroundColor: COLORS.accent,
          pointBorderColor: COLORS.accent,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          r: {
            beginAtZero: true,
            min: 0,
            max: 3,
            ticks: {
              stepSize: 1,
              color: COLORS.subtle,
              backdropColor: 'transparent',
              font: { size: 11 },
            },
            grid: {
              color: COLORS.grid,
              lineWidth: 1,
            },
            angleLines: {
              color: COLORS.grid,
              lineWidth: 1,
            },
            pointLabels: {
              color: COLORS.text,
              font: { size: 13, weight: '600' },
            },
          },
        },
      },
    });

    chartInstances[containerId] = chart;
  }

  // ── Timeline (Chart.js) ──────────────────────────────────────────────

  function renderTimeline(containerId, timelineData) {
    const container = clearContainer(containerId);
    if (!container) return;

    destroyChart(containerId);

    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const labels = timelineData.map(d => d.year + 'yr');
    const scores = timelineData.map(d => d.score);
    const finalScore = scores[scores.length - 1] || 0;
    const lineColor = getZoneColor(finalScore);

    const chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Disruption Score',
          data: scores,
          borderColor: lineColor,
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return 'transparent';
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, lineColor + '40');
            gradient.addColorStop(1, lineColor + '05');
            return gradient;
          },
          borderWidth: 3,
          pointBackgroundColor: lineColor,
          pointBorderColor: lineColor,
          pointRadius: 6,
          pointHoverRadius: 9,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1e293b',
            titleColor: COLORS.text,
            bodyColor: COLORS.text,
            borderColor: COLORS.grid,
            borderWidth: 1,
            callbacks: {
              label: function (ctx) {
                return 'Score: ' + ctx.parsed.y.toFixed(1);
              },
            },
          },
        },
        scales: {
          x: {
            grid: { color: COLORS.grid, lineWidth: 0.5 },
            ticks: {
              color: COLORS.text,
              font: { size: 13, weight: '600' },
            },
            border: { color: COLORS.grid },
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: COLORS.grid, lineWidth: 0.5 },
            ticks: {
              color: COLORS.subtle,
              stepSize: 20,
              font: { size: 11 },
            },
            border: { color: COLORS.grid },
          },
        },
      },
      plugins: [{
        // Data label plugin — render score above each point
        afterDatasetsDraw: function (chart) {
          const ctx = chart.ctx;
          const meta = chart.getDatasetMeta(0);
          ctx.save();
          ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = COLORS.text;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          meta.data.forEach(function (point, i) {
            ctx.fillText(scores[i].toFixed(1), point.x, point.y - 10);
          });
          ctx.restore();
        },
      }],
    });

    chartInstances[containerId] = chart;
  }

  // ── Task Table (HTML) ─────────────────────────────────────────────────

  function renderTaskTable(containerId, taskData) {
    const container = clearContainer(containerId);
    if (!container) return;

    if (!taskData || taskData.length === 0) {
      container.innerHTML = '<p style="color:' + COLORS.subtle + ';text-align:center;">No task data available.</p>';
      return;
    }

    const dims = ['H', 'M', 'V', 'B', 'R'];
    let sortCol = null;
    let sortAsc = true;
    let rows = taskData.slice();

    function impactLevel(val) {
      if (val >= 75) return 3;
      if (val >= 50) return 2;
      if (val >= 25) return 1;
      return 0;
    }

    function dimCellStyle(val) {
      const v = Math.max(0, Math.min(3, Math.round(val)));
      return 'background:' + IMPACT_COLORS[v] + ';color:' + (v >= 2 ? '#fff' : COLORS.subtle);
    }

    function impactCellStyle(val) {
      return 'background:' + getZoneColor(val) + '22;color:' + getZoneColor(val);
    }

    function rowBg(totalImpact) {
      return getZoneColor(totalImpact) + '08';
    }

    function build() {
      const table = document.createElement('table');
      table.className = 'diag-task-table';
      table.style.cssText = 'width:100%;border-collapse:collapse;font-size:13px;color:' + COLORS.text;

      // Header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      const columns = [
        { key: 'name', label: 'Task' },
        { key: 'category', label: 'Category' },
        { key: 'weight', label: 'Weight' },
        { key: 'A', label: 'A', dim: true },
        { key: 'C', label: 'C', dim: true },
        { key: 'P', label: 'P', dim: true },
        { key: 'T', label: 'T', dim: true },
        { key: 'D', label: 'D', dim: true },
        { key: 'totalImpact', label: 'Total Impact' },
      ];

      columns.forEach(function (col) {
        const th = document.createElement('th');
        th.textContent = col.label;
        th.style.cssText = 'padding:10px 8px;text-align:left;cursor:pointer;user-select:none;'
          + 'border-bottom:2px solid ' + COLORS.grid + ';color:' + COLORS.subtle
          + ';font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;'
          + 'white-space:nowrap;';
        if (col.dim) {
          th.title = DIMENSION_LABELS[col.key] || '';
          th.style.textAlign = 'center';
        }
        if (col.key === 'totalImpact') th.style.textAlign = 'center';
        if (col.key === 'weight') th.style.textAlign = 'center';

        // Sort arrow
        if (sortCol === col.key) {
          th.textContent += sortAsc ? ' \u25B2' : ' \u25BC';
          th.style.color = COLORS.accent;
        }

        th.addEventListener('click', function () {
          if (sortCol === col.key) {
            sortAsc = !sortAsc;
          } else {
            sortCol = col.key;
            sortAsc = true;
          }
          sort();
          container.innerHTML = '';
          container.appendChild(build());
        });

        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      rows.forEach(function (task) {
        const tr = document.createElement('tr');
        tr.style.cssText = 'background:' + rowBg(task.totalImpact) + ';transition:background .15s;';
        tr.addEventListener('mouseenter', function () { tr.style.background = getZoneColor(task.totalImpact) + '15'; });
        tr.addEventListener('mouseleave', function () { tr.style.background = rowBg(task.totalImpact); });

        const cellBase = 'padding:8px;border-bottom:1px solid ' + COLORS.grid + '80;';

        // Task name
        const tdName = document.createElement('td');
        tdName.textContent = task.name;
        tdName.style.cssText = cellBase + 'font-weight:500;max-width:220px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        tr.appendChild(tdName);

        // Category
        const tdCat = document.createElement('td');
        tdCat.textContent = task.category || '—';
        tdCat.style.cssText = cellBase + 'color:' + COLORS.subtle + ';';
        tr.appendChild(tdCat);

        // Weight
        const tdW = document.createElement('td');
        tdW.textContent = typeof task.weight === 'number' ? task.weight.toFixed(1) : task.weight;
        tdW.style.cssText = cellBase + 'text-align:center;color:' + COLORS.subtle + ';';
        tr.appendChild(tdW);

        // Dimension scores
        dims.forEach(function (d) {
          const td = document.createElement('td');
          const val = (task.scores && task.scores[d]) != null ? task.scores[d] : 0;
          td.textContent = val;
          td.style.cssText = cellBase + 'text-align:center;font-weight:600;border-radius:0;' + dimCellStyle(val);
          tr.appendChild(td);
        });

        // Total Impact
        const tdImp = document.createElement('td');
        tdImp.textContent = typeof task.totalImpact === 'number' ? task.totalImpact.toFixed(1) : task.totalImpact;
        tdImp.style.cssText = cellBase + 'text-align:center;font-weight:700;' + impactCellStyle(task.totalImpact);
        tr.appendChild(tdImp);

        tbody.appendChild(tr);
      });
      table.appendChild(tbody);

      // Wrapper for horizontal scroll on small screens
      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'overflow-x:auto;-webkit-overflow-scrolling:touch;';
      wrapper.appendChild(table);
      return wrapper;
    }

    function sort() {
      if (!sortCol) return;
      rows.sort(function (a, b) {
        let va, vb;
        if (dims.includes(sortCol)) {
          va = (a.scores && a.scores[sortCol]) != null ? a.scores[sortCol] : 0;
          vb = (b.scores && b.scores[sortCol]) != null ? b.scores[sortCol] : 0;
        } else {
          va = a[sortCol] != null ? a[sortCol] : '';
          vb = b[sortCol] != null ? b[sortCol] : '';
        }
        if (typeof va === 'string') {
          return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return sortAsc ? va - vb : vb - va;
      });
    }

    container.appendChild(build());
  }

  // ── Update All ────────────────────────────────────────────────────────

  function updateAll(results) {
    if (!results) return;

    // Destroy all existing Chart.js instances
    Object.keys(chartInstances).forEach(destroyChart);

    if (results.overallScore != null) {
      renderGauge(
        'gauge-container',
        results.overallScore,
        results.riskZone || getZoneLabel(results.overallScore)
      );
    }

    if (results.impactScores) {
      renderRadar('radar-container', results.impactScores);
    }

    if (results.timeline) {
      renderTimeline('timeline-container', results.timeline);
    }

    if (results.tasks) {
      renderTaskTable('task-table-container', results.tasks);
    }
  }

  // ── Public API ────────────────────────────────────────────────────────

  window.DiagnosticCharts = {
    renderGauge: renderGauge,
    renderRadar: renderRadar,
    renderTimeline: renderTimeline,
    renderTaskTable: renderTaskTable,
    updateAll: updateAll,
    getZoneColor: getZoneColor,
    getZoneLabel: getZoneLabel,
  };
})();
