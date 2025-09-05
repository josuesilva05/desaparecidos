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

// Função helper para decidir se usar mock ou API real
const shouldUseMock = () => {
  return 'useMockData' in environment && environment.useMockData;
};

export const login = async (data: LoginDTO): Promise<Permissao> => {
  const res = await axios.post(`${environment.apiUrl}/login`, data);
  return res.data;
};

export const refreshToken = async (token: string): Promise<Permissao> => {
  const res = await axios.post(`${environment.apiUrl}/refresh-token`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const buscarInformacoes = async (ocorrenciaId: number): Promise<OcorrenciaInformacaoDTO[]> => {
  if (shouldUseMock()) {
    return MockApiService.buscarInformacoes(ocorrenciaId);
  }
  
  const res = await axios.get(`${environment.apiUrl}/ocorrencias/informacoes-desaparecido`, {
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
  const formData = new FormData();
  formData.append('informacao', informacao);
  formData.append('descricao', descricao);
  formData.append('data', data);
  formData.append('ocoId', ocoId.toString());
  if (files) {
    files.forEach(file => formData.append('files', file));
  }
  const res = await axios.post(`${environment.apiUrl}/ocorrencias/informacoes-desaparecido`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const adicionarOcorrenciaIntegracao = async (data: OcorrenciaIntegracaoDto): Promise<any> => {
  const res = await axios.post(`${environment.apiUrl}/ocorrencias/delegacia-digital`, data);
  return res.data;
};

export const checarVitimaDuplicada = async (data: VitimaChecagemDuplicidadeResquestDto): Promise<any> => {
  const res = await axios.post(`${environment.apiUrl}/ocorrencias/delegacia-digital/verificar-duplicidade`, data);
  return res.data;
};

export const listarMotivosDesaparecimento = async (): Promise<MotivoDto[]> => {
  const res = await axios.get(`${environment.apiUrl}/ocorrencias/motivos`);
  return res.data;
};

export const detalhaPessoaDesaparecida = async (id: number): Promise<PessoaDTO> => {
  if (shouldUseMock()) {
    return MockApiService.detalhaPessoaDesaparecida(id);
  }
  
  const res = await axios.get(`${environment.apiUrl}/pessoas/${id}`);
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
  
  const res = await axios.get(`${environment.apiUrl}/pessoas/aberto`, {
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
  
  const res = await axios.get(`${environment.apiUrl}/pessoas/aberto/filtro`, {
    params: { nome, faixaIdadeInicial, faixaIdadeFinal, sexo, pagina, porPagina, status }
  });
  return res.data;
};

export const quantidadePessoasDesaparecidasLocalizadas = async (): Promise<EstatisticaPessoaDTO> => {
  if (shouldUseMock()) {
    return MockApiService.quantidadePessoasDesaparecidasLocalizadas();
  }
  
  const res = await axios.get(`${environment.apiUrl}/pessoas/aberto/estatistico`);
  return res.data;
};

export const pessoasDesaparecidasRandomico = async (registros?: number): Promise<PessoaDTO[]> => {
  if (shouldUseMock()) {
    return MockApiService.pessoasDesaparecidasRandomico(registros);
  }
  
  const res = await axios.get(`${environment.apiUrl}/pessoas/aberto/dinamico`, {
    params: { registros }
  });
  return res.data;
};

export const getPessoasEstatistico = quantidadePessoasDesaparecidasLocalizadas;