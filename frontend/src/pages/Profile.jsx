import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Camera, Check, X, Package, BadgeDollarSign, Heart, MessageCircle, ClipboardList, Plus, Save, Lock, Trash2 } from 'lucide-react';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const { success, error: alertError, info } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, text: '', action: null });

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [stats, setStats] = useState({
    itemsCount: 0,
    soldCount: 0,
    favoritesCount: 0,
    messagesCount: 0
  });

  useEffect(() => {
    if (user) {
      loadUserData();
      loadStats();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      const userData = response.data.user;
      setUsername(userData.username || '');
      setEmail(userData.email || '');
      setFullName(userData.full_name || '');
      setPhone(userData.phone || '');
      setAddress(userData.address || '');
      setCity(userData.city || '');
      setPostalCode(userData.postal_code || '');
      setProfileImage(userData.profile_image || '');
    } catch (error) {
      console.error('Hiba a profil betöltésekor:', error);
    }
  };

  const loadStats = async () => {
    try {
      const [itemsRes, favoritesRes] = await Promise.all([
        api.get('/my-items'),
        api.get('/favorites')
      ]);

      setStats({
        itemsCount: itemsRes.data.items?.length || 0,
        soldCount: 0,
        favoritesCount: favoritesRes.data.favorites?.length || 0,
        messagesCount: 0
      });
    } catch (error) {
      console.error('Hiba a statisztikák betöltésekor:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('A kép maximum 5MB lehet!');
        return;
      }
      setNewProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadProfileImage = async () => {
    if (!newProfileImage) return;

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('profile_image', newProfileImage);

      const response = await api.post('/users/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setProfileImage(response.data.image_url);
      setNewProfileImage(null);
      setImagePreview(null);
      updateUser({ profile_image: response.data.image_url });
      setMessage('Profilkép sikeresen feltöltve!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Hiba történt: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Phone number validation for Hungarian numbers
    if (phone && !/^(\+36|06)[0-9]{9}$/.test(phone.replace(/\s/g, ''))) {
      setMessage('Hibás telefonszám formátum! Használj +36 vagy 06 előtagot, majd 9 számjegyet.');
      setLoading(false);
      return;
    }

    // Postal code validation - only numbers
    if (postalCode && !/^[0-9]{4}$/.test(postalCode)) {
      setMessage('Az irányítószám csak 4 számjegy lehet!');
      setLoading(false);
      return;
    }

    try {
      await api.put('/users/profile', {
        full_name: fullName,
        phone,
        address,
        city,
        postal_code: postalCode
      });

      updateUser({ full_name: fullName, phone, address, city, postal_code: postalCode });
      setMessage('Profil sikeresen frissítve!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Hiba történt: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('Az új jelszavak nem egyeznek!');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Az új jelszó legalább 6 karakter legyen!');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await api.put('/users/password', {
        old_password: oldPassword,
        new_password: newPassword
      });

      setMessage('Jelszó sikeresen megváltoztatva!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Hiba: ' + (error.response?.data?.message || 'Hibás régi jelszó'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    setConfirmModal({
      isOpen: true,
      text: 'Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem visszavonható!',
      action: () => {
        // Késleltetjük egy picit a második modalt, hogy simább legyen az átmenet
        setTimeout(() => {
          setConfirmModal({
            isOpen: true,
            text: 'Utoljára kérdezzük: tényleg törölni szeretnéd az összes hirdetésedet és adatodat?',
            action: async () => {
              try {
                await api.delete('/users/account');
                success('Fiók törölve. Viszlát!');
                logout();
                navigate('/');
              } catch (error) {
                alertError('Hiba történt: ' + (error.response?.data?.message || error.message));
              }
            }
          });
        }, 100);
      }
    });
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-6xl">
        <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8">Profil beállítások</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.toLowerCase().includes('sikeresen') || message.toLowerCase().includes('sikeres') || message.toLowerCase().includes('feltöltve') || message.toLowerCase().includes('megváltoztatva') || message.toLowerCase().includes('frissítve') ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700 mb-4 md:mb-6">
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  {imagePreview || profileImage ? (
                    <img
                      src={imagePreview || `${import.meta.env.VITE_BASE_URL}${profileImage}`}
                      alt="Profilkép"
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold">
                      {username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Camera className="w-6 h-6" />
                  </label>
                </div>

                {imagePreview && (
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={handleUploadProfileImage}
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm disabled:opacity-50"
                    >
                      <><Check className="w-4 h-4 mr-1" /> Mentés</>
                    </button>
                    <button
                      onClick={() => {
                        setNewProfileImage(null);
                        setImagePreview(null);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      <><X className="w-4 h-4 mr-1" /> Mégse</>
                    </button>
                  </div>
                )}

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white">{username}</h2>
                  <p className="text-gray-400">{email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center gap-2"><Package size={18} /> Hirdetések</span>
                  <span className="text-white font-bold">{stats.itemsCount}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center gap-2"><BadgeDollarSign size={18} /> Eladott</span>
                  <span className="text-white font-bold">{stats.soldCount}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center gap-2"><Heart size={18} /> Kedvencek</span>
                  <span className="text-white font-bold">{stats.favoritesCount}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400 flex items-center gap-2"><MessageCircle size={18} /> Üzenetek</span>
                  <span className="text-white font-bold">{stats.messagesCount}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Gyors linkek</h3>
              <div className="space-y-2">
                <button onClick={() => navigate('/my-items')} className="w-full text-left text-gray-300 hover:text-white py-2">
                  <span className="flex items-center gap-2"><ClipboardList size={18} /> Hirdetéseim</span>
                </button>
                <button onClick={() => navigate('/favorites')} className="w-full text-left text-gray-300 hover:text-white py-2">
                  <span className="flex items-center gap-2"><Heart size={18} /> Kedvencek</span>
                </button>
                <button onClick={() => navigate('/messages')} className="w-full text-left text-gray-300 hover:text-white py-2">
                  <span className="flex items-center gap-2"><MessageCircle size={18} /> Üzenetek</span>
                </button>
                <button onClick={() => navigate('/new-item')} className="w-full text-left text-gray-300 hover:text-white py-2">
                  <span className="flex items-center gap-2"><Plus size={18} /> Új hirdetés</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Személyes adatok</h2>

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Felhasználónév</label>
                    <input
                      type="text"
                      value={username}
                      disabled
                      className="w-full px-4 py-3 bg-gray-700 text-gray-500 border border-gray-600 rounded-lg cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nem módosítható</p>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Email cím</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-3 bg-gray-700 text-gray-500 border border-gray-600 rounded-lg cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Nem módosítható</p>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Teljes név</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="pl. Nagy János"
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Telefonszám</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+36 20 123 4567"
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Cím</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="pl. Fő utca 123."
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Város</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="pl. Budapest"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Irányítószám</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="1234"
                      className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Mentés...' : <span className="flex items-center justify-center gap-2"><Save size={18} /> Profil mentése</span>}
                </button>
              </form>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Jelszó megváltoztatása</h2>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Jelenlegi jelszó</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Új jelszó</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Legalább 6 karakter</p>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Új jelszó megerősítése</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-semibold transition disabled:opacity-50"
                >
                  {loading ? 'Mentés...' : <span className="flex items-center justify-center gap-2"><Lock size={18} /> Jelszó változtatása</span>}
                </button>
              </form>
            </div>

            <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-red-700">
              <h2 className="text-2xl font-bold text-red-400 mb-4">Veszélyzóna</h2>
              <p className="text-gray-400 mb-4">
                Ha törlöd a fiókodat, az összes hirdetésed és adatod véglegesen törlődik. Ez a művelet nem visszavonható!
              </p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold transition"
              >
                <span className="flex items-center justify-center gap-2"><Trash2 size={18} /> Fiók törlése</span>
              </button>
            </div>
          </div>
        </div>
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
                  if (!confirmModal.action?.toString().includes('Utoljára kérdezzük')) {
                    setConfirmModal({ isOpen: false, text: '', action: null });
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              >
                Tovább
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
