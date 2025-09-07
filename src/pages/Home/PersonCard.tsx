import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Calendar, MapPin, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { PessoaDTO } from '@/types/models';
import placeholderImage from '@/assets/pessoa_desaparecida.png';

interface PersonCardProps {
  person: PessoaDTO;
  loading?: boolean;
}

export function PersonCard({ person, loading = false }: PersonCardProps) {
  const navigate = useNavigate();
  
  // Simplified image with direct fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = placeholderImage;
  };

  if (loading) {
    return (
      <Card className="overflow-hidden">
        <div className="relative">
          <Skeleton className="w-full h-48" />
          <div className="absolute top-3 right-3">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
        <CardContent className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Considera como desaparecido somente se não houve data de localização
  const isDesaparecido = !person.ultimaOcorrencia?.dataLocalizacao;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getGenderLabel = (sexo?: string) => {
    switch (sexo) {
      case 'MASCULINO': return 'Masculino';
      case 'FEMININO': return 'Feminino';
      default: return 'Não informado';
    }
  };

  const handleClick = () => {
    if (person.id) {
      navigate(`/person/${person.id}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group"
      onClick={handleClick}
    >
      <div className="relative">
        {/* Imagem da pessoa */}
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {/* Direct image with fallback to placeholder */}
          <img
            src={person.urlFoto || placeholderImage}
            alt={person.nome || 'Pessoa desaparecida'}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />

          {/* Badge de status */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant={isDesaparecido ? "destructive" : "default"}
              className={`text-xs font-medium shadow-lg ${
                isDesaparecido 
                  ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' 
                  : 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
              }`}
            >
              {isDesaparecido ? (
                <>
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Desaparecido(a)
                </>
              ) : (
                <>
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Localizado(a)
                </>
              )}
            </Badge>
          </div>
        </div>

        {/* Conteúdo do card */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Nome */}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {person.nome || 'Nome não informado'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <User className="h-3 w-3" />
                <span>{person.idade ? `${person.idade} anos` : 'Idade não informada'}</span>
                <span>•</span>
                <span>{getGenderLabel(person.sexo)}</span>
              </div>
            </div>

            {/* Informações da ocorrência */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {isDesaparecido ? 'Desapareceu em: ' : 'Localizado em: '}
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {isDesaparecido 
                      ? formatDate(person.ultimaOcorrencia?.dtDesaparecimento)
                      : formatDate(person.ultimaOcorrencia?.dataLocalizacao)
                    }
                  </span>
                </div>
              </div>

              {person.ultimaOcorrencia?.localDesaparecimentoConcat && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 dark:text-gray-400 line-clamp-2 text-xs">
                    {person.ultimaOcorrencia.localDesaparecimentoConcat}
                  </span>
                </div>
              )}
            </div>

            {/* Informação adicional se disponível */}
            {person.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.informacao && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                  {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
