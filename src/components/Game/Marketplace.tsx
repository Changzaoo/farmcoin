// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { MarketplaceListing, OfferStatus, UpgradeTier } from '../../types';
import {
  getMarketplaceListings,
  createMarketplaceListing,
  purchaseMarketplaceListing,
  createMarketplaceOffer,
  cancelMarketplaceListing,
} from '../../firebase/firestore';
import { getTierColor, getTierName, getTierGlow } from '../../utils/tierSystem';

// arquivo marcado com ts-nocheck para evitar erros de tipagem JSX locais

interface MarketplaceProps {
  userId: string;
  username: string;
  coins: number;
  ownedUpgrades: Array<{ id: string; name: string; icon: string; tier: UpgradeTier; count: number; baseIncome: number; baseCost: number }>;
  onPurchaseComplete: (sellerId: string, totalPrice: number, upgradeId: string, quantity: number) => void;
}

type TabType = 'browse' | 'myListings' | 'myOffers';

export default function Marketplace({
  userId,
  username,
  coins,
  ownedUpgrades,
  onPurchaseComplete,
}: MarketplaceProps) {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [selectedUpgrade, setSelectedUpgrade] = useState<string>('');
  
  // Form states
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(0);
  const [acceptOffers, setAcceptOffers] = useState(false);
  const [minOfferPrice, setMinOfferPrice] = useState(0);
  const [offerPrice, setOfferPrice] = useState(0);
  const [offerMessage, setOfferMessage] = useState('');

  // Filter states
  const [filterTier, setFilterTier] = useState<UpgradeTier | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMinPrice, setFilterMinPrice] = useState<number>(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(999999999);
  const [filterMinEfficiency, setFilterMinEfficiency] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'price' | 'efficiency' | 'name' | 'tier'>('price');

  useEffect(() => {
    loadListings();
  }, [activeTab]);

  useEffect(() => {
    if (listings.length > 0) {
      loadListings();
    }
  }, [filterTier, filterCategory, filterMinPrice, filterMaxPrice, filterMinEfficiency, sortBy]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await getMarketplaceListings(100);
      
      let filteredData = data;
      
      if (activeTab === 'browse') {
        filteredData = data.filter(l => l.sellerId !== userId);
      } else if (activeTab === 'myListings') {
        filteredData = data.filter(l => l.sellerId === userId);
      }

      // Apply filters
      filteredData = applyFilters(filteredData);
      
      setListings(filteredData);
    } catch (error) {
      console.error('Erro ao carregar listagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (data: MarketplaceListing[]) => {
    let filtered = [...data];

    // Filter by tier
    if (filterTier !== 'all') {
      filtered = filtered.filter(l => l.upgradeTier === filterTier);
    }

    // Filter by category (based on upgrade name patterns)
    if (filterCategory !== 'all') {
      const categoryPatterns: Record<string, string[]> = {
        plantacoes: ['Fazenda', 'Plantação', 'Colheita', 'Semente'],
        animais: ['Galinha', 'Vaca', 'Porco', 'Ovelha', 'Cabra'],
        producao: ['Moinho', 'Padaria', 'Fábrica', 'Indústria'],
        tecnologia: ['Drone', 'Robô', 'IA', 'Computador', 'Sistema'],
        especiais: ['Mágico', 'Místico', 'Lendário', 'Divino'],
      };

      const patterns = categoryPatterns[filterCategory] || [];
      filtered = filtered.filter(l => 
        patterns.some(pattern => l.upgradeName.includes(pattern))
      );
    }

    // Filter by price range
    filtered = filtered.filter(l => 
      l.pricePerUnit >= filterMinPrice && l.pricePerUnit <= filterMaxPrice
    );

    // Filter by efficiency (coins per second per cost)
    if (filterMinEfficiency > 0) {
      filtered = filtered.filter(l => {
        const efficiency = l.incomePerUnit / l.pricePerUnit;
        return efficiency >= filterMinEfficiency;
      });
    }

    // Sort listings
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.pricePerUnit - b.pricePerUnit;
        case 'efficiency':
          const effA = a.incomePerUnit / a.pricePerUnit;
          const effB = b.incomePerUnit / b.pricePerUnit;
          return effB - effA; // Higher efficiency first
        case 'name':
          return a.upgradeName.localeCompare(b.upgradeName);
        case 'tier':
          const tierOrder: Record<UpgradeTier, number> = {
            [UpgradeTier.COMUM]: 0,
            [UpgradeTier.INCOMUM]: 1,
            [UpgradeTier.RARO]: 2,
            [UpgradeTier.EPICO]: 3,
            [UpgradeTier.LENDARIO]: 4,
            [UpgradeTier.MITICO]: 5,
          };
          return tierOrder[b.upgradeTier] - tierOrder[a.upgradeTier]; // Higher tier first
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleCreateListing = async () => {
    if (!selectedUpgrade) return;

    const upgrade = ownedUpgrades.find(u => u.id === selectedUpgrade);
    if (!upgrade || upgrade.count < quantity) {
      alert('Você não possui quantidade suficiente deste item!');
      return;
    }

    try {
      await createMarketplaceListing({
        sellerId: userId,
        sellerUsername: username,
        upgradeId: upgrade.id,
        upgradeName: upgrade.name,
        upgradeIcon: upgrade.icon,
        upgradeTier: upgrade.tier,
        quantity,
        pricePerUnit,
        totalPrice: pricePerUnit * quantity,
        incomePerUnit: upgrade.baseIncome,
        totalIncome: upgrade.baseIncome * quantity,
        originalCost: upgrade.baseCost,
        acceptOffers,
        minOfferPrice: acceptOffers ? minOfferPrice : undefined,
        status: 'active',
      });

      alert('Listagem criada com sucesso!');
      setShowCreateModal(false);
      resetForm();
      loadListings();
    } catch (error: any) {
      alert(`Erro ao criar listagem: ${error.message}`);
    }
  };

  const handlePurchase = async (listing: MarketplaceListing) => {
    if (coins < listing.totalPrice) {
      alert('Você não tem moedas suficientes!');
      return;
    }

    if (window.confirm(`Confirmar compra de ${listing.quantity}x ${listing.upgradeName} por ${listing.totalPrice} moedas?`)) {
      try {
        await purchaseMarketplaceListing(listing.id!, userId, username, coins);
        onPurchaseComplete(listing.sellerId, listing.totalPrice, listing.upgradeId, listing.quantity);
        alert('Compra realizada com sucesso!');
        loadListings();
      } catch (error: any) {
        alert(`Erro na compra: ${error.message}`);
      }
    }
  };

  const handleMakeOffer = async () => {
    if (!selectedListing) return;

    if (offerPrice < (selectedListing.minOfferPrice || 0)) {
      alert(`Oferta mínima: ${selectedListing.minOfferPrice} moedas`);
      return;
    }

    try {
      await createMarketplaceOffer({
        listingId: selectedListing.id!,
        buyerId: userId,
        buyerUsername: username,
        offerPrice,
        message: offerMessage || undefined,
        status: OfferStatus.PENDING,
      });

      alert('Oferta enviada com sucesso!');
      setShowOfferModal(false);
      setOfferPrice(0);
      setOfferMessage('');
    } catch (error: any) {
      alert(`Erro ao enviar oferta: ${error.message}`);
    }
  };

  const handleCancelListing = async (listingId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar esta listagem?')) {
      try {
        await cancelMarketplaceListing(listingId);
        alert('Listagem cancelada!');
        loadListings();
      } catch (error: any) {
        alert(`Erro ao cancelar: ${error.message}`);
      }
    }
  };

  const resetForm = () => {
    setSelectedUpgrade('');
    setQuantity(1);
    setPricePerUnit(0);
    setAcceptOffers(false);
    setMinOfferPrice(0);
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg ${
            activeTab === 'browse'
              ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 text-white scale-110 shadow-[0_0_20px_rgba(59,130,246,0.5)]'
              : 'glass-vibrant text-white/90 hover:scale-105 dopamine-hover border border-white/30'
          }`}
        >
          🛒 Navegar
        </button>
        <button
          onClick={() => setActiveTab('myListings')}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all duration-200 shadow-lg ${
            activeTab === 'myListings'
              ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-white scale-110 shadow-[0_0_20px_rgba(168,85,247,0.5)]'
              : 'glass-vibrant text-white/90 hover:scale-105 dopamine-hover border border-white/30'
          }`}
        >
          📦 Minhas Vendas
        </button>
        {activeTab === 'myListings' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="ml-auto px-6 py-3 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] text-white rounded-2xl font-black text-sm transition-all shadow-lg dopamine-hover animate-pulse"
          >
            ➕ Nova Listagem
          </button>
        )}
      </div>

      {/* Painel de Filtros */}
      {activeTab === 'browse' && (
        <div className="glass-vibrant rounded-2xl p-6 space-y-5 border-2 border-white/30 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-2xl font-black text-white drop-shadow-lg flex items-center gap-3">
              <span className="text-3xl">🔍</span> Filtros Avançados
            </h3>
            <button
              onClick={() => {
                setFilterTier('all');
                setFilterCategory('all');
                setFilterMinPrice(0);
                setFilterMaxPrice(999999999);
                setFilterMinEfficiency(0);
                setSortBy('price');
              }}
              className="text-sm px-5 py-2.5 bg-gradient-to-r from-red-400 via-pink-400 to-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] text-white rounded-xl transition-all shadow-lg dopamine-hover font-black"
            >
              🔄 Limpar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Filtro de Raridade */}
            <div>
              <label className="block text-sm font-black text-white/90 mb-2 drop-shadow">
                ⭐ Raridade:
              </label>
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value as UpgradeTier | 'all')}
                className="w-full px-4 py-3 glass-vibrant backdrop-blur-md text-white font-bold border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-blue-400/50 focus:border-blue-300 outline-none shadow-lg hover:border-blue-300 transition-all cursor-pointer"
              >
                <option value="all" className="bg-gray-800">Todas</option>
                <option value={UpgradeTier.COMUM} className="bg-gray-800">⚪ Comum</option>
                <option value={UpgradeTier.INCOMUM} className="bg-gray-800">🟢 Incomum</option>
                <option value={UpgradeTier.RARO} className="bg-gray-800">🔵 Raro</option>
                <option value={UpgradeTier.EPICO} className="bg-gray-800">🟣 Épico</option>
                <option value={UpgradeTier.LENDARIO} className="bg-gray-800">🟠 Lendário</option>
                <option value={UpgradeTier.MITICO} className="bg-gray-800">🔴 Mítico</option>
              </select>
            </div>

            {/* Filtro de Categoria */}
            <div>
              <label className="block text-sm font-black text-white/90 mb-2 drop-shadow">
                📁 Categoria:
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-3 glass-vibrant backdrop-blur-md text-white font-bold border-2 border-white/30 rounded-xl focus:ring-4 focus:ring-blue-400/50 focus:border-blue-300 outline-none shadow-lg hover:border-blue-300 transition-all cursor-pointer"
              >
                <option value="all" className="bg-gray-800">Todas</option>
                <option value="plantacoes">🌾 Plantações</option>
                <option value="animais">🐄 Animais</option>
                <option value="producao">🏭 Produção</option>
                <option value="tecnologia">🤖 Tecnologia</option>
                <option value="especiais">✨ Especiais</option>
              </select>
            </div>

            {/* Filtro de Preço */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Faixa de Preço:
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Mín"
                  value={filterMinPrice || ''}
                  onChange={(e) => setFilterMinPrice(Number(e.target.value) || 0)}
                  className="w-1/2 px-2 py-2 bg-white text-gray-800 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm shadow-sm hover:border-blue-400 transition-colors placeholder-gray-400"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Máx"
                  value={filterMaxPrice === 999999999 ? '' : filterMaxPrice}
                  onChange={(e) => setFilterMaxPrice(Number(e.target.value) || 999999999)}
                  className="w-1/2 px-2 py-2 bg-white text-gray-800 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm shadow-sm hover:border-blue-400 transition-colors placeholder-gray-400"
                />
              </div>
            </div>

            {/* Filtro de Eficiência */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📊 Eficiência Mínima:
              </label>
              <input
                type="number"
                min="0"
                step="0.001"
                placeholder="Ex: 0.05"
                value={filterMinEfficiency || ''}
                onChange={(e) => setFilterMinEfficiency(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-white text-gray-800 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm hover:border-blue-400 transition-colors placeholder-gray-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Moedas/s por moeda gasta
              </p>
            </div>
          </div>

          {/* Ordenação */}
          <div className="flex items-center gap-4 pt-4 border-t-2 border-white/20">
            <label className="text-sm font-black text-white/90 drop-shadow">
              🔀 Ordenar por:
            </label>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setSortBy('price')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all shadow-lg ${
                  sortBy === 'price'
                    ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-105'
                    : 'glass-vibrant text-white/80 border border-white/30 hover:scale-105 dopamine-hover'
                }`}
              >
                💰 Preço
              </button>
              <button
                onClick={() => setSortBy('efficiency')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all shadow-lg ${
                  sortBy === 'efficiency'
                    ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-105'
                    : 'glass-vibrant text-white/80 border border-white/30 hover:scale-105 dopamine-hover'
                }`}
              >
                📊 Eficiência
              </button>
              <button
                onClick={() => setSortBy('tier')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all shadow-lg ${
                  sortBy === 'tier'
                    ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-105'
                    : 'glass-vibrant text-white/80 border border-white/30 hover:scale-105 dopamine-hover'
                }`}
              >
                ⭐ Raridade
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all shadow-lg ${
                  sortBy === 'name'
                    ? 'bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 text-white shadow-[0_0_20px_rgba(251,191,36,0.5)] scale-105'
                    : 'glass-vibrant text-white/80 border border-white/30 hover:scale-105 dopamine-hover'
                }`}
              >
                🔤 Nome
              </button>
            </div>
            <div className="ml-auto text-sm font-black bg-gradient-to-r from-blue-200 via-cyan-200 to-purple-200 bg-clip-text text-transparent drop-shadow-lg">
              ✨ {listings.length} {listings.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </div>
          </div>
        </div>
      )}

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-16 glass-vibrant rounded-3xl">
          <div className="text-8xl mb-4 animate-spin">⏳</div>
          <p className="text-2xl font-black text-white drop-shadow-lg">Carregando...</p>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 glass-vibrant rounded-3xl">
          <div className="text-8xl mb-4 animate-bounce">📦</div>
          <p className="text-2xl font-black text-white drop-shadow-lg">
            {activeTab === 'browse' ? 'Nenhum item disponível no momento' : 'Você não tem listagens ativas'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className={`glass-vibrant rounded-2xl p-5 border-2 border-white/30 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 dopamine-hover ${getTierGlow(listing.upgradeTier || UpgradeTier.COMUM)}`}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <span className="text-6xl animate-float drop-shadow-2xl">{listing.upgradeIcon}</span>
                <div className="flex-1">
                  <h3 className="font-black text-xl text-white drop-shadow-lg mb-2">{listing.upgradeName}</h3>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-black shadow-lg animate-pulse ${getTierColor(listing.upgradeTier || UpgradeTier.COMUM)}`}
                  >
                    ✨ {getTierName(listing.upgradeTier || UpgradeTier.COMUM)}
                  </span>
                </div>
              </div>

              {/* Seller */}
              <div className="text-sm text-white/80 font-semibold mb-3 glass-vibrant p-2 rounded-lg border border-white/20">
                👤 Vendedor: <span className="text-white font-black">{listing.sellerUsername}</span>
              </div>

              {/* Quantity & Stats */}
              <div className="glass-vibrant rounded-xl p-4 mb-4 space-y-2 text-sm border border-white/20 shadow-lg">
                <div className="flex justify-between">
                  <span className="text-white/80 font-semibold">Quantidade:</span>
                  <span className="text-white font-black text-lg">{listing.quantity}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/80 font-semibold">Preço/Unidade:</span>
                  <span className="font-black text-lg bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent drop-shadow-lg">{formatNumber(listing.pricePerUnit)} 🪙</span>
                </div>
                <div className="flex justify-between border-t border-white/20 pt-2">
                  <span className="text-white/80 font-semibold">Renda/Unidade:</span>
                  <span className="font-black bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 bg-clip-text text-transparent drop-shadow-lg">{formatNumber(listing.incomePerUnit)}/s</span>
                </div>
                <div className="flex justify-between text-base border-t-2 border-white/30 pt-3 mt-2">
                  <span className="text-white font-black">💎 Total:</span>
                  <span className="font-black text-xl bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent drop-shadow-lg animate-pulse">{formatNumber(listing.totalPrice)} 🪙</span>
                </div>
              </div>

              {/* Actions */}
              {activeTab === 'browse' ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePurchase(listing)}
                    disabled={coins < listing.totalPrice}
                    className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all shadow-lg ${
                      coins >= listing.totalPrice
                        ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 active:scale-95 animate-pulse'
                        : 'bg-gray-400/50 text-gray-300 cursor-not-allowed backdrop-blur-sm'
                    }`}
                  >
                    💰 Comprar Agora!
                  </button>
                  {listing.acceptOffers && (
                    <button
                      onClick={() => {
                        setSelectedListing(listing);
                        setShowOfferModal(true);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] text-white rounded-2xl font-black text-sm transition-all shadow-lg dopamine-hover"
                    >
                      📧 Fazer Oferta
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleCancelListing(listing.id!)}
                  className="w-full py-3 bg-gradient-to-r from-red-400 via-pink-400 to-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] text-white rounded-2xl font-black transition-all shadow-lg dopamine-hover"
                >
                  🚫 Cancelar Venda
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">📦 Nova Listagem</h2>

            <div>
              <label className="block text-gray-300 mb-2">Selecione o Item:</label>
              <select
                value={selectedUpgrade}
                onChange={(e) => setSelectedUpgrade(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              >
                <option value="">-- Escolha --</option>
                {ownedUpgrades.filter(u => u.count > 0).map((upgrade) => (
                  <option key={upgrade.id} value={upgrade.id}>
                    {upgrade.icon} {upgrade.name} (x{upgrade.count})
                  </option>
                ))}
              </select>
            </div>

            {selectedUpgrade && (
              <>
                <div>
                  <label className="block text-gray-300 mb-2">Quantidade:</label>
                  <input
                    type="number"
                    min="1"
                    max={ownedUpgrades.find(u => u.id === selectedUpgrade)?.count || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Preço por Unidade:</label>
                  <input
                    type="number"
                    min="1"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Total: {formatNumber(pricePerUnit * quantity)} moedas
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="acceptOffers"
                    checked={acceptOffers}
                    onChange={(e) => setAcceptOffers(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="acceptOffers" className="text-gray-300">
                    Aceitar ofertas
                  </label>
                </div>

                {acceptOffers && (
                  <div>
                    <label className="block text-gray-300 mb-2">Oferta Mínima:</label>
                    <input
                      type="number"
                      min="1"
                      value={minOfferPrice}
                      onChange={(e) => setMinOfferPrice(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateListing}
                disabled={!selectedUpgrade || pricePerUnit <= 0}
                className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
              >
                Criar Listagem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {showOfferModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">📧 Fazer Oferta</h2>
            
            <div className="bg-gray-900 rounded-lg p-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Item:</span>
                <span className="text-white">{selectedListing.upgradeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Preço Pedido:</span>
                <span className="text-yellow-400">{formatNumber(selectedListing.totalPrice)} 🪙</span>
              </div>
              {selectedListing.minOfferPrice && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Oferta Mínima:</span>
                  <span className="text-orange-400">{formatNumber(selectedListing.minOfferPrice)} 🪙</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Sua Oferta:</label>
              <input
                type="number"
                min={selectedListing.minOfferPrice || 1}
                value={offerPrice}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Mensagem (opcional):</label>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                rows={3}
                placeholder="Digite uma mensagem para o vendedor..."
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowOfferModal(false);
                  setOfferPrice(0);
                  setOfferMessage('');
                }}
                className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleMakeOffer}
                disabled={offerPrice < (selectedListing.minOfferPrice || 1)}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
              >
                Enviar Oferta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
