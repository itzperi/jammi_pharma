"use client";

import React, { useState, useEffect } from 'react';
import { subscribeToCollection } from '../../../lib/adminDb';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
  items: any[];
}

const ReportsPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('all'); // 'all', 'month', 'week'

  useEffect(() => {
    const unsubscribe = subscribeToCollection('orders', (data: any[]) => {
      setOrders(data as Order[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filterOrders = () => {
    if (dateRange === 'all') return orders;
    
    const now = new Date();
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      if (dateRange === 'week') {
        const threshold = new Date(now.setDate(now.getDate() - 7));
        return orderDate >= threshold;
      }
      if (dateRange === 'month') {
        const threshold = new Date(now.setMonth(now.getMonth() - 1));
        return orderDate >= threshold;
      }
      return true;
    });
    return filtered;
  };

  const filteredOrders = filterOrders();

  // Metrics calculation
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalOrdersCount = filteredOrders.length;
  const averageOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount) : 0;

  const getTopProducts = () => {
    const productCounts: Record<string, {name: string, quantity: number, revenue: number}> = {};
    
    filteredOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (!productCounts[item.productId]) {
            productCounts[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
          }
          const qty = item.quantity || 1;
          const price = item.price || 0;
          productCounts[item.productId].quantity += qty;
          productCounts[item.productId].revenue += (qty * price);
        });
      }
    });

    return Object.values(productCounts)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(34, 56, 33); // text-forest roughly
    doc.text('Jammi Pharmacy - Sales Report', 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Period: ${dateRange === 'all' ? 'All Time' : dateRange === 'month' ? 'Last 30 Days' : 'Last 7 Days'}`, 14, 34);

    // Summary Metrics
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(14, 42, 180, 25, 3, 3, 'FD');
    
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text('Total Revenue', 20, 52);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rs. ${totalRevenue.toLocaleString()}`, 20, 60);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text('Total Orders', 85, 52);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${totalOrdersCount}`, 85, 60);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text('Avg Order Value', 140, 52);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`Rs. ${Math.round(averageOrderValue).toLocaleString()}`, 140, 60);

    // Top Products Table
    doc.setFontSize(14);
    doc.setTextColor(34, 56, 33);
    doc.text('Top Selling Products', 14, 80);

    autoTable(doc, {
      startY: 85,
      head: [['Product Name', 'Quantity Sold', 'Revenue Generated']],
      body: topProducts.map(p => [p.name, p.quantity.toString(), `Rs. ${p.revenue.toLocaleString()}`]),
      headStyles: { fillColor: [54, 86, 53] }, // matching primary/forest
      alternateRowStyles: { fillColor: [250, 248, 241] }, // matching cream
      margin: { top: 10, left: 14, right: 14 }
    });

    // Recent Orders Table
    const nextY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.setTextColor(34, 56, 33);
    doc.text('Order History', 14, nextY);

    const tableData = filteredOrders.map(order => [
      order.orderNumber,
      new Date(order.createdAt).toLocaleDateString(),
      order.customerName,
      `Rs. ${order.total.toLocaleString()}`,
      order.status
    ]);

    autoTable(doc, {
      startY: nextY + 5,
      head: [['Order ID', 'Date', 'Customer', 'Amount', 'Status']],
      body: tableData,
      headStyles: { fillColor: [54, 86, 53] },
      alternateRowStyles: { fillColor: [250, 248, 241] },
      margin: { top: 10, left: 14, right: 14 }
    });

    // Save PDF
    doc.save(`Jammi_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold serif text-forest mb-2">Sales Reports</h1>
          <p className="text-slate-600">Analyze performance and generate structured PDF reports.</p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={dateRange} 
            onChange={e => setDateRange(e.target.value)}
            className="border-cream-dark rounded-xl px-4 py-2.5 bg-white text-sm font-bold text-slate-700 focus:ring-primary shadow-sm outline-none"
          >
            <option value="all">All Time</option>
            <option value="month">Last 30 Days</option>
            <option value="week">Last 7 Days</option>
          </select>

          <button 
            onClick={generatePDF}
            className="bg-primary hover:bg-[#c07a28] text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined">picture_as_pdf</span>
            Export to PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-cream-dark shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-forest">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-cream-dark shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-forest">{totalOrdersCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-cream-dark shadow-sm">
          <p className="text-sm font-bold text-slate-500 mb-2">Average Order Value</p>
          <p className="text-3xl font-bold text-forest">₹{Math.round(averageOrderValue).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Products */}
        <div className="lg:col-span-1 border border-cream-dark rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-cream-dark bg-cream/20 font-bold text-forest serif text-lg">
            Top Performing Products
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4">
            {topProducts.length === 0 ? (
              <p className="text-slate-500 text-sm text-center">No sales data available.</p>
            ) : (
              topProducts.map((p, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex-1 pr-4">
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">{p.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.quantity} sold</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-primary">₹{p.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 border border-cream-dark rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-cream-dark bg-cream/20 font-bold text-forest serif text-lg flex justify-between items-center">
            <span>Recent Orders</span>
            <span className="text-xs font-normal text-slate-500 font-sans tracking-wide uppercase">{filteredOrders.length} items</span>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-cream-dark text-slate-600 text-sm">
                  <th className="p-4 font-bold">Order ID</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Customer</th>
                  <th className="p-4 font-bold">Amount</th>
                  <th className="p-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No orders found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.slice(0, 10).map((order) => (
                    <tr key={order.id} className="border-b border-cream-dark hover:bg-cream/10 transition-colors">
                      <td className="p-4 text-sm font-bold text-primary">{order.orderNumber}</td>
                      <td className="p-4 text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-slate-800">{order.customerName}</td>
                      <td className="p-4 text-sm font-bold text-forest">₹{order.total.toLocaleString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
