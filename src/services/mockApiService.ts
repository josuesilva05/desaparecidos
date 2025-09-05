// Mock data para desenvolvimento e testes
import type { PagePessoaDTO, PessoaDTO, EstatisticaPessoaDTO, OcorrenciaInformacaoDTO } from '@/types/models';

// Dados mockados de pessoas
const mockPersons: PessoaDTO[] = [
  {
    id: 1,
    nome: 'Maria Silva Santos',
    idade: 25,
    sexo: 'FEMININO',
    vivo: true,
    urlFoto: 'https://randomuser.me/api/portraits/women/1.jpg',
    ultimaOcorrencia: {
      dtDesaparecimento: '2024-01-15',
      dataLocalizacao: undefined,
      encontradoVivo: undefined,
      localDesaparecimentoConcat: 'Shopping Center Norte, São Paulo - SP',
      ocorrenciaEntrevDesapDTO: {
        informacao: 'Foi vista pela última vez usando blusa azul e calça jeans. Estava acompanhada de uma amiga.',
        vestimentasDesaparecido: 'Blusa azul, calça jeans clara, tênis branco'
      },
      ocoId: 1001
    }
  },
  {
    id: 2,
    nome: 'João Carlos Oliveira',
    idade: 34,
    sexo: 'MASCULINO',
    vivo: true,
    urlFoto: 'https://randomuser.me/api/portraits/men/1.jpg',
    ultimaOcorrencia: {
      dtDesaparecimento: '2024-02-03',
      dataLocalizacao: '2024-02-10',
      encontradoVivo: true,
      localDesaparecimentoConcat: 'Centro de Cuiabá - MT',
      ocorrenciaEntrevDesapDTO: {
        informacao: 'Foi encontrado em hospital local, estava desorientado mas em boas condições de saúde.',
        vestimentasDesaparecido: 'Camisa social branca, calça preta, sapato social'
      },
      ocoId: 1002
    }
  },
  {
    id: 3,
    nome: 'Ana Paula Ferreira',
    idade: 17,
    sexo: 'FEMININO',
    vivo: true,
    urlFoto: 'https://randomuser.me/api/portraits/women/2.jpg',
    ultimaOcorrencia: {
      dtDesaparecimento: '2024-03-01',
      dataLocalizacao: undefined,
      encontradoVivo: undefined,
      localDesaparecimentoConcat: 'Escola Estadual Dom Pedro II, Várzea Grande - MT',
      ocorrenciaEntrevDesapDTO: {
        informacao: 'Aluna do ensino médio, desapareceu após sair da escola. Família muito preocupada.',
        vestimentasDesaparecido: 'Uniforme escolar: blusa branca, saia azul marinho'
      },
      ocoId: 1003
    }
  },
  {
    id: 4,
    nome: 'Roberto Mendes Costa',
    idade: 58,
    sexo: 'MASCULINO',
    vivo: true,
    urlFoto: 'https://randomuser.me/api/portraits/men/2.jpg',
    ultimaOcorrencia: {
      dtDesaparecimento: '2024-01-20',
      dataLocalizacao: '2024-01-25',
      encontradoVivo: true,
      localDesaparecimentoConcat: 'Parque Tanguá, Cuiabá - MT',
      ocorrenciaEntrevDesapDTO: {
        informacao: 'Localizado pelos bombeiros em área de mata. Estava perdido mas bem de saúde.',
        vestimentasDesaparecido: 'Bermuda verde, camiseta branca, tênis de caminhada'
      },
      ocoId: 1004
    }
  },
  {
    id: 5,
    nome: 'Carla Rodrigues Lima',
    idade: 42,
    sexo: 'FEMININO',
    vivo: true,
    urlFoto: 'https://randomuser.me/api/portraits/women/3.jpg',
    ultimaOcorrencia: {
      dtDesaparecimento: '2024-02-28',
      dataLocalizacao: undefined,
      encontradoVivo: undefined,
      localDesaparecimentoConcat: 'Terminal Rodoviário André Maggi, Cuiabá - MT',
      ocorrenciaEntrevDesapDTO: {
        informacao: 'Mãe de três filhos, saiu para trabalhar e não retornou. Celular fora de área.',
        vestimentasDesaparecido: 'Vestido floral, sandália de salto baixo, bolsa marrom'
      },
      ocoId: 1005
    }
  },
  {
    id: 6,
    nome: 'Pedro Henrique Silva',
    idade: 23,
    sexo: 'MASCULINO',
    vivo: true,
    urlFoto: 'https://randomuser.me/api/portraits/men/3.jpg',
    ultimaOcorrencia: {
      dtDesaparecimento: '2024-03-05',
      dataLocalizacao: undefined,
      encontradoVivo: undefined,
      localDesaparecimentoConcat: 'UFMT Campus Cuiabá - MT',
      ocorrenciaEntrevDesapDTO: {
        informacao: 'Universitário, desapareceu após as aulas. Amigos relatam comportamento estranho nos últimos dias.',
        vestimentasDesaparecido: 'Moletom cinza, bermuda jeans, tênis Adidas preto'
      },
      ocoId: 1006
    }
  }
];

// Mock de informações adicionais
const mockInformacoes: { [key: number]: OcorrenciaInformacaoDTO[] } = {
  1001: [
    {
      id: 1,
      ocoId: 1001,
      informacao: 'Vi uma pessoa parecida no Terminal do Araés por volta das 14h.',
      data: '2024-01-16',
      anexos: []
    },
    {
      id: 2,
      ocoId: 1001,
      informacao: 'Minha vizinha disse que viu ela no mercado ontem à tarde.',
      data: '2024-01-17',
      anexos: []
    }
  ],
  1003: [
    {
      id: 3,
      ocoId: 1003,
      informacao: 'Uma pessoa parecida foi vista no Centro de Cuiabá ontem.',
      data: '2024-03-02',
      anexos: []
    }
  ]
};

// Simula delay de rede
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  static async listaUltimasPessoasDesaparecidas(
    pagina: number = 0,
    porPagina: number = 12,
    direcao: string = 'DESC',
    status?: string
  ): Promise<PagePessoaDTO> {
    await delay();

    let filteredPersons = [...mockPersons];

    // Filtrar por status se especificado
    if (status) {
      if (status === 'DESAPARECIDO') {
        filteredPersons = mockPersons.filter(p => 
          !p.ultimaOcorrencia?.dataLocalizacao || !p.ultimaOcorrencia?.encontradoVivo
        );
      } else if (status === 'LOCALIZADO') {
        filteredPersons = mockPersons.filter(p => 
          p.ultimaOcorrencia?.dataLocalizacao && p.ultimaOcorrencia?.encontradoVivo
        );
      }
    }

    // Paginação
    const startIndex = pagina * porPagina;
    const endIndex = startIndex + porPagina;
    const paginatedData = filteredPersons.slice(startIndex, endIndex);

    return {
      content: paginatedData,
      totalElements: filteredPersons.length,
      totalPages: Math.ceil(filteredPersons.length / porPagina),
      number: pagina,
      size: porPagina,
      numberOfElements: paginatedData.length,
      first: pagina === 0,
      last: pagina >= Math.ceil(filteredPersons.length / porPagina) - 1,
      empty: filteredPersons.length === 0
    };
  }

  static async listaPessoasDesaparecidasPeloFiltro(
    nome?: string,
    faixaIdadeInicial?: number,
    faixaIdadeFinal?: number,
    sexo?: string,
    pagina: number = 0,
    porPagina: number = 12,
    status?: string
  ): Promise<PagePessoaDTO> {
    await delay();

    let filteredPersons = [...mockPersons];

    // Filtrar por nome
    if (nome && nome.trim()) {
      filteredPersons = filteredPersons.filter(p =>
        p.nome?.toLowerCase().includes(nome.toLowerCase())
      );
    }

    // Filtrar por idade
    if (faixaIdadeInicial !== undefined) {
      filteredPersons = filteredPersons.filter(p =>
        (p.idade || 0) >= faixaIdadeInicial
      );
    }

    if (faixaIdadeFinal !== undefined) {
      filteredPersons = filteredPersons.filter(p =>
        (p.idade || 0) <= faixaIdadeFinal
      );
    }

    // Filtrar por sexo
    if (sexo && sexo !== '') {
      filteredPersons = filteredPersons.filter(p => p.sexo === sexo);
    }

    // Filtrar por status
    if (status) {
      if (status === 'DESAPARECIDO') {
        filteredPersons = filteredPersons.filter(p => 
          !p.ultimaOcorrencia?.dataLocalizacao || !p.ultimaOcorrencia?.encontradoVivo
        );
      } else if (status === 'LOCALIZADO') {
        filteredPersons = filteredPersons.filter(p => 
          p.ultimaOcorrencia?.dataLocalizacao && p.ultimaOcorrencia?.encontradoVivo
        );
      }
    }

    // Paginação
    const startIndex = pagina * porPagina;
    const endIndex = startIndex + porPagina;
    const paginatedData = filteredPersons.slice(startIndex, endIndex);

    return {
      content: paginatedData,
      totalElements: filteredPersons.length,
      totalPages: Math.ceil(filteredPersons.length / porPagina),
      number: pagina,
      size: porPagina,
      numberOfElements: paginatedData.length,
      first: pagina === 0,
      last: pagina >= Math.ceil(filteredPersons.length / porPagina) - 1,
      empty: filteredPersons.length === 0
    };
  }

  static async detalhaPessoaDesaparecida(id: number): Promise<PessoaDTO> {
    await delay(600);

    const person = mockPersons.find(p => p.id === id);
    if (!person) {
      throw new Error('Pessoa não encontrada');
    }

    return person;
  }

  static async quantidadePessoasDesaparecidasLocalizadas(): Promise<EstatisticaPessoaDTO> {
    await delay(400);

    const desaparecidas = mockPersons.filter(p => 
      !p.ultimaOcorrencia?.dataLocalizacao || !p.ultimaOcorrencia?.encontradoVivo
    ).length;

    const localizadas = mockPersons.filter(p => 
      p.ultimaOcorrencia?.dataLocalizacao && p.ultimaOcorrencia?.encontradoVivo
    ).length;

    return {
      quantPessoasDesaparecidas: desaparecidas,
      quantPessoasEncontradas: localizadas
    };
  }

  static async buscarInformacoes(ocorrenciaId: number): Promise<OcorrenciaInformacaoDTO[]> {
    await delay(500);

    return mockInformacoes[ocorrenciaId] || [];
  }

  static async pessoasDesaparecidasRandomico(registros: number = 6): Promise<PessoaDTO[]> {
    await delay(300);

    const shuffled = [...mockPersons].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, registros);
  }
}
