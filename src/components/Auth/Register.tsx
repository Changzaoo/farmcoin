// @ts-nocheck
import React, { useState } from 'react';
import { UserPlus, Lock, User, Shield } from 'lucide-react';
import { registerUser } from '../../firebase/auth';

interface RegisterProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function Register({ onSuccess, onSwitchToLogin }: RegisterProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (username.length < 3) {
      setError('O nome de usuário deve ter pelo menos 3 caracteres');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await registerUser(username, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iIzRhNzc1YSIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIuMiIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="max-w-md w-full relative">
        {/* Logo/Header */}
        <div className="text-center mb-8 animate-bounce-slow">
          <div className="inline-block bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-full shadow-2xl mb-4">
            <span className="text-6xl">🌾</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-lg">FarmCoin</h1>
          <p className="text-green-200 text-lg">Crie sua Conta</p>
        </div>

        {/* Register Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex items-center justify-center gap-2 mb-6">
            <UserPlus className="text-yellow-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Registrar</h2>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-green-100 text-sm font-semibold mb-2">
                <User size={16} className="inline mr-2" />
                Nome de Usuário
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="seu_usuario"
                required
                minLength={3}
              />
              <p className="text-xs text-green-200 mt-1">Mínimo 3 caracteres</p>
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
                minLength={6}
              />
              <p className="text-xs text-green-200 mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-green-100 text-sm font-semibold mb-2">
                <Lock size={16} className="inline mr-2" />
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-green-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-green-200">
              Já tem uma conta?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-yellow-400 hover:text-yellow-300 font-semibold underline transition-colors"
              >
                Entrar
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-green-300 text-sm space-y-2">
          <p className="flex items-center justify-center gap-2">
            <Shield size={16} />
            Criptografia SHA-512
          </p>
          <p className="text-xs">Seus dados estão seguros conosco</p>
        </div>
      </div>
    </div>
  );
}
