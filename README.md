# ABITUS - Consulta de Pessoas Desaparecidas

Este projeto é uma Single Page Application (SPA) desenvolvida como parte de um teste prático, com o objetivo de consumir a API da Polícia Judiciária Civil de Mato Grosso para consulta e colaboração em casos de pessoas desaparecidas.

A aplicação permite que qualquer cidadão visualize registros de pessoas desaparecidas e localizadas, filtre os resultados e envie informações relevantes que possam auxiliar nas investigações, como fotos e locais onde a pessoa foi vista.

- **API Documentação**: [Swagger UI](https://abitus-api.geia.vip/swagger-ui/index.html)

![Diagrama de Conexão Docker, Nginx e Vite](https://i.imgur.com/uhY4Kyq.png)

## ✨ Features

- **Visualização de Perfis**: Exibição de cards de pessoas desaparecidas e localizadas na página inicial.
- **Paginação**: Navegação eficiente entre os registros, com 10 itens por página.
- **Busca e Filtros Avançados**: Campo de busca por nome e filtros por status (desaparecido/localizado), faixa de idade e sexo.
- **Página de Detalhes**: Rota dedicada com informações completas sobre a pessoa, destacando visualmente seu status atual.
- **Colaboração Cidadã**: Formulário para envio de novas informações sobre uma pessoa desaparecida, incluindo a opção de anexar fotos.
- **Responsividade**: Layout adaptado para os principais tamanhos de tela, de dispositivos móveis a desktops.
- **Otimização de Performance**:
    - **Lazy Loading**: As rotas são carregadas sob demanda para acelerar o carregamento inicial da aplicação.
    - **Skeleton Loading**: Exibição de "esqueletos" de interface enquanto os dados da API são carregados, melhorando a percepção de velocidade.
- **Tema Dark/Light**: Alternância entre modos de visualização claro e escuro.
- **Notificações**: Alertas visuais para feedback de ações do usuário, como o envio de um formulário.

## 🚀 Tecnologias Utilizadas

O projeto foi construído com tecnologias modernas do ecossistema JavaScript, com foco em performance e manutenibilidade.

- **Framework Principal**: [React](https://react.dev/) com [Vite](https://vitejs.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI**: Baseado em [shadcn/ui](https://ui.shadcn.com/) para componentes reutilizáveis e acessíveis
- **Roteamento**: [React Router DOM](https://reactrouter.com/)
- **Requisições HTTP**: [Axios](https://axios-http.com/)
- **Containerização**: [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- **Linting**: [ESLint](https://eslint.org/)

## 🏛️ Padrões de Projeto (Design Patterns)

A arquitetura do projeto aplica diversos padrões para garantir um código limpo, desacoplado e escalável.

-   **Arquitetura Baseada em Componentes**: O padrão central do React. A interface é quebrada em componentes independentes e reutilizáveis (como `Card`, `Button`, `PersonCard`), promovendo a coesão e facilitando a manutenção.

-   **Service Layer (Camada de Serviço)**: Toda a lógica de comunicação com a API é abstraída no `apiService.ts`. Isso separa as responsabilidades da interface (componentes) e da busca de dados, tornando os componentes mais "puros" e a lógica de dados centralizada e fácil de modificar.

-   **Hooks Customizados**: A lógica de estado e efeitos colaterais complexos é extraída para hooks customizados (`useAlert`, `usePersonDetails`, `useInformationSorting`). Isso permite reutilizar lógica stateful entre diferentes componentes sem duplicar código.

-   **Provider Pattern (Context API)**: Utilizado para gerenciar estados globais, como o tema da aplicação (`ThemeProvider`) e o sistema de alertas (`AlertProvider`). Isso evita o "prop drilling" (passar propriedades por múltiplos níveis de componentes) e disponibiliza um estado global de forma eficiente.

-   **Renderização Condicional**: Usado extensivamente para controlar o que é exibido na tela com base no estado da aplicação. O exemplo mais claro é a exibição dos componentes `Skeleton` enquanto os dados estão sendo carregados (`loading`), ou a exibição de badges diferentes com base no status (`isDesaparecido`).

## 🐳 Nginx para Produção

O projeto utiliza uma abordagem de **multi-stage build** no `Dockerfile` para criar um ambiente de produção otimizado.

1.  **Estágio 1 (Build)**: Uma imagem `node:lts-alpine` é usada para instalar as dependências e construir a aplicação React, gerando os arquivos estáticos (HTML, CSS, JS) na pasta `/dist`.
2.  **Estágio 2 (Produção)**: Os arquivos da pasta `/dist` são copiados para uma imagem `nginx:alpine`, que é muito menor e mais segura.

O Nginx atua como um servidor web de alta performance para servir esses arquivos estáticos. A configuração em `nginx.conf` inclui:

-   **Roteamento de SPA**: A diretiva `try_files $uri $uri/ /index.html;` é fundamental. Ela garante que todas as requisições de navegação sejam direcionadas para o `index.html`, permitindo que o React Router controle as rotas no lado do cliente.
-   **Otimização de Cache**: Ativos como JS, CSS e imagens recebem um cabeçalho `Cache-Control` de longa duração, fazendo com que o navegador do usuário os armazene em cache e não precise baixá-los novamente em visitas futuras.
-   **Compressão Gzip**: Habilita a compressão de arquivos de texto, reduzindo o tamanho dos dados transferidos e acelerando o carregamento.
-   **Cabeçalhos de Segurança**: Adiciona cabeçalhos HTTP (como `X-Frame-Options` e `Content-Security-Policy`) para aumentar a segurança da aplicação contra ataques comuns.

## 🏁 Como Rodar o Projeto

O projeto é totalmente containerizado, facilitando a sua execução em qualquer ambiente que tenha o Docker instalado.

### Pré-requisitos

-   [Git](https://git-scm.com/)
-   [Docker](https://www.docker.com/get-started/)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Instalação e Execução

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/josuesilva05/desaparecidos.git
    ```

2.  **Navegue até a pasta do projeto:**
    ```bash
    cd desaparecidos
    ```

3.  **Construa e execute o container Docker:**
    O `docker-compose.yml` está configurado para construir a imagem do frontend a partir do `Dockerfile` e servir os arquivos estáticos com Nginx.
    ```bash
    docker compose up -d --build
    ```
    Ou
        
    ```bash
    npm run docker
    ```

4.  **Acesse a aplicação:**
    Abra seu navegador e acesse [http://localhost:8080](http://localhost:8080). A aplicação estará rodando.