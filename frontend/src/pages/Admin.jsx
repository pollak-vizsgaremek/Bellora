import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Users, Package, ShoppingBag, Flag, Shield, Trash2, ChevronDown, BarChart3, AlertTriangle, CheckCircle, XCircle, Eye } from 'lucide-react';

export default function Admin() {
  const { user } = useAuth();
  const { success, error: alertError } = useAlert();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, text: '', action: null });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadData();
  }, [user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await api.get('/admin/stats');
        setStats(res.data.stats);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.users);
      } else if (activeTab === 'items') {
        const res = await api.get('/admin/items');
        setItems(res.data.items);
      } else if (activeTab === 'orders') {
        const res = await api.get('/admin/orders');
        setOrders(res.data.orders);
      } else if (activeTab === 'reports') {
        const res = await api.get('/admin/reports');
        setReports(res.data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userId) => {
    setConfirmModal({
      isOpen: true,
      text: 'Biztosan törölni szeretnéd ezt a felhasználót? Ez a művelet nem visszavonható!',
      action: async () => {
        try {
          await api.delete(`/admin/users/${userId}`);
          success('Felhasználó törölve');
          loadData();
        } catch (err) { alertError(err.response?.data?.message || 'Hiba'); }
      }
    });
  };

  const handleUpdateRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      success('Szerep frissítve');
      loadData();
    } catch (err) { alertError(err.response?.data?.message || 'Hiba'); }
  };

  const handleDeleteItem = (itemId) => {
    setConfirmModal({
      isOpen: true,
      text: 'Biztosan törölni szeretnéd ezt a hirdetést? Ez a művelet nem visszavonható!',
      action: async () => {
        try {
          await api.delete(`/admin/items/${itemId}`);
          success('Hirdetés törölve');
          loadData();
        } catch (err) { alertError(err.response?.data?.message || 'Hiba'); }
      }
    });
  };

  const handleUpdateItemStatus = async (itemId, status) => {
    try {
      await api.put(`/admin/items/${itemId}/status`, { status });
      success('Státusz frissítve');
      loadData();
    } catch (err) { alertError(err.response?.data?.message || 'Hiba'); }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      success('Rendelés státusz frissítve');
      loadData();
    } catch (err) { alertError(err.response?.data?.message || 'Hiba'); }
  };

  const handleDeleteOrder = (orderId) => {
    setConfirmModal({
      isOpen: true,
      text: 'Biztosan törölni szeretnéd ezt a rendelést? Ez a művelet nem visszavonható!',
      action: async () => {
        try {
          await api.delete(`/admin/orders/${orderId}`);
          success('Rendelés törölve');
          loadData();
        } catch (err) { alertError(err.response?.data?.message || 'Hiba'); }
      }
    });
  };

  const handleUpdateReportStatus = async (reportId, status) => {
    try {
      await api.put(`/admin/reports/${reportId}/status`, { status });
      success('Bejelentés frissítve');
      loadData();
    } catch (err) { alertError(err.response?.data?.message || 'Hiba'); }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Felhasználók', icon: Users },
    { id: 'items', label: 'Hirdetések', icon: Package },
    { id: 'orders', label: 'Rendelések', icon: ShoppingBag },
    { id: 'reports', label: 'Bejelentések', icon: Flag },
  ];

  const statusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400',
      available: 'bg-green-500/20 text-green-400',
      sold: 'bg-purple-500/20 text-purple-400',
      reserved: 'bg-blue-500/20 text-blue-400',
      reviewed: 'bg-red-500/20 text-red-400',
      dismissed: 'bg-gray-500/20 text-gray-400',
    };
    const labels = {
      pending: 'Függőben', completed: 'Teljesítve', cancelled: 'Törölve',
      available: 'Elérhető', sold: 'Eladva', reserved: 'Foglalt',
      reviewed: 'Jogos (Törölve)', dismissed: 'Alaptalan (Megtartva)',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-500/20 text-gray-400'}`}>{labels[status] || status}</span>;
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-purple-400" />
          <h1 className="text-2xl md:text-4xl font-bold text-white">Admin Panel</h1>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap text-sm ${activeTab === tab.id ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-purple-500"></div>
          </div>
        ) : (
          <>
            {/* DASHBOARD */}
            {activeTab === 'dashboard' && stats && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'Felhasználók', value: stats.usersCount, icon: Users, color: 'from-blue-600 to-blue-800' },
                  { label: 'Hirdetések', value: stats.itemsCount, icon: Package, color: 'from-green-600 to-green-800' },
                  { label: 'Rendelések', value: stats.ordersCount, icon: ShoppingBag, color: 'from-purple-600 to-purple-800' },
                  { label: 'Bejelentések', value: stats.reportsCount, icon: Flag, color: 'from-red-600 to-red-800' },
                  { label: 'Függő bejelentések', value: stats.pendingReportsCount, icon: AlertTriangle, color: 'from-yellow-600 to-yellow-800' },
                  { label: 'Függő rendelések', value: stats.pendingOrdersCount, icon: ShoppingBag, color: 'from-orange-600 to-orange-800' },
                ].map((s, i) => (
                  <div key={i} className={`bg-gradient-to-br ${s.color} rounded-xl p-4 md:p-6 shadow-lg`}>
                    <s.icon className="w-8 h-8 text-white/70 mb-2" />
                    <p className="text-white/70 text-sm">{s.label}</p>
                    <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* USERS */}
            {activeTab === 'users' && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Felhasználó</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold hidden md:table-cell">Email</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold hidden md:table-cell">Hirdetések</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Szerep</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Műveletek</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {users.map(u => (
                        <tr key={u.user_id} className="hover:bg-gray-700/30 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {u.profile_image ? (
                                <img src={`${import.meta.env.VITE_BASE_URL}${u.profile_image}`} className="w-8 h-8 rounded-full object-cover" />
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">{u.username?.charAt(0).toUpperCase()}</div>
                              )}
                              <div>
                                <p className="text-white font-medium text-sm">{u.username}</p>
                                <p className="text-gray-500 text-xs md:hidden">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">{u.email}</td>
                          <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">{u.items_count}</td>
                          <td className="px-4 py-3">
                            <select value={u.role} onChange={(e) => handleUpdateRole(u.user_id, e.target.value)}
                              disabled={u.user_id === user.user_id}
                              className="bg-gray-700 text-white text-xs rounded-lg px-2 py-1 border border-gray-600 disabled:opacity-50">
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => navigate(`/user/${u.user_id}`)} className="text-blue-400 hover:text-blue-300 transition" title="Profil"><Eye size={16} /></button>
                              {u.user_id !== user.user_id && (
                                <button onClick={() => handleDeleteUser(u.user_id)} className="text-red-400 hover:text-red-300 transition" title="Törlés"><Trash2 size={16} /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ITEMS */}
            {activeTab === 'items' && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Termék</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold hidden md:table-cell">Eladó</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Ár</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Státusz</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold hidden md:table-cell">Bejelentések</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Műveletek</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {items.map(item => (
                        <tr key={item.item_id} className="hover:bg-gray-700/30 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {item.image_url ? (
                                <img src={`${import.meta.env.VITE_BASE_URL}${item.image_url}`} className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center"><Package size={16} className="text-gray-500" /></div>
                              )}
                              <p className="text-white text-sm font-medium truncate max-w-[150px]">{item.title}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">{item.seller_name}</td>
                          <td className="px-4 py-3 text-white text-sm font-semibold">{Number(item.price).toLocaleString()} Ft</td>
                          <td className="px-4 py-3">
                            <select value={item.status} onChange={(e) => handleUpdateItemStatus(item.item_id, e.target.value)}
                              className="bg-gray-700 text-white text-xs rounded-lg px-2 py-1 border border-gray-600">
                              <option value="available">Elérhető</option>
                              <option value="sold">Eladva</option>
                              <option value="reserved">Foglalt</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {item.reports_count > 0 ? (
                              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs font-semibold">{item.reports_count} db</span>
                            ) : (
                              <span className="text-gray-500 text-xs">0</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button onClick={() => navigate(`/item/${item.item_id}`)} className="text-blue-400 hover:text-blue-300 transition"><Eye size={16} /></button>
                              <button onClick={() => handleDeleteItem(item.item_id)} className="text-red-400 hover:text-red-300 transition"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ORDERS */}
            {activeTab === 'orders' && (
              <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">#</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Termék</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold hidden md:table-cell">Vevő</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold hidden md:table-cell">Eladó</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Státusz</th>
                        <th className="px-4 py-3 text-gray-300 text-sm font-semibold">Műveletek</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {orders.map(order => (
                        <tr key={order.order_id} className="hover:bg-gray-700/30 transition">
                          <td className="px-4 py-3 text-gray-400 text-sm">#{order.order_id}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {order.image_url ? (
                                <img src={`${import.meta.env.VITE_BASE_URL}${order.image_url}`} className="w-10 h-10 rounded-lg object-cover" />
                              ) : (
                                <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
                              )}
                              <div>
                                <p className="text-white text-sm font-medium truncate max-w-[120px]">{order.title}</p>
                                <p className="text-gray-400 text-xs">{Number(order.price).toLocaleString()} Ft</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">{order.buyer_name}</td>
                          <td className="px-4 py-3 text-gray-400 text-sm hidden md:table-cell">{order.seller_name}</td>
                          <td className="px-4 py-3">
                            <select value={order.status} onChange={(e) => handleUpdateOrderStatus(order.order_id, e.target.value)}
                              className="bg-gray-700 text-white text-xs rounded-lg px-2 py-1 border border-gray-600">
                              <option value="pending">Függőben</option>
                              <option value="completed">Teljesítve</option>
                              <option value="cancelled">Törölve</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDeleteOrder(order.order_id)} className="text-red-400 hover:text-red-300 transition"><Trash2 size={16} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {orders.length === 0 && <p className="text-center text-gray-500 py-8">Nincs rendelés</p>}
              </div>
            )}

            {/* REPORTS */}
            {activeTab === 'reports' && (
              <div className="space-y-4">
                {reports.length === 0 && <p className="text-center text-gray-500 py-8">Nincs bejelentés</p>}
                {reports.map(r => (
                  <div key={r.report_id} className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {r.item_image ? (
                          <img src={`${import.meta.env.VITE_BASE_URL}${r.item_image}`} className="w-12 h-12 rounded-lg object-cover cursor-pointer" onClick={() => navigate(`/item/${r.item_id}`)} />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center"><Flag size={16} className="text-gray-500" /></div>
                        )}
                        <div>
                          <p className="text-white font-medium">{r.item_title}</p>
                          <p className="text-gray-400 text-sm">Bejelentő: {r.reporter_name}</p>
                          <p className="text-gray-500 text-xs">{new Date(r.created_at).toLocaleDateString('hu-HU')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {statusBadge(r.status)}
                        {r.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateReportStatus(r.report_id, 'reviewed')} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition flex items-center gap-1">
                              <CheckCircle size={14} /> Jogos (Hirdetés törlése)
                            </button>
                            <button onClick={() => handleUpdateReportStatus(r.report_id, 'dismissed')} className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded-lg text-xs transition flex items-center gap-1">
                              <XCircle size={14} /> Alaptalan (Megtartás)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-3 bg-gray-700/50 rounded-lg p-3">
                      <p className="text-gray-300 text-sm"><span className="text-gray-500">Ok:</span> {r.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-2">Megerősítés szükséges</h3>
            <p className="text-gray-300 mb-6">{confirmModal.text}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal({ isOpen: false, text: '', action: null })}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition"
              >
                Mégse
              </button>
              <button
                onClick={() => {
                  if (confirmModal.action) confirmModal.action();
                  setConfirmModal({ isOpen: false, text: '', action: null });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Törlés
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
