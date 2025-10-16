import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  createGuild, 
  getAllGuilds, 
  getUserGuild,
  joinGuild,
  leaveGuild,
  deleteGuild,
  updateGuild
} from '../../firebase/firestore';
import { Guild as GuildType, Upgrade } from '../../types';

interface GuildProps {
  user: User;
  username: string;
  userUpgrades: Upgrade[];
}

const EMOJI_OPTIONS = [
  '🏰', '⚔️', '🛡️', '👑', '🦁', '🐉', '🦅', '🐺', '🌟', '⭐',
  '🔥', '❄️', '⚡', '💎', '🏆', '🎯', '🚀', '🌈', '🌙', '☀️',
  '🌲', '🌊', '🏔️', '🌋', '🏝️', '🌺', '🍀', '🌸', '🌼', '🍄'
];

const Guild: React.FC<GuildProps> = ({ user, username, userUpgrades }) => {
  const [myGuild, setMyGuild] = useState<GuildType | null>(null);
  const [allGuilds, setAllGuilds] = useState<GuildType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Form states
  const [guildName, setGuildName] = useState('');
  const [guildDescription, setGuildDescription] = useState('');
  const [guildEmoji, setGuildEmoji] = useState('🏰');
  const [selectedLandId, setSelectedLandId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Buscar terrenos do usuário
  const userLands = userUpgrades.filter(u => 
    u.category === 'Terrenos' && (u.count || 0) > 0
  );

  useEffect(() => {
    loadGuilds();
  }, [user.uid]);

  const loadGuilds = async () => {
    setLoading(true);
    try {
      const [userGuildData, guildsData] = await Promise.all([
        getUserGuild(user.uid),
        getAllGuilds(100)
      ]);
      
      setMyGuild(userGuildData);
      setAllGuilds(guildsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuild = async () => {
    if (!guildName.trim()) {
      setError('Digite um nome para a guilda');
      return;
    }
    
    if (!selectedLandId) {
      setError('Selecione um terreno');
      return;
    }
    
    setError('');
    try {
      await createGuild(
        user.uid,
        username,
        selectedLandId,
        guildName.trim(),
        guildDescription.trim(),
        guildEmoji
      );
      
      setSuccess('Guilda criada com sucesso!');
      setShowCreateModal(false);
      setGuildName('');
      setGuildDescription('');
      setGuildEmoji('🏰');
      setSelectedLandId('');
      
      await loadGuilds();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleJoinGuild = async (guildId: string) => {
    setError('');
    try {
      await joinGuild(guildId, user.uid, username);
      setSuccess('Você entrou na guilda!');
      await loadGuilds();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLeaveGuild = async () => {
    if (!myGuild) return;
    
    if (window.confirm('Tem certeza que deseja sair da guilda?')) {
      setError('');
      try {
        await leaveGuild(myGuild.id, user.uid);
        setSuccess('Você saiu da guilda');
        await loadGuilds();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleDeleteGuild = async () => {
    if (!myGuild) return;
    
    if (window.confirm('Tem certeza que deseja DELETAR a guilda? Esta ação é irreversível!')) {
      setError('');
      try {
        await deleteGuild(myGuild.id, user.uid);
        setSuccess('Guilda deletada');
        await loadGuilds();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleUpdateGuild = async () => {
    if (!myGuild) return;
    
    if (!guildName.trim()) {
      setError('Digite um nome para a guilda');
      return;
    }
    
    setError('');
    try {
      await updateGuild(myGuild.id, user.uid, {
        name: guildName.trim(),
        description: guildDescription.trim(),
        emoji: guildEmoji
      });
      
      setSuccess('Guilda atualizada!');
      setShowEditModal(false);
      await loadGuilds();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const openEditModal = () => {
    if (!myGuild) return;
    
    setGuildName(myGuild.name);
    setGuildDescription(myGuild.description);
    setGuildEmoji(myGuild.emoji);
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-900">Carregando guildas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🏰 Guildas</h1>
        <p className="text-gray-700">
          Crie ou junte-se a uma guilda! Apenas jogadores com terrenos podem criar guildas.
        </p>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
          <p className="text-red-900 font-semibold">❌ {error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4">
          <p className="text-green-900 font-semibold">✅ {success}</p>
        </div>
      )}

      {/* Minha Guilda */}
      {myGuild ? (
        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl">{myGuild.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{myGuild.name}</h2>
                <p className="text-gray-700">{myGuild.description}</p>
              </div>
            </div>
            
            {myGuild.ownerId === user.uid && (
              <div className="flex gap-2">
                <button
                  onClick={openEditModal}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={handleDeleteGuild}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  🗑️ Deletar
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white/40 rounded-lg p-3">
              <div className="text-sm text-gray-700">Dono</div>
              <div className="text-lg font-bold text-gray-900">👑 {myGuild.ownerUsername}</div>
            </div>
            <div className="bg-white/40 rounded-lg p-3">
              <div className="text-sm text-gray-700">Membros</div>
              <div className="text-lg font-bold text-gray-900">
                👥 {myGuild.members.length}/{myGuild.maxMembers}
              </div>
            </div>
          </div>

          <div className="bg-white/40 rounded-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Membros:</h3>
            <div className="space-y-2">
              {myGuild.members.map((member, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between bg-white/40 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2">
                    <span>{member.role === 'owner' ? '👑' : '👤'}</span>
                    <span className="font-semibold text-gray-900">{member.username}</span>
                  </div>
                  <span className="text-sm text-gray-700">
                    {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {myGuild.ownerId !== user.uid && (
            <button
              onClick={handleLeaveGuild}
              className="mt-4 w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              🚪 Sair da Guilda
            </button>
          )}
        </div>
      ) : (
        /* Botão de Criar Guilda */
        <div className="bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Você não está em nenhuma guilda</h2>
          
          {userLands.length > 0 ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              ✨ Criar Minha Guilda
            </button>
          ) : (
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <p className="text-yellow-900 font-semibold">
                ⚠️ Você precisa ter pelo menos um terreno para criar uma guilda!
              </p>
            </div>
          )}
        </div>
      )}

      {/* Todas as Guildas */}
      {!myGuild && (
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Guildas Disponíveis</h2>
          
          {allGuilds.length === 0 ? (
            <p className="text-gray-700 text-center py-8">
              Nenhuma guilda criada ainda. Seja o primeiro!
            </p>
          ) : (
            <div className="grid gap-4">
              {allGuilds.map((guild) => (
                <div
                  key={guild.id}
                  className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-white/30 p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-3xl">{guild.emoji}</span>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{guild.name}</h3>
                        <p className="text-sm text-gray-700">{guild.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                          <span>👑 {guild.ownerUsername}</span>
                          <span>👥 {guild.members.length}/{guild.maxMembers}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleJoinGuild(guild.id)}
                      disabled={guild.members.length >= guild.maxMembers}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        guild.members.length >= guild.maxMembers
                          ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {guild.members.length >= guild.maxMembers ? '🔒 Cheia' : '➕ Entrar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Criar Guilda */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✨ Criar Guilda</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Escolha um Emoji:
                </label>
                <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto bg-gray-100 rounded-lg p-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setGuildEmoji(emoji)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        guildEmoji === emoji
                          ? 'bg-purple-500 scale-110'
                          : 'bg-white hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nome da Guilda:
                </label>
                <input
                  type="text"
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite o nome..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Descrição:
                </label>
                <textarea
                  value={guildDescription}
                  onChange={(e) => setGuildDescription(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Descreva sua guilda..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Selecione um Terreno:
                </label>
                <select
                  value={selectedLandId}
                  onChange={(e) => setSelectedLandId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Escolha...</option>
                  {userLands.map((land) => (
                    <option key={land.id} value={land.id}>
                      {land.icon} {land.name} ({land.tier}) - Limite: {
                        land.tier === 'comum' ? 5 :
                        land.tier === 'incomum' ? 10 :
                        land.tier === 'raro' ? 20 :
                        land.tier === 'epico' ? 35 :
                        land.tier === 'lendario' ? 50 : 100
                      } membros
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateGuild}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-semibold transition-all"
                >
                  Criar Guilda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Editar Guilda */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✏️ Editar Guilda</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Escolha um Emoji:
                </label>
                <div className="grid grid-cols-10 gap-2 max-h-40 overflow-y-auto bg-gray-100 rounded-lg p-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setGuildEmoji(emoji)}
                      className={`text-2xl p-2 rounded-lg transition-all ${
                        guildEmoji === emoji
                          ? 'bg-purple-500 scale-110'
                          : 'bg-white hover:bg-gray-200'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Nome da Guilda:
                </label>
                <input
                  type="text"
                  value={guildName}
                  onChange={(e) => setGuildName(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Digite o nome..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Descrição:
                </label>
                <textarea
                  value={guildDescription}
                  onChange={(e) => setGuildDescription(e.target.value)}
                  maxLength={200}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Descreva sua guilda..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpdateGuild}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Guild;
