import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Calendar, MapPin, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useImageWithFallback } from '@/hooks/useImageWithFallback';
import type { PessoaDTO } from '@/types/models';

interface PersonCardProps {
  person: PessoaDTO;
  loading?: boolean;
}

export function PersonCard({ person, loading = false }: PersonCardProps) {
  const navigate = useNavigate();
  
  // URLs de fallback para caso a imagem principal falhe
  const fallbackUrls = [
    `https://ui-avatars.com/api/?name=${encodeURIComponent(person.nome || 'Pessoa')}&size=400&background=e5e7eb&color=374151&format=png`,
    `https://via.placeholder.com/400x400/e5e7eb/374151?text=${encodeURIComponent(person.nome?.charAt(0) || '?')}`
  ];

  const {
    src: currentImageSrc,
    isLoading: imageLoading,
    hasError: imageError,
    onLoad: handleImageLoad,
    onError: handleImageError,
  } = useImageWithFallback({
    src: person.urlFoto,
    fallbackSrcs: fallbackUrls,
  });

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

  const isDesaparecido = person.ultimaOcorrencia?.encontradoVivo === undefined || 
                         person.ultimaOcorrencia?.encontradoVivo === null ||
                         !person.ultimaOcorrencia?.dataLocalizacao;

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
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {currentImageSrc && !imageError ? (
            <div className="relative w-full h-full">
              {imageLoading && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
                  <div className="text-gray-500 text-sm font-medium">Carregando...</div>
                </div>
              )}
              <img
                src={currentImageSrc}
                alt={person.nome || 'Pessoa desaparecida'}
                className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="text-2xl bg-gray-300 text-gray-600">
                  {person.nome?.charAt(0).toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Loading skeleton */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Carregando...</div>
            </div>
          )}

          {/* Badge de status */}
          <div className="absolute top-3 right-3">
            <Badge 
              variant={isDesaparecido ? "destructive" : "default"}
              className={`text-xs font-medium shadow-lg ${
                isDesaparecido 
                  ? 'bg-red-100 text-red-800 border-red-200' 
                  : 'bg-green-100 text-green-800 border-green-200'
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
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {person.nome || 'Nome não informado'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <User className="h-3 w-3" />
                <span>{person.idade ? `${person.idade} anos` : 'Idade não informada'}</span>
                <span>•</span>
                <span>{getGenderLabel(person.sexo)}</span>
              </div>
            </div>

            {/* Informações da ocorrência */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-500">
                    {isDesaparecido ? 'Desapareceu em: ' : 'Localizado em: '}
                  </span>
                  <span className="font-medium text-gray-700">
                    {isDesaparecido 
                      ? formatDate(person.ultimaOcorrencia?.dtDesaparecimento)
                      : formatDate(person.ultimaOcorrencia?.dataLocalizacao)
                    }
                  </span>
                </div>
              </div>

              {person.ultimaOcorrencia?.localDesaparecimentoConcat && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 line-clamp-2 text-xs">
                    {person.ultimaOcorrencia.localDesaparecimentoConcat}
                  </span>
                </div>
              )}
            </div>

            {/* Informação adicional se disponível */}
            {person.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.informacao && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-600 line-clamp-2">
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
