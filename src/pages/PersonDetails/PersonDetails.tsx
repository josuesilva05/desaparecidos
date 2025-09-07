import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  Download,
  FileText,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  detalhaPessoaDesaparecida,
  buscarInformacoes,
} from "@/services/apiService";
import type { PessoaDTO, OcorrenciaInformacaoDTO } from "@/types/models";
import { PersonInformationForm } from "@/pages/Home/PersonInformationForm";

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [person, setPerson] = useState<PessoaDTO | null>(null);
  const [informacoes, setInformacoes] = useState<OcorrenciaInformacaoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Função para baixar arquivo
  const downloadFile = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para verificar se é imagem
  const isImageUrl = (url: string) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return imageExtensions.some((ext) => url.toLowerCase().includes(ext));
  };

  // Função para obter nome do arquivo da URL
  const getFileNameFromUrl = (url: string) => {
    const urlParts = url.split("/");
    const fileName = urlParts[urlParts.length - 1];
    return fileName.split("?")[0] || "arquivo";
  };

  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const personData = await detalhaPessoaDesaparecida(parseInt(id));
        setPerson(personData);

        if (personData.ultimaOcorrencia?.ocoId) {
          const infos = await buscarInformacoes(
            personData.ultimaOcorrencia.ocoId
          );
          setInformacoes(infos);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da pessoa:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Pessoa não encontrada
          </h2>
          <Button onClick={() => navigate("/")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para início
          </Button>
        </div>
      </div>
    );
  }

  const isDesaparecido =
    person.ultimaOcorrencia?.encontradoVivo === undefined ||
    person.ultimaOcorrencia?.encontradoVivo === null ||
    !person.ultimaOcorrencia?.dataLocalizacao;

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

      // Check if the date is valid
      if (isNaN(disappearanceDateTime.getTime())) return null;

      // Reset time to midnight for both dates to get accurate day difference
      disappearanceDateTime.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const timeDifference = today.getTime() - disappearanceDateTime.getTime();
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

      // Handle negative values (future dates)
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {person.nome}
              </h1>
              <Badge
                variant={isDesaparecido ? "destructive" : "default"}
                className={`text-sm font-medium ${
                  isDesaparecido
                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                {isDesaparecido ? (
                  <>
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Desaparecido(a)
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Localizado(a)
                  </>
                )}
              </Badge>
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Fornecer Informação
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch min-h-[50rem]">
          {/* Informações principais */}
          <div className="lg:col-span-2 flex flex-col space-y-6">
            {/* Card da foto e informações básicas */}
            <Card className="flex-shrink-0">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Imagem principal */}
                  <div className="flex-shrink-0">
                    <div className="w-72 h-80 mx-auto md:mx-0 rounded-lg overflow-hidden shadow-md">
                      <img
                        src={person.urlFoto}
                        alt={person.nome}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedImage(person.urlFoto || null)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <div className="w-full h-full bg-gray-200 rounded-lg items-center justify-center hidden">
                        <span className="text-6xl text-gray-400 font-semibold">
                          {person.nome?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Informações ao lado da imagem */}
                  <div className="flex-1 flex flex-col justify-center space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                            Idade
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {person.idade || "N/A"} anos
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                            Sexo
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {getGenderLabel(person.sexo)}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                            Desaparecimento
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
                          {formatDate(
                            person.ultimaOcorrencia?.dtDesaparecimento
                          )}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                          <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                            Situação
                          </span>
                        </div>
                        <p className="text-lg font-bold text-gray-900">
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
                            <MapPin className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                              Local do Desaparecimento
                            </span>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            {person.ultimaOcorrencia.localDesaparecimentoConcat}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações reportadas */}
            <Card className="flex-1 flex flex-col">
              {" "}
              {/* Usar flex para ocupar espaço disponível */}
              <CardHeader className="flex-shrink-0 border-b">
                <CardTitle className="flex items-center justify-between">
                  <span>Informações Reportadas</span>
                  {informacoes.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {informacoes.length}{" "}
                      {informacoes.length === 1 ? "registro" : "registros"}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
                {" "}
                {/* Flex-1 para ocupar espaço restante */}
                {informacoes.length > 0 ? (
                  <div className="p-4 space-y-4">
                    {informacoes.map((info) => (
                      <div
                        key={info.id}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                      >
                        {/* Cabeçalho da informação */}
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Data: {formatDate(info.data)}
                            </span>
                          </div>
                        </div>

                        {/* Texto da informação */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-800 leading-relaxed bg-white p-3 rounded border">
                            {info.informacao}
                          </p>
                        </div>

                        {/* Anexos em quadradinhos */}
                        {info.anexos && info.anexos.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-700">
                                Anexos ({info.anexos.length})
                              </span>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                              {info.anexos.map((anexo, anexoIndex) => (
                                <div
                                  key={anexoIndex}
                                  className="group relative attachment-grid-item"
                                >
                                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200 hover:border-blue-300 transition-colors">
                                    {isImageUrl(anexo) ? (
                                      <img
                                        src={anexo}
                                        alt={`Anexo ${anexoIndex + 1}`}
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => setSelectedImage(anexo)}
                                      />
                                    ) : (
                                      <div
                                        className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                        onClick={() =>
                                          window.open(anexo, "_blank")
                                        }
                                      >
                                        <FileText className="h-6 w-6 text-gray-400" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Botões de ação - aparecem no hover */}
                                  <div className="absolute -bottom-8 left-0 right-0 opacity-0 group-hover:opacity-100 action-buttons">
                                    <div className="flex gap-1 bg-white rounded shadow-lg p-1">
                                      <Dialog>
                                        <DialogContent className="max-w-4xl max-h-[90vh]">
                                          <DialogHeader>
                                            <DialogTitle>
                                              Anexo - {formatDate(info.data)}
                                            </DialogTitle>
                                          </DialogHeader>
                                          <div className="flex justify-center">
                                            {isImageUrl(anexo) ? (
                                              <img
                                                src={anexo}
                                                alt={`Anexo ${anexoIndex + 1}`}
                                                className="max-w-full max-h-[70vh] object-contain"
                                              />
                                            ) : (
                                              <div className="text-center p-8">
                                                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-600 mb-4">
                                                  Arquivo não é uma imagem
                                                </p>
                                                <Button
                                                  onClick={() =>
                                                    window.open(anexo, "_blank")
                                                  }
                                                >
                                                  Abrir arquivo
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 font-medium">
                        Nenhuma informação reportada
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Seja o primeiro a compartilhar uma informação
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar com informações recentes */}
          <div className="flex flex-col gap-6 h-full min-h-[50rem]">
            {/* Informações do Desaparecimento */}
            {person.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO && (
              <Card className="flex-shrink-0">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações do Desaparecimento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                    .vestimentasDesaparecido && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Vestimentas
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {
                          person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                            .vestimentasDesaparecido
                        }
                      </p>
                    </div>
                  )}

                  {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                    .informacao && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">
                        Informações Adicionais
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {
                          person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO
                            .informacao
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Card de contato e cartazes - com altura expandida */}
            <Card className="!gap-3 flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-lg">
                  Informações de Emergência
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                <div className="p-4 bg-red-50 rounded-lg mt-auto flex-shrink-0">
                  <h4 className="font-semibold text-red-800 mb-2">
                    Viu esta pessoa?
                  </h4>
                  <p className="text-sm text-red-700 mb-3">
                    Entre em contato imediatamente com as autoridades.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-red-800" />
                      <span className="text-sm font-medium">
                        (65) 3901-4839 (1ª DP - CENTRO DE CUIABÁ)
                      </span>
                    </div>
                  </div>
                </div>
                {person.ultimaOcorrencia?.listaCartaz &&
                person.ultimaOcorrencia.listaCartaz.length > 0 ? (
                  <div className="flex-1">
                    <div className="grid grid-cols-1 gap-4">
                      {person.ultimaOcorrencia.listaCartaz.map(
                        (cartaz, index) => (
                          <div
                            key={index}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className="relative">
                              {cartaz.urlCartaz && (
                                <img
                                  src={cartaz.urlCartaz}
                                  alt={`Cartaz ${cartaz.tipoCartaz}`}
                                  className="w-full h-100 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                  onClick={() =>
                                    setSelectedImage(cartaz.urlCartaz!)
                                  }
                                />
                              )}
                              <div className="absolute top-2 left-2">
                                <Badge
                                  variant="secondary"
                                  className="bg-white/90 text-xs"
                                >
                                  CARTAZ DE DESAPARECIMENTO
                                </Badge>
                              </div>
                            </div>
                            <div className="p-3 space-y-2">
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 text-xs"
                                    >
                                      <Eye className="mr-1 h-3 w-3" />
                                      Ver
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-4xl max-h-[90vh]">
                                    <DialogHeader>
                                      <DialogTitle>
                                        Cartaz -{" "}
                                        {cartaz.tipoCartaz?.replace("_", " ")}
                                      </DialogTitle>
                                    </DialogHeader>
                                    <div className="flex justify-center">
                                      <img
                                        src={cartaz.urlCartaz}
                                        alt={`Cartaz ${cartaz.tipoCartaz}`}
                                        className="max-w-full max-h-[70vh] object-contain"
                                      />
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 text-xs"
                                  onClick={() =>
                                    downloadFile(
                                      cartaz.urlCartaz!,
                                      `cartaz_${index + 1}_${getFileNameFromUrl(
                                        cartaz.urlCartaz!
                                      )}`
                                    )
                                  }
                                >
                                  <Download className="mr-1 h-3 w-3" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="border rounded-lg overflow-hidden">
                        <div className="relative">
                          <div className="w-full h-100 bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400 mb-3" />
                            <p className="text-sm text-gray-600 font-medium text-center px-4">
                              Cartaz não disponível para essa pessoa
                            </p>
                            <p className="text-xs text-gray-500 mt-1 text-center px-4">
                              Nenhum cartaz foi gerado ainda
                            </p>
                          </div>
                          <div className="absolute top-2 left-2">
                            <Badge
                              variant="secondary"
                              className="bg-white/90 text-xs"
                            >
                              CARTAZ DE DESAPARECIMENTO
                            </Badge>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              disabled
                            >
                              <Eye className="mr-1 h-3 w-3" />
                              Ver
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs"
                              disabled
                            >
                              <Download className="mr-1 h-3 w-3" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seção de contato que fica no final do card */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal do formulário */}
      {showForm && (
        <PersonInformationForm
          personId={parseInt(id!)}
          personName={person.nome || ""}
          ocorrenciaId={person.ultimaOcorrencia?.ocoId || 0}
          onClose={() => setShowForm(false)}
          onSubmit={(data: any) => {
            console.log("Informação enviada:", data);
            setShowForm(false);
            // Recarregar as informações após envio bem-sucedido
            if (person.ultimaOcorrencia?.ocoId) {
              buscarInformacoes(person.ultimaOcorrencia.ocoId).then(
                setInformacoes
              );
            }
          }}
        />
      )}

      {/* Modal para visualização de imagem em tela cheia */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-5">
            <DialogHeader>
              <DialogTitle>Visualização de Imagem</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center items-center h-full">
              <img
                src={selectedImage}
                alt="Visualização em tamanho grande"
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={() =>
                  downloadFile(
                    selectedImage,
                    `imagem_${Date.now()}_${getFileNameFromUrl(selectedImage)}`
                  )
                }
                className="mr-2"
              >
                <Download className="mr-2 h-4 w-4" />
                Baixar Imagem
              </Button>
              <Button variant="outline" onClick={() => setSelectedImage(null)}>
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
