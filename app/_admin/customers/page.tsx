"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, updateDocument } from '../../../lib/adminDb';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  status: 'Active' | 'Blocked' | 'Deactivated';
}

interface Order {
  id: string;
  customerId: string;
  total: number;
  status: string;
  createdAt: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const { subscribeToCollection } = require('../../../lib/adminDb');
    
    setIsLoading(true);
    
    const unsubCustomers = subscribeToCollection('customers', (data: any[]) => {
      setCustomers(data.sort((a, b) => new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime()));
      setIsLoading(false);
    });

    const unsubOrders = subscribeToCollection('orders', (data: any[]) => {
      setOrders(data);
    });

    return () => {
      unsubCustomers();
      unsubOrders();
    };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Customer['status']) => {
    if (confirm(`Change status to ${newStatus}?`)) {
      try {
        const { updateDocument } = require('../../../lib/adminDb');
        await updateDocument('customers', id, { status: newStatus });
        // Real-time listener will update the list
      } catch (err) {
        console.error("Error updating customer", err);
      }
    }
  };

  const filteredCustomers = customers.filter(c => {
    const term = search.toLowerCase();
    const matchesSearch = c.name?.toLowerCase().includes(term) || c.email?.toLowerCase().includes(term);
    const matchesStatus = statusFilter ? c.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const getCustomerOrders = (email: string) => {
    return orders.filter(o => o.email === email).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Customer Management</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-forest"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:border-forest bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
          <option value="Deactivated">Deactivated</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Phone</th>
                <th className="p-4 font-bold">Orders</th>
                <th className="p-4 font-bold">Total Spent</th>
                <th className="p-4 font-bold">Joined</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                     <span className="material-symbols-outlined text-4xl">group</span>
                     <p>No customers found.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{customer.name}</td>
                    <td className="p-4 text-slate-500">{customer.email}</td>
                    <td className="p-4">{customer.phone}</td>
                    <td className="p-4"><span className="inline-flex items-center justify-center bg-slate-100 font-bold w-6 h-6 rounded-md">{customer.totalOrders || 0}</span></td>
                    <td className="p-4 font-medium text-slate-900">₹{Number(customer.totalSpent || 0).toLocaleString()}</td>
                    <td className="p-4 text-slate-500">{new Date(customer.joinedDate).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                        customer.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        customer.status === 'Blocked' ? 'bg-red-100 text-red-800' : 'bg-slate-200 text-slate-800'
                      }`}>
                        {customer.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                       <button onClick={() => setSelectedCustomer(customer)} className="text-blue-600 hover:text-blue-800 px-3 py-1.5 border border-blue-200 hover:bg-blue-50 rounded text-xs font-bold transition-colors">
                         Profile
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Profile Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedCustomer(null)} />
          <div className="relative z-10 w-full max-w-4xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-forest text-white rounded-full flex items-center justify-center text-xl font-bold uppercase">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h2>
                  <p className="text-sm text-slate-500">Customer since {new Date(selectedCustomer.joinedDate).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                 <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Contact Info</h3>
                  <div className="text-sm text-slate-600 space-y-2">
                    <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">mail</span> {selectedCustomer.email}</p>
                    <p className="flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">call</span> {selectedCustomer.phone}</p>
                    <p className="flex items-start gap-2"><span className="material-symbols-outlined text-[16px] mt-0.5">home</span> <span className="flex-1 whitespace-pre-wrap">{selectedCustomer.address || 'No address provided'}</span></p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Value Summary</h3>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Orders</p>
                      <p className="text-2xl font-bold text-slate-800">{selectedCustomer.totalOrders || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Spent</p>
                      <p className="text-2xl font-bold text-saffron">₹{Number(selectedCustomer.totalSpent || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Account Actions</h3>
                  <div className="flex flex-col gap-2">
                    {selectedCustomer.status !== 'Blocked' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedCustomer.id, 'Blocked')}
                        className="w-full flex justify-between items-center px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded text-sm font-bold transition-colors"
                      >
                        Block Account
                        <span className="material-symbols-outlined text-[18px]">block</span>
                      </button>
                    )}
                    {selectedCustomer.status !== 'Deactivated' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedCustomer.id, 'Deactivated')}
                        className="w-full flex justify-between items-center px-4 py-2 border border-orange-200 text-orange-600 hover:bg-orange-50 rounded text-sm font-bold transition-colors"
                      >
                        Deactivate Account
                        <span className="material-symbols-outlined text-[18px]">person_off</span>
                      </button>
                    )}
                    {selectedCustomer.status !== 'Active' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedCustomer.id, 'Active')}
                        className="w-full flex justify-between items-center px-4 py-2 border border-green-200 text-green-600 hover:bg-green-50 rounded text-sm font-bold transition-colors"
                      >
                        Reactivate Account
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Order History</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="p-3 font-bold border-b border-slate-200">Order ID</th>
                        <th className="p-3 font-bold border-b border-slate-200">Date</th>
                        <th className="p-3 font-bold border-b border-slate-200">Total</th>
                        <th className="p-3 font-bold border-b border-slate-200">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {getCustomerOrders(selectedCustomer.email).length === 0 ? (
                        <tr><td colSpan={4} className="p-4 text-center text-slate-500">No orders yet.</td></tr>
                      ) : (
                        getCustomerOrders(selectedCustomer.email).map(order => (
                          <tr key={order.id} className="hover:bg-slate-50">
                            <td className="p-3 font-medium text-slate-800">#{order.orderNumber || order.id.substring(0,8).toUpperCase()}</td>
                            <td className="p-3 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="p-3 font-bold text-slate-800">₹{Number(order.total).toLocaleString()}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
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
        </div>
      )}
    </div>
  );
}
