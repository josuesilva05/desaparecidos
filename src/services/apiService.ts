import axios from 'axios';
import { environment } from '@/environments/environment';
import type {
  Permissao,
  OcorrenciaInformacaoDTO,
  LoginDTO,
  PessoaDTO,
  PagePessoaDTO,
  EstatisticaPessoaDTO,
  MotivoDto
} from '@/types/models';

const api = axios.create({
  baseURL: environment.apiUrl,
  timeout: 20000,
  headers: {
    'Accept': 'application/json',
  }
});

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
  const res = await api.get('/ocorrencias/informacoes-desaparecido', {
    params: { ocorrenciaId }
  });
  return res.data;
};

export const adicionarInformacoes = async (
  informacao: string,
  descricao: string,
  data: string,
  ocoId: number,
  files?: File[]
): Promise<OcorrenciaInformacaoDTO> => {
  try {
    if (!informacao?.trim()) throw new Error('Informação é obrigatória');
    if (!data) throw new Error('Data é obrigatória');
    if (!ocoId || ocoId <= 0) throw new Error('ID da ocorrência inválido');
    
    const formData = new FormData();
    
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('files', file, file.name);
      });
    }
    
    const params = {
      informacao: informacao.trim(),
      descricao: descricao?.trim() || '',
      data,
      ocoId
    };
    
    const response = await api.post('/ocorrencias/informacoes-desaparecido', formData, {
      params,
      timeout: 20000
    });
    
    return response.data;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      
      if (status === 404) throw new Error('Ocorrência não encontrada');
      if (status === 400) throw new Error(responseData?.message || 'Dados inválidos');
      if (status === 500) throw new Error('Erro no servidor. Tente novamente mais tarde.');
    }
    
    throw error;
  }
};

export const listarMotivosDesaparecimento = async (): Promise<MotivoDto[]> => {
  const res = await api.get('/ocorrencias/motivos');
  return res.data;
};

export const detalhaPessoaDesaparecida = async (id: number): Promise<PessoaDTO> => {
  const res = await api.get(`/pessoas/${id}`);
  return res.data;
};

export const listaUltimasPessoasDesaparecidas = async (
  pagina?: number,
  porPagina?: number,
  direcao?: string,
  status?: string
): Promise<PagePessoaDTO> => {
  const res = await api.get('/pessoas/aberto/filtro', {
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
  const res = await api.get('/pessoas/aberto/filtro', {
    params: { nome, faixaIdadeInicial, faixaIdadeFinal, sexo, pagina, porPagina, status }
  });
  return res.data;
};

export const quantidadePessoasDesaparecidasLocalizadas = async (): Promise<EstatisticaPessoaDTO> => {
  const res = await api.get('/pessoas/aberto/estatistico');
  return res.data;
};

export const pessoasDesaparecidasRandomico = async (registros?: number): Promise<PessoaDTO[]> => {
  const res = await api.get('/pessoas/aberto/dinamico', {
    params: { registros }
  });
  return res.data;
};

export const getPessoasEstatistico = quantidadePessoasDesaparecidasLocalizadas;