"use client";
import React, { useState, useEffect } from 'react';
import { subscribeToCollection } from '../../../lib/adminDb';
import dynamic from 'next/dynamic';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(
  () => import('recharts').then((mod) => mod.LineChart),
  { ssr: false }
);
const Line = dynamic(
  () => import('recharts').then((mod) => mod.Line),
  { ssr: false }
);
const XAxis = dynamic(
  () => import('recharts').then((mod) => mod.XAxis),
  { ssr: false }
);
const YAxis = dynamic(
  () => import('recharts').then((mod) => mod.YAxis),
  { ssr: false }
);
const CartesianGrid = dynamic(
  () => import('recharts').then((mod) => mod.CartesianGrid),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('recharts').then((mod) => mod.Tooltip),
  { ssr: false }
);

interface Order {
  id: string;
  orderNumber?: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus?: string;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customerCount, setCustomerCount] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly'>('monthly');

  useEffect(() => {
    const unsubOrders = subscribeToCollection('orders', (data) => {
      const fetchedOrders = data as Order[];
      setOrders(fetchedOrders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
    });
    
    const unsubProducts = subscribeToCollection('products', (data) => {
      const fetchedProducts = data as Product[];
      setLowStockProducts(fetchedProducts.filter(p => Number(p.stock) < 10));
    });

    const unsubCustomers = subscribeToCollection('customers', (data) => {
      setCustomerCount(data.length);
    });

    return () => {
      unsubOrders();
      unsubProducts();
      unsubCustomers();
    };
  }, []);

  const paidOrders = orders.filter(o => o.paymentStatus === 'Paid');
  const totalSales = paidOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const totalOrdersCount = orders.length;
  const newCustomers = customerCount; 

  // Generate real-time chart data from orders
  const generateChartData = () => {
    const monthlyData: Record<string, number> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Initialize current year months up to current month with 0
    const currentMonth = new Date().getMonth();
    for (let i = 0; i <= currentMonth; i++) {
        monthlyData[months[i]] = 0;
    }

    paidOrders.forEach(order => {
        if (!order.createdAt) return;
        const date = new Date(order.createdAt);
        if (date.getFullYear() === new Date().getFullYear()) {
            const monthName = months[date.getMonth()];
            monthlyData[monthName] = (monthlyData[monthName] || 0) + Number(order.total || 0);
        }
    });

    return Object.keys(monthlyData).map(key => ({
        name: key,
        revenue: monthlyData[key]
    }));
  };
  const chartData = generateChartData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h1>
        <div className="flex bg-slate-200 rounded-lg p-1">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${timeframe === 'weekly' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setTimeframe('weekly')}
          >
            Weekly
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${timeframe === 'monthly' ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            onClick={() => setTimeframe('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-sm font-bold uppercase tracking-wider">Total Sales</span>
            <span className="material-symbols-outlined text-saffron">payments</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">₹{totalSales.toLocaleString()}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-sm font-bold uppercase tracking-wider">Total Orders</span>
            <span className="material-symbols-outlined text-saffron">shopping_cart</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalOrdersCount}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-sm font-bold uppercase tracking-wider">New Customers</span>
            <span className="material-symbols-outlined text-saffron">group_add</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{newCustomers}</p>
          <span className="text-xs text-green-600 font-medium">+0% from last 30 days</span>
        </div>
      </div>

      {/* Chart and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Revenue Analysis</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(value) => `₹${value}`} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value: number) => [`₹${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-96">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex justify-between items-center border-b border-slate-100 pb-4">
            Low Stock Alerts
            <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-bold">{lowStockProducts.length}</span>
          </h2>
          <div className="flex-1 overflow-y-auto pr-2">
            {lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
                <span className="material-symbols-outlined text-4xl">inventory_2</span>
                <p className="text-sm font-medium">All products are well stocked.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {lowStockProducts.map(product => (
                  <li key={product.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-800 line-clamp-1" title={product.name}>{product.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Stock: <span className="text-red-500 font-bold">{product.stock} left</span></p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          <button className="text-saffron font-bold text-xs uppercase tracking-wider hover:text-yellow-600 transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-200">Order ID</th>
                <th className="p-4 font-bold border-b border-slate-200">Customer</th>
                <th className="p-4 font-bold border-b border-slate-200">Date</th>
                <th className="p-4 font-bold border-b border-slate-200">Amount</th>
                <th className="p-4 font-bold border-b border-slate-200">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <span className="material-symbols-outlined text-4xl">shopping_bag</span>
                      <p className="font-medium">No recent orders found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4 font-medium text-slate-900">#{order.orderNumber || order.id.substring(0, 8).toUpperCase()}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-medium text-slate-900">₹{Number(order.total).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status || 'Pending'}
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
  );
}
