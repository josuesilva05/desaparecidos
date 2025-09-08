export interface Permissao {
  accessToken: string;
  refreshToken: string;
}

export interface OcorrenciaInformacaoDTO {
  ocoId: number;
  informacao: string;
  data: string;
  id?: number;
  anexos?: string[];
}

export interface EnderecoDto {
  tipoLogradouro?: 'ALAMEDA' | 'ALTO' | 'AVENIDA' | 'BECO' | 'CALCADAO' | 'CAMINHO' | 'ESCADARIA' | 'ESTRADA' | 'LADEIRA' | 'LINHA' | 'PARALELA' | 'PRACA' | 'QUADRA' | 'RUA' | 'RODOVIA' | 'SUBIDA' | 'TRAVESSA' | 'VIA' | 'VIELA' | 'OUTROS';
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidadeId?: number;
  uf?: 'MT' | 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';
  referencia?: string;
  latitude?: number;
  longitude?: number;
  cep?: string;
  tipoEndereco?: 'RESIDENCIAL' | 'COMERCIAL' | 'OUTROS';
}

export interface EnderecoEletronicoDto {
  endereco: string;
  principal?: boolean;
}

export interface FotoPessoaDto {
  descricao?: string;
  tamanho?: number;
  tipo?: string;
  data?: string;
  principal?: boolean;
  hash?: string;
  bucket?: string;
}

export interface OcorrenciaContatoDto {
  nome?: string;
  telefone?: string;
  grauParentesco?: 'AMIGO_AMIGA' | 'AVOS' | 'BISAVOS' | 'BISNETO_BISNETA' | 'CONJUGE' | 'FILHO_FILHA' | 'GENRO_NORA' | 'IRMA_IRMAO' | 'NENHUM' | 'NETO_NETA' | 'PAI_MAE' | 'PADRASTO_MADRASTA' | 'PRIMO_PRIMA' | 'TIO_TIA' | 'TIOAVOS' | 'TRISAVOS' | 'TRINETO_TRINETA' | 'SOBRINHO_SOBRINHA' | 'SOBRINHO_NETOS' | 'SOGRO_SOGRA';
}

export interface OcorrenciaEntrevistaComportamentalDto {
  relacionamento?: string;
  dividas?: string;
  vicios?: string;
  tipoDroga?: string;
  situacaoRua?: boolean;
  desafetos?: string;
  desapareceuAntes?: string;
  melhorAmigo?: string;
  faccao?: string;
  observacao?: string;
  depressaoAnsiedadeOutrosProblemasMentais?: boolean;
  comportamentoAutoDestrutivo?: boolean;
  desentendimentoRecente?: boolean;
  terminoRelacionamentoRecente?: boolean;
  mudancaHumor?: boolean;
  eventoMarcante?: boolean;
}

export interface OcorrenciaEntrevistaDesaparecimentoDto {
  vestimenta?: string;
  aderecos?: string;
  roupa?: string;
  sapatos?: string;
  acessorios?: string;
  meioTransporte?: string;
  informacao?: string;
  ondeFoiVistoUltimaVez?: string;
  oqueEstavaFazendo?: string;
  comQuemEstava?: string;
  incomumOuSuspeito?: string;
  clima?: string;
  particularidadeLocal?: string;
}

export interface OcorrenciaIntegracaoDto {
  protocolo?: string;
  numAip?: string;
  numIp?: string;
  enderecos?: EnderecoDto[];
  vitima: PessoaDto;
  vitimaFotos?: FotoPessoaDto[];
  unidadeId?: number;
  usuarioCadastroId: number;
  boNumero?: string;
  origemBO?: 'PM' | 'PJC' | 'PJC_MINHA_UNIDADE' | 'GUARDA_MUNICIPAL' | 'POLICIA_FEDERAL' | 'POLICIA_RODOVIARIA_FEDERAL' | 'OUTROS';
  codBO?: number;
  dataHoraFato?: string;
  altura?: 'MB' | 'B' | 'M' | 'A' | 'MA';
  compleicao?: 'MAGRO' | 'GORDO' | 'FORTE' | 'ESBELTO';
  cabeloCor?: 'BRANCOS' | 'CASTANHOS' | 'COLORIDOS' | 'GRISALHOS' | 'LOUROS' | 'PRETOS' | 'RUIVOS' | 'OUTRO';
  cabeloTipo?: 'CALVO' | 'CARAPINHA' | 'CARECA' | 'ENCARACOLADO' | 'LISO' | 'ONDULADO' | 'RASPADO' | 'OUTRO';
  olhoTipo?: 'NORMAL' | 'ORIENTAL' | 'SALIENTE' | 'CAOLHO' | 'ESTRABICO' | 'PROTESE' | 'OUTRO';
  olhoCor?: 'PRETOS' | 'CASTANHOS' | 'VERDES' | 'AZUIS' | 'HETEROCROMIA' | 'OUTRO';
  fratura?: string;
  placaMetalica?: string;
  tatuagem?: string;
  cicatriz?: string;
  arcadaDentaria?: string;
  aparelhoDentario?: boolean;
  defeitoFisico?: string;
  deficienciaFisica?: string;
  deficienciaMental?: string;
  deficienciaMentalCuratela?: boolean;
  deficienciaMentalLaudo?: boolean;
  deficienciaMentalInterdicao?: boolean;
  doencaTransmissivelIncuravel?: string;
  gravidez?: boolean;
  cegueira?: boolean;
  faccao?: boolean;
  faccaoNome?: 'PCC' | 'CV' | 'OUTROS';
  grupoSanguineo?: 'A' | 'B' | 'AB' | 'O';
  fatorRh?: 'POSITIVO' | 'NEGATIVO';
  contatos?: OcorrenciaContatoDto[];
  entrevistaComportamental?: OcorrenciaEntrevistaComportamentalDto;
  entrevistaDesaparecimento?: OcorrenciaEntrevistaDesaparecimentoDto;
  grauParentescoComunicante?: 'AMIGO_AMIGA' | 'AVOS' | 'BISAVOS' | 'BISNETO_BISNETA' | 'CONJUGE' | 'FILHO_FILHA' | 'GENRO_NORA' | 'IRMA_IRMAO' | 'NENHUM' | 'NETO_NETA' | 'PAI_MAE' | 'PADRASTO_MADRASTA' | 'PRIMO_PRIMA' | 'TIO_TIA' | 'TIOAVOS' | 'TRISAVOS' | 'TRINETO_TRINETA' | 'SOBRINHO_SOBRINHA' | 'SOBRINHO_NETOS' | 'SOGRO_SOGRA';
  grauParentescoLocalizacao?: 'AMIGO_AMIGA' | 'AVOS' | 'BISAVOS' | 'BISNETO_BISNETA' | 'CONJUGE' | 'FILHO_FILHA' | 'GENRO_NORA' | 'IRMA_IRMAO' | 'NENHUM' | 'NETO_NETA' | 'PAI_MAE' | 'PADRASTO_MADRASTA' | 'PRIMO_PRIMA' | 'TIO_TIA' | 'TIOAVOS' | 'TRISAVOS' | 'TRINETO_TRINETA' | 'SOBRINHO_SOBRINHA' | 'SOBRINHO_NETOS' | 'SOGRO_SOGRA';
  telefoneLocalizacao?: string;
  condicaoLocalizacao?: string;
  encontradoVivo?: boolean;
  sigiloso?: boolean;
  grauParentescoPessoaTermo?: 'AMIGO_AMIGA' | 'AVOS' | 'BISAVOS' | 'BISNETO_BISNETA' | 'CONJUGE' | 'FILHO_FILHA' | 'GENRO_NORA' | 'IRMA_IRMAO' | 'NENHUM' | 'NETO_NETA' | 'PAI_MAE' | 'PADRASTO_MADRASTA' | 'PRIMO_PRIMA' | 'TIO_TIA' | 'TIOAVOS' | 'TRISAVOS' | 'TRINETO_TRINETA' | 'SOBRINHO_SOBRINHA' | 'SOBRINHO_NETOS' | 'SOGRO_SOGRA';
  informacaoMorte?: boolean;
  informacaoMorteBoNumero?: string;
  nomeUsuarioCadastro: string;
  cargoUsuarioCadastro: string;
  comunicante: PessoaDto;
  redesSociaisVitima?: RedeSocialDto[];
}

export interface PessoaDto {
  nome: string;
  nomeSocial?: string;
  razaoSocial?: string;
  mae?: string;
  pai?: string;
  dtNascimento?: string;
  naturalidadeId?: number;
  sexo?: 'MASCULINO' | 'FEMININO';
  orientacaoSexual?: 'HETEROSEXUAL' | 'HOMOSEXUAL' | 'BISEXUAL';
  identidadeGenero?: 'TRANSEXUAL' | 'TRAVESTI';
  escolaridade?: 'ANALFABETO' | 'ALFABETIZADO' | 'FUNDAMENTAL' | 'MEDIO' | 'SUPERIOR' | 'POSGRADUADO';
  estadoCivil?: 'CASADO' | 'CONVIVENTE' | 'DIVORCIADO' | 'SEPARADO' | 'SOLTEIRO' | 'VIUVO';
  cutis?: 'AMARELA' | 'BRANCA' | 'INDIGENA' | 'PARDA' | 'PRETA';
  funcaoPublica?: string;
  nacionalidadeId?: number;
  cpfCnpj?: number;
  rgNumero?: string;
  rgEmissor?: string;
  rgUF?: 'MT' | 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';
  tipoPessoa?: 'FISICA' | 'JURIDICA';
  profissao?: string;
  restrito?: boolean;
  dtFalecimento?: string;
  vivo?: boolean;
  telefones?: TelefoneDto[];
  emails?: EnderecoEletronicoDto[];
  enderecos?: EnderecoDto[];
}

export interface RedeSocialDto {
  tipoRedeSocial?: 'INSTA' | 'FACE' | 'LINKEDIN' | 'TWITTER' | 'OUTROS';
  url?: string;
}

export interface TelefoneDto {
  numero: string;
  tipoTelefone: 'CELULAR' | 'RESIDENCIAL' | 'COMERCIAL' | 'FAX' | 'OUTROS';
}

export interface VitimaChecagemDuplicidadeResquestDto {
  nome: string;
  mae?: string;
  cpf?: string;
  dataNascimento?: string;
  dataDesaparecimento: string;
}

export interface LoginDTO {
  login: string;
  password: string;
}

export interface OcorrenciaCartazDTO {
  urlCartaz?: string;
  tipoCartaz?: 'PDF_DESAPARECIDO' | 'PDF_LOCALIZADO' | 'JPG_DESAPARECIDO' | 'JPG_LOCALIZADO' | 'INSTA_DESAPARECIDO' | 'INSTA_LOCALIZADO';
}

export interface OcorrenciaDTO {
  dtDesaparecimento?: string;
  dataLocalizacao?: string;
  encontradoVivo?: boolean;
  localDesaparecimentoConcat?: string;
  ocorrenciaEntrevDesapDTO?: OcorrenciaEntrevDesapDTO;
  listaCartaz?: OcorrenciaCartazDTO[];
  ocoId?: number;
}

export interface OcorrenciaEntrevDesapDTO {
  informacao?: string;
  vestimentasDesaparecido?: string;
}

export interface PessoaDTO {
  id?: number;
  nome?: string;
  idade?: number;
  sexo?: 'MASCULINO' | 'FEMININO';
  vivo?: boolean;
  urlFoto?: string;
  ultimaOcorrencia?: OcorrenciaDTO;
}

export interface PagePessoaDTO {
  totalPages?: number;
  totalElements?: number;
  pageable?: PageableObject;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  size?: number;
  content?: PessoaDTO[];
  number?: number;
  sort?: SortObject;
  empty?: boolean;
}

export interface PageableObject {
  unpaged?: boolean;
  paged?: boolean;
  pageSize?: number;
  pageNumber?: number;
  offset?: number;
  sort?: SortObject;
}

export interface SortObject {
  unsorted?: boolean;
  sorted?: boolean;
  empty?: boolean;
}

export interface EstatisticaPessoaDTO {
  quantPessoasDesaparecidas?: number;
  quantPessoasEncontradas?: number;
}

export interface MotivoDto {
  id?: number;
  descricao?: string;
}

export type PessoasEstatistico = EstatisticaPessoaDTO;