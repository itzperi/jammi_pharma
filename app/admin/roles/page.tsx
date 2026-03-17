"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, createDocument, updateDocument, deleteDocument } from '../../../lib/adminDb';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Superadmin' | 'Editor' | 'Support';
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export default function AdminRoles() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'Superadmin' | 'Editor' | 'Support'>('Editor');

  // Hardcoded current admin to prevent self-deletion in this demo
  const currentUserEmail = 'admin@jammipharma.com';

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const a = await fetchCollection('admins') as AdminUser[];
      if (a.length === 0) {
        // Mock data if empty
        setAdmins([
          { id: '1', name: 'Jammi Admin', email: 'admin@jammipharma.com', role: 'Superadmin', status: 'Active', createdAt: new Date().toISOString() }
        ]);
      } else {
        setAdmins(a);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newAdmin: Omit<AdminUser, 'id'> = { name, email, role, status: 'Active', createdAt: new Date().toISOString() };
      const id = await createDocument('admins', newAdmin);
      setAdmins([...admins, { ...newAdmin, id }]);
      setIsModalOpen(false);
      setName(''); setEmail(''); setRole('Editor');
    } catch (err) {
      console.error("Error creating admin", err);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateDocument('admins', id, { status: newStatus });
      setAdmins(admins.map(a => a.id === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteAdmin = async (id: string, adminEmail: string) => {
    if (adminEmail === currentUserEmail) {
      alert("You cannot delete your own account.");
      return;
    }
    if (confirm("Delete this admin user?")) {
      try {
        await deleteDocument('admins', id);
        setAdmins(admins.filter(a => a.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Admin Roles & Users</h1>
          <p className="text-slate-500 mt-1">Manage admin panel access and permissions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-forest text-white px-6 py-2.5 rounded-md font-bold hover:bg-forest/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">person_add</span>
          Add Admin User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">User</th>
                <th className="p-4 font-bold">Role & Permissions</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Added On</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading users...</p>
                    </div>
                  </td>
                </tr>
              ) : admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-forest text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{admin.name}</p>
                        <p className="text-xs text-slate-500">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                      admin.role === 'Superadmin' ? 'bg-purple-100 text-purple-800' :
                      admin.role === 'Editor' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {admin.role}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">
                      {admin.role === 'Superadmin' ? 'Full Access' : admin.role === 'Editor' ? 'Content & Products' : 'Orders & Customers Only'}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                      admin.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500">{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                     {admin.email !== currentUserEmail && (
                       <>
                         <button onClick={() => toggleStatus(admin.id, admin.status)} className="text-slate-500 hover:text-slate-800 px-2 py-1 rounded transition-colors text-xs font-bold border border-slate-200 hover:bg-slate-100">
                           {admin.status === 'Active' ? 'Disable' : 'Enable'}
                         </button>
                         <button onClick={() => deleteAdmin(admin.id, admin.email)} className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors" title="Delete">
                           <span className="material-symbols-outlined text-[18px]">delete</span>
                         </button>
                       </>
                     )}
                     {admin.email === currentUserEmail && (
                       <span className="text-xs text-slate-400 italic">Current User</span>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsModalOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Add Admin User</h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                <select value={role} onChange={e => setRole(e.target.value as any)} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest bg-white">
                  <option value="Superadmin">Superadmin (Full Access)</option>
                  <option value="Editor">Editor (Content & Products)</option>
                  <option value="Support">Support (Orders & Customers)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancel</button>
                <button type="submit" className="bg-forest text-white px-6 py-2.5 rounded font-bold hover:bg-forest/90">Add User</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
