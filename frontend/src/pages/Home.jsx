import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ItemCard from '../components/ItemCard';
import { useAuth } from '../hooks/useAuth';
import { Search, Home as HomeIcon, Plus, Shield, MessageCircle, Zap, Frown } from 'lucide-react';

export default function Home() {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        loadItems();
        loadCategories();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            const response = await api.get('/items');
            setItems(response.data.items || []);
        } catch (error) {
            console.error('Hiba:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data.categories || []);
        } catch (error) {
            console.error('Kategóriák betöltési hiba:', error);
            setCategories([]);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesCategory = selectedCategory === 'all' || item.category_id === parseInt(selectedCategory);
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 md:py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 md:mb-6">
                        Vásárolj és adj el használt termékeket
                    </h1>
                    <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 max-w-2xl mx-auto">
                        Fedezd fel a legjobb ajánlatokat ruhákra, elektronikára és még sok másra!
                    </p>

                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Keress márkára, termékre, színre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 pr-12 rounded-full text-lg bg-white text-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300"
                            />
                            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
                                <Search size={20} />
                            </button>
                        </div>
                    </div>

                    {!user && (
                        <div className="mt-6 md:mt-8 flex gap-3 md:gap-4 justify-center flex-wrap px-4">
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-white text-blue-600 px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-gray-100 transition shadow-lg"
                            >
                                Regisztrálj most
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-transparent border-2 border-white text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-white hover:text-blue-600 transition"
                            >
                                Bejelentkezés
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-40 shadow-md">
                <div className="container mx-auto px-4 py-4">
                    <div className="md:hidden">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                            style={{ backgroundImage: 'none' }}
                        >
                            <option value="all">Összes kategória</option>
                            {categories.map(cat => (
                                <option key={cat.category_id} value={cat.category_id.toString()}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="hidden md:flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition flex items-center gap-2 ${selectedCategory === 'all'
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                                }`}
                        >
                            <HomeIcon size={18} /> Összes
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.category_id}
                                onClick={() => setSelectedCategory(cat.category_id.toString())}
                                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition ${selectedCategory === cat.category_id.toString()
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                        {selectedCategory === 'all' ? 'Összes hirdetés' : categories.find(c => c.category_id.toString() === selectedCategory)?.name}
                        <span className="text-gray-500 ml-2">({filteredItems.length})</span>
                    </h2>

                    {user && (
                        <button
                            onClick={() => navigate('/new-item')}
                            className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center"
                        >
                            <Plus size={18} className="md:w-5 md:h-5" /> Új hirdetés
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500"></div>
                        <p className="text-gray-400 mt-4">Hirdetések betöltése...</p>
                    </div>
                ) : filteredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredItems.map(item => (
                            <ItemCard
                                key={item.item_id}
                                item={item}
                                onClick={() => navigate(`/item/${item.item_id}`)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-800 rounded-lg">
                        <Frown size={64} className="mx-auto mb-4 text-gray-500" />
                        <p className="text-gray-300 text-xl mb-2">Nincs találat</p>
                        <p className="text-gray-500">Próbálj meg más keresési feltételeket</p>
                    </div>
                )}
            </div>

            <div className="bg-gray-800 border-t border-gray-700 py-12 md:py-16 mt-8 md:mt-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 md:mb-12">Miért válaszd a Bellora-t?</h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="text-center">
                            <Shield className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-blue-400" />
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Biztonságos vásárlás</h3>
                            <p className="text-sm md:text-base text-gray-400">Minden eladó értékelve van, biztonságosan vásárolhatsz</p>
                        </div>
                        <div className="text-center">
                            <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-purple-400" />
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Közvetlen chat</h3>
                            <p className="text-sm md:text-base text-gray-400">Kommunikálj közvetlenül az eladókkal valós időben</p>
                        </div>
                        <div className="text-center">
                            <Zap className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-yellow-400" />
                            <h3 className="text-lg md:text-xl font-bold text-white mb-2">Gyors eladás</h3>
                            <p className="text-sm md:text-base text-gray-400">Add fel hirdetésed percek alatt, teljesen ingyen</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}