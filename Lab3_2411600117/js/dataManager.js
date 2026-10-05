class DataManager {
  constructor() {
    this.products = [];
    this.activityLogs = [];
  }

  async initializeData() {
    try {
      const response = await fetch('api/data.json');
      if (response.ok) {
        this.products = await response.json();
      } else {
        throw new Error('Failed to load JSON');
      }
    } catch (error) {
      const savedData = localStorage.getItem('student_grade_data');
      if (savedData) {
        this.products = JSON.parse(savedData);
      } else {
        this.products = this.getDefaultData();
      }
    }
  }

  getProducts() {
    return this.products || [];
  }

  filterProducts(query = '', category = 'ALL', status = 'ALL', minPrice = 0, maxPrice = Infinity) {
    const minP = isNaN(parseFloat(minPrice)) ? 0 : parseFloat(minPrice);
    const maxP = isNaN(parseFloat(maxPrice)) || maxPrice === 0 ? Infinity : parseFloat(maxPrice);

    return this.products.filter(product => {
      const matchesSearch = query === '' || 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.sku.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = category === 'ALL' || product.category === category;
      const matchesStatus = status === 'ALL' || product.status === status;
      const matchesPrice = Number(product.price) >= minP && Number(product.price) <= maxP;

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });
  }

  getStockStatistics() {
    const totalProducts = this.products.length;
    

    const lowStockCount = this.products.filter(p => p.status === 'low stock').length;
    const outOfStockCount = this.products.filter(p => p.status === 'out of stock').length;
    const avgGrade = this.products.reduce((sum, p) => sum + Number(p.stock), 0) / (totalProducts || 1);

    return {
      totalProducts,
      lowStockCount,
      outOfStockCount, 
      avgGrade: avgGrade.toFixed(1)
    };
  }

  getCategorySummary() {
    const summary = {};
    this.products.forEach(p => {
      if (!summary[p.category]) {
        summary[p.category] = { totalStock: 0, count: 0 };
      }
      summary[p.category].totalStock += Number(p.stock);
      summary[p.category].count += 1;
    });
    return summary;
  }

  simulateDataChange() {
    if (!this.products || this.products.length === 0) return;

    const randomIndex = Math.floor(Math.random() * this.products.length);
    const product = this.products[randomIndex];
    
    let change = Math.floor(Math.random() * 5) - 2; 
    if (change === 0) change = 1; 

    product.stock = Math.min(100, Math.max(50, Number(product.stock) + change));
    
    if (product.stock < 75) {
      product.status = 'out of stock'; // Failing
    } else if (product.stock <= product.reorderLevel) {
      product.status = 'low stock'; // Warning
    } else {
      product.status = 'in stock'; // Passing
    }

    const log = {
      time: new Date().toLocaleTimeString(),
      name: product.name,
      action: change > 0 ? `+${change}% Grade Increase` : `${change}% Grade Decrease`,
      newStock: product.stock,
      type: change > 0 ? 'success' : 'danger'
    };

    if (!this.activityLogs) this.activityLogs = [];
    this.activityLogs.unshift(log);
    if (this.activityLogs.length > 5) this.activityLogs.pop();
  }

  getActivityLogs() {
    return this.activityLogs || [];
  }

  getDefaultData() {
    return [
      { id: 1, name: "Web Development 2", sku: "CS-101", category: "Core CS", price: 3, stock: 95, reorderLevel: 75, status: "in stock" },
      { id: 2, name: "Database Systems", sku: "CS-102", category: "Core CS", price: 3, stock: 72, reorderLevel: 75, status: "low stock" },
      { id: 3, name: "Data Structures", sku: "CS-103", category: "Core CS", price: 4, stock: 88, reorderLevel: 75, status: "in stock" },
      { id: 4, name: "Software Engineering", sku: "CS-104", category: "Elective", price: 3, stock: 60, reorderLevel: 75, status: "out of stock" },
      { id: 5, name: "Network Admin", sku: "CS-105", category: "Networking", price: 3, stock: 74, reorderLevel: 75, status: "low stock" },
      { id: 6, name: "Ethics in IT", sku: "GE-101", category: "General Ed", price: 3, stock: 92, reorderLevel: 75, status: "in stock" }
    ];
  }
}

window.dataManager = new DataManager();