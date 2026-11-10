# Digital Store â€” Backend API

API REST do projeto **Digital Store**, desenvolvido como projeto final da FormaÃ§Ã£o Full Stack â€” GeraÃ§Ã£o Tech.

**Desenvolvedor:** Zaqueu Silva
**RepositÃ³rio:** https://github.com/ZSSOUSA/digital-store-backend
**Frontend:** https://github.com/ZSSOUSA/digital-store-frontend

## 1. Sobre o projeto

O Digital Store Backend fornece serviÃ§os de API REST para uma aplicaÃ§Ã£o de comÃ©rcio eletrÃ´nico, incluindo gerenciamento de produtos, categorias, usuÃ¡rios e autenticaÃ§Ã£o.

O projeto utiliza Node.js, Express, Sequelize e MySQL, com autenticaÃ§Ã£o baseada em JWT.

A aplicaÃ§Ã£o foi estruturada para execuÃ§Ã£o em ambiente Docker, com banco de dados persistente e verificaÃ§Ãµes automatizadas de qualidade.

## 2. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js 22 | Ambiente de execuÃ§Ã£o |
| Express 4 | Framework HTTP |
| Sequelize 6 | ORM |
| MySQL 8.4 | Banco de dados relacional |
| mysql2 | Driver MySQL |
| JWT | AutenticaÃ§Ã£o por token |
| bcrypt | Hash de senhas |
| Docker | ContainerizaÃ§Ã£o |
| Docker Compose | OrquestraÃ§Ã£o dos serviÃ§os |
| Jest | Testes automatizados |
| Supertest | Testes HTTP |
| ESLint | AnÃ¡lise estÃ¡tica de cÃ³digo |
| Swagger / OpenAPI 3.0 | DocumentaÃ§Ã£o da API |

## 3. Arquitetura e organizaÃ§Ã£o

O projeto utiliza uma organizaÃ§Ã£o em camadas, separando responsabilidades da aplicaÃ§Ã£o.

```text
digital-store-backend/
â”‚
â”œâ”€â”€ .github/
â”‚   â””â”€â”€ workflows/
â”‚       â””â”€â”€ ci.yml
â”‚
â”œâ”€â”€ docs/
â”‚   â””â”€â”€ api-preview.svg
â”‚
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”œâ”€â”€ database.js
â”‚   â”‚   â””â”€â”€ swagger.js
â”‚   â”‚
â”‚   â”œâ”€â”€ controllers/
â”‚   â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ models/
â”‚   â”œâ”€â”€ routes/
â”‚   â”œâ”€â”€ middleware/
â”‚   â”œâ”€â”€ images/
â”‚   â”‚
â”‚   â”œâ”€â”€ infrastructure/
â”‚   â”‚   â””â”€â”€ observability/
â”‚   â”‚       â”œâ”€â”€ logger.js
â”‚   â”‚       â””â”€â”€ metrics.js
â”‚   â”‚
â”‚   â”œâ”€â”€ app.js
â”‚   â””â”€â”€ server.js
â”‚
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ application/
â”‚   â”œâ”€â”€ domain/
â”‚   â”œâ”€â”€ infrastructure/
â”‚   â””â”€â”€ config/
â”‚
â”œâ”€â”€ .env.example
â”œâ”€â”€ .gitignore
â”œâ”€â”€ Dockerfile
â”œâ”€â”€ docker-compose.yml
â”œâ”€â”€ eslint.config.js
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

### Responsabilidades principais

- **Controllers:** recebem as requisiÃ§Ãµes HTTP e coordenam as respostas.
- **Services:** concentram operaÃ§Ãµes e regras da aplicaÃ§Ã£o.
- **Models:** representam as entidades persistidas pelo Sequelize.
- **Routes:** definem os endpoints da API.
- **Middleware:** executa verificaÃ§Ãµes intermediÃ¡rias, incluindo autenticaÃ§Ã£o.
- **Config:** concentra configuraÃ§Ãµes de banco de dados e documentaÃ§Ã£o.
- **Infrastructure/Observability:** implementa logs estruturados e mÃ©tricas HTTP.
- **Tests:** contÃ©m testes automatizados das funcionalidades e integraÃ§Ãµes.

## 4. PrÃ©-requisitos

Para executar o projeto:

- Docker Desktop instalado e em execuÃ§Ã£o.
- Docker Compose disponÃ­vel.
- Git.
- Node.js 22 e npm, caso queira executar os comandos de desenvolvimento e testes fora dos containers.

## 5. ConfiguraÃ§Ã£o do ambiente

O projeto utiliza variÃ¡veis de ambiente para evitar credenciais diretamente no cÃ³digo.

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

**Importante:** substitua os valores de exemplo por credenciais prÃ³prias.

O arquivo `.env` nÃ£o deve ser enviado ao Git. Utilize `.env.example` para documentar as variÃ¡veis necessÃ¡rias.

## 6. Como executar com Docker Compose

A execuÃ§Ã£o principal utiliza Docker Compose.

Na raiz do projeto, execute:

```powershell
docker compose up -d --build
```

Esse comando:

1. ConstrÃ³i a imagem da API.
2. Inicializa o banco MySQL 8.4.
3. Aguarda a verificaÃ§Ã£o de saÃºde do banco.
4. Inicia a API apÃ³s o banco estar disponÃ­vel.

Para verificar os containers:

```powershell
docker compose ps
```

Para acompanhar os logs:

```powershell
docker compose logs -f api
```

Para parar os serviÃ§os:

```powershell
docker compose down
```

O banco utiliza o volume persistente `digital_store_data`, preservando os dados quando os containers sÃ£o parados.

**AtenÃ§Ã£o:** nÃ£o utilize `docker compose down -v` se quiser preservar os dados do banco.

## 7. EndereÃ§os da aplicaÃ§Ã£o

| ServiÃ§o | EndereÃ§o |
|---|---|
| API | http://localhost:3000 |
| Rota principal | http://localhost:3000/ |
| Swagger UI | http://localhost:3000/api-docs |
| MÃ©tricas | http://localhost:3000/metrics |
| MySQL (porta do host) | localhost:3307 |

## 8. Endpoints principais

Base URL:

```text
http://localhost:3000/v1
```

### Produtos

| MÃ©todo | Endpoint | DescriÃ§Ã£o | AutenticaÃ§Ã£o |
|---|---|---|---|
| GET | `/v1/product/search` | Busca produtos com filtros | NÃ£o |
| GET | `/v1/product/:id` | Consulta produto por ID | NÃ£o |
| POST | `/v1/product` | Cria produto | Sim |
| DELETE | `/v1/product/:id` | Remove produto | Sim |

Os endpoints protegidos exigem o cabeÃ§alho:

```http
Authorization: Bearer SEU_TOKEN_JWT
```

O token Ã© obtido pelo endpoint de autenticaÃ§Ã£o:

```text
POST /v1/auth/login
```

Consulte a documentaÃ§Ã£o Swagger para visualizar os parÃ¢metros e respostas disponÃ­veis.

## 9. DocumentaÃ§Ã£o OpenAPI / Swagger

A API possui documentaÃ§Ã£o interativa baseada no padrÃ£o OpenAPI 3.0.

Com a aplicaÃ§Ã£o em execuÃ§Ã£o, acesse:

http://localhost:3000/api-docs

A documentaÃ§Ã£o permite visualizar os endpoints, parÃ¢metros, respostas e requisitos de autenticaÃ§Ã£o.

## 10. Observabilidade

O projeto possui recursos bÃ¡sicos de observabilidade.

### Logs estruturados

Os registros sÃ£o emitidos em formato JSON, contendo:

- Timestamp.
- NÃ­vel do registro.
- Mensagem.
- Contexto adicional, quando aplicÃ¡vel.

Os nÃ­veis implementados sÃ£o:

- `info`
- `warn`
- `error`

### MÃ©tricas HTTP

O endpoint:

```text
GET /metrics
```

apresenta a mÃ©trica:

```text
http_request_duration_ms
```

SÃ£o armazenadas as Ãºltimas 1.000 amostras de duraÃ§Ã£o das requisiÃ§Ãµes HTTP.

O sistema calcula o percentil 95 (p95) e compara o resultado com o objetivo de nÃ­vel de serviÃ§o:

**SLO:** 95% das requisiÃ§Ãµes em atÃ© 500 ms.

As mediÃ§Ãµes sÃ£o mantidas em memÃ³ria e reiniciadas quando a aplicaÃ§Ã£o reinicia.

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

Os limites globais definidos no Jest sÃ£o:

| Indicador | Limite mÃ­nimo |
|---|---:|
| Statements | 90% |
| Branches | 80% |
| Functions | 100% |
| Lines | 90% |

## 12. Qualidade de cÃ³digo

O projeto utiliza ESLint para anÃ¡lise estÃ¡tica.

Executar:

```powershell
npm run lint
```

## 13. IntegraÃ§Ã£o contÃ­nua (CI)

O projeto utiliza GitHub Actions para automatizar verificaÃ§Ãµes em eventos de push e pull request direcionados Ã  branch `main`.

O workflow executa:

1. Checkout do repositÃ³rio.
2. ConfiguraÃ§Ã£o do Node.js.
3. InstalaÃ§Ã£o de dependÃªncias com `npm ci`.
4. ExecuÃ§Ã£o do ESLint.
5. Testes automatizados com cobertura.

Arquivo de configuraÃ§Ã£o:

```text
.github/workflows/ci.yml
```

## 14. LicenÃ§a

Projeto acadÃªmico desenvolvido como parte da FormaÃ§Ã£o Full Stack â€” GeraÃ§Ã£o Tech.

A licenÃ§a declarada no `package.json` Ã© ISC.
