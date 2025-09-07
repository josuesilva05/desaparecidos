import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <div className="@container grow w-full mb-6">
        <div className="grid grid-cols-1 @3xl:grid-cols-3 bg-background overflow-hidden rounded-xl border border-border">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-0 shadow-none rounded-none border-y @3xl:border-x @3xl:border-y-0 border-border last:border-0 first:border-0">
              <CardContent className="flex flex-col h-full space-y-3 justify-between py-4">
                <div className="space-y-0.5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex-1 flex flex-col gap-1.5 justify-between grow">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">{error || 'Não foi possível carregar as estatísticas'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalPeople = (statistics.quantPessoasDesaparecidas || 0) + (statistics.quantPessoasEncontradas || 0);
  const foundPercentage = totalPeople > 0 ? ((statistics.quantPessoasEncontradas || 0) / totalPeople) * 100 : 0;
  const missingPercentage = totalPeople > 0 ? ((statistics.quantPessoasDesaparecidas || 0) / totalPeople) * 100 : 0;

  const cards = [
    {
      title: 'Total de Pessoas',
      subtitle: 'Cadastradas no sistema',
      value: totalPeople.toLocaleString('pt-BR'),
      valueColor: 'text-blue-600',
      badge: {
        color: 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
        icon: Users,
        iconColor: 'text-blue-500',
        text: totalPeople === 0 ? '0%' : '100%',
      },
      // subtext: (
      //   <span className="text-blue-600 font-medium">
      //     {totalPeople} <span className="text-muted-foreground font-normal">pessoas registradas</span>
      //   </span>
      // ),
    },
    {
      title: 'Pessoas Desaparecidas',
      subtitle: 'Casos em aberto',
      value: (statistics.quantPessoasDesaparecidas || 0).toLocaleString('pt-BR'),
      valueColor: 'text-red-500',
      badge: {
        color: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
        icon: AlertCircle,
        iconColor: 'text-red-500',
        text: `${missingPercentage.toFixed(0)}%`,
      },
      // subtext: (
      //   <span className="text-red-500 font-medium">
      //     {statistics.quantPessoasDesaparecidas} <span className="text-muted-foreground font-normal">casos ativos</span>
      //   </span>
      // ),
    },
    {
      title: 'Pessoas Localizadas',
      subtitle: 'Casos solucionados',
      value: (statistics.quantPessoasEncontradas || 0).toLocaleString('pt-BR'),
      valueColor: 'text-green-600',
      badge: {
        color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400',
        icon: CheckCircle,
        iconColor: 'text-green-500',
        text: `${foundPercentage.toFixed(0)}%`,
      },
      // subtext: (
      //   <span className="text-green-600 font-medium">
      //     {statistics.quantPessoasEncontradas} <span className="text-muted-foreground font-normal">casos solucionados</span>
      //   </span>
      // ),
    },
  ];

  return (
    <div className="mb-6">
      <div className="@container grow w-full">
        <div className="grid grid-cols-1 @3xl:grid-cols-3 bg-background overflow-hidden rounded-xl border border-gray-300 dark:border-gray-600">
          {cards.map((card, i) => (
            <Card
              key={i}
              className="border-0 shadow-none rounded-none border-y @3xl:border-x @3xl:border-y-0 border-border last:border-0 first:border-0"
            >
              <CardContent className="flex flex-col h-full space-y-3 justify-between py-4 px-6">
                {/* Title & Subtitle */}
                <div className="space-y-0.5">
                  <div className="text-2xl font-semibold text-foreground">{card.title}</div>
                  <div className="text-sm text-muted-foreground">{card.subtitle}</div>
                </div>

                {/* Information */}
                <div className="flex-1 flex flex-col gap-1.5 justify-between grow">
                  {/* Value & Delta */}
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold tracking-tight ${card.valueColor}`}>
                      {card.value}
                    </span>
                    <Badge
                      className={`${card.badge.color} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-none`}
                    >
                      <card.badge.icon className={`w-3 h-3 ${card.badge.iconColor}`} />
                      {card.badge.text}
                    </Badge>
                  </div>
                  {/* Subtext */}
                  {/* <div className="text-sm">{card.subtext}</div> */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
