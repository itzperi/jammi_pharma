"use client";
import React, { useState, useEffect } from 'react';
import { ordersApi } from '@/lib/adminApi';
import { useToast } from '@/components/Toast';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: string;
  order_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  total_amount: number;
  payment_status: 'paid' | 'unpaid' | 'refunded';
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items?: OrderItem[];
  tracking_number?: string;
  courier_name?: string;
  payment_method?: string;
  subtotal: number;
  shipping_cost: number;
  discount_amount: number;
  tax_amount: number;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const { addToast } = useToast();

  const [newStatus, setNewStatus] = useState<Order['order_status']>('pending');
  const [trackingNo, setTrackingNo] = useState('');
  const [courier, setCourier] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await ordersApi.list();
      setOrders(res.data || []);
    } catch (err: any) {
      addToast?.(err.message || 'Failed to load orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenDetail = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.order_status);
    setTrackingNo(order.tracking_number || '');
    setCourier(order.courier_name || '');
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsSaving(true);
    try {
      await ordersApi.updateStatus(selectedOrder.id, {
        order_status: newStatus,
        tracking_number: trackingNo,
        courier_name: courier
      });
      addToast?.('Order updated successfully', 'success');
      fetchOrders();
      setSelectedOrder(null);
    } catch (err: any) {
      addToast?.(err.message || 'Failed to update order', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter ? o.order_status === statusFilter : true;
    const matchesPayment = paymentFilter ? o.payment_status === paymentFilter : true;
    return matchesStatus && matchesPayment;
  });

  const formatAddress = (address: any): string => {
    if (typeof address === 'string') return address;
    if (address?.address) return `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`;
    return 'Address not available';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#f1f5f9]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Order Management</h2>
          <p className="text-[#94a3b8] text-sm mt-1">{orders.length} total orders</p>
        </div>
      </div>

      <div className="bg-[#111118] p-4 rounded-xl border border-[#16161f] flex flex-col sm:flex-row gap-4">
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 bg-[#0a0a0f] border border-[#16161f] rounded-lg px-4 py-2 focus:outline-none focus:border-[#22c55e] text-[#f1f5f9]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select 
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="w-full sm:w-48 bg-[#0a0a0f] border border-[#16161f] rounded-lg px-4 py-2 focus:outline-none focus:border-[#22c55e] text-[#f1f5f9]"
        >
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="bg-[#111118] rounded-xl border border-[#16161f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#16161f] text-[#94a3b8] text-xs uppercase tracking-wider border-b border-[#22c55e]/10">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Payment</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#16161f] text-[#f1f5f9]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="w-8 h-8 border-4 border-[#22c55e]/20 border-t-[#22c55e] rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-[#94a3b8]">
                    <span className="material-symbols-outlined text-4xl mb-2">shopping_cart</span>
                    <p className="mt-2">No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-[#16161f] transition-colors cursor-pointer"
                    onClick={() => handleOpenDetail(order)}
                  >
                    <td className="p-4 font-medium">#{order.order_number || order.id.substring(0,8).toUpperCase()}</td>
                    <td className="p-4">{order.customer_name}</td>
                    <td className="p-4 text-[#94a3b8]">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">₹{Number(order.total_amount).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${
                        order.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' : 
                        order.payment_status === 'refunded' ? 'bg-gray-500/20 text-gray-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-md ${
                        order.order_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.order_status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                        order.order_status === 'shipped' ? 'bg-indigo-500/20 text-indigo-400' :
                        order.order_status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {order.order_status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedOrder(null)} />
          <div className="relative z-10 w-full max-w-3xl bg-[#111118] rounded-xl border border-[#16161f] shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-[#16161f] flex justify-between items-center bg-[#0a0a0f] rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-[#f1f5f9]">Order #{selectedOrder.order_number || selectedOrder.id.substring(0,8).toUpperCase()}</h2>
                <p className="text-sm text-[#94a3b8] mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="text-[#94a3b8] hover:text-white transition-colors"
              >
                 <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0a0a0f] p-4 rounded-lg space-y-3">
                  <h3 className="font-bold text-[#f1f5f9] text-sm uppercase tracking-wider border-b border-[#16161f] pb-2">Customer Details</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium text-[#94a3b8]">Name:</span> <span className="text-[#f1f5f9]">{selectedOrder.customer_name}</span></p>
                    <p><span className="font-medium text-[#94a3b8]">Email:</span> <span className="text-[#f1f5f9]">{selectedOrder.customer_email}</span></p>
                    <p><span className="font-medium text-[#94a3b8]">Phone:</span> <span className="text-[#f1f5f9]">{selectedOrder.customer_phone || 'N/A'}</span></p>
                  </div>
                </div>
                <div className="bg-[#0a0a0f] p-4 rounded-lg space-y-3">
                  <h3 className="font-bold text-[#f1f5f9] text-sm uppercase tracking-wider border-b border-[#16161f] pb-2">Payment Info</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="font-medium text-[#94a3b8]">Method:</span> <span className="text-[#f1f5f9]">{selectedOrder.payment_method || 'Not specified'}</span></p>
                    <p>
                      <span className="font-medium text-[#94a3b8]">Status:</span> 
                      <span className={`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded ${
                        selectedOrder.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' : 
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {selectedOrder.payment_status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0f] p-4 rounded-lg space-y-3">
                <h3 className="font-bold text-[#f1f5f9] text-sm uppercase tracking-wider border-b border-[#16161f] pb-2">Shipping Address</h3>
                <p className="text-sm text-[#94a3b8] whitespace-pre-wrap leading-relaxed">{formatAddress(selectedOrder.shipping_address)}</p>
              </div>

              <div className="bg-[#0a0a0f] p-4 rounded-lg space-y-3">
                <h3 className="font-bold text-[#f1f5f9] text-sm uppercase tracking-wider border-b border-[#16161f] pb-2">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Subtotal</span>
                    <span className="text-[#f1f5f9]">₹{Number(selectedOrder.subtotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8]">Shipping</span>
                    <span className="text-[#f1f5f9]">₹{Number(selectedOrder.shipping_cost || 0).toLocaleString()}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#94a3b8]">Discount</span>
                      <span className="text-green-400">-₹{Number(selectedOrder.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#16161f] pt-2">
                    <span className="font-bold text-[#f1f5f9]">Total</span>
                    <span className="font-bold text-[#22c55e]">₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdateOrder} className="bg-[#0a0a0f] p-6 rounded-lg space-y-4">
                <h3 className="font-bold text-[#f1f5f9] text-sm uppercase tracking-wider border-b border-[#16161f] pb-2">Update Order Status</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#94a3b8] mb-2 uppercase tracking-wider">Status</label>
                    <select 
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Order['order_status'])}
                      className="w-full bg-[#111118] border border-[#16161f] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22c55e] text-[#f1f5f9]"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#94a3b8] mb-2 uppercase tracking-wider">Courier Name</label>
                    <input 
                      type="text" 
                      value={courier}
                      onChange={(e) => setCourier(e.target.value)}
                      placeholder="e.g. Delhivery"
                      className="w-full bg-[#111118] border border-[#16161f] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22c55e] text-[#f1f5f9]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#94a3b8] mb-2 uppercase tracking-wider">Tracking No.</label>
                    <input 
                      type="text" 
                      value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      placeholder="AWB123456789"
                      className="w-full bg-[#111118] border border-[#16161f] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#22c55e] text-[#f1f5f9]"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" disabled={isSaving} className="px-6 py-2 bg-[#22c55e] text-white rounded-lg font-semibold hover:bg-[#16a34a] transition-colors disabled:opacity-50 flex items-center gap-2">
                    {isSaving ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">save</span>
                        Save Updates
                      </>
                    )}
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
