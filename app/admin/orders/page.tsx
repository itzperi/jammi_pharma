"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { subscribeToCollection, updateDocument } from '../../../lib/adminDb';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Completed';
  createdAt: string;
  items: OrderItem[];
  trackingNumber?: string;
  courierName?: string;
  paymentMethod?: string;
  // Supabase fields
  supabase_id?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  // detail modal states
  const [newStatus, setNewStatus] = useState<Order['status']>('Pending');
  const [trackingNo, setTrackingNo] = useState('');
  const [courier, setCourier] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const unsub = subscribeToCollection('orders', (data) => {
      const o = data as Order[];
      setOrders(o.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()));
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setTrackingNo(order.trackingNumber || '');
    setCourier(order.courierName || '');
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      await updateDocument('orders', selectedOrder.id, {
        status: newStatus,
        trackingNumber: trackingNo,
        courierName: courier
      });
      // update local state
      setOrders(orders.map(o => o.id === selectedOrder.id
        ? { ...o, status: newStatus, trackingNumber: trackingNo, courierName: courier }
        : o
      ));

      // ── Trigger shipping email when marked Completed ───────────────────
      if (newStatus === 'Completed') {
        // Use supabase_id if available, else fall back to firebase id
        const orderIdForEmail = selectedOrder.supabase_id || selectedOrder.id;
        const res = await fetch('/api/send-shipping-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderIdForEmail,
            courierName: courier || undefined,
            trackingId: trackingNo || undefined,
          }),
        });
        if (res.ok) {
          toast.success(`✅ Order saved & shipping email sent to ${selectedOrder.email}`);
        } else if (res.status === 429) {
          toast.error('Email rate limit hit — wait a moment and retry.');
        } else {
          toast.success('Order saved ✓');
          toast.error('Shipping email failed — check server logs.');
        }
      } else {
        toast.success('Order updated ✓');
      }

      setSelectedOrder(null);
    } catch (err) {
      console.error('Error updating order', err);
      toast.error('Failed to update order.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter ? o.status === statusFilter : true;
    const matchesPayment = paymentFilter ? o.paymentStatus === paymentFilter : true;
    return matchesStatus && matchesPayment;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Order Management</h1>
        <div className="flex gap-3">
          <input 
            type="file" 
            id="import-orders" 
            className="hidden" 
            accept=".json,.csv"
            onChange={(e) => {
              // TODO: Implement import logic
              alert("Import logic to be implemented. Please upload a valid JSON file representing orders.");
            }}
          />
          <button 
            onClick={() => document.getElementById('import-orders')?.click()}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            Import Orders
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
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Completed">✅ Completed (sends email)</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select 
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="w-full sm:w-48 border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:border-forest bg-white"
        >
          <option value="">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">Order ID</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Items</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Payment</th>
                <th className="p-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                     <span className="material-symbols-outlined text-4xl">shopping_cart</span>
                     <p>No orders found.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDetail(order)}
                  >
                    <td className="p-4 font-medium text-slate-900 group-hover:text-forest transition-colors">#{order.orderNumber || order.id.substring(0,8).toUpperCase()}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4 text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">{order.items?.length || 0} items</td>
                    <td className="p-4 font-medium text-slate-900">₹{Number(order.total).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${
                        order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 
                        order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Order #{selectedOrder.orderNumber || selectedOrder.id.substring(0,8).toUpperCase()}</h2>
                <p className="text-sm text-slate-500 mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                 <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Customer Details</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-800">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-medium text-slate-800">Email:</span> {selectedOrder.email}</p>
                    <p><span className="font-medium text-slate-800">Phone:</span> {selectedOrder.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Payment Info</h3>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p><span className="font-medium text-slate-800">Method:</span> {selectedOrder.paymentMethod || 'Not specified'}</p>
                    <p><span className="font-medium text-slate-800">Status:</span> 
                      <span className={`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                        selectedOrder.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Shipping Address</h3>
                  <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{selectedOrder.address}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-100 pb-2">Order Items</h3>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="p-3 font-medium border-b border-slate-200">Product</th>
                        <th className="p-3 font-medium border-b border-slate-200 text-center">Qty</th>
                        <th className="p-3 font-medium border-b border-slate-200 text-right">Price</th>
                        <th className="p-3 font-medium border-b border-slate-200 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedOrder.items?.map((item, i) => (
                        <tr key={i}>
                          <td className="p-3 flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                              {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-400"><span className="material-symbols-outlined text-sm">image</span></div>}
                            </div>
                            <span className="font-medium text-slate-800">{item.name}</span>
                          </td>
                          <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                          <td className="p-3 text-right text-slate-600">₹{Number(item.price).toLocaleString()}</td>
                          <td className="p-3 text-right font-medium text-slate-800">₹{(Number(item.price) * Number(item.quantity)).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50">
                      <tr>
                        <td colSpan={3} className="p-3 text-right font-bold text-slate-800">Order Total:</td>
                        <td className="p-3 text-right font-bold text-saffron text-lg">₹{Number(selectedOrder.total).toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <form onSubmit={handleUpdateOrder} className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider border-b border-slate-200 pb-2 mb-4">Update Order Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Status</label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Order['status'])}
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-forest bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Completed">✅ Completed — sends shipping email</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Courier Name</label>
                    <input 
                      type="text" 
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      placeholder="e.g. Delhivery"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Tracking No.</label>
                    <input 
                      type="text" 
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      placeholder="AWB123456789"
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>
                <div className="flex gap-3 justify-end pt-2">
                   <button type="button" className="px-4 py-2 border border-slate-300 text-slate-600 rounded text-sm font-bold hover:bg-slate-100 flex items-center gap-2 transition-colors">
                     <span className="material-symbols-outlined text-[18px]">print</span>
                     Print Invoice
                   </button>
                 <button type="submit" disabled={isSaving} className="px-6 py-2 bg-forest text-white rounded text-sm font-bold hover:bg-forest/90 transition-colors disabled:opacity-60 flex items-center gap-2">
                   {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                   {isSaving ? 'Saving...' : (newStatus === 'Completed' ? '✅ Save & Send Email' : 'Save Updates')}
                 </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
