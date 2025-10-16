// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Home, Users, DollarSign, X, Edit, Plus, Trash2, Save, Crown, TrendingUp } from 'lucide-react';
import { Land, LandType, LandRarity, LandResident } from '../../types';
import {
  getLandsInArea,
  purchaseLand,
  addLandResident,
  removeLandResident,
  listLandForSale,
  unlistLandFromSale,
  getUserLands,
  updateLandCustomization,
} from '../../firebase/lands';

interface LandMapProps {
  uid: string;
  username: string;
  coins: number;
  onPurchase: (cost: number, income: number) => void;
}

const LandMap: React.FC<LandMapProps> = ({ uid, username, coins, onPurchase }) => {
  const [lands, setLands] = useState<Land[]>([]);
  const [userLands, setUserLands] = useState<Land[]>([]);
  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [viewX, setViewX] = useState(25); // Centro do mapa
  const [viewY, setViewY] = useState(25);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showResidentsModal, setShowResidentsModal] = useState(false);
  const [newResidentUsername, setNewResidentUsername] = useState('');
  const [editingName, setEditingName] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const TILE_SIZE = 20;
  const VIEW_SIZE = 25; // Mostrar 25x25 terrenos por vez

  // Carregar terrenos visíveis
  const loadVisibleLands = useCallback(async () => {
    try {
      setLoading(true);
      const minX = Math.max(0, viewX - VIEW_SIZE);
      const maxX = Math.min(49, viewX + VIEW_SIZE);
      const minY = Math.max(0, viewY - VIEW_SIZE);
      const maxY = Math.min(49, viewY + VIEW_SIZE);

      const visibleLands = await getLandsInArea(minX, maxX, minY, maxY);
      setLands(visibleLands);
    } catch (error) {
      console.error('Erro ao carregar terrenos:', error);
    } finally {
      setLoading(false);
    }
  }, [viewX, viewY]);

  // Carregar terrenos do usuário
  const loadUserLands = useCallback(async () => {
    try {
      const myLands = await getUserLands(uid);
      setUserLands(myLands);
    } catch (error) {
      console.error('Erro ao carregar terrenos do usuário:', error);
    }
  }, [uid]);

  useEffect(() => {
    loadVisibleLands();
    loadUserLands();
  }, [loadVisibleLands, loadUserLands]);

  // Desenhar mapa no canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || lands.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar cada terreno
    lands.forEach((land) => {
      const x = (land.x - viewX + VIEW_SIZE) * TILE_SIZE * zoom;
      const y = (land.y - viewY + VIEW_SIZE) * TILE_SIZE * zoom;
      const size = TILE_SIZE * zoom;

      // Cor baseada no tipo
      ctx.fillStyle = getLandColor(land.type, land.rarity);
      ctx.fillRect(x, y, size, size);

      // Borda se tiver dono
      if (land.ownerId) {
        ctx.strokeStyle = land.ownerId === uid ? '#fbbf24' : '#6b7280';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, size, size);
      }

      // Marca se for do usuário
      if (land.ownerId === uid) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [lands, viewX, viewY, zoom, uid]);

  const getLandColor = (type: LandType, rarity: LandRarity): string => {
    const baseColors = {
      [LandType.PLAINS]: '#86efac',     // Verde claro
      [LandType.FOREST]: '#22c55e',     // Verde escuro
      [LandType.MOUNTAIN]: '#94a3b8',   // Cinza
      [LandType.DESERT]: '#fbbf24',     // Amarelo
      [LandType.WATER]: '#3b82f6',      // Azul
      [LandType.SPECIAL]: '#a855f7',    // Roxo
    };

    return baseColors[type];
  };

  const getRarityColor = (rarity: LandRarity): string => {
    const colors = {
      [LandRarity.COMUM]: 'text-gray-400',
      [LandRarity.INCOMUM]: 'text-green-400',
      [LandRarity.RARO]: 'text-blue-400',
      [LandRarity.EPICO]: 'text-purple-400',
      [LandRarity.LENDARIO]: 'text-orange-400',
    };
    return colors[rarity];
  };

  const getRarityName = (rarity: LandRarity): string => {
    const names = {
      [LandRarity.COMUM]: 'Comum',
      [LandRarity.INCOMUM]: 'Incomum',
      [LandRarity.RARO]: 'Raro',
      [LandRarity.EPICO]: 'Épico',
      [LandRarity.LENDARIO]: 'Lendário',
    };
    return names[rarity];
  };

  const getTypeName = (type: LandType): string => {
    const names = {
      [LandType.PLAINS]: 'Planície',
      [LandType.FOREST]: 'Floresta',
      [LandType.MOUNTAIN]: 'Montanha',
      [LandType.DESERT]: 'Deserto',
      [LandType.WATER]: 'Água',
      [LandType.SPECIAL]: 'Especial',
    };
    return names[type];
  };

  const handleLandClick = (land: Land) => {
    setSelectedLand(land);
    setCustomName(land.customName || '');
    setCustomDescription(land.customDescription || '');
  };

  const handlePurchaseLand = async () => {
    if (!selectedLand || selectedLand.ownerId) return;

    const cost = selectedLand.listedForSale && selectedLand.salePrice
      ? selectedLand.salePrice
      : selectedLand.price;

    if (coins < cost) {
      alert('Moedas insuficientes!');
      return;
    }

    try {
      await purchaseLand(selectedLand.id, uid, username);
      onPurchase(cost, selectedLand.baseIncome);
      await loadVisibleLands();
      await loadUserLands();
      setSelectedLand(null);
      alert('Terreno comprado com sucesso!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleListForSale = async () => {
    if (!selectedLand || selectedLand.ownerId !== uid) return;

    const price = prompt('Digite o preço de venda:');
    if (!price) return;

    try {
      await listLandForSale(selectedLand.id, Number(price));
      await loadVisibleLands();
      await loadUserLands();
      setSelectedLand({ ...selectedLand, listedForSale: true, salePrice: Number(price) });
      alert('Terreno listado para venda!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleUnlistFromSale = async () => {
    if (!selectedLand || selectedLand.ownerId !== uid) return;

    try {
      await unlistLandFromSale(selectedLand.id);
      await loadVisibleLands();
      await loadUserLands();
      setSelectedLand({ ...selectedLand, listedForSale: false, salePrice: undefined });
      alert('Terreno removido da venda!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSaveCustomization = async () => {
    if (!selectedLand || selectedLand.ownerId !== uid) return;

    try {
      await updateLandCustomization(selectedLand.id, customName, customDescription);
      await loadVisibleLands();
      await loadUserLands();
      setSelectedLand({
        ...selectedLand,
        customName: customName || undefined,
        customDescription: customDescription || undefined,
      });
      setEditingName(false);
      alert('Personalização salva!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleAddResident = async () => {
    if (!selectedLand || !newResidentUsername || selectedLand.ownerId !== uid) return;

    // Aqui você precisaria buscar o UID do usuário pelo username
    // Por simplicidade, vou assumir que você tem essa função
    try {
      const newResident: LandResident = {
        uid: 'temp_uid', // Substituir pela busca real
        username: newResidentUsername,
        addedAt: new Date(),
        permissions: {
          canBuild: false,
          canInvite: false,
          canRemove: false,
        },
      };

      await addLandResident(selectedLand.id, newResident);
      await loadVisibleLands();
      setNewResidentUsername('');
      alert('Morador adicionado!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleRemoveResident = async (residentUid: string) => {
    if (!selectedLand || selectedLand.ownerId !== uid) return;

    try {
      await removeLandResident(selectedLand.id, residentUid);
      await loadVisibleLands();
      alert('Morador removido!');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 p-6 rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-8 h-8" />
            Mapa de Terrenos
          </h2>
          <p className="text-green-200 mt-1">
            {userLands.length} terreno{userLands.length !== 1 ? 's' : ''} possuído{userLands.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Controles de zoom e navegação */}
        <div className="flex gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            -
          </button>
          <span className="px-4 py-2 bg-gray-800 text-white rounded-lg">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.1))}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mapa */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-xl p-4 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-xl z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
              </div>
            )}

            <canvas
              ref={canvasRef}
              width={VIEW_SIZE * 2 * TILE_SIZE}
              height={VIEW_SIZE * 2 * TILE_SIZE}
              className="w-full h-auto border-2 border-gray-700 rounded-lg cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = Math.floor((e.clientX - rect.left) / (TILE_SIZE * zoom)) + viewX - VIEW_SIZE;
                const y = Math.floor((e.clientY - rect.top) / (TILE_SIZE * zoom)) + viewY - VIEW_SIZE;
                const land = lands.find((l) => l.x === x && l.y === y);
                if (land) handleLandClick(land);
              }}
            />

            {/* Controles de navegação */}
            <div className="mt-4 grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <div></div>
              <button
                onClick={() => setViewY(Math.max(VIEW_SIZE, viewY - 5))}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                ↑
              </button>
              <div></div>
              <button
                onClick={() => setViewX(Math.max(VIEW_SIZE, viewX - 5))}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                ←
              </button>
              <button
                onClick={() => {
                  setViewX(25);
                  setViewY(25);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Centro
              </button>
              <button
                onClick={() => setViewX(Math.min(49 - VIEW_SIZE, viewX + 5))}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                →
              </button>
              <div></div>
              <button
                onClick={() => setViewY(Math.min(49 - VIEW_SIZE, viewY + 5))}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                ↓
              </button>
            </div>

            {/* Legenda */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#86efac' }}></div>
                <span className="text-white">Planície</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
                <span className="text-white">Floresta</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#94a3b8' }}></div>
                <span className="text-white">Montanha</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
                <span className="text-white">Deserto</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
                <span className="text-white">Água</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#a855f7' }}></div>
                <span className="text-white">Especial</span>
              </div>
            </div>
          </div>
        </div>

        {/* Painel de detalhes */}
        <div className="lg:col-span-1">
          {selectedLand ? (
            <div className="bg-gray-900 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Detalhes do Terreno</h3>
                <button
                  onClick={() => setSelectedLand(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {/* Nome personalizado */}
                {editingName && selectedLand.ownerId === uid ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Nome do terreno"
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
                    />
                    <textarea
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="Descrição"
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveCustomization}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditingName(false)}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white">
                        {selectedLand.customName || `Terreno (${selectedLand.x}, ${selectedLand.y})`}
                      </h4>
                      {selectedLand.ownerId === uid && (
                        <button
                          onClick={() => setEditingName(true)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {selectedLand.customDescription && (
                      <p className="text-gray-400 text-sm mt-1">{selectedLand.customDescription}</p>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Coordenadas:</span>
                  <span className="text-white font-semibold">
                    ({selectedLand.x}, {selectedLand.y})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Tipo:</span>
                  <span className="text-white font-semibold">{getTypeName(selectedLand.type)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Raridade:</span>
                  <span className={`font-bold ${getRarityColor(selectedLand.rarity)}`}>
                    {getRarityName(selectedLand.rarity)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <span className="text-gray-400">Preço:</span>
                  <span className="text-white font-bold">
                    {selectedLand.listedForSale && selectedLand.salePrice
                      ? selectedLand.salePrice.toLocaleString()
                      : selectedLand.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-gray-400">Renda/s:</span>
                  <span className="text-green-400 font-bold">
                    +{selectedLand.baseIncome.toFixed(2)}
                  </span>
                </div>

                {selectedLand.ownerId && (
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400">Dono:</span>
                    <span className="text-white font-semibold">
                      {selectedLand.ownerUsername}
                      {selectedLand.ownerId === uid && ' (Você)'}
                    </span>
                  </div>
                )}

                {selectedLand.residents.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-gray-400">Moradores:</span>
                      <span className="text-white font-semibold">{selectedLand.residents.length}/100</span>
                    </div>
                    <button
                      onClick={() => setShowResidentsModal(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm"
                    >
                      Ver lista completa
                    </button>
                  </div>
                )}

                {/* Ações */}
                <div className="pt-4 space-y-2">
                  {!selectedLand.ownerId ? (
                    <button
                      onClick={handlePurchaseLand}
                      disabled={coins < (selectedLand.listedForSale && selectedLand.salePrice ? selectedLand.salePrice : selectedLand.price)}
                      className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                      <Home className="w-5 h-5 inline mr-2" />
                      Comprar Terreno
                    </button>
                  ) : selectedLand.ownerId === uid ? (
                    <>
                      {selectedLand.listedForSale ? (
                        <button
                          onClick={handleUnlistFromSale}
                          className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
                        >
                          Remover da Venda
                        </button>
                      ) : (
                        <button
                          onClick={handleListForSale}
                          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all"
                        >
                          Listar para Venda
                        </button>
                      )}

                      <button
                        onClick={() => setShowResidentsModal(true)}
                        className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Users className="w-5 h-5" />
                        Gerenciar Moradores
                      </button>
                    </>
                  ) : selectedLand.listedForSale ? (
                    <button
                      onClick={handlePurchaseLand}
                      disabled={!selectedLand.salePrice || coins < selectedLand.salePrice}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                      Comprar de {selectedLand.ownerUsername}
                    </button>
                  ) : (
                    <div className="text-center text-gray-400 italic">Este terreno já tem dono</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Clique em um terreno no mapa para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Moradores */}
      {showResidentsModal && selectedLand && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="w-6 h-6" />
                Moradores ({selectedLand.residents.length}/100)
              </h3>
              <button
                onClick={() => setShowResidentsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedLand.ownerId === uid && (
              <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Adicionar Morador:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResidentUsername}
                    onChange={(e) => setNewResidentUsername(e.target.value)}
                    placeholder="Nome de usuário"
                    className="flex-1 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg"
                  />
                  <button
                    onClick={handleAddResident}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {selectedLand.residents.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Nenhum morador ainda</p>
              ) : (
                selectedLand.residents.map((resident, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                  >
                    <div>
                      <span className="text-white font-semibold">{resident.username}</span>
                      <div className="text-xs text-gray-400 mt-1">
                        Adicionado em: {new Date(resident.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                    {selectedLand.ownerId === uid && (
                      <button
                        onClick={() => handleRemoveResident(resident.uid)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandMap;
