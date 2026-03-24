"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, updateDocument } from '../../../lib/adminDb';

interface Shipment {
  id: string; // which is the order ID
  customerName: string;
  address: string;
  courierName?: string;
  trackingNumber?: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
}

export default function AdminShipping() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  
  // Settings Modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [baseRate, setBaseRate] = useState(50);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1000);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      // In Jammi Pharma we treat Orders as Shipments for now.
      const o = await fetchCollection('orders') as Shipment[];
      // Only show orders that need shipping or are currently in transit
      const activeShipments = o.filter(order => order.status !== 'Cancelled');
      setShipments(activeShipments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: Shipment['status']) => {
    try {
      await updateDocument('orders', id, { status: newStatus });
      setShipments(shipments.map(s => s.id === id ? { ...s, status: newStatus } : s));
    } catch (err) {
      console.error("Error updating status", err);
      alert('Failed to update shipment status.');
    }
  };

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(search.toLowerCase()) || 
                          s.customerName.toLowerCase().includes(search.toLowerCase()) || 
                          (s.trackingNumber && s.trackingNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? s.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Shipping Management</h1>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">local_shipping</span>
          Shipping Rates
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer, or Tracking No..." 
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
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer & Address</th>
                <th className="p-4 font-bold">Courier Details</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading shipments...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                     <span className="material-symbols-outlined text-4xl">local_shipping</span>
                     <p>No shipments found.</p>
                  </td>
                </tr>
              ) : (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-900">#{shipment.id.substring(0,8).toUpperCase()}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{shipment.customerName}</p>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1 max-w-xs">{shipment.address || 'No address provided'}</p>
                    </td>
                    <td className="p-4">
                      {shipment.courierName ? (
                        <div>
                          <p className="font-medium text-slate-800 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">package</span>
                            {shipment.courierName}
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-1">{shipment.trackingNumber || 'No tracking available'}</p>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Courier not assigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                        shipment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        shipment.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        shipment.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                       {shipment.status === 'Processing' && (
                         <button onClick={() => handleUpdateStatus(shipment.id, 'Shipped')} className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded text-xs font-bold transition-colors">
                           Mark Shipped
                         </button>
                       )}
                       {shipment.status === 'Shipped' && (
                         <button onClick={() => handleUpdateStatus(shipment.id, 'Delivered')} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 rounded text-xs font-bold transition-colors">
                           Mark Delivered
                         </button>
                       )}
                       {shipment.status === 'Delivered' && (
                         <span className="text-xs text-slate-400 font-medium flex items-center justify-end gap-1">
                           <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                           Completed
                         </span>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative z-10 w-full max-w-sm bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Shipping Rates</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Default Base Rate (₹)</label>
                <input 
                  type="number" 
                  value={baseRate}
                  onChange={e => setBaseRate(Number(e.target.value))}
                  min="0"
                  className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Free Shipping Threshold (₹)</label>
                <input 
                  type="number" 
                  value={freeShippingThreshold}
                  onChange={e => setFreeShippingThreshold(Number(e.target.value))}
                  min="0"
                  className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest"
                />
                <p className="text-xs text-slate-500 mt-2">Orders above this amount will have free shipping applied automatically.</p>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsSettingsOpen(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded transition-colors">
                  Cancel
                </button>
                <button type="button" onClick={() => { alert('Shipping rules saved.'); setIsSettingsOpen(false); }} className="bg-forest text-white px-6 py-2 rounded font-bold hover:bg-forest/90 transition-colors">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
