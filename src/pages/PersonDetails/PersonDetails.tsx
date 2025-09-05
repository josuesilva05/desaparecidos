import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, User, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {person.ultimaOcorrencia.listaCartaz.map((cartaz, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <Badge variant="outline" className="mb-2">
                          {cartaz.tipoCartaz?.replace('_', ' ')}
                        </Badge>
                        {cartaz.urlCartaz && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(cartaz.urlCartaz, '_blank')}
                          >
                            Visualizar Cartaz
                          </Button>
                        )}
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
                <CardTitle className="text-lg">Informações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {informacoes.length > 0 ? (
                  <div className="space-y-4">
                    {informacoes.slice(0, 3).map((info) => (
                      <div key={info.id} className="border-l-4 border-blue-500 pl-4">
                        <p className="text-sm text-gray-500 mb-1">
                          {formatDate(info.data)}
                        </p>
                        <p className="text-sm">{info.informacao}</p>
                      </div>
                    ))}
                    {informacoes.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{informacoes.length - 3} informações adicionais
                      </p>
                    )}
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
          onClose={() => setShowForm(false)}
          onSubmit={(data: any) => {
            console.log('Informação enviada:', data);
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}
