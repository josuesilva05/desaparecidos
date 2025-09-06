import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Phone, AlertCircle, CheckCircle, Download, FileText, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { detalhaPessoaDesaparecida, buscarInformacoes } from '@/services/apiService';
import type { PessoaDTO, OcorrenciaInformacaoDTO } from '@/types/models';
import { PersonInformationForm } from '@/components/PersonInformationForm';

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
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para verificar se é imagem
  const isImageUrl = (url: string) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().includes(ext));
  };

  // Função para obter nome do arquivo da URL
  const getFileNameFromUrl = (url: string) => {
    const urlParts = url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    return fileName.split('?')[0] || 'arquivo';
  };

  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const personData = await detalhaPessoaDesaparecida(parseInt(id));
        setPerson(personData);
        
        if (personData.ultimaOcorrencia?.ocoId) {
          const infos = await buscarInformacoes(personData.ultimaOcorrencia.ocoId);
          setInformacoes(infos);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes da pessoa:', error);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pessoa não encontrada</h2>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para início
          </Button>
        </div>
      </div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{person.nome}</h1>
              <Badge 
                variant={isDesaparecido ? "destructive" : "default"}
                className={`text-sm font-medium ${
                  isDesaparecido 
                    ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card da foto e informações básicas */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <Avatar className="w-48 h-48 mx-auto md:mx-0">
                      <AvatarImage 
                        src={person.urlFoto} 
                        alt={person.nome}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-4xl">
                        {person.nome?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Idade</p>
                          <p className="font-medium">{person.idade || 'N/A'} anos</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Sexo</p>
                          <p className="font-medium">{getGenderLabel(person.sexo)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Data do Desaparecimento</p>
                          <p className="font-medium">
                            {formatDate(person.ultimaOcorrencia?.dtDesaparecimento)}
                          </p>
                        </div>
                      </div>
                      
                      {person.ultimaOcorrencia?.dataLocalizacao && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500">Data da Localização</p>
                            <p className="font-medium text-green-600">
                              {formatDate(person.ultimaOcorrencia.dataLocalizacao)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {person.ultimaOcorrencia?.localDesaparecimentoConcat && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                        <div>
                          <p className="text-sm text-gray-500">Local do Desaparecimento</p>
                          <p className="font-medium">{person.ultimaOcorrencia.localDesaparecimentoConcat}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações adicionais */}
            {person.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO && (
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Desaparecimento</CardTitle>
                </CardHeader>
                <CardContent>
                  {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-2">Vestimentas</h4>
                      <p className="text-gray-600">
                        {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.vestimentasDesaparecido}
                      </p>
                    </div>
                  )}
                  
                  {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Informações Adicionais</h4>
                      <p className="text-gray-600">
                        {person.ultimaOcorrencia.ocorrenciaEntrevDesapDTO.informacao}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Cartazes */}
            {person.ultimaOcorrencia?.listaCartaz && person.ultimaOcorrencia.listaCartaz.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Cartazes de Divulgação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {person.ultimaOcorrencia.listaCartaz.map((cartaz, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="relative">
                          {cartaz.urlCartaz && (
                            <img 
                              src={cartaz.urlCartaz} 
                              alt={`Cartaz ${cartaz.tipoCartaz}`}
                              className="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setSelectedImage(cartaz.urlCartaz!)}
                            />
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge variant="secondary" className="bg-white/90">
                              {cartaz.tipoCartaz?.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Eye className="mr-2 h-4 w-4" />
                                  Visualizar
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[90vh]">
                                <DialogHeader>
                                  <DialogTitle>Cartaz - {cartaz.tipoCartaz?.replace('_', ' ')}</DialogTitle>
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
                              className="flex-1"
                              onClick={() => downloadFile(cartaz.urlCartaz!, `cartaz_${index + 1}_${getFileNameFromUrl(cartaz.urlCartaz!)}`)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar com informações recentes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações da Comunidade</CardTitle>
              </CardHeader>
              <CardContent>
                {informacoes.length > 0 ? (
                  <div className="space-y-6">
                    {informacoes.map((info) => (
                      <div key={info.id} className="border-l-4 border-l-blue-500 pl-4 pb-4 border-b border-b-gray-100 last:border-b-0">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm text-gray-500">
                            {formatDate(info.data)}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            ID: {info.id}
                          </Badge>
                        </div>
                        <p className="text-sm mb-3">{info.informacao}</p>
                        
                        {/* Anexos da informação */}
                        {info.anexos && info.anexos.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-gray-600">Anexos ({info.anexos.length}):</p>
                            <div className="grid grid-cols-2 gap-2">
                              {info.anexos.map((anexo, anexoIndex) => (
                                <div key={anexoIndex} className="relative">
                                  {isImageUrl(anexo) ? (
                                    <div className="relative group">
                                      <img 
                                        src={anexo} 
                                        alt={`Anexo ${anexoIndex + 1}`}
                                        className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
                                        onClick={() => setSelectedImage(anexo)}
                                      />
                                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                        <Eye className="h-4 w-4 text-white" />
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="w-full h-16 bg-gray-100 rounded flex items-center justify-center">
                                      <FileText className="h-6 w-6 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="mt-1 flex gap-1">
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 text-xs px-2 flex-1">
                                          Ver
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl max-h-[90vh]">
                                        <DialogHeader>
                                          <DialogTitle>Anexo - {formatDate(info.data)}</DialogTitle>
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
                                              <p className="text-gray-600 mb-4">Arquivo não é uma imagem</p>
                                              <Button onClick={() => window.open(anexo, '_blank')}>
                                                Abrir arquivo
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="h-6 text-xs px-2 flex-1"
                                      onClick={() => downloadFile(anexo, `anexo_${info.id}_${anexoIndex + 1}_${getFileNameFromUrl(anexo)}`)}
                                    >
                                      <Download className="h-3 w-3" />
                                    </Button>
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
                  <p className="text-sm text-gray-500">
                    Nenhuma informação adicional disponível.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Card de contato */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações de Emergência</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Viu esta pessoa?
                  </h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Entre em contato imediatamente com as autoridades ou use o formulário ao lado.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">190 (Polícia Militar)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">197 (Polícia Civil)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal do formulário */}
      {showForm && (
        <PersonInformationForm
          personId={parseInt(id!)}
          personName={person.nome || ''}
          ocorrenciaId={person.ultimaOcorrencia?.ocoId || 0}
          onClose={() => setShowForm(false)}
          onSubmit={(data: any) => {
            console.log('Informação enviada:', data);
            setShowForm(false);
            // Recarregar as informações após envio bem-sucedido
            if (person.ultimaOcorrencia?.ocoId) {
              buscarInformacoes(person.ultimaOcorrencia.ocoId).then(setInformacoes);
            }
          }}
        />
      )}

      {/* Modal para visualização de imagem em tela cheia */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
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
                onClick={() => downloadFile(selectedImage, `imagem_${Date.now()}_${getFileNameFromUrl(selectedImage)}`)}
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
