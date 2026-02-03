import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { 
  Heart, MessageCircle, Share2, MapPin, Clock, Tag, 
  TrendingDown, Check, X, ArrowRight, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { success, error: alertError, info } = useAlert();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [offers, setOffers] = useState([]);
  const [offerPrice, setOfferPrice] = useState('');
  const [counterPrice, setCounterPrice] = useState('');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [dailyLimit, setDailyLimit] = useState({ used: 0, remaining: 20, limit: 20 });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadItem();
    if (user) {
      loadOffers();
      loadDailyLimit();
      checkIfFavorite();
    }
  }, [id, user]);

  const loadItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data.item);
    } catch (error) {
      console.error('Hiba:', error);
    }
  };

  const loadOffers = async () => {
    try {
      const response = await api.get(`/offers/item/${id}`);
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Hiba:', error);
    }
  };

  const loadDailyLimit = async () => {
    try {
      const response = await api.get('/offers/daily-count');
      setDailyLimit(response.data);
    } catch (error) {
      console.error('Hiba:', error);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await api.get('/favorites');
      if (response.data && response.data.favorites) {
        const isFav = response.data.favorites.some(fav => fav.item_id === parseInt(id));
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error('Kedvenc ellenőrzési hiba:', error);
      setIsFavorite(false);
    }
  };

  const handleSendOffer = async () => {
    if (!offerPrice || offerPrice <= 0) {
      alertError('Kérlek adj meg egy érvényes árat!');
      return;
    }

    const minPrice = item.price * 0.7;
    
    if (dailyLimit.remaining <= 0) {
      alertError('Elérted a napi 20 ajánlat limitet!');
      return;
    }

    try {
      const response = await api.post('/offers', {
        item_id: id,
        offer_price: offerPrice
      });
      success(`Árajánlat elküldve! Még ${response.data.remaining_offers} ajánlatod maradt ma.`);
      setShowOfferModal(false);
      setOfferPrice('');
      loadOffers();
      loadDailyLimit();
    } catch (err) {
      alertError(err.response?.data?.message || 'Hiba történt');
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!window.confirm('Biztosan elfogadod ezt az ajánlatot?')) return;
    
    try {
      await api.put(`/offers/${offerId}/accept`);
      success('Árajánlat elfogadva!');
      loadOffers();
    } catch (err) {
      alertError('Hiba történt');
    }
  };

  const handleRejectOffer = async (offerId) => {
    if (!window.confirm('Biztosan elutasítod ezt az ajánlatot?')) return;
    
    try {
      await api.put(`/offers/${offerId}/reject`);
      info('Árajánlat elutasítva');
      loadOffers();
    } catch (err) {
      alertError('Hiba történt');
    }
  };

  const handleSendCounter = async () => {
    if (!counterPrice || counterPrice <= 0) {
      alertError('Kérlek adj meg egy érvényes árat!');
      return;
    }

    try {
      await api.put(`/offers/${selectedOffer}/counter`, {
        counter_price: counterPrice
      });
      success('Visszaajánlat elküldve!');
      setShowCounterModal(false);
      setCounterPrice('');
      setSelectedOffer(null);
      loadOffers();
    } catch (err) {
      alertError(err.response?.data?.message || 'Hiba történt');
    }
  };

  const handleAcceptCounter = async (offerId) => {
    if (!window.confirm('Biztosan elfogadod a visszaájnlatot?')) return;
    
    try {
      await api.put(`/offers/${offerId}/accept-counter`);
      success('Visszaájnlat elfogadva!');
      loadOffers();
    } catch (err) {
      alertError('Hiba történt');
    }
  };

  const handleCancelOffer = async (offerId) => {
    if (!window.confirm('Biztosan visszavonod az árajánlat?')) return;
    
    try {
      await api.delete(`/offers/${offerId}`);
      info('Árajánlat törölve!');
      loadOffers();
      loadDailyLimit();
    } catch (err) {
      alertError('Hiba történt');
    }
  };

  const addToFavorites = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
        info('Eltávolítva a kedvencekből');
      } else {
        await api.post('/favorites', { item_id: id });
        setIsFavorite(true);
        success('Hozzáadva a kedvencekhez!');
      }
      loadItem(); 
    } catch (err) {
      console.error('Kedvenc hozzáadási hiba:', err);
      alertError(err.response?.data?.message || 'Hiba történt a kedvencek kezelésekor');
    }
  };

  const nextImage = () => {
    if (item?.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
    }
  };

  const prevImage = () => {
    if (item?.images && item.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
      counter_offered: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    };
    
    const labels = {
      pending: 'Függőben',
      accepted: 'Elfogadva',
      rejected: 'Elutasítva',
      counter_offered: 'Visszaajánlat'
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500 mb-4"></div>
            <p className="text-gray-400 text-lg">Betöltés...</p>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && user.user_id === item.seller_id;
  const myOffers = offers.filter(o => o.buyer_id === user?.user_id);
  const receivedOffers = offers.filter(o => o.seller_id === user?.user_id);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-gray-800 rounded-xl md:rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative">
                {item.images && item.images.length > 0 ? (
                  <>
                    <img
                      src={`http://localhost:5000${item.images[currentImageIndex].image_url}`}
                      alt={item.title}
                      className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
                    />
                    {item.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition"
                        >
                          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 md:p-3 rounded-full transition"
                        >
                          <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                          {item.images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentImageIndex(idx)}
                              className={`w-2 h-2 rounded-full transition ${
                                idx === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-64 md:h-96 lg:h-[500px] bg-gray-700 flex items-center justify-center">
                    <div className="text-center px-4">
                      <Tag className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-gray-600" />
                      <p className="text-gray-500 text-base md:text-lg">Nincs kép</p>
                    </div>
                  </div>
                )}
              </div>

              {item.images && item.images.length > 1 && (
                <div className="p-4 flex gap-3 overflow-x-auto">
                  {item.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                        idx === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={`http://localhost:5000${img.image_url}`}
                        alt=""
                        className="w-20 h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
              <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 md:w-6 md:h-6 text-blue-400" /> Termék részletei
              </h2>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed whitespace-pre-line">
                {item.description || 'Nincs részletes leírás megadva.'}
              </p>
            </div>

            {user && !isOwner && myOffers.length > 0 && (
              <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">Ajánlataid</h2>
                <div className="space-y-3">
                  {myOffers.map(offer => (
                    <div key={offer.offer_id} className="bg-gray-700 rounded-xl p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <div>
                          <p className="text-white font-semibold text-base md:text-lg">
                            Eredeti: {offer.offer_price.toLocaleString()} Ft
                          </p>
                          {offer.status === 'counter_offered' && offer.counter_price && (
                            <p className="text-yellow-400 font-semibold text-sm md:text-base">
                              Visszaajánlat: {offer.counter_price.toLocaleString()} Ft
                            </p>
                          )}
                          <p className="text-gray-400 text-xs md:text-sm">
                            {new Date(offer.created_at).toLocaleDateString('hu-HU')}
                          </p>
                        </div>
                        {getStatusBadge(offer.status)}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {offer.status === 'pending' && (
                          <button
                            onClick={() => handleCancelOffer(offer.offer_id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                          >
                            <X className="w-4 h-4 md:w-5 md:h-5" /> Visszavonás
                          </button>
                        )}
                        
                        {offer.status === 'counter_offered' && (
                          <>
                            <button
                              onClick={() => handleAcceptCounter(offer.offer_id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                            >
                              <Check className="w-4 h-4 md:w-5 md:h-5" /> Elfogadom
                            </button>
                            <button
                              onClick={() => handleCancelOffer(offer.offer_id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg transition font-semibold flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                            >
                              <X className="w-4 h-4 md:w-5 md:h-5" /> Elutasítom
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isOwner && receivedOffers.length > 0 && (
              <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-xl">
                <h2 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">Kapott ajánlatok</h2>
                <div className="space-y-3">
                  {receivedOffers.map(offer => (
                    <div key={offer.offer_id} className="bg-gray-700 rounded-xl p-3 md:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {offer.buyer_name[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-semibold">{offer.buyer_name}</p>
                            <p className="text-gray-400 text-sm">
                              {new Date(offer.created_at).toLocaleDateString('hu-HU')}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(offer.status)}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-white">
                          {offer.offer_price.toLocaleString()} Ft
                        </p>
                        
                        {offer.status === 'pending' && (
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() => handleAcceptOffer(offer.offer_id)}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 md:px-4 py-2 rounded-lg transition flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                            >
                              <Check className="w-4 h-4 md:w-5 md:h-5" /> Elfogad
                            </button>
                            <button
                              onClick={() => {
                                setSelectedOffer(offer.offer_id);
                                setCounterPrice(offer.offer_price);
                                setShowCounterModal(true);
                              }}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-4 py-2 rounded-lg transition flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                            >
                              <TrendingDown className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Visszaajánlat</span><span className="sm:hidden">Vissza</span>
                            </button>
                            <button
                              onClick={() => handleRejectOffer(offer.offer_id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 md:px-4 py-2 rounded-lg transition flex items-center justify-center gap-1 md:gap-2 text-sm md:text-base"
                            >
                              <X className="w-4 h-4 md:w-5 md:h-5" /> Elutasít
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl lg:sticky lg:top-20">
              <h1 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">{item.title}</h1>
              
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 md:p-6 mb-4 md:mb-6 text-center">
                <p className="text-blue-100 text-xs md:text-sm mb-1">Ár</p>
                <p className="text-3xl md:text-5xl font-bold text-white">{item.price.toLocaleString()}</p>
                <p className="text-lg md:text-2xl font-bold text-white">Ft</p>
              </div>

              <div className="bg-gray-700 rounded-xl p-3 md:p-4 mb-4 md:mb-6 cursor-pointer hover:bg-gray-600 transition" onClick={() => navigate(`/user/${item.user_id}`)}>
                <p className="text-gray-400 text-xs md:text-sm mb-2">Eladó</p>
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg">
                    {item.seller_name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-base md:text-lg hover:text-blue-400 transition truncate">{item.seller_name}</p>
                    <p className="text-gray-400 text-xs md:text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 flex-shrink-0" /> <span className="truncate">Tag {new Date(item.created_at).toLocaleDateString('hu-HU')} óta</span>
                    </p>
                  </div>
                </div>
              </div>

              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 md:py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 font-bold text-base md:text-lg transition shadow-lg mb-3 flex items-center justify-center gap-2"
                >
                  Bejelentkezés <ArrowRight className="w-5 h-5" />
                </button>
              )}

              {user && !isOwner && (
                <div className="space-y-2 md:space-y-3">
                  <button
                    onClick={() => navigate(`/messages/${item.seller_id}`)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 md:py-4 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5" /> Üzenet küldése
                  </button>

                  <button
                    onClick={() => setShowOfferModal(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 md:py-4 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <TrendingDown className="w-4 h-4 md:w-5 md:h-5" /> Árajánlat küldése
                  </button>

                  <button
                    onClick={addToFavorites}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 md:py-4 rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
                  >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    {isFavorite ? 'Kedvencekben' : 'Kedvencekhez'} 
                    <span className="bg-gray-800 px-2 py-0.5 rounded-full text-xs ml-1">
                      {item.favorites_count || 0}
                    </span>
                  </button>

                  {dailyLimit && (
                    <div className="bg-gray-700 rounded-xl p-3 md:p-4 text-center">
                      <p className="text-gray-400 text-xs md:text-sm mb-1">Mai ajánlatok</p>
                      <p className="text-white font-bold text-xl md:text-2xl">
                        {dailyLimit.remaining} / {dailyLimit.limit}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">maradt ma</p>
                    </div>
                  )}
                </div>
              )}

              {isOwner && (
                <div className="bg-gray-700 rounded-xl p-3 md:p-4 text-center">
                  <AlertCircle className="mx-auto mb-2 text-blue-400 w-7 h-7 md:w-8 md:h-8" />
                  <p className="text-white font-semibold text-sm md:text-base">Ez a te hirdetésed</p>
                  <p className="text-gray-400 text-xs md:text-sm mt-1">Nem tudsz saját magadnak ajánlatot küldeni</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showOfferModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-2">Árajánlat küldése</h2>
            <p className="text-gray-400 mb-6">Ajánld meg az árat, amit szeretnél fizetni</p>
            
            <div className="bg-gray-700 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm">Eredeti ár</p>
              <p className="text-white text-2xl font-bold">{item.price.toLocaleString()} Ft</p>
              <div className="mt-2 pt-2 border-t border-gray-600">
                <p className="text-gray-500 text-xs">Minimális ajánlat (70%)</p>
                <p className="text-gray-400 text-sm font-semibold">{Math.ceil(item.price * 0.7).toLocaleString()} Ft</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-semibold">Az ajánlatod (Ft)</label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder={`Minimum ${Math.ceil(item.price * 0.7).toLocaleString()} Ft`}
                min={Math.ceil(item.price * 0.7)}
                max={item.price}
                className="w-full px-4 py-4 bg-gray-700 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
              <p className="text-gray-500 text-xs mt-2">Maximum 30% kedvezményt adhatsz</p>
            </div>

            {dailyLimit.remaining <= 5 && (
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-xl p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-yellow-300 text-sm">
                  Csak {dailyLimit.remaining} ajánlatod maradt ma!
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setOfferPrice('');
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Mégse
              </button>
              <button
                onClick={handleSendOffer}
                disabled={!offerPrice || offerPrice <= 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Küldés
              </button>
            </div>
          </div>
        </div>
      )}

      {showCounterModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-bold text-white mb-2">Visszaajánlat</h2>
            <p className="text-gray-400 mb-6">Add meg a saját ajánlatodat</p>
            
            <div className="bg-gray-700 rounded-xl p-4 mb-4">
              <p className="text-gray-400 text-sm">Eredeti ár</p>
              <p className="text-white text-2xl font-bold">{item.price.toLocaleString()} Ft</p>
              <div className="mt-2 pt-2 border-t border-gray-600">
                <p className="text-gray-500 text-xs">Minimális visszaajánlat (70%)</p>
                <p className="text-gray-400 text-sm font-semibold">{Math.ceil(item.price * 0.7).toLocaleString()} Ft</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-semibold">Visszaajánlat (Ft)</label>
              <input
                type="number"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
                placeholder={`Minimum ${Math.ceil(item.price * 0.7).toLocaleString()} Ft`}
                min={Math.ceil(item.price * 0.7)}
                max={item.price}
                className="w-full px-4 py-4 bg-gray-700 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                autoFocus
              />
              <p className="text-gray-500 text-xs mt-2">Maximum 30% kedvezményt adhatsz</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCounterModal(false);
                  setCounterPrice('');
                  setSelectedOffer(null);
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition"
              >
                Mégse
              </button>
              <button
                onClick={handleSendCounter}
                disabled={!counterPrice || counterPrice <= 0}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Küldés
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
