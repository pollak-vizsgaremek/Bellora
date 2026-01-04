import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Sparkles, ArrowLeft, Lock, Shield, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('A jelszavak nem egyeznek!');
      return;
    }
    
    if (password.length < 6) {
      setError('A jelszó legalább 6 karakter legyen!');
      return;
    }
    
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Regisztráció sikertelen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
            Bellora
          </h1>
          <p className="text-sm md:text-base text-gray-300">Csatlakozz a közösséghez!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6 text-center flex items-center justify-center gap-2 md:gap-3">
            <Sparkles className="w-7 h-7 md:w-8 md:h-8" /> Regisztráció
          </h2>
          
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm text-red-200 p-4 rounded-xl mb-6 border border-red-400/50">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-200 mb-2 font-medium">Felhasználónév</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="válassz egy egyedi nevet"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400 transition"
                required
                minLength={3}
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2 font-medium">Email cím</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pelda@email.com"
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-gray-200 mb-2 font-medium">Jelszó</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="legalább 6 karakter"
                  className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400 transition"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-200 mb-2 font-medium">Jelszó megerősítése</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="írd be újra a jelszót"
                  className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent placeholder-gray-400 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 rounded-xl hover:from-purple-600 hover:to-pink-700 font-bold text-lg transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Regisztráció...</span>
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Ingyen regisztráció</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Van már fiókod?
            </p>
            <button 
              onClick={() => navigate('/login')} 
              className="mt-2 text-purple-300 hover:text-purple-200 font-semibold underline transition"
            >
              Jelentkezz be →
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20">
            <button
              onClick={() => navigate('/')}
              className="w-full text-gray-300 hover:text-white transition text-sm flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Vissza a főoldalra
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <Shield size={16} /> Az adataid biztonságban vannak
          </p>
        </div>
      </div>
    </div>
  );
}
