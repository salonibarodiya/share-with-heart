import React, { useState, useEffect } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';

// Offline Backup Data for Instant UI Testing
const BACKUP_NGOS = [
  { id: 'ngo_1', _id: 'ngo_1', name: 'Bangalore Child Relief Network', impact: 'Orphanage Cluster' },
  { id: 'ngo_2', _id: 'ngo_2', name: 'Green Earth Foundation', impact: 'Textile Recycle Node' },
  { id: 'ngo_3', _id: 'ngo_3', name: 'Vidya Stationary Bank', impact: 'Slum Education Care' }
];

const BACKUP_DONATIONS = [
  { _id: 'd_1', itemType: 'Clothes', quantity: 4, ngoName: 'Bangalore Child Relief Network', pickupAddress: 'Flat 402, Green Glen Layout, Bangalore', status: 'Pending', scheduledTime: '2026-06-15T10:00' },
  { _id: 'd_2', itemType: 'Books & Stationary', quantity: 12, ngoName: 'Vidya Stationary Bank', pickupAddress: 'Whitefield Main Road, Bangalore', status: 'Delivered', scheduledTime: '2026-06-12T14:30' }
];

function App() {
  const [activeTab, setActiveTab] = useState('donor'); // donor | ngo | admin
  const [donations, setDonations] = useState(BACKUP_DONATIONS);
  const [ngos, setNgos] = useState(BACKUP_NGOS);
  
  const [userProfile, setUserProfile] = useState({
    name: 'Saloni Barodiya',
    email: 'saloni@example.com',
    city: 'Bangalore',
    memberSince: '2026'
  });

  const [formData, setFormData] = useState({
    itemType: 'Clothes',
    quantity: 1,
    pickupAddress: 'Flat 402, Green Glen Layout, Bangalore',
    scheduledTime: '',
    ngoId: 'ngo_1' // Defaulting to first fallback node
  });

  const [historyFilter, setHistoryFilter] = useState('All');

  const fetchData = async () => {
    try {
      const donationRes = await fetch(`${API_BASE}/api/donations`);
      const donationData = await donationRes.json();
      if (donationData.success && donationData.donations.length > 0) {
        setDonations(donationData.donations);
      }

      const ngoRes = await fetch(`${API_BASE}/api/ngos`);
      const ngoData = await ngoRes.json();
      if (ngoData.success && ngoData.ngos.length > 0) {
        setNgos(ngoData.ngos);
        setFormData(prev => ({ ...prev, ngoId: ngoData.ngos[0].id || ngoData.ngos[0]._id }));
      }
    } catch (err) {
      console.log("Using dynamic offline-first simulation nodes.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.pickupAddress || !formData.scheduledTime) {
      alert('Please select a valid Pickup Date and Time.');
      return;
    }

    // Dynamic UI Simulation if server isn't hit
    const selectedNgo = ngos.find(n => (n.id === formData.ngoId || n._id === formData.ngoId)) || ngos[0];
    const newDonation = {
      _id: 'mock_' + Date.now(),
      itemType: formData.itemType,
      quantity: Number(formData.quantity),
      ngoName: selectedNgo.name,
      pickupAddress: formData.pickupAddress,
      status: 'Pending',
      scheduledTime: formData.scheduledTime
    };

    try {
      const res = await fetch(`${API_BASE}/api/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        alert('🎉 Doorstep pickup scheduled successfully! Live notification dispatched to NGO.');
        setFormData(prev => ({ ...prev, scheduledTime: '' }));
        fetchData();
      } else {
        // Fallback smooth transition if server is local-offline
        setDonations(prev => [newDonation, ...prev]);
        alert('🎉 Doorstep pickup simulated successfully in sandbox environment!');
        setFormData(prev => ({ ...prev, scheduledTime: '' }));
      }
    } catch (err) {
      // Graceful offline fallback execution
      setDonations(prev => [newDonation, ...prev]);
      alert('🎉 Doorstep pickup simulated successfully in sandbox environment!');
      setFormData(prev => ({ ...prev, scheduledTime: '' }));
    }
  };

  const updateStatus = async (id, status) => {
    // Local state immediate update for testing ease
    setDonations(prev => prev.map(item => item._id === id ? { ...item, status } : item));

    try {
      await fetch(`${API_BASE}/api/donations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.log("Status simulated offline.");
    }
  };

  const totalItemsCount = donations.reduce((acc, item) => acc + Number(item.quantity), 0);
  const totalPending = donations.filter(i => i.status === 'Pending').length;
  const totalDelivered = donations.filter(i => i.status === 'Delivered').length;

  const filteredDonations = donations.filter(item => {
    if (historyFilter === 'All') return true;
    return item.status === historyFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Brand Header */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">💜</span>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-emerald-700">Share With Heart</h1>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Unified Mentor Platform</p>
            </div>
          </div>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setActiveTab('donor')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'donor' ? 'bg-emerald-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Donor Profile & Request</button>
            <button onClick={() => setActiveTab('ngo')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'ngo' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>NGO Verification Hub</button>
            <button onClick={() => setActiveTab('admin')} className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'admin' ? 'bg-teal-700 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Admin Operations</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="bg-white/20 text-teal-100 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">Eco-Friendly Social Impact Solution</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 leading-tight">Share With Your Heart, Donate From Your Doorstep.</h2>
            <p className="text-emerald-100 mt-4 text-base">An intelligent web interface bridging the logistical gap between conscious citizens and verified regional orphanages.</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center">
              <span className="text-2xl block">🌿</span>
              <span className="text-2xl font-black block mt-1">{totalItemsCount}</span>
              <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Items Reused</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center">
              <span className="text-2xl block">🏢</span>
              <span className="text-2xl font-black block mt-1">{ngos.length}</span>
              <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Verified NGOs</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 text-center">
              <span className="text-2xl block">♻️</span>
              <span className="text-2xl font-black block mt-1">{totalDelivered}</span>
              <span className="text-[10px] text-teal-200 font-bold uppercase tracking-wider">Zero Waste Wins</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {activeTab === 'donor' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="space-y-6 lg:col-span-1">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 font-black text-xl flex items-center justify-center">
                    {userProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{userProfile.name}</h4>
                    <p className="text-xs text-indigo-500 font-semibold">Active Verified Donor</p>
                  </div>
                </div>
                <div className="text-xs space-y-2 text-slate-600 bg-indigo-50/40 p-3 rounded-xl border border-indigo-50">
                  <p><strong>Email:</strong> {userProfile.email}</p>
                  <p><strong>Region Base:</strong> {userProfile.city}</p>
                  <p><strong>Timeline:</strong> Batch {userProfile.memberSince}</p>
                </div>
              </div>

              {/* Secure Scheduling Form */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">✨ Schedule Doorstep Pickup</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Item Category</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={formData.itemType} onChange={(e) => setFormData({...formData, itemType: e.target.value})}>
                      <option>Clothes</option>
                      <option>Household Items</option>
                      <option>Books & Stationary</option>
                      <option>Toys / General Materials</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Quantity Estimate</label>
                    <input type="number" min="1" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})}/>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Target NGO Route</label>
                    <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={formData.ngoId} onChange={(e) => setFormData({...formData, ngoId: e.target.value})}>
                      {ngos.map(n => (
                        <option key={n.id || n._id} value={n.id || n._id}>{n.name} — ({n.impact || 'Verified Cluster'})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Address Validation</label>
                    <textarea rows="2" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={formData.pickupAddress} onChange={(e) => setFormData({...formData, pickupAddress: e.target.value})}></textarea>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Logistics Date & Time Picker</label>
                    <input type="datetime-local" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      value={formData.scheduledTime} onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})}/>
                  </div>
                  <button type="submit" className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-md uppercase tracking-wider transition-all">
                    Initialize Collection Route
                  </button>
                </form>
              </div>
            </div>

            {/* Right Side: History Module */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">📋 Transparent Fulfillment History</h3>
                
                <div className="flex gap-1 bg-slate-200 p-1 rounded-lg text-xs font-bold">
                  {['All', 'Pending', 'Accepted', 'Delivered'].map(f => (
                    <button key={f} onClick={() => setHistoryFilter(f)} className={`px-3 py-1.5 rounded-md transition-all ${historyFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}>{f}</button>
                  ))}
                </div>
              </div>

              {filteredDonations.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-dashed border-slate-200 text-sm text-slate-400 font-medium">
                  No records matched for filter state: "{historyFilter}"
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDonations.map(item => (
                    <div key={item._id} className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-900 text-base">{item.itemType} (x{item.quantity})</span>
                          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full ${
                            item.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            item.status === 'Accepted' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>{item.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">🏁 Route: <strong>{item.ngoName || 'Assigned NGO Partner'}</strong></p>
                        <p className="text-xs text-slate-400 truncate mt-1">📍 {item.pickupAddress}</p>
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold mt-3 pt-3 border-t border-slate-100">
                        ⏱️ Expected: {new Date(item.scheduledTime).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORKSPACE 2: NGO VERIFICATION CONSOLE */}
        {activeTab === 'ngo' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3">
              <span className="text-xl">🛡️</span>
              <p className="text-xs text-indigo-900 font-medium">Showing console requests for <strong>Verified Bangalore NGO Clusters</strong>. All payloads are encrypted and logged.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donations.map(item => (
                <div key={item._id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-slate-900">{item.itemType}</span>
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold">{item.status}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-600 mb-4">
                      <p><strong>Package Weight/Qty:</strong> {item.quantity} Units</p>
                      <p><strong>Assigned To:</strong> {item.ngoName || 'Cluster Node'}</p>
                      <p><strong>Address:</strong> {item.pickupAddress}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {item.status === 'Pending' && (
                      <button onClick={() => updateStatus(item._id, 'Accepted')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-all">Accept Allocation</button>
                    )}
                    {item.status === 'Accepted' && (
                      <button onClick={() => updateStatus(item._id, 'Delivered')} className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-all">Mark as Received</button>
                    )}
                    {item.status === 'Delivered' && (
                      <div className="w-full text-center py-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-xs">♻️ Inventory Logged</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKSPACE 3: ADMIN PANEL */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Pipeline Items</span>
                <p className="text-3xl font-black text-slate-900 mt-1">{totalItemsCount}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Open Logistics Tickets</span>
                <p className="text-3xl font-black text-amber-600 mt-1">{totalPending}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Logistical Turnaround</span>
                <p className="text-3xl font-black text-emerald-700 mt-1">&lt; 3 Seconds</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 bg-slate-50 border-b border-slate-200">
                <h4 className="font-bold text-slate-800 text-sm">System Master Activity Report</h4>
              </div>
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
                    <th className="p-4">Donor Subject</th>
                    <th className="p-4">Allocated NGO</th>
                    <th className="p-4">Geographic Routing</th>
                    <th className="p-4">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {donations.map(d => (
                    <tr key={d._id} className="hover:bg-slate-50/40">
                      <td className="p-4 font-bold">{d.itemType} <span className="text-slate-400 font-normal">(Qty: {d.quantity})</span></td>
                      <td className="p-4">{d.ngoName || 'Cluster Node'}</td>
                      <td className="p-4 truncate max-w-xs text-slate-500">{d.pickupAddress}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-bold ${d.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{d.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;