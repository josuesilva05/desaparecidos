import { useNavigate } from "react-router-dom";
import { AlertCircle, CheckCircle, Calendar, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { PessoaDTO } from "@/types/models";
import placeholderImage from "@/assets/pessoa_desaparecida.png";

interface PersonCardProps {
  person: PessoaDTO;
  loading?: boolean;
}

export function PersonCard({ person, loading = false }: PersonCardProps) {
  const navigate = useNavigate();
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = placeholderImage;
  };

  if (loading) {
    return (
      <Card className="overflow-hidden bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700 transition-all duration-200">
        <div className="relative">
          <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <Skeleton variant="shimmer" className="w-full h-full" />
            <div className="absolute top-3 right-3">
              <Skeleton variant="shimmer" className="h-6 w-24 rounded-full" />
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Skeleton variant="shimmer" className="h-6 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-1 w-1 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Skeleton className="h-3 w-3 rounded-full mt-0.5 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton variant="shimmer" className="h-4 w-2/3" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Skeleton className="h-3 w-3 rounded-full mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5 mt-1" />
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/5 mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isDesaparecido = !person.ultimaOcorrencia?.dataLocalizacao;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const getGenderLabel = (sexo?: string) => {
    switch (sexo) {
      case "MASCULINO":
        return "Masculino";
      case "FEMININO":
        return "Feminino";
      default:
        return "Não informado";
    }
  };

  const handleClick = () => {
    if (person.id) {
      navigate(`/detalhes-pessoa/${person.id}`);
    }
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] group bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700"
      onClick={handleClick}
    >
      <div className="relative">
        <div className="relative h-48 bg-gray-100 dark:bg-gray-800 overflow-hidden">
          <img
            src={person.urlFoto || placeholderImage}
            alt={person.nome || "Pessoa desaparecida"}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 ease-out"
            loading="lazy"
          />
          <div className="absolute top-3 right-3">
            <Badge
              variant={isDesaparecido ? "destructive" : "default"}
              className={`text-xs font-medium shadow-lg ${
                isDesaparecido
                  ? "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
                  : "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
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
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {person.nome || "Nome não informado"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <User className="h-3 w-3" />
                <span>
                  {person.idade
                    ? `${person.idade} anos`
                    : "Idade não informada"}
                </span>
                <span>•</span>
                <span>{getGenderLabel(person.sexo)}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    {isDesaparecido ? "Desapareceu em: " : "Localizado em: "}
                  </span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    {isDesaparecido
                      ? formatDate(person.ultimaOcorrencia?.dtDesaparecimento)
                      : formatDate(person.ultimaOcorrencia?.dataLocalizacao)}
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
