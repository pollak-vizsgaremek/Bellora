import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { User, Package, Star, Calendar, MapPin, Phone, Mail, MessageCircle, Image } from 'lucide-react';

export default function PublicProfile() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const { error: alertError } = useAlert();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
    loadUserItems();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await api.get(`/users/${userId}`);
      setProfile(response.data.user);
    } catch (error) {
      console.error('Hiba:', error);
      alertError('Nem sikerült betölteni a profilt');
    }
  };

  const loadUserItems = async () => {
    try {
      const response = await api.get(`/users/${userId}/items`);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Hiba:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl text-white">Felhasználó nem található</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 text-center sm:text-left">
            <div className="relative flex-shrink-0">
              {profile.profile_image ? (
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${profile.profile_image}`}
                  alt={profile.username}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                  <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{profile.username}</h1>
              {profile.full_name && (
                <p className="text-blue-100 text-lg mb-3">{profile.full_name}</p>
              )}

              <div className="flex flex-wrap gap-4 text-blue-100">
                {profile.city && (
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{profile.city}</span>
                  </div>
                )}
                {profile.join_date && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Tagság: {new Date(profile.join_date).toLocaleDateString('hu-HU')}</span>
                  </div>
                )}
              </div>
            </div>

            {currentUser && currentUser.user_id !== parseInt(userId) && (
              <button
                onClick={() => navigate(`/messages/${userId}`)}
                className="w-full sm:w-auto bg-white text-blue-600 px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" /> Üzenet küldése
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <Package size={40} className="text-blue-400" />
              <div>
                <div className="text-3xl font-bold text-white">{items.length}</div>
                <div className="text-gray-400">Aktív hirdetés</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <Package size={28} /> {profile.username} hirdetései
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700">
            <Package size={64} className="mx-auto mb-4 text-gray-500" />
            <h3 className="text-2xl font-bold text-white mb-2">Nincsenek hirdetések</h3>
            <p className="text-gray-400">Ez a felhasználó még nem adott fel hirdetést.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.item_id}
                onClick={() => navigate(`/item/${item.item_id}`)}
                className="group bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className="relative">
                  {item.image_url ? (
                    <img
                      src={`${import.meta.env.VITE_BASE_URL}${item.image_url}`}
                      alt={item.title}
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <Image size={48} className="text-gray-500" />
                    </div>
                  )}

                  {item.status !== 'available' && (
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'sold' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
                        }`}>
                        {item.status === 'sold' ? 'Eladva' : 'Foglalt'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg text-white mb-2 truncate group-hover:text-blue-400 transition">
                    {item.title}
                  </h3>
                  <p className="text-blue-400 font-bold text-2xl mb-2">
                    {item.price.toLocaleString()} Ft
                  </p>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
