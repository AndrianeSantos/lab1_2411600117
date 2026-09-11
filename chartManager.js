window.chartManager = (function() {
  let barChartInstance = null;
  let doughnutChartInstance = null;
  let topProductsChartInstance = null;

  return {
    initInventoryBarChart(canvasId, categories, values) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;

      if (barChartInstance) barChartInstance.destroy();

      barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: categories,
          datasets: [{
            label: 'Total Value (₱)',
            data: values,
            backgroundColor: 'rgba(13, 110, 253, 0.75)',
            borderColor: '#0d6efd',
            borderWidth: 1.5
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { y: { beginAtZero: true } }
        }
      });
    },

    initStatusDoughnutChart(canvasId, statusCounts) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;

      if (doughnutChartInstance) doughnutChartInstance.destroy();

      doughnutChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['In Stock', 'Low Stock', 'Out of Stock'],
          datasets: [{
            data: statusCounts,
            backgroundColor: ['#198754', '#ffc107', '#dc3545']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    },

    initTopProductsChart(canvasId, products) {
      const ctx = document.getElementById(canvasId);
      if (!ctx) return;

      if (topProductsChartInstance) topProductsChartInstance.destroy();

      const top5 = [...products]
        .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
        .slice(0, 5);

      const labels = top5.map(p => p.name);
      const values = top5.map(p => p.price * p.quantity);

      topProductsChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Value (₱)',
            data: values,
            backgroundColor: 'rgba(25, 135, 84, 0.75)',
            borderColor: '#198754',
            borderWidth: 1.5
          }]
        },
        options: {
          indexAxis: 'y', // Ginagawang Horizontal Bar Chart
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { beginAtZero: true } }
        }
      });
    }
  };
})();