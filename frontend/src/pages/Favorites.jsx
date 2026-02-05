import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Heart, HeartOff, Search, Sparkles } from 'lucide-react';

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: alertError } = useAlert();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadFavorites();
  }, [user]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response = await api.get('/favorites');
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error('Hiba:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (itemId, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/favorites/${itemId}`);
      setFavorites(favorites.filter(f => f.item_id !== itemId));
      success('Eltávolítva a kedvencekből');
    } catch (error) {
      alertError('Hiba történt');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="bg-gradient-to-r from-pink-600 to-red-600 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2 md:gap-3">
            <Heart className="w-7 h-7 md:w-9 md:h-9" fill="white" /> Kedvenceim
          </h1>
          <p className="text-sm md:text-base text-pink-100">Az általam mentett termékek</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 md:-mt-8 mb-6 md:mb-8">
        <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-4 md:p-6 inline-block">
          <div className="flex items-center gap-3 md:gap-4">
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-pink-400" />
            <div>
              <div className="text-2xl md:text-3xl font-bold text-white">{favorites.length}</div>
              <div className="text-xs md:text-sm text-gray-400">kedvenc hirdetés</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-pink-500"></div>
            <p className="text-gray-400 mt-4">Betöltés...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700 px-4">
            <HeartOff className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-500" />
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Nincsenek kedvencek</h3>
            <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">Kezdj el kedvencek közé menteni és kövesd nyomon a tetszett termékeket!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-pink-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-pink-700 font-semibold transition inline-flex items-center gap-2 text-sm md:text-base"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" /> Hirdetések böngészése
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((item) => (
              <div
                key={item.item_id}
                className="group bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden hover:border-pink-500 transition-all duration-300 hover:scale-105"
              >
                <div 
                  onClick={() => navigate(`/item/${item.item_id}`)}
                  className="cursor-pointer"
                >
                  <div className="relative">
                    {item.image_url ? (
                      <img
                        src={`http://localhost:5000${item.image_url}`}
                        alt={item.title}
                        className="w-full h-56 object-cover"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <span className="text-gray-500 text-5xl">🖼️</span>
                      </div>
                    )}
                    
                    {/* Kedvenc szív jel */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-pink-500 p-2 rounded-full animate-pulse">
                        <Heart size={20} fill="white" stroke="white" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 md:p-4">
                    <h3 className="font-bold text-base md:text-lg text-white mb-2 truncate group-hover:text-pink-400 transition">
                      {item.title}
                    </h3>
                    <p className="text-pink-400 font-bold text-xl md:text-2xl mb-2">
                      {item.price.toLocaleString()} Ft
                    </p>
                    
                    {/* Eladó profilképpel */}
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      {item.seller_image ? (
                        <img 
                          src={`http://localhost:5000${item.seller_image}`}
                          alt={item.seller_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {item.seller_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-gray-400 text-sm">Eladó: {item.seller_name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="px-3 md:px-4 pb-3 md:pb-4">
                  <button
                    onClick={(e) => removeFavorite(item.item_id, e)}
                    className="w-full bg-red-600/80 hover:bg-red-600 text-white py-1.5 md:py-2 rounded-lg text-sm md:text-base font-semibold transition backdrop-blur-sm flex items-center justify-center gap-1 md:gap-2"
                  >
                    <HeartOff className="w-4 h-4" /> Eltávolítás
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
