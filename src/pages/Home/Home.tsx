import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Heart, Search as SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { PersonCard } from '@/components/PersonCard';
import { SearchFiltersComponent } from '@/components/SearchFilters';
import { Pagination } from '@/components/Pagination';
import { StatisticsCards } from '@/components/StatisticsCards';
import { 
  listaUltimasPessoasDesaparecidas, 
  listaPessoasDesaparecidasPeloFiltro 
} from '@/services/apiService';
import type { PagePessoaDTO, PessoaDTO } from '@/types/models';
import type { SearchFilters } from '@/components/SearchFilters';

const ITEMS_PER_PAGE = 10;

export const Home = () => {
  const [pessoas, setPessoas] = useState<PessoaDTO[]>([]);
  const [pageInfo, setPageInfo] = useState<PagePessoaDTO>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  const fetchPessoas = useCallback(async (page: number = 0, searchFilters: SearchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      let response: PagePessoaDTO;

      // Verifica se há filtros ativos
      const hasFilters = Object.values(searchFilters).some(value => 
        value !== undefined && value !== '' && value !== null
      );

      if (hasFilters) {
        response = await listaPessoasDesaparecidasPeloFiltro(
          searchFilters.nome,
          searchFilters.faixaIdadeInicial,
          searchFilters.faixaIdadeFinal,
          searchFilters.sexo,
          page,
          ITEMS_PER_PAGE,
          searchFilters.status
        );
      } else {
        response = await listaUltimasPessoasDesaparecidas(
          page,
          ITEMS_PER_PAGE,
          'DESC'
        );
      }

      setPessoas(response.content || []);
      setPageInfo(response);
    } catch (err) {
      console.error('Erro ao buscar pessoas:', err);
      setError('Erro ao carregar dados. Tente novamente.');
      setPessoas([]);
      setPageInfo({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPessoas(currentPage, filters);
  }, [fetchPessoas, currentPage, filters]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = pageInfo.totalPages || 0;
  const totalElements = pageInfo.totalElements || 0;
  const hasResults = pessoas.length > 0;
  const hasFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-6">
          
          {/* <div className="text-center mb-8">

          
          </div> */}

          {/* Estatísticas */}
          <StatisticsCards />

          {/* Filtros de busca */}
          <SearchFiltersComponent 
            onFiltersChange={handleFiltersChange} 
            loading={loading}
          />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-6 py-8">
        {/* Mensagens de estado */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações dos resultados */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {hasFilters ? 'Resultados da Busca' : 'Pessoas Desaparecidas e Localizadas'}
              </h2>
              <p className="text-gray-600 mt-1">
                {totalElements > 0 ? (
                  <>
                    {totalElements.toLocaleString('pt-BR')} pessoa{totalElements !== 1 ? 's' : ''} encontrada{totalElements !== 1 ? 's' : ''}
                    {hasFilters && ' com os filtros aplicados'}
                  </>
                ) : (
                  hasFilters ? 'Nenhuma pessoa encontrada com estes filtros' : 'Nenhuma pessoa cadastrada'
                )}
              </p>
            </div>

            {hasResults && (
              <div className="text-sm text-gray-500">
                Página {currentPage + 1} de {totalPages}
              </div>
            )}
          </div>
        )}

        {/* Grid de cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
              <PersonCard 
                key={index} 
                person={{}} 
                loading={true} 
              />
            ))}
          </div>
        ) : hasResults ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {pessoas.map((pessoa) => (
                <PersonCard 
                  key={pessoa.id || Math.random()} 
                  person={pessoa} 
                />
              ))}
            </div>

            {/* Paginação */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={ITEMS_PER_PAGE}
              onPageChange={handlePageChange}
              loading={loading}
            />
          </>
        ) : !error && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="mb-4">
                  <SearchIcon className="h-16 w-16 text-gray-400 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {hasFilters ? 'Nenhum resultado encontrado' : 'Nenhuma pessoa cadastrada'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {hasFilters 
                    ? 'Tente ajustar seus filtros de busca para encontrar mais resultados.'
                    : 'Não há pessoas cadastradas no sistema no momento.'
                  }
                </p>
                {hasFilters && (
                  <div className="text-sm text-gray-500">
                    <p>Sugestões:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Remova alguns filtros</li>
                      <li>Tente uma busca mais ampla</li>
                      <li>Verifique a ortografia do nome</li>
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-gray-600">
                Sistema desenvolvido para ajudar famílias a encontrarem seus entes queridos
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Se você tem informações sobre alguma pessoa desaparecida, entre em contato através 
              da página de detalhes ou pelos telefones de emergência: <strong>190</strong> ou <strong>197</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};