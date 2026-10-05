// js/dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const user = localStorage.getItem('user') || 'admin';

  if (isLoggedIn !== 'true') {
    window.location.href = 'index.html';
    return;
  }

  const userNameSpan = document.getElementById('userName');
  if (userNameSpan) userNameSpan.textContent = user;

  const navUsername = document.getElementById('navUsername');
  if (navUsername) navUsername.textContent = user;

  const performLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  };

  const logoutBtn = document.getElementById('logout-btn');
  const sidebarLogout = document.getElementById('sidebarLogout');
  const logoutLink = document.getElementById('logoutLink');

  if (logoutBtn) logoutBtn.addEventListener('click', performLogout);
  if (sidebarLogout) sidebarLogout.addEventListener('click', performLogout);
  if (logoutLink) logoutLink.addEventListener('click', performLogout);

  await window.dataManager.initializeData();

  function renderTable() {
    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    const data = window.dataManager.getProducts();
    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-3">No student records found.</td></tr>`;
      return;
    }

    data.forEach(item => {
      const row = document.createElement('tr');
      let badgeClass = 'bg-success';
      let statusText = 'Passing';
      
      if (item.status === 'low stock') {
        badgeClass = 'bg-warning text-dark';
        statusText = 'Warning';
        row.classList.add('table-warning');
      } else if (item.status === 'out of stock') {
        badgeClass = 'bg-danger';
        statusText = 'Failing';
        row.classList.add('table-danger');
      }

      row.innerHTML = `
        <td>${item.id}</td>
        <td class="fw-bold">${item.name}</td>
        <td class="text-danger small">${item.sku}</td>
        <td>${item.category}</td>
        <td>₱${parseFloat(item.price).toFixed(2)}</td>
        <td>${item.stock}%</td>
        <td><span class="badge ${badgeClass}">${statusText}</span></td>
      `;
      tbody.appendChild(row);
    });
  }

  function renderActivityLog() {
    const tbody = document.getElementById('activityTableBody');
    if (!tbody) return;

    const logs = window.dataManager.getActivityLogs();
    if (logs.length === 0) return;

    tbody.innerHTML = logs.map(log => `
      <tr>
        <td>${log.time}</td>
        <td>${log.name}</td>
        <td><span class="badge bg-${log.type}">${log.action}</span></td>
        <td>Updated (${log.newStock}%)</td>
      </tr>
    `).join('');
  }

  function updateCardsAndAlerts() {
    const stats = window.dataManager.getStockStatistics();
    
    const totalVal = document.getElementById('stat-total-value');
    if (totalVal) totalVal.textContent = `${stats.avgGrade}%`;

    const totalSub = document.getElementById('stat-total-products');
    if (totalSub) totalSub.textContent = stats.totalProducts;

    const warningEl = document.getElementById('warningCount');
    if (warningEl) warningEl.textContent = stats.lowStockCount;

    const failingEl = document.getElementById('failingCount');
    if (failingEl) failingEl.textContent = stats.outOfStockCount;

    const alertBanner = document.getElementById('alertBanner');
    const alertMessage = document.getElementById('alertMessage');
    if (alertBanner && alertMessage) {
      if (stats.lowStockCount > 0 || stats.outOfStockCount > 0) {
        alertMessage.textContent = `You have ${stats.lowStockCount} course(s) near passing threshold and ${stats.outOfStockCount} failing.`;
        alertBanner.classList.remove('d-none');
      } else {
        alertBanner.classList.add('d-none');
      }
    }
  }

  function updateCharts() {
    if (!window.chartManager) return;

    const products = window.dataManager.getProducts();
    const categorySummary = window.dataManager.getCategorySummary();
    const stats = window.dataManager.getStockStatistics();

    const categoryLabels = Object.keys(categorySummary);
    const categoryAvgGrades = categoryLabels.map(cat => {
      const catData = categorySummary[cat];
      return (catData.totalStock / catData.count).toFixed(1);
    });

    window.chartManager.initGeneralOverviewChart(
      'generalLineChart', 
      ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'], 
      [85, 87, 89, 88, 91, parseFloat(stats.avgGrade)]
    );

    window.chartManager.initInventoryBarChart(
      'categoryValueChart', 
      categoryLabels, 
      categoryAvgGrades
    );

    const statusCounts = [
      products.filter(p => p.status === 'in stock').length,
      stats.lowStockCount,
      stats.outOfStockCount
    ];
    window.chartManager.initStatusDoughnutChart(
      'stockStatusChart', 
      statusCounts
    );

    const sorted = [...products].sort((a, b) => b.stock - a.stock).slice(0, 5);
    window.chartManager.initTopProductsChart(
      'topProductsChart', 
      sorted.map(p => p.name), 
      sorted.map(p => p.stock)
    );
  }

  function renderDashboard() {
    renderTable();
    updateCardsAndAlerts();
    updateCharts();
    renderActivityLog();
  }

  renderDashboard();

  setInterval(() => {
    try {
      window.dataManager.simulateDataChange();
      renderDashboard();
    } catch (e) {
      console.error('Simulation error handled:', e);
    }
  }, 3500);
});