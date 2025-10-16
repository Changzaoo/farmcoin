import React, { useState } from 'react';
import { LogIn, Mail, Lock, User } from 'lucide-react';
import { loginUser } from '../../firebase/auth';

interface LoginProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export default function Login({ onSuccess, onSwitchToRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await loginUser(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzRhNzc1YSIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIuMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="max-w-md w-full relative">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-bounce-slow">
          <div className="inline-block bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-full shadow-2xl mb-4">
            <span className="text-6xl">🌾</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">FarmCoin</h1>
          <p className="text-green-200 text-lg">Construa seu Império Agrícola</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <LogIn className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Entrar</h2>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-green-100 text-sm font-semibold mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-green-100 text-sm font-semibold mb-2">
                <Lock size={16} className="inline mr-2" />
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-green-200">
              Não tem uma conta?{' '}
              <button
                onClick={onSwitchToRegister}
                className="text-yellow-400 hover:text-yellow-300 font-semibold underline transition-colors"
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-green-300 text-sm">
          <p>🔒 Autenticação segura com SHA-512</p>
        </div>
      </div>
    </div>
  );
}
