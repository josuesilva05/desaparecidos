import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Search as SearchIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PersonCard } from "./PersonCard";
import { SearchFiltersComponent } from "./SearchFilters";
import { Pagination } from "./Pagination";
import { StatisticsCards } from "./StatisticsCards";
import {
  listaUltimasPessoasDesaparecidas,
  listaPessoasDesaparecidasPeloFiltro,
} from "@/services/apiService";
import type { PagePessoaDTO, PessoaDTO } from "@/types/models";
import type { SearchFilters } from "./SearchFilters";

const ITEMS_PER_PAGE = 10;

export const Home = () => {
  // const { success, error: showError } = useAlert();
  const [pessoas, setPessoas] = useState<PessoaDTO[]>([]);
  const [pageInfo, setPageInfo] = useState<PagePessoaDTO>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({});

  const fetchPessoas = useCallback(
    async (page: number = 0, searchFilters: SearchFilters = {}) => {
      try {
        setLoading(true);
        setError(null);

        let response: PagePessoaDTO;
        
        const hasFilters = Object.values(searchFilters).some(
          (value) => value !== undefined && value !== "" && value !== null
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
            "DESC"
          );
        }

        setPessoas(response.content || []);
        setPageInfo(response);
      } catch (err) {
        console.error("Erro ao buscar pessoas:", err);
        setError(
          "Ocorreu um problema ao carregar os dados. Tente novamente mais tarde."
        );
        setPessoas([]);
        setPageInfo({});
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPessoas(currentPage, filters);
  }, [fetchPessoas, currentPage, filters]);

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = pageInfo.totalPages || 0;
  const totalElements = pageInfo.totalElements || 0;
  const hasResults = pessoas.length > 0;
  const hasFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== null
  );

  return (
    <div className="min-h-screen w-full bg-[#faf9f6] dark:bg-gray-900 relative">
      {/* Paper Texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.12) 1px, transparent 0)`,
          backgroundSize: "8px 8px",
        }}
      />
      {/* Dark mode texture overlay */}
      <div
        className="absolute inset-0 z-0 dark:block hidden"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
          backgroundSize: "8px 8px",
        }}
      />
      {/* Content */}
      <div className="relative z-10">
        <div className="bg-white dark:bg-[#0c0d18] shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-6 py-6">
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
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-[#0c0d18]">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-300">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informações dos resultados */}
          {!loading && !error && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {hasFilters
                    ? "Resultados da Busca"
                    : "Pessoas Desaparecidas e Localizadas"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {totalElements > 0 ? (
                    <>
                      {totalElements.toLocaleString("pt-BR")} pessoa
                      {totalElements !== 1 ? "s" : ""} encontrada
                      {totalElements !== 1 ? "s" : ""}
                      {hasFilters && " com os filtros aplicados"}
                    </>
                  ) : hasFilters ? (
                    "Nenhuma pessoa encontrada com estes filtros"
                  ) : (
                    "Nenhuma pessoa cadastrada"
                  )}
                </p>
              </div>

              {hasResults && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Página {currentPage + 1} de {totalPages}
                </div>
              )}
            </div>
          )}

          {/* Grid de cards */}
          {loading ? (
            <div className="space-y-6">
              {/* Skeleton para informações dos resultados */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-pulse">
                <div className="space-y-2">
                  <Skeleton variant="shimmer" className="h-7 w-64" />
                  <Skeleton className="h-5 w-48" />
                </div>
                <Skeleton className="h-5 w-32" />
              </div>

              {/* Grid de cards com skeletons */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <div
                    key={index}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className="animate-pulse"
                  >
                    <PersonCard person={{}} loading={true} />
                  </div>
                ))}
              </div>

              {/* Skeleton da paginação */}
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-6 animate-pulse">
                <Skeleton className="h-5 w-48" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-10 w-24 rounded-md" />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-10 rounded-md" />
                  ))}
                  <Skeleton className="h-10 w-24 rounded-md" />
                </div>
              </div>
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
          ) : (
            !error && (
              <Card className="text-center py-12 bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700 transition-all duration-200">
                <CardContent>
                  <div className="max-w-md mx-auto">
                    <div className="mb-6">
                      <div className="relative">
                        <SearchIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto" />
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 opacity-50 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      {hasFilters
                        ? "Nenhum resultado encontrado"
                        : "Nenhuma pessoa cadastrada"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {hasFilters
                        ? "Tente ajustar seus filtros de busca para encontrar mais resultados."
                        : "Não há pessoas cadastradas no sistema no momento."}
                    </p>
                    {hasFilters && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <p className="font-medium mb-3">Sugestões:</p>
                        <ul className="list-disc list-inside space-y-2 text-left max-w-xs mx-auto">
                          <li>Remova alguns filtros</li>
                          <li>Tente uma busca mais ampla</li>
                          <li>Verifique a ortografia do nome</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
};
