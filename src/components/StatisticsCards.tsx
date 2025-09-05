import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { quantidadePessoasDesaparecidasLocalizadas } from '@/services/apiService';
import type { EstatisticaPessoaDTO } from '@/types/models';

export function StatisticsCards() {
  const [statistics, setStatistics] = useState<EstatisticaPessoaDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await quantidadePessoasDesaparecidasLocalizadas();
        setStatistics(data);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError('Erro ao carregar estatísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-12 w-12 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="col-span-full">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">{error || 'Não foi possível carregar as estatísticas'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPeople = (statistics.quantPessoasDesaparecidas || 0) + (statistics.quantPessoasEncontradas || 0);
  const foundPercentage = totalPeople > 0 ? Math.round(((statistics.quantPessoasEncontradas || 0) / totalPeople) * 100) : 0;

  const statsCards = [
    {
      title: 'Total de Pessoas',
      value: totalPeople.toLocaleString('pt-BR'),
      icon: Users,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColorLight: 'bg-blue-100',
    },
    {
      title: 'Desaparecidas',
      value: (statistics.quantPessoasDesaparecidas || 0).toLocaleString('pt-BR'),
      icon: AlertCircle,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      bgColorLight: 'bg-red-100',
    },
    {
      title: 'Localizadas',
      value: (statistics.quantPessoasEncontradas || 0).toLocaleString('pt-BR'),
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgColorLight: 'bg-green-100',
    },
    {
      title: 'Taxa de Sucesso',
      value: `${foundPercentage}%`,
      icon: TrendingUp,
      bgColor: foundPercentage >= 50 ? 'bg-green-500' : 'bg-yellow-500',
      textColor: foundPercentage >= 50 ? 'text-green-600' : 'text-yellow-600',
      bgColorLight: foundPercentage >= 50 ? 'bg-green-100' : 'bg-yellow-100',
 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className={`text-3xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColorLight}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
            
            {/* Barra de progresso para taxa de sucesso */}
            {stat.title === 'Taxa de Sucesso' && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${stat.bgColor}`}
                    style={{ width: `${foundPercentage}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
