# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

# Sistema de Pessoas Desaparecidas

Sistema desenvolvido em React para busca e localização de pessoas desaparecidas, cumprindo os requisitos especificados.

## 🚀 Funcionalidades Implementadas

### 1. Tela Inicial
- ✅ **Cards com foto e dados** de pessoas desaparecidas ou localizadas
- ✅ **Status visual** distinguindo "Desaparecida" vs "Localizada" com badges coloridas
- ✅ **Paginação** implementada (12 registros por página, configurável)
- ✅ **Campo de busca** com filtros avançados suportando:
  - Busca por nome
  - Filtro por faixa etária (idade mínima/máxima)
  - Filtro por sexo
  - Filtro por status (Desaparecido/Localizado)

### 2. Detalhamento do Registro
- ✅ **Navegação por clique** no card leva à página de detalhes
- ✅ **Informações completas** da pessoa:
  - Foto principal
  - Dados pessoais (nome, idade, sexo)
  - Data do desaparecimento/localização
  - Local do desaparecimento
  - Vestimentas e informações adicionais
  - Cartazes de divulgação (quando disponíveis)
- ✅ **Destaque visual** do status com ícones e cores diferenciadas
- ✅ **Informações recentes** em sidebar lateral

### 3. Envio de Informações
- ✅ **Botão na página de detalhes** para fornecer informações
- ✅ **Formulário completo** com:
  - Campo para descrição do avistamento
  - Data do avistamento (com máscara de data)
  - Local do avistamento
  - Dados de contato (nome e telefone com máscara)
  - Upload de até 3 fotos
- ✅ **Máscaras de entrada**:
  - Telefone: (11) 99999-9999
  - Data: input type="date" com validação
- ✅ **Validações** de campos obrigatórios
- ✅ **Mock implementado** (conforme solicitado) em vez de POST real

## 🎨 Design Moderno

### Componentes Utilizados
- **shadcn/ui**: Componentes de interface consistentes e modernos
- **Tailwind CSS**: Sistema de design responsivo e utilitário
- **Lucide React**: Ícones consistentes e modernos

### Features de UX/UI
- ✅ **Design responsivo** para desktop, tablet e mobile
- ✅ **Lazy loading** implementado nas rotas com React.lazy()
- ✅ **Skeletons de carregamento** durante fetch de dados
- ✅ **Transições suaves** e hover effects
- ✅ **Feedback visual** para todas as interações
- ✅ **Acessibilidade** com labels, alt texts e navegação por teclado

## ⚡ Otimizações de Performance

### Lazy Loading
- **Rotas lazy**: Componentes carregados sob demanda
- **Imagens lazy**: Loading="lazy" nas imagens dos cards
- **Code splitting**: Separação automática de bundles

### Outras Otimizações
- **useCallback**: Para funções que são dependências de useEffect
- **Paginação eficiente**: Carregamento sob demanda
- **Debounce implícito**: Filtros aplicados apenas quando necessário
- **Error boundaries**: Tratamento gracioso de erros

## 🛠 Tecnologias Utilizadas

- **React 19** com TypeScript
- **React Router DOM 7** para navegação
- **Tailwind CSS 4** para estilização
- **shadcn/ui** para componentes
- **Lucide React** para ícones
- **Vite** como bundler
- **Axios** para requisições HTTP

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── home/                   # Componente da página inicial
│   ├── PersonCard.tsx          # Card de pessoa
│   ├── PersonInformationForm.tsx # Formulário de informações
│   ├── SearchFilters.tsx       # Filtros de busca
│   ├── Pagination.tsx          # Componente de paginação
│   └── StatisticsCards.tsx     # Cards de estatísticas
├── pages/
│   └── PersonDetails.tsx       # Página de detalhes
├── services/
│   ├── apiService.ts           # Serviços de API
│   └── mockApiService.ts       # Dados mockados
├── types/
│   └── models.ts               # Tipos TypeScript
├── routes/
│   └── routes.tsx              # Configuração de rotas
└── environments/
    └── environment.ts          # Configurações de ambiente
```

## 🎯 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar o sistema**:
   - Abrir http://localhost:5173
   - O sistema está configurado para usar dados mockados por padrão

## 🔧 Configurações

### Modo de Desenvolvimento
O arquivo `src/environments/environment.ts` está configurado para usar dados mockados:

```typescript
export const environment = {
    production: false,
    useMockData: true,  // true = usa dados mockados
    apiUrl: 'https://abitus-api.pjc.mt.gov.br/v1'
};
```

Para usar a API real, altere `useMockData: false`.

### Dados Mockados
Os dados de exemplo incluem:
- 6 pessoas (3 desaparecidas, 3 localizadas)
- Fotos do Unsplash para demonstração
- Informações realistas de teste
- Estatísticas calculadas dinamicamente

## 📱 Funcionalidades por Página

### Página Inicial (/)
- Cards responsivos em grid
- Estatísticas no topo
- Filtros de busca expandíveis
- Paginação na parte inferior
- Estados de loading e erro

### Página de Detalhes (/person/:id)
- Layout em duas colunas
- Informações completas da pessoa
- Sidebar com informações recentes
- Botão para fornecer informações
- Modal com formulário completo

## ✨ Destaques da Implementação

1. **Componentização**: Código altamente modularizado e reutilizável
2. **TypeScript**: Tipagem completa para maior segurança
3. **Responsividade**: Funciona perfeitamente em todos os dispositivos
4. **Acessibilidade**: Labels, alt-texts e navegação por teclado
5. **Performance**: Lazy loading e otimizações de rendering
6. **UX/UI**: Transições suaves, feedback visual e estados de loading
7. **Mocks**: Sistema completo de dados mockados para desenvolvimento

O projeto está pronto para uso e atende a todos os requisitos especificados, com um design moderno e funcionalidades completas.

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
