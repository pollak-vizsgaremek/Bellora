import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../context/AlertContext';
import api from '../services/api';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import { MessageCircle, Send, ArrowLeft, Mail, MessageSquare, CheckCircle, XCircle, RotateCcw, Clock } from 'lucide-react';

export default function Messages() {
  const { userId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { success, error: alertError, info } = useAlert();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadConversations();

    const newSocket = io(import.meta.env.VITE_BASE_URL);
    setSocket(newSocket);

    newSocket.emit('user_connected', user.user_id);

    newSocket.on('receive_message', (data) => {
      if (userId && (data.sender_id == userId || data.receiver_id == userId)) {
        setMessages(prev => [...prev, data]);
      }
      loadConversations();
    });

    newSocket.on('offer_status_changed', (data) => {
      setMessages(prev => prev.map(msg =>
        msg.offer_id === data.offer_id
          ? { ...msg, offer_status: data.status, counter_price: data.counter_price || msg.counter_price }
          : msg
      ));
    });

    return () => newSocket.close();
  }, [user]);

  useEffect(() => {
    if (userId) {
      loadMessages(userId);
      const conv = conversations.find(c => c.other_user_id == userId);
      if (conv) {
        setSelectedUser(conv.other_user_name);
      }
    }
  }, [userId, conversations]);

  const loadConversations = async () => {
    try {
      const response = await api.get('/conversations');
      setConversations(response.data.conversations);
    } catch (error) {
      console.error('Hiba:', error);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const response = await api.get(`/messages/${otherUserId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Hiba:', error);
    }
  };

  const handleOfferAction = async (offerId, action) => {
    try {
      let response;
      if (action === 'accept') {
        response = await api.put(`/offers/${offerId}/accept`);
        success(response.data.message);
      } else if (action === 'reject') {
        response = await api.put(`/offers/${offerId}/reject`);
        info(response.data.message);
      } else if (action === 'accept-counter') {
        response = await api.put(`/offers/${offerId}/accept-counter`);
        success(response.data.message);
      }
      loadMessages(userId);
    } catch (error) {
      alertError(error.response?.data?.message || 'Hiba történt');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post('/messages', {
        receiver_id: userId,
        content: newMessage
      });

      if (socket) {
        socket.emit('send_message', {
          sender_id: user.user_id,
          receiver_id: userId,
          content: newMessage
        });
      }

      setMessages(prev => [...prev, {
        sender_id: user.user_id,
        receiver_id: userId,
        content: newMessage,
        sent_at: new Date()
      }]);

      setNewMessage('');
      loadConversations();
    } catch (error) {
      alertError('Hiba történt');
    }
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      <Navbar />

      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 md:py-6 px-4 flex-shrink-0">
        <div className="container mx-auto">
          <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
            <MessageCircle className="w-6 h-6 md:w-8 md:h-8" /> Üzenetek
          </h1>
          <p className="text-white/80 mt-1 text-xs md:text-sm">Beszélgetéseid egy helyen</p>
        </div>
      </div>

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-6 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
          <div className={`bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col border border-white/10 h-full overflow-hidden ${userId ? 'hidden md:flex' : 'flex'
            }`}>
            <div className="p-3 md:p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex-shrink-0">
              <h2 className="font-bold text-lg md:text-xl text-white flex items-center gap-2">
                <Mail size={18} className="md:w-5 md:h-5" /> Beszélgetések
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-6 md:p-8 text-center">
                  <MessageSquare className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-sm md:text-base text-gray-400">Nincs még beszélgetésed</p>
                  <p className="text-xs md:text-sm text-gray-500 mt-2">Írj valakinek először!</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.other_user_id}
                    onClick={() => navigate(`/messages/${conv.other_user_id}`)}
                    className={`p-3 md:p-4 border-b border-white/5 cursor-pointer transition-all duration-200 ${userId == conv.other_user_id
                      ? 'bg-blue-500/30 border-l-4 border-l-blue-500'
                      : 'hover:bg-white/5'
                      }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-base md:text-lg">
                        {conv.other_user_name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm md:text-base text-white">{conv.other_user_name}</h3>
                        <p className="text-xs md:text-sm text-gray-400 truncate">{conv.last_message}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`md:col-span-2 bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col border border-white/10 h-full overflow-hidden ${userId ? 'flex' : 'hidden md:flex'
            }`}>
            {userId ? (
              <>
                <div className="p-3 md:p-4 border-b border-white/10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex-shrink-0">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button
                      onClick={() => navigate('/messages')}
                      className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
                    >
                      <ArrowLeft size={20} className="text-white" />
                    </button>
                    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm md:text-base">
                      {selectedUser?.[0]?.toUpperCase()}
                    </div>
                    <h2 className="font-bold text-lg md:text-xl text-white truncate">{selectedUser || 'Chat'}</h2>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-900/50">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                      <MessageCircle className="w-12 h-12 md:w-16 md:h-16 mb-4 text-gray-500" />
                      <p className="text-sm md:text-base">Még nincsenek üzenetek</p>
                      <p className="text-xs md:text-sm text-gray-500 mt-2">Kezdj el beszélgetni!</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.sender_id == user.user_id ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        <div
                          className={`max-w-[95%] md:max-w-lg ${msg.offer_id && msg.item_id ? '' : `px-3 py-2 md:px-5 md:py-3 rounded-2xl shadow-lg ${msg.sender_id == user.user_id
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm'
                            : 'bg-gray-700/80 backdrop-blur-sm text-white border border-white/10 rounded-bl-sm'
                            }`
                            }`}
                        >

                          {msg.offer_id && msg.item_id && !msg.content ? (
                            <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
                              <div className="p-3 md:p-4 border-b border-gray-700">
                                <h4 className="font-semibold text-white text-sm md:text-base mb-2">{msg.item_title}</h4>
                                <p className="text-gray-400 text-xs md:text-sm">
                                  Eredeti ár: <span className="font-bold text-gray-200">{msg.item_price?.toLocaleString()} Ft</span>
                                </p>
                              </div>

                              <div className="p-3 md:p-4 bg-gray-750/50">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs md:text-sm text-gray-400">Ajánlat:</span>
                                  <span className="text-lg md:text-xl font-bold text-teal-400">
                                    {(msg.counter_price || msg.offer_price)?.toLocaleString()} Ft
                                  </span>
                                </div>

                                <div className="mb-3">
                                  {msg.offer_status === 'pending' && (
                                    <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full border border-yellow-500/30">
                                      <Clock size={12} className="inline mr-1" /> Függőben
                                    </span>
                                  )}
                                  {msg.offer_status === 'accepted' && (
                                    <span className="inline-block px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                                      <CheckCircle size={12} className="inline mr-1" /> Elfogadva
                                    </span>
                                  )}
                                  {msg.offer_status === 'rejected' && (
                                    <span className="inline-block px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                                      <XCircle size={12} className="inline mr-1" /> Elutasítva
                                    </span>
                                  )}
                                  {msg.offer_status === 'counter_offered' && (
                                    <span className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                                      <RotateCcw size={12} className="inline mr-1" /> Visszaajánlat
                                    </span>
                                  )}
                                </div>

                                {msg.offer_status === 'pending' && msg.sender_id != user.user_id && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleOfferAction(msg.offer_id, 'accept')}
                                      className="flex-1 py-2 md:py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs md:text-sm font-semibold transition shadow-md"
                                    >
                                      Elfogad
                                    </button>
                                    <button
                                      onClick={() => handleOfferAction(msg.offer_id, 'reject')}
                                      className="flex-1 py-2 md:py-2.5 bg-gray-700 hover:bg-gray-600 text-white border-2 border-gray-600 rounded-lg text-xs md:text-sm font-semibold transition"
                                    >
                                      Elutasít
                                    </button>
                                  </div>
                                )}

                                {msg.offer_status === 'counter_offered' && msg.sender_id != user.user_id && (
                                  <button
                                    onClick={() => handleOfferAction(msg.offer_id, 'accept-counter')}
                                    className="w-full py-2 md:py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs md:text-sm font-semibold transition shadow-md"
                                  >
                                    Visszaajánlat elfogadása
                                  </button>
                                )}
                              </div>

                              <div className="px-3 md:px-4 py-2 bg-gray-800 border-t border-gray-700">
                                <p className="text-xs text-gray-400 text-right">
                                  {new Date(msg.sent_at).toLocaleTimeString('hu-HU', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="break-words text-sm md:text-base">{msg.content}</p>
                              <p className={`text-xs mt-1 ${msg.sender_id == user.user_id ? 'text-white/70' : 'text-gray-400'
                                }`}>
                                {new Date(msg.sent_at).toLocaleTimeString('hu-HU', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={sendMessage} className="p-3 md:p-4 border-t border-white/10 bg-gray-800/80 backdrop-blur-sm flex-shrink-0">
                  <div className="flex gap-2 md:gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Írj üzenetet..."
                      className="flex-1 px-3 py-2 md:px-4 md:py-2.5 text-sm md:text-base bg-gray-700/50 backdrop-blur-sm text-white border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 transition"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 md:px-6 md:py-2.5 rounded-xl hover:from-blue-600 hover:to-purple-700 font-semibold transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 md:gap-2 text-sm md:text-base"
                    >
                      <span className="hidden sm:inline">Küldés</span>
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 px-4">
                <MessageCircle className="w-16 h-16 md:w-24 md:h-24 mb-4 md:mb-6 text-gray-600" />
                <p className="text-lg md:text-xl font-semibold text-white mb-2 text-center">Válassz egy beszélgetést</p>
                <p className="text-sm md:text-base text-gray-500 text-center">hogy elkezdhesz az üzenetküldést</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
