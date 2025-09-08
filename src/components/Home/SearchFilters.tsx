import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export interface SearchFilters {
  nome?: string;
  faixaIdadeInicial?: number;
  faixaIdadeFinal?: number;
  sexo?: string;
  status?: string;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  loading?: boolean;
}

export function SearchFiltersComponent({
  onFiltersChange,
  loading = false,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchValue, setSearchValue] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchSubmit = () => {
    const newFilters = { ...filters, nome: searchValue || undefined };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchValue(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const handleFilterChange = (
    key: keyof SearchFilters,
    value: string | number | undefined
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters); // Dispara a busca automaticamente para filtros avançados
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    setSearchValue("");
    onFiltersChange(emptyFilters);
    setShowAdvanced(false);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== "" && value !== null
  );

  const getActiveFiltersLabels = () => {
    const activeFilters = [];

    // Para filtros ativos (que já foram aplicados), verificamos tanto searchValue quanto filters.nome
    const appliedSearchValue = filters.nome;
    if (appliedSearchValue && appliedSearchValue.trim()) {
      activeFilters.push({
        key: "nome",
        label: `Nome: "${appliedSearchValue}"`,
      });
    }

    if (filters.status) {
      const statusLabel =
        filters.status === "DESAPARECIDO" ? "Desaparecidos" : "Localizados";
      activeFilters.push({ key: "status", label: `Status: ${statusLabel}` });
    }

    if (filters.faixaIdadeInicial) {
      activeFilters.push({
        key: "faixaIdadeInicial",
        label: `Idade mín: ${filters.faixaIdadeInicial}`,
      });
    }

    if (filters.faixaIdadeFinal) {
      activeFilters.push({
        key: "faixaIdadeFinal",
        label: `Idade máx: ${filters.faixaIdadeFinal}`,
      });
    }

    if (filters.sexo) {
      const sexoLabel = filters.sexo === "MASCULINO" ? "Masculino" : "Feminino";
      activeFilters.push({ key: "sexo", label: `Sexo: ${sexoLabel}` });
    }

    return activeFilters;
  };

  const removeFilter = (filterKey: string) => {
    if (filterKey === "nome") {
      setSearchValue("");
      const newFilters = { ...filters, nome: undefined };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    } else {
      const newFilters = { ...filters, [filterKey]: undefined };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    }
  };

  return (
    <div className="space-y-4">
      {/* Busca principal */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${
            loading 
              ? 'text-gray-300 dark:text-gray-600' 
              : 'text-gray-400 dark:text-gray-500'
          }`} />
          <Input
            type="text"
            placeholder={loading ? "Buscando..." : "Buscar por nome..."}
            className={`w-full pl-10 pr-4 py-6 border dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 ${
              loading ? 'opacity-75' : ''
            }`}
            value={searchValue}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
            </div>
          )}
        </div>
        <Button
          onClick={handleSearchSubmit}
          disabled={loading}
          size="lg"
          className={`px-6 py-6 transition-all duration-200 ${loading ? 'opacity-80' : ''}`}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-2"></div>
          ) : (
            <Search className="h-5 w-5 mr-2" />
          )}
          {loading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2 justify-between">

        {/* Theme toggle à direita */}
        <div className="flex order-3 justify-center lg:justify-end">
          <ThemeToggle />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.status === "DESAPARECIDO" ? "default" : "outline"}
            size="lg"
            onClick={() => {
              const newStatus =
                filters.status === "DESAPARECIDO" ? undefined : "DESAPARECIDO";
              const newFilters = { ...filters, status: newStatus };
              setFilters(newFilters);
              onFiltersChange(newFilters); // Dispara a busca automaticamente
            }}
            disabled={loading}
            className={`transition-all duration-200 ${
              filters.status === "DESAPARECIDO"
                ? "bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800"
                : "hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 dark:border-gray-600"
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>}
            Desaparecidos
          </Button>

          <Button
            variant={filters.status === "LOCALIZADO" ? "default" : "outline"}
            size="lg"
            onClick={() => {
              const newStatus =
                filters.status === "LOCALIZADO" ? undefined : "LOCALIZADO";
              const newFilters = { ...filters, status: newStatus };
              setFilters(newFilters);
              onFiltersChange(newFilters); // Dispara a busca automaticamente
            }}
            disabled={loading}
            className={`transition-all duration-200 ${
              filters.status === "LOCALIZADO"
                ? "bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
                : "hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400 dark:border-gray-600"
            } ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>}
            Localizados
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={loading}
            className={`transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 dark:border-gray-600 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros avançados
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="lg"
              onClick={clearFilters}
              disabled={loading}
              className={`transition-all duration-200 hover:bg-gray-50 text-red-600 hover:text-red-700 dark:hover:bg-gray-800 dark:text-red-400 dark:hover:text-red-300 dark:border-gray-600 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <X className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros ativos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground font-medium">
            Filtros ativos:
          </span>
          {getActiveFiltersLabels().map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="gap-1 pr-1 pl-2"
            >
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeFilter(filter.key)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filtros avançados */}
      {showAdvanced && (
        <Card className="bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Faixa etária */}
              <div className="space-y-2">
                <Label htmlFor="idade-minima">Idade mínima</Label>
                <Input
                  id="idade-minima"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Ex: 18"
                  value={filters.faixaIdadeInicial || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "faixaIdadeInicial",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idade-maxima">Idade máxima</Label>
                <Input
                  id="idade-maxima"
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Ex: 65"
                  value={filters.faixaIdadeFinal || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "faixaIdadeFinal",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  disabled={loading}
                />
              </div>

              {/* Sexo */}
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select
                  value={filters.sexo}
                  onValueChange={(value) =>
                    handleFilterChange(
                      "sexo",
                      value === "ALL" ? undefined : value
                    )
                  }
                  disabled={loading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Todos os sexos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todos</SelectItem>
                    <SelectItem value="MASCULINO">Masculino</SelectItem>
                    <SelectItem value="FEMININO">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="text-sm text-muted-foreground">
              <p>
                Use os filtros acima para refinar sua busca. A busca é feita automaticamente quando você altera um filtro.
                {hasActiveFilters &&
                  " Filtros ativos são exibidos com destaque."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
