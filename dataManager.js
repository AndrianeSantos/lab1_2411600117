window.dataManager = (function() {
  let products = [];

  const defaultProducts = [
    { id: 101, name: "Laptop Pro", sku: "ELE-001", category: "Electronics", price: 45000, quantity: 15, status: "In Stock" },
    { id: 102, name: "Wireless Mouse", sku: "ELE-002", category: "Electronics", price: 750, quantity: 4, status: "Low Stock" },
    { id: 103, name: "Office Chair", sku: "FUR-001", category: "Furniture", price: 3500, quantity: 0, status: "Out of Stock" },
    { id: 104, name: "Wooden Desk", sku: "FUR-002", category: "Furniture", price: 8500, quantity: 8, status: "In Stock" },
    { id: 105, name: "Notebook A5", sku: "STA-001", category: "Stationery", price: 120, quantity: 50, status: "In Stock" }
  ];

  return {
    async initializeData() {
      try {
        const endpoint = (typeof CONFIG !== 'undefined' && CONFIG.API_ENDPOINT) ? CONFIG.API_ENDPOINT : 'api/products.php';
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        products = (Array.isArray(data) && data.length > 0) ? data : defaultProducts;
      } catch (error) {
        console.warn('API Fetch failed, using default inventory data:', error);
        products = defaultProducts;
      }
      return products;
    },

    getProducts() {
      return products;
    },

    // Real-Time Simulation: Randomly binabawasan o dinadagdagan ang quantity
    simulateRealTimeUpdate() {
      if (products.length === 0) return null;
      
      const randomIndex = Math.floor(Math.random() * products.length);
      const product = products[randomIndex];
      const change = Math.floor(Math.random() * 5) - 2; // Value mula -2 hanggang +2
      
      product.quantity = Math.max(0, product.quantity + change);
      
      // Update status base sa bagong quantity
      if (product.quantity === 0) {
        product.status = 'Out of Stock';
      } else if (product.quantity <= 5) {
        product.status = 'Low Stock';
      } else {
        product.status = 'In Stock';
      }

      return product;
    },

    filterProducts(query, category, status, minPrice, maxPrice) {
      return products.filter(p => {
        const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === 'ALL' || p.category === category;
        const matchesStatus = status === 'ALL' || p.status === status;
        const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
        return matchesQuery && matchesCategory && matchesStatus && matchesPrice;
      });
    },

    exportToCSV(data) {
      let csvContent = "data:text/csv;charset=utf-8,ID,Name,SKU,Category,Price,Quantity,Status\n";
      data.forEach(p => {
        csvContent += `${p.id},"${p.name}",${p.sku},${p.category},${p.price},${p.quantity},${p.status}\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "inventory_report.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
})();