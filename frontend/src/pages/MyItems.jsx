import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import Navbar from "../components/Navbar";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  DollarSign,
  Box,
} from "lucide-react";

export default function MyItems() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: alertError } = useAlert();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    reserved: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadItems();
  }, [user]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/my-items");
      const itemsData = response.data.items || [];
      setItems(itemsData);

      setStats({
        total: itemsData.length,
        available: itemsData.filter((i) => i.status === "available").length,
        sold: itemsData.filter((i) => i.status === "sold").length,
        reserved: itemsData.filter((i) => i.status === "reserved").length,
      });
    } catch (error) {
      console.error("Hiba:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId, e) => {
    e.stopPropagation();
    if (!window.confirm("Biztosan törlöd ezt a hirdetést?")) return;

    try {
      await api.delete(`/items/${itemId}`);
      setItems(items.filter((item) => item.item_id !== itemId));
      success("Hirdetés sikeresen törölve");
    } catch (error) {
      console.error(error);
      alertError("Hiba történt a törlés során");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 flex items-center gap-2 md:gap-3">
                <Package className="w-7 h-7 md:w-9 md:h-9" /> Hirdetéseim
              </h1>
              <p className="text-sm md:text-base text-blue-100">
                Kezeld és kövesd nyomon a hirdetéseidet
              </p>
            </div>
            <button
              onClick={() => navigate("/new-item")}
              className="w-full sm:w-auto bg-white text-blue-600 px-4 md:px-6 py-2 md:py-3 rounded-full font-bold hover:bg-gray-100 transition shadow-lg flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5" /> Új hirdetés
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6 md:-mt-8 mb-6 md:mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl p-4 md:p-6 text-center">
            <div className="text-2xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              {stats.total}
            </div>
            <div className="text-xs md:text-sm text-gray-400">Összes</div>
          </div>
          <div className="bg-green-900/40 backdrop-blur-lg border border-green-700 rounded-xl p-4 md:p-6 text-center">
            <div className="text-2xl md:text-4xl font-bold text-green-400 mb-1 md:mb-2">
              {stats.available}
            </div>
            <div className="text-xs md:text-sm text-green-300">Aktív</div>
          </div>
          <div className="bg-red-900/40 backdrop-blur-lg border border-red-700 rounded-xl p-4 md:p-6 text-center">
            <div className="text-2xl md:text-4xl font-bold text-red-400 mb-1 md:mb-2">
              {stats.sold}
            </div>
            <div className="text-xs md:text-sm text-red-300">Eladva</div>
          </div>
          <div className="bg-yellow-900/40 backdrop-blur-lg border border-yellow-700 rounded-xl p-4 md:p-6 text-center">
            <div className="text-2xl md:text-4xl font-bold text-yellow-400 mb-1 md:mb-2">
              {stats.reserved}
            </div>
            <div className="text-xs md:text-sm text-yellow-300">Foglalt</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-600 border-t-blue-500"></div>
            <p className="text-gray-400 mt-4">Betöltés...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 md:py-20 bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700 px-4">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">📦</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Még nincs hirdetésed
            </h3>
            <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6">
              Kezdj el eladásba és add fel az első hirdetésedet!
            </p>
            <button
              onClick={() => navigate("/new-item")}
              className="bg-blue-600 text-white px-6 md:px-8 py-2.5 md:py-3 rounded-lg hover:bg-blue-700 font-semibold transition text-sm md:text-base"
            >
              ➕ Első hirdetés feladása
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.item_id}
                className="group bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-xl overflow-hidden hover:border-blue-500 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => navigate(`/item/${item.item_id}`)}
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

                  {/* Státusz badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "available"
                          ? "bg-green-500 text-white"
                          : item.status === "sold"
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500 text-black"
                      }`}
                    >
                      {item.status === "available"
                        ? "✓ Elérhető"
                        : item.status === "sold"
                        ? "✓ Eladva"
                        : "⏳ Foglalt"}
                    </span>
                  </div>
                </div>

                <div className="p-3 md:p-4">
                  <h3 className="font-bold text-base md:text-lg text-white mb-2 truncate group-hover:text-blue-400 transition">
                    {item.title}
                  </h3>
                  <p className="text-blue-400 font-bold text-xl md:text-2xl mb-2 md:mb-3">
                    {item.price.toLocaleString()} Ft
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/item/${item.item_id}/edit`);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition flex items-center justify-center gap-1"
                    >
                      <Edit className="w-3 h-3 md:w-3.5 md:h-3.5" />{" "}
                      <span className="hidden sm:inline">Szerkesztés</span>
                      <span className="sm:hidden">Szerk.</span>
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.item_id, e)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 md:w-3.5 md:h-3.5" /> Törlés
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
