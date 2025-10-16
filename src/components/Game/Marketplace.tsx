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

  useEffect(() => {
    loadListings();
  }, [activeTab]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await getMarketplaceListings(100);
      
      if (activeTab === 'browse') {
        setListings(data.filter(l => l.sellerId !== userId));
      } else if (activeTab === 'myListings') {
        setListings(data.filter(l => l.sellerId === userId));
      }
    } catch (error) {
      console.error('Erro ao carregar listagens:', error);
    } finally {
      setLoading(false);
    }
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
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'browse'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          🛒 Navegar
        </button>
        <button
          onClick={() => setActiveTab('myListings')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'myListings'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          📦 Minhas Vendas
        </button>
        {activeTab === 'myListings' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="ml-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
          >
            ➕ Nova Listagem
          </button>
        )}
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Carregando...</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {activeTab === 'browse' ? 'Nenhum item disponível no momento' : 'Você não tem listagens ativas'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className={`bg-gray-800 rounded-xl p-4 border-2 ${getTierGlow(listing.upgradeTier || UpgradeTier.COMUM)}`}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                <span className="text-4xl">{listing.upgradeIcon}</span>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{listing.upgradeName}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${getTierColor(listing.upgradeTier || UpgradeTier.COMUM)}`}
                  >
                    {getTierName(listing.upgradeTier || UpgradeTier.COMUM)}
                  </span>
                </div>
              </div>

              {/* Seller */}
              <div className="text-sm text-gray-400 mb-2">
                Vendedor: <span className="text-white">{listing.sellerUsername}</span>
              </div>

              {/* Quantity & Stats */}
              <div className="bg-gray-900 rounded-lg p-3 mb-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantidade:</span>
                  <span className="text-white font-bold">{listing.quantity}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Preço/Unidade:</span>
                  <span className="text-yellow-400 font-bold">{formatNumber(listing.pricePerUnit)} 🪙</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Renda/Unidade:</span>
                  <span className="text-green-400 font-bold">{formatNumber(listing.incomePerUnit)}/s</span>
                </div>
                <div className="flex justify-between text-base border-t border-gray-700 pt-2 mt-2">
                  <span className="text-gray-300 font-semibold">Total:</span>
                  <span className="text-yellow-400 font-bold">{formatNumber(listing.totalPrice)} 🪙</span>
                </div>
              </div>

              {/* Actions */}
              {activeTab === 'browse' ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePurchase(listing)}
                    disabled={coins < listing.totalPrice}
                    className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all"
                  >
                    💰 Comprar
                  </button>
                  {listing.acceptOffers && (
                    <button
                      onClick={() => {
                        setSelectedListing(listing);
                        setShowOfferModal(true);
                      }}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all"
                    >
                      📧 Oferecer
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleCancelListing(listing.id!)}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                >
                  🚫 Cancelar
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
