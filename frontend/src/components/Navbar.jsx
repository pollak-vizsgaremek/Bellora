import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect, useRef } from 'react';
import { Home, Package, MessageCircle, Heart, Plus, User, LogOut, ChevronDown, Menu, X, Bell, ShoppingBag, Star } from 'lucide-react';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadOffers, setUnreadOffers] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadUnreadOffers();
      loadNotifications();
      const interval = setInterval(() => {
        loadUnreadOffers();
        loadNotifications();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUnreadOffers = async () => {
    try {
      const response = await api.get('/offers/unread-count');
      setUnreadOffers(response.data.count);
    } catch (error) {
      console.error('Error loading unread offers:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              Bellora
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                  <Home size={18} /> Főoldal
                </button>
                <button onClick={() => navigate('/my-items')} className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                  <Package size={18} /> Hirdetéseim
                </button>
                <button onClick={() => navigate('/messages')} className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                  <MessageCircle size={18} /> Üzenetek
                </button>
                <button onClick={() => navigate('/favorites')} className="text-gray-300 hover:text-white transition font-medium flex items-center gap-2">
                  <Heart size={18} /> Kedvencek
                </button>

                <button
                  onClick={() => navigate('/new-item')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg flex items-center gap-2"
                >
                  <Plus size={18} /> Új hirdetés
                </button>

                {/* Notification Dropdown */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative text-gray-300 hover:text-white transition p-2 rounded-full hover:bg-gray-800"
                  >
                    <Bell size={22} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-96 overflow-y-auto">
                      <div className="p-3 border-b border-gray-700 sticky top-0 bg-gray-800">
                        <h3 className="text-white font-semibold">Értesítések</h3>
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          Nincs új értesítés
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-700">
                          {notifications.map((notif, index) => (
                            <div
                              key={`${notif.type}-${notif.item_id}-${index}`}
                              className="p-3 hover:bg-gray-700 transition cursor-pointer"
                              onClick={() => {
                                navigate(`/item/${notif.item_id}`);
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                {notif.favoriter_image || notif.buyer_image ? (
                                  <img
                                    src={`${import.meta.env.VITE_BASE_URL}${notif.favoriter_image || notif.buyer_image}`}
                                    alt=""
                                    className="w-10 h-10 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {(notif.favoriter_name || notif.buyer_name)?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {notif.type === 'favorite' && (
                                      <Heart size={14} className="text-pink-400 flex-shrink-0" fill="currentColor" />
                                    )}
                                    {notif.type === 'order' && (
                                      <ShoppingBag size={14} className="text-green-400 flex-shrink-0" />
                                    )}
                                    {notif.type === 'offer' && (
                                      <Star size={14} className="text-yellow-400 flex-shrink-0" />
                                    )}
                                    <span className="text-white text-sm font-medium truncate">
                                      {notif.favoriter_name || notif.buyer_name}
                                    </span>
                                  </div>
                                  
                                  <p className="text-gray-300 text-xs">
                                    {notif.type === 'favorite' && 'kedvencnek jelölte: '}
                                    {notif.type === 'order' && 'megrendelte: '}
                                    {notif.type === 'offer' && `ajánlatot tett (${notif.offer_price.toLocaleString()} Ft): `}
                                    <span className="text-gray-400">{notif.item_title}</span>
                                  </p>
                                  
                                  {notif.type === 'order' && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${
                                      notif.order_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                      notif.order_status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {notif.order_status === 'pending' ? 'Folyamatban' :
                                       notif.order_status === 'completed' ? 'Teljesítve' : 'Törölve'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-700 transition"
                  >
                    {user.profile_image ? (
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${user.profile_image}`}
                        alt={user.username}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-white font-medium">{user.username}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-700">
                      <button
                        onClick={() => { navigate('/profile'); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-2"
                      >
                        <User size={16} /> Profilom
                      </button>
                      <button
                        onClick={() => { navigate('/my-items'); setShowUserMenu(false); }}
                        className="w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center gap-2"
                      >
                        <Package size={16} /> Hirdetéseim
                      </button>
                      <div className="border-t border-gray-700 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300 transition flex items-center gap-2"
                      >
                        <LogOut size={16} /> Kijelentkezés
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white transition font-medium">
                  Főoldal
                </button>
                <button onClick={() => navigate('/login')} className="text-gray-300 hover:text-white transition font-medium">
                  Bejelentkezés
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:from-blue-700 hover:to-purple-700 transition font-semibold"
                >
                  Regisztráció
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden text-white p-2"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 pt-4">
            {user ? (
              <div className="flex flex-col gap-3">
                <button onClick={() => { navigate('/'); setShowMobileMenu(false); }} className="text-left text-gray-300 hover:text-white transition py-2 flex items-center gap-2">
                  <Home size={18} /> Főoldal
                </button>
                <button onClick={() => { navigate('/my-items'); setShowMobileMenu(false); }} className="text-left text-gray-300 hover:text-white transition py-2 flex items-center gap-2">
                  <Package size={18} /> Hirdetéseim
                </button>
                <button onClick={() => { navigate('/messages'); setShowMobileMenu(false); }} className="text-left text-gray-300 hover:text-white transition py-2 flex items-center gap-2 relative">
                  <MessageCircle size={18} /> Üzenetek
                  {unreadOffers > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 ml-2">
                      {unreadOffers}
                    </span>
                  )}
                </button>
                <button onClick={() => { navigate('/favorites'); setShowMobileMenu(false); }} className="text-left text-gray-300 hover:text-white transition py-2 flex items-center gap-2">
                  <Heart size={18} /> Kedvencek
                </button>
                <button onClick={() => { navigate('/new-item'); setShowMobileMenu(false); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center flex items-center justify-center gap-2">
                  <Plus size={18} /> Új hirdetés
                </button>
                <div className="border-t border-gray-800 pt-3 mt-2">
                  <div className="text-white mb-3 font-semibold flex items-center gap-2"><User size={18} /> {user.username}</div>
                  <button onClick={() => { handleLogout(); setShowMobileMenu(false); }} className="w-full bg-red-600 text-white px-4 py-2 rounded-lg">
                    Kijelentkezés
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button onClick={() => { navigate('/'); setShowMobileMenu(false); }} className="text-left text-gray-300 hover:text-white transition py-2">
                  Főoldal
                </button>
                <button onClick={() => { navigate('/login'); setShowMobileMenu(false); }} className="text-left text-gray-300 hover:text-white transition py-2">
                  Bejelentkezés
                </button>
                <button onClick={() => { navigate('/register'); setShowMobileMenu(false); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                  Regisztráció
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
