import axios from 'axios';
import { environment } from '@/environments/environment';
import { MockApiService } from './mockApiService';
import type {
  Permissao,
  OcorrenciaInformacaoDTO,
  OcorrenciaIntegracaoDto,
  VitimaChecagemDuplicidadeResquestDto,
  LoginDTO,
  PessoaDTO,
  PagePessoaDTO,
  EstatisticaPessoaDTO,
  MotivoDto
} from '@/types/models';

// Configuração do axios
const api = axios.create({
  baseURL: environment.apiUrl,
  timeout: 30000, // 30 segundos
  headers: {
    'Accept': 'application/json',
  }
});

// Função helper para decidir se usar mock ou API real
const shouldUseMock = () => {
  return 'useMockData' in environment && environment.useMockData;
};

export const login = async (data: LoginDTO): Promise<Permissao> => {
  const res = await api.post('/login', data);
  return res.data;
};

export const refreshToken = async (token: string): Promise<Permissao> => {
  const res = await api.post('/refresh-token', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const buscarInformacoes = async (ocorrenciaId: number): Promise<OcorrenciaInformacaoDTO[]> => {
  if (shouldUseMock()) {
    return MockApiService.buscarInformacoes(ocorrenciaId);
  }
  
  const res = await api.get('/ocorrencias/informacoes-desaparecido', {
    params: { ocorrenciaId }
  });
  return res.data;
};

// Função para adicionar informações sobre pessoa desaparecida
export const adicionarInformacoes = async (
  informacao: string,
  descricao: string,
  data: string,
  ocoId: number,
  files?: File[]
): Promise<OcorrenciaInformacaoDTO> => {
  try {
    // Validações básicas
    if (!informacao?.trim()) throw new Error('Informação é obrigatória');
    if (!data) throw new Error('Data é obrigatória');
    if (!ocoId || ocoId <= 0) throw new Error('ID da ocorrência inválido');
    
    // FormData para arquivos (multipart/form-data)
    const formData = new FormData();
    
    // Adicionar arquivos se existirem
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file, file.name);
      });
    }
    
    // Parâmetros da requisição
    const params = {
      informacao: informacao.trim(),
      descricao: descricao?.trim() || '',
      data,
      ocoId
    };
    
    const response = await api.post('/ocorrencias/informacoes-desaparecido', formData, {
      params,
      timeout: 30000
    });
    
    return response.data;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      
      if (status === 404) throw new Error('Ocorrência não encontrada');
      if (status === 400) throw new Error(responseData?.message || 'Dados inválidos');
      if (status === 500) throw new Error('Erro no servidor. Tente novamente.');
    }
    
    throw error;
  }
};

export const adicionarOcorrenciaIntegracao = async (data: OcorrenciaIntegracaoDto): Promise<any> => {
  try {
    // Validações básicas
    if (!data.vitima?.nome?.trim()) throw new Error('Nome da vítima é obrigatório');
    if (!data.comunicante?.nome?.trim()) throw new Error('Nome do comunicante é obrigatório');
    if (!data.usuarioCadastroId) throw new Error('ID do usuário é obrigatório');
    if (!data.nomeUsuarioCadastro?.trim()) throw new Error('Nome do usuário é obrigatório');
    if (!data.cargoUsuarioCadastro?.trim()) throw new Error('Cargo do usuário é obrigatório');

    // Log the data being sent for debugging
    console.log('Sending data to API:', JSON.stringify(data, null, 2));

    const response = await api.post('/ocorrencias/delegacia-digital', data, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    return response.data;
    
  } catch (error) {
    console.error('API Error:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      
      console.error('Response status:', status);
      console.error('Response data:', responseData);
      console.error('Request config:', error.config);
      
      if (status === 400) {
        const message = responseData?.message || responseData?.error || 'Dados inválidos fornecidos';
        throw new Error(`Erro 400: ${message}`);
      }
      if (status === 401) throw new Error('Erro 401: Acesso não autorizado');
      if (status === 403) throw new Error('Erro 403: Permissão negada');
      if (status === 500) {
        const message = responseData?.message || responseData?.error || 'Erro interno do servidor';
        throw new Error(`Erro 500: ${message}`);
      }
      
      throw new Error(`Erro ${status}: ${responseData?.message || error.message}`);
    }
    
    throw error;
  }
};

export const checarVitimaDuplicada = async (data: VitimaChecagemDuplicidadeResquestDto): Promise<any> => {
  const res = await api.post('/ocorrencias/delegacia-digital/verificar-duplicidade', data);
  return res.data;
};

export const listarMotivosDesaparecimento = async (): Promise<MotivoDto[]> => {
  const res = await api.get('/ocorrencias/motivos');
  return res.data;
};

export const detalhaPessoaDesaparecida = async (id: number): Promise<PessoaDTO> => {
  if (shouldUseMock()) {
    return MockApiService.detalhaPessoaDesaparecida(id);
  }
  
  const res = await api.get(`/pessoas/${id}`);
  return res.data;
};

export const listaUltimasPessoasDesaparecidas = async (
  pagina?: number,
  porPagina?: number,
  direcao?: string,
  status?: string
): Promise<PagePessoaDTO> => {
  if (shouldUseMock()) {
    return MockApiService.listaUltimasPessoasDesaparecidas(pagina, porPagina, direcao, status);
  }
  
  const res = await api.get('/pessoas/aberto', {
    params: { pagina, porPagina, direcao, status }
  });
  return res.data;
};

export const listaPessoasDesaparecidasPeloFiltro = async (
  nome?: string,
  faixaIdadeInicial?: number,
  faixaIdadeFinal?: number,
  sexo?: string,
  pagina?: number,
  porPagina?: number,
  status?: string
): Promise<PagePessoaDTO> => {
  if (shouldUseMock()) {
    return MockApiService.listaPessoasDesaparecidasPeloFiltro(
      nome, faixaIdadeInicial, faixaIdadeFinal, sexo, pagina, porPagina, status
    );
  }
  
  const res = await api.get('/pessoas/aberto/filtro', {
    params: { nome, faixaIdadeInicial, faixaIdadeFinal, sexo, pagina, porPagina, status }
  });
  return res.data;
};

export const quantidadePessoasDesaparecidasLocalizadas = async (): Promise<EstatisticaPessoaDTO> => {
  if (shouldUseMock()) {
    return MockApiService.quantidadePessoasDesaparecidasLocalizadas();
  }
  
  const res = await api.get('/pessoas/aberto/estatistico');
  return res.data;
};

export const pessoasDesaparecidasRandomico = async (registros?: number): Promise<PessoaDTO[]> => {
  if (shouldUseMock()) {
    return MockApiService.pessoasDesaparecidasRandomico(registros);
  }
  
  const res = await api.get('/pessoas/aberto/dinamico', {
    params: { registros }
  });
  return res.data;
};

export const getPessoasEstatistico = quantidadePessoasDesaparecidasLocalizadas;