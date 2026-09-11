document.addEventListener('DOMContentLoaded', async () => {
  await dataManager.initializeData();
  renderDashboard();

  document.getElementById('searchInput')?.addEventListener('input', renderDashboard);
  document.getElementById('categoryFilter')?.addEventListener('change', renderDashboard);
  document.getElementById('statusFilter')?.addEventListener('change', renderDashboard);
  document.getElementById('minPriceInput')?.addEventListener('input', renderDashboard);
  document.getElementById('maxPriceInput')?.addEventListener('input', renderDashboard);

  document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('categoryFilter').value = 'ALL';
    document.getElementById('statusFilter').value = 'ALL';
    document.getElementById('minPriceInput').value = '';
    document.getElementById('maxPriceInput').value = '';
    renderDashboard();
  });

  document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    const currentData = getFilteredData();
    dataManager.exportToCSV(currentData);
  });

  setInterval(() => {
    const updatedProduct = dataManager.simulateRealTimeUpdate();
    if (updatedProduct) {
      renderDashboard();
      console.log(`[Real-Time Update] ${updatedProduct.name} quantity updated to ${updatedProduct.quantity}`);
    }
  }, 10000);
});

function getFilteredData() {
  const query = document.getElementById('searchInput')?.value || '';
  const category = document.getElementById('categoryFilter')?.value || 'ALL';
  const status = document.getElementById('statusFilter')?.value || 'ALL';
  const minPrice = parseFloat(document.getElementById('minPriceInput')?.value) || 0;
  const maxPrice = parseFloat(document.getElementById('maxPriceInput')?.value) || Infinity;

  return dataManager.filterProducts(query, category, status, minPrice, maxPrice);
}

function renderDashboard() {
  const filteredProducts = getFilteredData();
  const allProducts = dataManager.getProducts();

  const tbody = document.getElementById('inventoryTableBody');
  if (tbody) {
    if (filteredProducts.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted">No matching products found.</td></tr>`;
    } else {
      tbody.innerHTML = filteredProducts.map(p => {
        let badgeClass = 'bg-success';
        if (p.status === 'Low Stock') badgeClass = 'bg-warning text-dark';
        if (p.status === 'Out of Stock') badgeClass = 'bg-danger';

        return `
          <tr>
            <td>${p.id}</td>
            <td class="fw-bold">${p.name}</td>
            <td><code>${p.sku}</code></td>
            <td>${p.category}</td>
            <td>₱${p.price.toFixed(2)}</td>
            <td>${p.quantity}</td>
            <td><span class="badge ${badgeClass}">${p.status}</span></td>
          </tr>
        `;
      }).join('');
    }
  }

  const lowStockCount = allProducts.filter(p => p.status === 'Low Stock').length;
  const outOfStockCount = allProducts.filter(p => p.status === 'Out of Stock').length;
  const totalValue = allProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  document.getElementById('totalProductsCount').textContent = allProducts.length;
  document.getElementById('lowStockCount').textContent = lowStockCount;
  document.getElementById('outOfStockCount').textContent = outOfStockCount;
  document.getElementById('totalInventoryValue').textContent = `₱${totalValue.toLocaleString('en-US', {minimumFractionDigits: 2})}`;

  const alertBanner = document.getElementById('alertBanner');
  if (alertBanner) {
    if (lowStockCount > 0 || outOfStockCount > 0) {
      alertBanner.classList.remove('d-none');
    } else {
      alertBanner.classList.add('d-none');
    }
  }

  const categories = ['Electronics', 'Furniture', 'Stationery'];
  const categoryValues = categories.map(cat => {
    return allProducts
      .filter(p => p.category === cat)
      .reduce((sum, p) => sum + (p.price * p.quantity), 0);
  });

  const inStock = allProducts.filter(p => p.status === 'In Stock').length;
  const lowStock = lowStockCount;
  const outOfStock = outOfStockCount;

  chartManager.initInventoryBarChart('inventoryBarChart', categories, categoryValues);
  chartManager.initStatusDoughnutChart('statusDoughnutChart', [inStock, lowStock, outOfStock]);
  chartManager.initTopProductsChart('topProductsChart', allProducts);
}