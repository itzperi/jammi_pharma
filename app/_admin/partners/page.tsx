"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, updateDocument, deleteDocument } from '../../../lib/adminDb';

interface PartnerRequest {
  id: string;
  name: string;
  clinicName: string;
  qualifications: string;
  experience: number;
  contact: string;
  email: string;
  address: string;
  status: 'New' | 'Contacted' | 'Verified' | 'Rejected';
  createdAt: string;
  message?: string;
}

export default function AdminPartners() {
  const [requests, setRequests] = useState<PartnerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  
  // Modal state
  const [selectedRequest, setSelectedRequest] = useState<PartnerRequest | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const r = await fetchCollection('partner_requests') as PartnerRequest[];
      setRequests(r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: PartnerRequest['status']) => {
    try {
      await updateDocument('partner_requests', id, { status: newStatus });
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this partner request?")) {
      try {
        await deleteDocument('partner_requests', id);
        setRequests(requests.filter(r => r.id !== id));
        if (selectedRequest?.id === id) setSelectedRequest(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.name?.toLowerCase().includes(search.toLowerCase()) || 
                          r.clinicName?.toLowerCase().includes(search.toLowerCase()) ||
                          r.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Partner Requests</h1>
          <p className="text-slate-500 mt-1">Manage doctor and clinic applications.</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-bold text-sm shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">verified_user</span>
          {requests.filter(r => r.status === 'New').length} New Requests
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search by doctor name, clinic, or email..." 
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
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Verified">Verified</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">Applicant Details</th>
                <th className="p-4 font-bold">Clinic Info</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading requests...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                     <span className="material-symbols-outlined text-4xl">handshake</span>
                     <p>No partner requests found.</p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{req.name}</p>
                      <p className="text-xs text-slate-500">{req.qualifications} • {req.experience} yrs exp</p>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{req.clinicName}</td>
                    <td className="p-4 text-xs text-slate-500">
                      <div>{req.email}</div>
                      <div>{req.contact}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                        req.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        req.status === 'Contacted' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'Verified' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                       <button onClick={() => setSelectedRequest(req)} className="text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                         View Details
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedRequest(null)} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Partner Application Details</h2>
                <p className="text-sm text-slate-500 mt-1">Submitted on {new Date(selectedRequest.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Doctor Name</p>
                  <p className="font-medium text-slate-900">{selectedRequest.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Clinic Name</p>
                  <p className="font-medium text-slate-900">{selectedRequest.clinicName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Qualifications</p>
                  <p className="font-medium text-slate-900">{selectedRequest.qualifications}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Experience</p>
                  <p className="font-medium text-slate-900">{selectedRequest.experience} Years</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</p>
                  <a href={`mailto:${selectedRequest.email}`} className="font-medium text-blue-600 hover:underline">{selectedRequest.email}</a>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Phone Number</p>
                  <a href={`tel:${selectedRequest.contact}`} className="font-medium text-blue-600 hover:underline">{selectedRequest.contact}</a>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Clinic Address</p>
                  <p className="font-medium text-slate-900">{selectedRequest.address}</p>
                </div>
              </div>

              {selectedRequest.message && (
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Additional Message</p>
                  <p className="text-sm text-slate-700 italic">"{selectedRequest.message}"</p>
                </div>
              )}

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Update Application Status</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleUpdateStatus(selectedRequest.id, 'New')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${selectedRequest.status === 'New' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>New</button>
                  <button onClick={() => handleUpdateStatus(selectedRequest.id, 'Contacted')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${selectedRequest.status === 'Contacted' ? 'bg-yellow-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Contacted</button>
                  <button onClick={() => handleUpdateStatus(selectedRequest.id, 'Verified')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${selectedRequest.status === 'Verified' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Verified Partner</button>
                  <button onClick={() => handleUpdateStatus(selectedRequest.id, 'Rejected')} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${selectedRequest.status === 'Rejected' ? 'bg-red-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Rejected</button>
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-between items-center">
              <button 
                onClick={() => handleDelete(selectedRequest.id)}
                className="text-red-600 hover:text-red-800 px-4 py-2 rounded text-sm font-bold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span> Delete Record
              </button>

              <button 
                onClick={() => setSelectedRequest(null)}
                className="px-6 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded text-sm font-bold transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
