# Digital Store — Backend API

API REST do projeto **Digital Store**, desenvolvido como projeto final da Formação Full Stack — Geração Tech.

**Desenvolvedor:** Zaqueu Silva
**Repositório:** https://github.com/ZSSOUSA/digital-store-backend
**Frontend:** https://github.com/ZSSOUSA/digital-store-frontend

## 1. Sobre o projeto

O Digital Store Backend fornece serviços de API REST para uma aplicação de comércio eletrônico, incluindo gerenciamento de produtos, categorias, usuários e autenticação.

O projeto utiliza Node.js, Express, Sequelize e MySQL, com autenticação baseada em JWT.

A aplicação foi estruturada para execução em ambiente Docker, com banco de dados persistente e verificações automatizadas de qualidade.

## 2. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js 22 | Ambiente de execução |
| Express 4 | Framework HTTP |
| Sequelize 6 | ORM |
| MySQL 8.4 | Banco de dados relacional |
| mysql2 | Driver MySQL |
| JWT | Autenticação por token |
| bcrypt | Hash de senhas |
| Docker | Containerização |
| Docker Compose | Orquestração dos serviços |
| Jest | Testes automatizados |
| Supertest | Testes HTTP |
| ESLint | Análise estática de código |
| Swagger / OpenAPI 3.0 | Documentação da API |

## 3. Arquitetura e organização

O projeto utiliza uma organização em camadas, separando responsabilidades da aplicação.

```text
digital-store-backend/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docs/
│   ├── adr/
│   │   └── 0001-decisoes-arquiteturais.md
│   ├── api-preview.svg
│   ├── desempenho.md
│   └── ia.md
│
├── performance/
│   └── products-smoke.js
│
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       └── CreateProductUseCase.js
│   ├── config/
│   │   ├── database.js
│   │   └── swagger.js
│   ├── controllers/
│   ├── domain/
│   │   └── entities/
│   │       └── Product.js
│   ├── images/
│   ├── infrastructure/
│   │   ├── observability/
│   │   │   ├── logger.js
│   │   │   └── metrics.js
│   │   └── repositories/
│   │       └── SequelizeProductRepository.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   └── server.js
│
├── tests/
│   ├── application/
│   │   └── use-cases/
│   ├── config/
│   ├── domain/
│   │   └── entities/
│   └── infrastructure/
│       ├── observability/
│       └── repositories/
│
├── .dockerignore
├── .env.example
├── .gitignore
├── CONTRIBUTORS.md
├── Dockerfile
├── docker-compose.yml
├── eslint.config.js
├── package-lock.json
├── package.json
└── README.md
```
### Responsabilidades principais

- **Application/Use Cases:** organiza os casos de uso da aplicação, incluindo a criação de produtos.
- **Domain:** concentra entidades e regras fundamentais do domínio.
- **Infrastructure/Repositories:** implementa o acesso e a persistência de dados.
- **Controllers:** recebem as requisições HTTP e coordenam as respostas.
- **Services:** concentram operações e regras da aplicação.
- **Models:** representam as entidades persistidas pelo Sequelize.
- **Routes:** definem os endpoints da API.
- **Middleware:** executa verificações intermediárias, incluindo autenticação.
- **Config:** concentra configurações de banco de dados e documentação.
- **Infrastructure/Observability:** implementa logs estruturados e métricas HTTP.
- **Tests:** contém testes automatizados das funcionalidades e integrações.

## 4. Pré-requisitos

Para executar o projeto:

- Docker Desktop instalado e em execução.
- Docker Compose disponível.
- Git.
- Node.js 22 e npm, caso queira executar os comandos de desenvolvimento e testes fora dos containers.

## 5. Configuração do ambiente

O projeto utiliza variáveis de ambiente para evitar credenciais diretamente no código.

Crie seu arquivo `.env` a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

Configure as credenciais no arquivo `.env`:

```env
NODE_ENV=development
PORT=3000

DB_HOST=db
DB_NAME=digital_store
DB_USER=digital_store_user
DB_PASS=sua_senha_forte

DB_ROOT_PASSWORD=sua_senha_root_forte

JWT_SECRET=sua_chave_secreta_longa_e_aleatoria

CORS_ORIGIN=http://localhost:3001
```

**Importante:** substitua os valores de exemplo por credenciais próprias.

O arquivo `.env` não deve ser enviado ao Git. Utilize `.env.example` para documentar as variáveis necessárias.

## 6. Como executar com Docker Compose

A execução principal utiliza Docker Compose.

Na raiz do projeto, execute:

```powershell
docker compose up -d --build
```

Esse comando:

1. Constrói a imagem da API.
2. Inicializa o banco MySQL 8.4.
3. Aguarda a verificação de saúde do banco.
4. Inicia a API após o banco estar disponível.

Para verificar os containers:

```powershell
docker compose ps
```

Para acompanhar os logs:

```powershell
docker compose logs -f api
```

Para parar os serviços:

```powershell
docker compose down
```

O banco utiliza o volume persistente `digital_store_data`, preservando os dados quando os containers são parados.

**Atenção:** não utilize `docker compose down -v` se quiser preservar os dados do banco.

**Execução fora do Docker:** é possível iniciar a aplicação utilizando `npm start` ou executar em modo de desenvolvimento com `npm run dev`. Nesse cenário, configure as variáveis de ambiente para que a aplicação consiga acessar o MySQL. Se utilizar o banco disponibilizado pelo Docker Compose, o acesso pelo Windows deve utilizar `localhost` e a porta `3307`, em vez de `db:3306`.

## 7. Endereços da aplicação

| Serviço | Endereço |
|---|---|
| API | http://localhost:3000 |
| Rota principal | http://localhost:3000/ |
| Swagger UI | http://localhost:3000/api-docs |
| Métricas | http://localhost:3000/metrics |
| MySQL (porta do host) | localhost:3307 |

## 8. Endpoints principais

Base URL:

```text
http://localhost:3000/v1
```

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| POST | `/v1/user/token` | Autenticar usuário e gerar JWT | Não |

### Usuários

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| POST | `/v1/user` | Cadastrar usuário | Não |
| GET | `/v1/user/:id` | Consultar usuário por ID | Não |
| PUT | `/v1/user/:id` | Atualizar usuário | Sim |
| DELETE | `/v1/user/:id` | Remover usuário | Sim |

### Categorias

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| GET | `/v1/category/search` | Listar categorias | Não |
| GET | `/v1/category/:id` | Consultar categoria por ID | Não |
| POST | `/v1/category` | Criar categoria | Sim |

### Produtos

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| GET | `/v1/product/search` | Buscar produtos com filtros | Não |
| GET | `/v1/product/:id` | Consultar produto por ID | Não |
| POST | `/v1/product` | Criar produto | Sim |
| DELETE | `/v1/product/:id` | Remover produto por ID | Sim |

Os endpoints protegidos exigem o cabeçalho:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

O token é obtido pelo endpoint:

```text
POST /v1/user/token
```

Consulte a documentação Swagger para visualizar os parâmetros, exemplos de requisições e respostas disponíveis.

## 9. Documentação OpenAPI / Swagger

A API possui documentação interativa baseada no padrão OpenAPI 3.0.

Com a aplicação em execução, acesse:

http://localhost:3000/api-docs

A documentação permite visualizar os endpoints, parâmetros, respostas e requisitos de autenticação.

## 10. Observabilidade

O projeto possui recursos básicos de observabilidade.

### Logs estruturados

Os registros são emitidos em formato JSON, contendo:

- Timestamp.
- Nível do registro.
- Mensagem.
- Contexto adicional, quando aplicável.

Os níveis implementados são:

- `info`
- `warn`
- `error`

### Métricas HTTP

O endpoint:

```text
GET /metrics
```

apresenta a métrica:

```text
http_request_duration_ms
```

São armazenadas as últimas 1.000 amostras de duração das requisições HTTP.

O sistema calcula o percentil 95 (p95) e compara o resultado com o objetivo de nível de serviço:

**SLO:** 95% das requisições em até 500 ms.

As medições são mantidas em memória e reiniciadas quando a aplicação reinicia.

## 11. Testes automatizados

O projeto utiliza Jest e Supertest para testes automatizados.

Executar todos os testes:

```powershell
npm test -- --runInBand
```

Executar testes com cobertura:

```powershell
npm test -- --runInBand --coverage
```

Executar somente os testes de observabilidade:

```powershell
npx jest tests/infrastructure/observability --runInBand
```

### Cobertura configurada

Os limites globais definidos no Jest são:

| Indicador | Limite mínimo |
|---|---:|
| Statements | 90% |
| Branches | 80% |
| Functions | 100% |
| Lines | 90% |

## 12. Qualidade de código

O projeto utiliza ESLint para análise estática.

Executar:

```powershell
npm run lint
```

## 13. Integração contínua (CI)

O projeto utiliza GitHub Actions para automatizar verificações em eventos de push e pull request direcionados à branch `main`.

O workflow executa:

1. Checkout do repositório.
2. Configuração do Node.js.
3. Instalação de dependências com `npm ci`.
4. Execução do ESLint.
5. Testes automatizados com cobertura.

Arquivo de configuração:

```text
.github/workflows/ci.yml
```

## 14. Licença

Projeto acadêmico desenvolvido como parte da Formação Full Stack — Geração Tech.

A licença declarada no `package.json` é ISC.
