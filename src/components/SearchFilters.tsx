import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

export function SearchFiltersComponent({ onFiltersChange, loading = false }: SearchFiltersProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
    setShowAdvanced(false);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="space-y-4">
      {/* Busca principal */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar por nome..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          value={filters.nome || ''}
          onChange={(e) => handleFilterChange('nome', e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.status === 'DESAPARECIDO' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('status', filters.status === 'DESAPARECIDO' ? undefined : 'DESAPARECIDO')}
          disabled={loading}
          className={`${
            filters.status === 'DESAPARECIDO' 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'hover:bg-red-50 hover:text-red-600'
          }`}
        >
          Desaparecidos
        </Button>
        
        <Button
          variant={filters.status === 'LOCALIZADO' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFilterChange('status', filters.status === 'LOCALIZADO' ? undefined : 'LOCALIZADO')}
          disabled={loading}
          className={`${
            filters.status === 'LOCALIZADO' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'hover:bg-green-50 hover:text-green-600'
          }`}
        >
          Localizados
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          disabled={loading}
          className="hover:bg-gray-50"
        >
          <Filter className="mr-2 h-4 w-4" />
          Filtros avançados
        </Button>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            disabled={loading}
            className="hover:bg-gray-50 text-red-600 hover:text-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>

      {/* Filtros avançados */}
      {showAdvanced && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Faixa etária */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade mínima
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Ex: 18"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.faixaIdadeInicial || ''}
                  onChange={(e) => handleFilterChange('faixaIdadeInicial', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade máxima
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  placeholder="Ex: 65"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.faixaIdadeFinal || ''}
                  onChange={(e) => handleFilterChange('faixaIdadeFinal', e.target.value ? parseInt(e.target.value) : undefined)}
                  disabled={loading}
                />
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={filters.sexo || ''}
                  onChange={(e) => handleFilterChange('sexo', e.target.value || undefined)}
                  disabled={loading}
                >
                  <option value="">Todos</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                </select>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                Use os filtros acima para refinar sua busca. 
                {hasActiveFilters && ' Filtros ativos são exibidos com destaque.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
