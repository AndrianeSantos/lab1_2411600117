class ChartManager {
  constructor() {
    this.charts = {};
  }

  initGeneralOverviewChart(canvasId, labels, data) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].data.labels = labels;
      this.charts[canvasId].data.datasets[0].data = [...data];
      this.charts[canvasId].update('active'); // Dynamic live animation
      return;
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Performance Progress (%)',
          data: [...data],
          backgroundColor: 'rgba(13, 110, 253, 0.15)',
          borderColor: '#0d6efd',
          borderWidth: 3,
          fill: true,
          tension: 0.35,
          pointRadius: 5,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: true, position: 'top' } },
        scales: {
          y: { beginAtZero: false, min: 70, max: 100 },
          x: { grid: { display: false } }
        }
      }
    });
  }

  initInventoryBarChart(canvasId, labels, data) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].data.labels = labels;
      this.charts[canvasId].data.datasets[0].data = [...data];
      this.charts[canvasId].update('active');
      return;
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Grade Value',
          data: [...data],
          backgroundColor: '#0d6efd',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } }
      }
    });
  }

  initStatusDoughnutChart(canvasId, data) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].data.datasets[0].data = [...data];
      this.charts[canvasId].update('active');
      return;
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Passing', 'Warning', 'Failing'],
        datasets: [{
          data: [...data],
          backgroundColor: ['#198754', '#ffc107', '#dc3545'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  initTopProductsChart(canvasId, labels, data) {
    if (this.charts[canvasId]) {
      this.charts[canvasId].data.labels = labels;
      this.charts[canvasId].data.datasets[0].data = [...data];
      this.charts[canvasId].update('active');
      return;
    }

    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    this.charts[canvasId] = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Grade (%)',
          data: [...data],
          backgroundColor: '#0dcaf0'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, max: 100 } }
      }
    });
  }
}

window.chartManager = new ChartManager();