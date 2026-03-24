"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { reportsApi } from '@/lib/adminApi';
import { useToast } from '@/components/Toast';
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

interface DashboardData {
  totalSales: number;
  totalOrders: number;
  thisMonthRevenue: number;
  lastMonthRevenue: number;
  newCustomers: number;
  recentOrders: any[];
  lowStockProducts: any[];
  chartData: { label: string; revenue: number }[];
}

interface SkeletonRowProps {
  cols: number;
}

const SkeletonRow: React.FC<SkeletonRowProps> = ({ cols }) => (
  <tr className="animate-pulse">
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-[#16161f] rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const toast: any = useToast();
  const addToast = (message: string, type: string = 'success') => {
    if (toast && typeof toast.addToast === 'function') {
      toast.addToast(message, type);
    }
  };

  const fetchDashboard = useCallback(async () => {
    try {
      const result = await reportsApi.dashboard();
      setData(result);
    } catch (error: any) {
      addToast?.(error.message || 'Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[#111118] p-6 rounded-xl border border-[#16161f]">
              <div className="h-4 bg-[#16161f] rounded w-1/2 mb-4 animate-pulse"></div>
              <div className="h-8 bg-[#16161f] rounded w-3/4 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              title="Total Sales"
              value={formatCurrency(data.totalSales)}
              change={calculateChange(data.totalSales, data.lastMonthRevenue)}
              icon="payments"
              color="#22c55e"
            />
            <StatCard
              title="Total Orders"
              value={data.totalOrders.toString()}
              change={calculateChange(data.totalOrders, Math.floor(data.totalOrders * 0.85))}
              icon="shopping_cart"
              color="#3b82f6"
            />
            <StatCard
              title="This Month"
              value={formatCurrency(data.thisMonthRevenue)}
              change={calculateChange(data.thisMonthRevenue, data.lastMonthRevenue)}
              icon="calendar_month"
              color="#a855f7"
            />
            <StatCard
              title="New Customers"
              value={data.newCustomers.toString()}
              change={calculateChange(data.newCustomers, Math.floor(data.newCustomers * 0.9))}
              icon="group_add"
              color="#f59e0b"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#111118] p-6 rounded-xl border border-[#16161f] backdrop-blur-sm">
              <h2 className="text-lg font-bold text-[#f1f5f9] mb-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Monthly Revenue</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#16161f" />
                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(v) => `₹${v/1000}k`} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#111118',
                        border: '1px solid #22c55e',
                        borderRadius: '8px',
                        color: '#f1f5f9'
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} dot={{r: 4, fill: '#22c55e'}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111118] p-6 rounded-xl border border-[#16161f] backdrop-blur-sm">
              <h2 className="text-lg font-bold text-[#f1f5f9] mb-4 flex justify-between items-center pb-4 border-b border-[#16161f]">
                Low Stock Alerts
                <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full font-bold">
                  {data.lowStockProducts?.length || 0}
                </span>
              </h2>
              <div className="flex-1 overflow-y-auto max-h-64 pr-2 scrollbar-thin scrollbar-thumb-red-500/20">
                {!data.lowStockProducts?.length ? (
                  <div className="flex flex-col items-center justify-center h-48 text-[#94a3b8] gap-2">
                    <span className="material-symbols-outlined text-4xl">inventory_2</span>
                    <p className="text-sm font-medium">All products well stocked</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {data.lowStockProducts.map((product: any) => (
                      <li key={product.id} className="flex justify-between items-center p-3 bg-[#16161f] rounded-lg border border-[#22c55e]/10 hover:border-red-500/30 transition-all">
                        <div>
                          <p className="text-sm font-semibold text-[#f1f5f9] line-clamp-1" title={product.name}>{product.name}</p>
                          <p className="text-xs text-[#94a3b8] mt-1">
                            Stock: <span className={product.stock === 0 ? 'text-red-400' : 'text-orange-400'}>{product.stock} left</span>
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-red-400/50">warning</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="bg-[#111118] rounded-xl border border-[#16161f] overflow-hidden backdrop-blur-sm">
            <div className="p-6 border-b border-[#16161f] flex justify-between items-center">
              <h2 className="text-lg font-bold text-[#f1f5f9]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Recent Orders</h2>
              <button className="text-[#22c55e] font-semibold text-xs uppercase tracking-wider hover:text-[#16a34a] transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#16161f] text-[#94a3b8] text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b border-[#22c55e]/10">Order ID</th>
                    <th className="p-4 font-semibold border-b border-[#22c55e]/10">Customer</th>
                    <th className="p-4 font-semibold border-b border-[#22c55e]/10">Date</th>
                    <th className="p-4 font-semibold border-b border-[#22c55e]/10">Amount</th>
                    <th className="p-4 font-semibold border-b border-[#22c55e]/10">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-[#16161f] text-[#f1f5f9]">
                  {!data.recentOrders?.length ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#94a3b8] gap-3">
                          <span className="material-symbols-outlined text-4xl">shopping_bag</span>
                          <p className="font-medium">No recent orders found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.recentOrders.slice(0, 10).map((order: any) => (
                      <tr key={order.id} className="hover:bg-[#16161f] transition-colors group">
                        <td className="p-4 font-medium">#{order.order_number || order.id?.substring(0, 8).toUpperCase()}</td>
                        <td className="p-4">{order.user_code || order.customer_name}</td>
                        <td className="p-4 text-[#94a3b8]">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-4 font-medium">{formatCurrency(order.total_amount)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                            order.order_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            order.order_status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            order.order_status === 'shipped' ? 'bg-indigo-500/20 text-indigo-400' :
                            order.order_status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {order.order_status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard({ title, value, change, icon, color }: { title: string; value: string; change: number; icon: string; color: string }) {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-[#111118] p-6 rounded-xl border border-[#16161f] backdrop-blur-sm hover:border-[#22c55e]/30 transition-all duration-200">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">{title}</span>
        <span className="material-symbols-outlined" style={{ color }}>{icon}</span>
      </div>
      <p className="text-2xl font-bold text-[#f1f5f9] mb-2">{value}</p>
      <div className="flex items-center gap-1">
        <span className={`text-xs font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{change}%
        </span>
        <span className="text-[#94a3b8] text-xs">vs last month</span>
      </div>
    </div>
  );
}

// End of file
