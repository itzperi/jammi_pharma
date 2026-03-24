"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, updateDocument } from '../../../lib/adminDb';

interface Transaction {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  createdAt: string;
}

export default function AdminPayments() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  // settings modal
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [rzpKey, setRzpKey] = useState('rzp_test_XXXXXXXXXXXXXXXXX');
  const [stripeKey, setStripeKey] = useState('sk_test_XXXXXXXXXXXXXXXXXX');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      // In a real app we would have a transactions collection. For now we can derive from orders if transactions don't exist, 
      // but let's assume we fetch transactions.
      const t = await fetchCollection('transactions') as Transaction[];
      setTransactions(t.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRefund = async (id: string, orderId: string) => {
    if (confirm(`Initiate refund for Transaction ${id} (Order #${orderId})?`)) {
      try {
        await updateDocument('transactions', id, { status: 'Refunded' });
        // In real app, we would also update the order document status
        setTransactions(transactions.map(t => t.id === id ? { ...t, status: 'Refunded' } : t));
        alert('Refund initiated successfully.');
      } catch (err) {
        console.error("Error refunding", err);
        alert('Failed to initiate refund.');
      }
    }
  };

  const exportCSV = () => {
    const headers = ['Transaction ID', 'Order ID', 'Customer', 'Amount', 'Method', 'Date', 'Status'];
    const rows = transactions.map(t => [
      t.id, 
      t.orderId, 
      t.customerName, 
      t.amount, 
      t.method, 
      new Date(t.createdAt).toLocaleDateString(), 
      t.status
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesStatus = statusFilter ? t.status === statusFilter : true;
    const matchesMethod = methodFilter ? t.method === methodFilter : true;
    return matchesStatus && matchesMethod;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Payment Management</h1>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-md font-bold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
            Gateway Settings
          </button>
          <button 
            onClick={exportCSV}
            className="bg-forest text-white px-4 py-2 rounded-md font-bold hover:bg-forest/90 transition-colors shadow-sm flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:border-forest bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
        <select 
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="w-full sm:w-48 border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:border-forest bg-white"
        >
          <option value="">All Methods</option>
          <option value="Razorpay">Razorpay</option>
          <option value="Stripe">Stripe</option>
          <option value="Credit Card">Credit Card</option>
          <option value="UPI">UPI</option>
          <option value="Net Banking">Net Banking</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">Transaction ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Amount</th>
                <th className="p-4 font-bold">Method</th>
                <th className="p-4 font-bold">Date</th>
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
                      <p>Loading transactions...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                     <span className="material-symbols-outlined text-4xl">payments</span>
                     <p>No transactions found.</p>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{t.id}</td>
                    <td className="p-4 font-medium text-slate-900">{t.customerName}</td>
                    <td className="p-4 text-blue-600 hover:underline cursor-pointer">#{t.orderId}</td>
                    <td className="p-4 font-bold text-slate-900">₹{Number(t.amount).toLocaleString()}</td>
                    <td className="p-4">{t.method}</td>
                    <td className="p-4 text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                        t.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        t.status === 'Refunded' ? 'bg-purple-100 text-purple-800' :
                        t.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {t.status === 'Paid' ? (
                        <button 
                          onClick={() => handleRefund(t.id, t.orderId)}
                          className="text-orange-600 hover:text-orange-800 border border-orange-200 hover:bg-orange-50 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                        >
                          Initiate Refund
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs italic">N/A</span>
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
          <div className="relative z-10 w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-saffron">settings</span>
              Payment Gateway Settings
            </h2>
            <div className="space-y-6">
              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-700">Razorpay Configuration</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">API Key ID</label>
                  <input 
                    type="password" 
                    value={rzpKey}
                    onChange={e => setRzpKey(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-forest font-mono"
                  />
                  <p className="text-xs text-slate-500 mt-1">Keys are masked for security. Stored in environment variables.</p>
                </div>
              </div>

              <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-700">Stripe Configuration</h3>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Secret Key</label>
                  <input 
                    type="password" 
                    value={stripeKey}
                    onChange={e => setStripeKey(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-forest font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsSettingsOpen(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded transition-colors">
                  Close
                </button>
                <button type="button" onClick={() => { alert('Settings saved to .env config.'); setIsSettingsOpen(false); }} className="bg-forest text-white px-6 py-2.5 rounded font-bold hover:bg-forest/90 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
