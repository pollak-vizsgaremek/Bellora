import { useNavigate } from 'react-router-dom';

export default function ItemCard({ item }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/item/${item.item_id}`)}
            className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200 group"
        >
            {item.image_url ? (
                <img
                    src={`http://localhost:5000${item.image_url}`}
                    alt={item.title}
                    className="w-full h-40 sm:h-48 md:h-52 object-cover group-hover:scale-105 transition-transform duration-200"
                />
            ) : (
                <div className="w-full h-40 sm:h-48 md:h-52 bg-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Nincs kép</span>
                </div>
            )}
            <div className="p-3 md:p-4">
                <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-white truncate">{item.title}</h3>
                <p className="text-blue-400 font-bold text-lg md:text-xl mb-1 md:mb-2">{item.price.toLocaleString()} Ft</p>
                <p className="text-gray-400 text-xs md:text-sm">Eladó: {item.seller_name}</p>
                <div className="flex items-center gap-1 mt-2 text-gray-500 text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
                    {item.favorites_count || 0}
                </div>
            </div>
        </div>
    );
}