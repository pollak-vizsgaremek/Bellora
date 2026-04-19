import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { UploadCloud, Lightbulb } from 'lucide-react';

export default function NewItem() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { success, error: alertError } = useAlert();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [categoryId, setCategoryId] = useState('1');
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const newImages = [...images, ...files].slice(0, 10); // Max 10 images
            setImages(newImages);
            
            const newPreviews = [];
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    if (newPreviews.length === files.length) {
                        setImagePreviews([...imagePreviews, ...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!price || parseFloat(price) <= 0) {
            alertError('Az árnak nullánál nagyobbnak kell lennie!');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/items', {
                title,
                description,
                price: parseFloat(price),
                category_id: categoryId
            });

            if (images.length > 0) {
                const formData = new FormData();
                images.forEach((image, index) => {
                    formData.append('images', image);
                });

                await api.post(`/items/${response.data.item_id}/images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            success('Hirdetés sikeresen létrehozva!');
            navigate('/my-items');
        } catch (error) {
            alertError('Hiba történt: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-3xl">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 md:mb-8">Új hirdetés feladása</h1>

                <form onSubmit={handleSubmit} className="bg-gray-800 p-4 md:p-8 rounded-lg shadow-xl border border-gray-700">
                    <div className="mb-4 md:mb-6">
                        <label className="block text-gray-300 font-semibold mb-2 md:mb-3 text-base md:text-lg">Képek feltöltése (max. 10 kép)</label>
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 md:p-6 text-center hover:border-blue-500 transition">
                            {imagePreviews.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <img src={preview} alt={`Előnézet ${index + 1}`} className="w-full h-32 object-cover rounded" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 text-sm"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {images.length < 10 && (
                                        <label className="cursor-pointer inline-block">
                                            <span className="text-blue-400 hover:text-blue-300 text-sm">+ További kép hozzáadása</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-500 mb-3" />
                                    <label className="cursor-pointer">
                                        <span className="text-blue-400 hover:text-blue-300">Kattints ide a képek feltöltéséhez</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    <p className="text-gray-500 text-sm mt-2">Több kép is feltölthető, PNG, JPG, GIF maximum 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-300 font-semibold mb-2">Cím *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="pl. IPhone 13 Pro 256GB"
                            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-300 font-semibold mb-2">Részletes leírás *</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Írd le a termék állapotát, tulajdonságait..."
                            className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg h-40 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            required
                        />
                        <p className="text-gray-500 text-sm mt-1">Minimum 20 karakter</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                        <div>
                            <label className="block text-gray-300 font-semibold mb-2 text-sm md:text-base">Ár (Ft) *</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="1000"
                                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                min="1"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 font-semibold mb-2 text-sm md:text-base">Kategória</label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="1">Ruházat</option>
                                <option value="2">Elektronika</option>
                                <option value="3">Bútor</option>
                                <option value="4">Sport</option>
                                <option value="5">Könyvek</option>
                                <option value="6">Egyéb</option>
                            </select>
                        </div>
                    </div>

                    <div className="border-t border-gray-700 pt-4 md:pt-6 mt-4 md:mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 md:py-4 rounded-lg hover:bg-blue-700 font-bold text-base md:text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                'Feltöltés...'
                            ) : (
                                <>
                                    <UploadCloud className="inline-block mr-2 w-5 h-5" /> Hirdetés feladása
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="w-full mt-2 md:mt-3 bg-gray-700 text-gray-300 py-2 md:py-3 rounded-lg hover:bg-gray-600 font-semibold transition text-sm md:text-base"
                        >
                            Mégse
                        </button>
                    </div>
                </form>

                <div className="mt-8 bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-white font-bold mb-3"><Lightbulb className="inline-block mr-2 w-5 h-5 text-yellow-400" /> Tippek sikeres hirdetéshez:</h3>
                    <ul className="text-gray-400 space-y-2 text-sm">
                        <li>Készíts jó minőségű fotókat világos helyen</li>
                        <li>Írd le pontosan a termék állapotát</li>
                        <li>Add meg az összes fontos tulajdonságot (méret, szín, márka)</li>
                        <li>Határozz meg reális árat a termék állapotához képest</li>
                        <li>Válaszolj gyorsan az érdeklődőknek</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}