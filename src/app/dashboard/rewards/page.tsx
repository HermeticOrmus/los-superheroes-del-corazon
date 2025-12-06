'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Gift,
  Star,
  Package,
  Download,
  Zap,
  CheckCircle,
  AlertCircle,
  Filter,
  Search,
  Sparkles,
} from 'lucide-react';
import { rewardsApi, childrenApi } from '@/lib/api';

interface Reward {
  id: string;
  nameEs: string;
  descriptionEs: string;
  type: 'BADGE' | 'DIGITAL' | 'PHYSICAL';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  luzPointsCost: number;
  imageUrl?: string;
  stockQuantity?: number;
}

interface ChildInfo {
  id: string;
  name: string;
  superheroName: string;
  luzPoints: number;
  archangel: {
    colorHex: string;
  };
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [selectedChild, setSelectedChild] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rewardsData, childrenData] = await Promise.all([
        rewardsApi.getAll(),
        childrenApi.getAll(),
      ]);

      setRewards(rewardsData);
      setChildren(childrenData);
      if (childrenData.length > 0) {
        setSelectedChild(childrenData[0].id);
      }
    } catch (error) {
      console.error('Error loading rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (rewardId: string) => {
    if (!selectedChild) {
      alert('Selecciona un niño primero');
      return;
    }

    try {
      setRedeeming(rewardId);
      await rewardsApi.redeem(rewardId, { childId: selectedChild });
      alert('¡Recompensa canjeada con éxito!');
      loadData(); // Reload to update points
    } catch (error: any) {
      alert(error.message || 'Error al canjear la recompensa');
    } finally {
      setRedeeming(null);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return 'from-purple-500 to-pink-500';
      case 'EPIC':
        return 'from-blue-500 to-purple-500';
      case 'RARE':
        return 'from-green-500 to-blue-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'LEGENDARY':
        return <Badge className="bg-purple-100 text-purple-700">Legendaria</Badge>;
      case 'EPIC':
        return <Badge className="bg-blue-100 text-blue-700">Épica</Badge>;
      case 'RARE':
        return <Badge className="bg-green-100 text-green-700">Rara</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Común</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PHYSICAL':
        return <Package className="w-5 h-5" />;
      case 'DIGITAL':
        return <Download className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const filteredRewards = rewards.filter((reward) => {
    const matchesType = filterType === 'ALL' || reward.type === filterType;
    const matchesSearch = reward.nameEs.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reward.descriptionEs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const selectedChildData = children.find((c) => c.id === selectedChild);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando recompensas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tienda de Recompensas</h1>
          <p className="text-gray-600">Canjea Puntos Luz por increíbles premios</p>
        </div>
        <Gift className="w-12 h-12 text-gold-600" />
      </div>

      {/* Child Selector */}
      {children.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Canjeando para:
              </label>
              <div className="flex gap-3">
                {children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedChild === child.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {child.superheroName || child.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedChildData && (
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Puntos Luz Disponibles</p>
                <div className="flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  <span className="text-3xl font-bold text-yellow-600">
                    {selectedChildData.luzPoints}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar recompensas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex gap-2">
              {['ALL', 'BADGE', 'DIGITAL', 'PHYSICAL'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filterType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'ALL' ? 'Todas' : type === 'BADGE' ? 'Insignias' : type === 'DIGITAL' ? 'Digitales' : 'Físicas'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Rewards Grid */}
      {filteredRewards.length === 0 ? (
        <Card className="p-12 text-center">
          <Gift className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No se encontraron recompensas
          </h3>
          <p className="text-gray-600">Intenta con otros filtros de búsqueda</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => {
            const canAfford = selectedChildData && selectedChildData.luzPoints >= reward.luzPointsCost;
            const isOutOfStock = reward.type === 'PHYSICAL' && reward.stockQuantity === 0;

            return (
              <Card
                key={reward.id}
                className={`overflow-hidden hover:shadow-xl transition-all ${
                  !canAfford || isOutOfStock ? 'opacity-75' : ''
                }`}
              >
                {/* Reward Image */}
                <div className={`h-48 bg-gradient-to-br ${getRarityColor(reward.rarity)} p-6 flex items-center justify-center relative`}>
                  {reward.imageUrl ? (
                    <img
                      src={reward.imageUrl}
                      alt={reward.nameEs}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-white">
                      {getTypeIcon(reward.type)}
                    </div>
                  )}

                  <div className="absolute top-3 right-3">
                    {getRarityBadge(reward.rarity)}
                  </div>

                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Agotado</span>
                    </div>
                  )}
                </div>

                {/* Reward Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{reward.nameEs}</h3>
                    <div className="flex items-center gap-1 text-yellow-600 font-bold">
                      <Zap className="w-4 h-4" />
                      {reward.luzPointsCost}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{reward.descriptionEs}</p>

                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                    {getTypeIcon(reward.type)}
                    <span>
                      {reward.type === 'PHYSICAL' ? 'Físico - Envío a domicilio' :
                       reward.type === 'DIGITAL' ? 'Digital - Descarga inmediata' :
                       'Insignia - Desbloqueo instantáneo'}
                    </span>
                  </div>

                  {reward.type === 'PHYSICAL' && reward.stockQuantity !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Disponibles</span>
                        <span>{reward.stockQuantity} unidades</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${Math.min((reward.stockQuantity / 100) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleRedeem(reward.id)}
                    disabled={!canAfford || isOutOfStock || !selectedChild || redeeming === reward.id}
                    className="w-full"
                    variant={canAfford && !isOutOfStock ? 'default' : 'outline'}
                  >
                    {redeeming === reward.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Canjeando...
                      </>
                    ) : !canAfford ? (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Puntos insuficientes
                      </>
                    ) : isOutOfStock ? (
                      'Agotado'
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Canjear
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
