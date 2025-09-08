import { User, Calendar, MapPin, CheckCircle } from "lucide-react";
import placeholderImage from '@/assets/pessoa_desaparecida.png';
import { Card, CardContent } from "@/components/ui/card";
import type { PessoaDTO } from "@/types/models";

interface PersonBasicInfoProps {
  person: PessoaDTO;
  onImageClick: (imageUrl: string | null) => void;
}

export function PersonBasicInfo({ person, onImageClick }: PersonBasicInfoProps) {
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

  const calculateDaysMissing = (disappearanceDate?: string) => {
    if (!disappearanceDate) return null;

    try {
      const disappearanceDateTime = new Date(disappearanceDate);
      const today = new Date();

      if (isNaN(disappearanceDateTime.getTime())) return null;

      disappearanceDateTime.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const timeDifference = today.getTime() - disappearanceDateTime.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      return Math.max(0, daysDifference);
    } catch (error) {
      console.error("Error calculating days missing:", error);
      return null;
    }
  };

  const formatDaysMissing = (daysMissing: number | null): string => {
    if (daysMissing === null) return "Desaparecido(a)";
    if (daysMissing === 0) return "Desaparecido(a) hoje";
    if (daysMissing === 1) return "Desaparecido(a) há 1 dia";
    return `Desaparecido(a) há ${daysMissing} dias`;
  };

  const isDesaparecido =
    person.ultimaOcorrencia?.encontradoVivo === undefined ||
    person.ultimaOcorrencia?.encontradoVivo === null ||
    !person.ultimaOcorrencia?.dataLocalizacao;

  return (
    <Card className="flex-shrink-0 bg-white dark:bg-[#0c0d18] border border-gray-200 dark:border-gray-700">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Imagem principal */}
          <div className="flex-shrink-0">
            <div className="w-72 h-80 mx-auto md:mx-0 rounded-lg overflow-hidden shadow-md">
              <img
                src={person.urlFoto || placeholderImage}
                alt={person.nome || 'Pessoa desaparecida'}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => onImageClick(person.urlFoto || null)}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src = placeholderImage;
                }}
              />
            </div>
          </div>

          {/* Informações ao lado da imagem */}
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Idade
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {person.idade || "N/A"} anos
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Sexo
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {getGenderLabel(person.sexo)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Desaparecimento
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatDate(person.ultimaOcorrencia?.dtDesaparecimento)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                    Situação
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {isDesaparecido
                    ? formatDaysMissing(
                        calculateDaysMissing(
                          person.ultimaOcorrencia?.dtDesaparecimento
                        )
                      )
                    : "Localizado(a)"}
                </p>
              </div>

              {person.ultimaOcorrencia?.localDesaparecimentoConcat && (
                <div className="space-y-1 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                      Local do Desaparecimento
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {person.ultimaOcorrencia.localDesaparecimentoConcat}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
