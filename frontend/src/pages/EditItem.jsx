import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { Edit, Save, X, Upload, Image as ImageIcon, Trash2, GripVertical } from 'lucide-react';

export default function EditItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: alertError } = useAlert();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    status: 'available'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadItem();
    loadCategories();
  }, [user, id]);

  const loadItem = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      const item = response.data.item;

      if (item.user_id !== user.user_id) {
        alertError('Nincs jogosultságod szerkeszteni ezt a hirdetést');
        navigate('/');
        return;
      }

      setFormData({
        title: item.title,
        description: item.description || '',
        price: item.price,
        category_id: item.category_id,
        status: item.status
      });

      const imagesResponse = await api.get(`/items/${id}/images`);
      setExistingImages(imagesResponse.data.images || []);

      setLoading(false);
    } catch (error) {
      console.error('Hiba:', error);
      alertError('Nem sikerült betölteni a hirdetést');
      navigate('/my-items');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Hiba:', error);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const deleteExistingImage = async (imageId) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a képet?')) return;

    try {
      await api.delete(`/items/${id}/images/${imageId}`);
      setExistingImages(existingImages.filter(img => img.image_id !== imageId));
      success('Kép törölve');
    } catch (error) {
      console.error('Hiba:', error);
      alertError('Nem sikerült törölni a képet');
    }
  };

  const setPrimaryImage = async (imageId) => {
    try {
      await api.put(`/items/${id}/images/${imageId}/primary`);
      setExistingImages(existingImages.map(img => ({
        ...img,
        is_primary: img.image_id === imageId ? 1 : 0
      })));
      success('Elsődleges kép beállítva');
    } catch (error) {
      console.error('Hiba:', error);
      alertError('Nem sikerült beállítani az elsődleges képet');
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...existingImages];
    const draggedItem = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedItem);

    setExistingImages(newImages);
    setDraggedIndex(index);
  };

  const handleDragEnd = async () => {
    if (draggedIndex === null) return;

    try {
      const orderData = existingImages.map((img, index) => ({
        image_id: img.image_id,
        display_order: index
      }));

      await api.put(`/items/${id}/images/reorder`, { images: orderData });

      if (existingImages.length > 0) {
        await setPrimaryImage(existingImages[0].image_id);
      }
    } catch (error) {
      console.error('Hiba:', error);
      alertError('Nem sikerült frissíteni a sorrrendet');
    }

    setDraggedIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      alertError('Kérlek töltsd ki a kötelező mezőket!');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      alertError('Az árnak nullánál nagyobbnak kell lennie!');
      return;
    }

    setSubmitting(true);
    try {
      await api.put(`/items/${id}`, formData);

      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach(image => {
          imageFormData.append('images', image);
        });

        await api.post(`/items/${id}/images`, imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      success('Hirdetés sikeresen frissítve!');
      navigate('/my-items');
    } catch (error) {
      console.error('Hiba:', error);
      alertError('Hiba történt a mentés során');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />


      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2 md:gap-3">
            <Edit className="w-7 h-7 md:w-9 md:h-9" /> Hirdetés szerkesztése
          </h1>
          <p className="text-sm md:text-base text-blue-100">Frissítsd a hirdetés adatait</p>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-6 md:py-12 max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-8 shadow-2xl border border-gray-700">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">
                Hirdetés címe <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="pl. iPhone 12 64GB"
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Leírás</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Részletes leírás a termékről..."
                rows={6}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Ár (Ft) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="10000"
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">Kategória</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Válassz kategóriát</option>
                  {categories.map(cat => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">Állapot</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="available">Elérhető</option>
                <option value="reserved">Foglalt</option>
                <option value="sold">Eladva</option>
              </select>
            </div>

            {existingImages.length > 0 && (
              <div>
                <label className="block text-white font-semibold mb-3">Jelenlegi képek (húzd a sorrendbe)</label>
                <p className="text-gray-400 text-sm mb-3">Az első kép lesz a borítókép a hirdetés kártyáján</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((img, index) => (
                    <div
                      key={img.image_id}
                      className="relative group cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="absolute top-2 left-2 z-10 bg-gray-800 text-white px-2 py-1 rounded flex items-center gap-1">
                        <GripVertical size={14} />
                        <span className="text-xs font-bold">#{index + 1}</span>
                      </div>
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${img.image_url}`}
                        alt="Item"
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-600"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                          Borítókép
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => deleteExistingImage(img.image_id)}
                          className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-white font-semibold mb-3">Új képek hozzáadása</label>
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-6 hover:border-blue-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload size={48} className="text-gray-400 mb-2" />
                  <span className="text-gray-300 font-semibold">Kattints vagy húzd ide a képeket</span>
                  <span className="text-gray-500 text-sm mt-1">PNG, JPG, JPEG (Max 10MB)</span>
                </label>
              </div>

              {newImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {newImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(img)}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                      />
                      <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Új
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => navigate('/my-items')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              <X size={20} /> Mégse
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Mentés...</span>
                </>
              ) : (
                <>
                  <Save size={20} /> Mentés
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
