# ADR 0001 — Decisões Arquiteturais do Backend Digital Store

- **Status:** Aceita
- **Data:** 09/11/2026
- **Projeto:** Digital Store Backend
- **Responsável:** Zaqueu Silva

## 1. Contexto

O projeto Digital Store Backend tem como objetivo disponibilizar uma API REST para gerenciamento e consulta de produtos, utilizando persistência em banco de dados relacional.

Durante o desenvolvimento, surgiu a necessidade de organizar melhor as responsabilidades do código, facilitar os testes automatizados, reduzir o acoplamento entre regras de negócio e tecnologias externas e permitir a execução padronizada do ambiente.

A arquitetura foi organizada gradualmente, mantendo partes da estrutura anterior e introduzindo elementos de separação de domínio, casos de uso e infraestrutura.

## 2. Decisões arquiteturais

### 2.1. Node.js e Express

**Decisão:** utilizar Node.js com Express para desenvolver a API REST.

**Justificativa:**
- Permite construir endpoints HTTP de maneira simples.
- Possui um ecossistema amplo de bibliotecas.
- Facilita a organização de rotas, controladores e middlewares.
- Atende às necessidades da API proposta.

**Consequências:**
- A aplicação utiliza JavaScript no ambiente Node.js.
- As requisições HTTP são organizadas por rotas e controladores.
- A lógica de negócio pode ser separada do transporte HTTP.

### 2.2. MySQL e Sequelize

**Decisão:** utilizar MySQL como banco de dados relacional e Sequelize como ferramenta de mapeamento objeto-relacional (ORM).

**Justificativa:**
- O domínio possui relacionamentos entre produtos, categorias, imagens e opções.
- O banco relacional permite manter esses relacionamentos.
- O Sequelize facilita operações de persistência e transações.

**Consequências:**
- Os dados são persistidos em um banco MySQL.
- Os modelos Sequelize representam as estruturas persistidas.
- Operações relacionadas podem utilizar transações para manter a consistência dos dados.

### 2.3. Separação de responsabilidades

**Decisão:** organizar o código em camadas com responsabilidades distintas.

A estrutura contempla:

| Camada | Responsabilidade |
|---|---|
| Controllers | Receber requisições HTTP e produzir respostas. |
| Services | Concentrar operações e consultas da aplicação. |
| Application | Coordenar casos de uso. |
| Domain | Representar entidades e regras de negócio. |
| Infrastructure | Implementar integrações técnicas, como repositórios e observabilidade. |
| Models | Representar os modelos de persistência do Sequelize. |

**Justificativa:**

A separação facilita a manutenção, a compreensão do código e os testes das regras de negócio.

A arquitetura é híbrida e evolutiva: nem todas as operações utilizam ainda o mesmo fluxo de camadas.

### 2.4. Caso de uso e injeção de dependência

**Decisão:** utilizar o caso de uso `CreateProductUseCase` para coordenar a criação de produtos.

O caso de uso recebe o repositório por meio do construtor:

`CreateProductUseCase(productRepository)`

**Justificativa:**
- Reduz o acoplamento entre a regra de criação e a implementação de persistência.
- Permite substituir a implementação do repositório.
- Facilita testes utilizando implementações controladas ou simuladas.

**Consequências:**

O caso de uso trabalha com o contrato operacional do repositório, sem precisar conhecer diretamente os detalhes do Sequelize.

### 2.5. Entidade de domínio

**Decisão:** implementar a entidade `Product` para concentrar validações essenciais do produto.

A entidade valida:
- Nome obrigatório.
- Slug obrigatório.
- Estoque inteiro e não negativo.
- Preço válido e não negativo.
- Preço com desconto válido e não superior ao preço original.
- Tipo booleano para o campo de habilitação.
- Descrição textual ou nula.

A entidade utiliza `Object.freeze()` para impedir alterações posteriores nas propriedades da instância.

**Justificativa:**

As regras essenciais do produto ficam protegidas na camada de domínio, evitando que dependam exclusivamente de validações realizadas pelos controladores.

### 2.6. Padrão Repository

**Decisão:** utilizar o padrão Repository para separar a persistência do caso de uso.

A implementação `SequelizeProductRepository` é responsável por persistir o produto e seus relacionamentos.

**Justificativa:**

O caso de uso não precisa conhecer diretamente os métodos de persistência do Sequelize.

**Consequências:**
- A implementação de persistência fica concentrada em uma classe específica.
- A dependência pode ser substituída em testes.
- A persistência dos dados relacionados utiliza uma única transação.

### 2.7. Transações no banco de dados

**Decisão:** utilizar transação do Sequelize durante a criação do produto e seus relacionamentos.

A operação contempla:
1. Criação do produto.
2. Associação das categorias.
3. Persistência das imagens.
4. Persistência das opções.

**Justificativa:**

Se ocorrer uma falha durante a operação, a transação permite desfazer as gravações realizadas, evitando que o produto fique parcialmente persistido.

### 2.8. Docker e Docker Compose

**Decisão:** utilizar Docker e Docker Compose para padronizar o ambiente de execução.

**Justificativa:**
- Facilitar a configuração do ambiente.
- Padronizar a execução da API e do banco de dados.
- Reduzir diferenças entre ambientes de desenvolvimento.
- Permitir inicialização por um único comando.

**Consequências:**

A API e o MySQL são executados em contêineres, com persistência de dados por volume Docker e verificação de saúde do banco antes da inicialização da API.

### 2.9. Testes automatizados e integração contínua

**Decisão:** utilizar Jest para testes automatizados e GitHub Actions para integração contínua.

**Justificativa:**

A execução automatizada de testes e análise estática ajuda a identificar problemas antes da integração das alterações.

**Consequências:**
- Testes automatizados são executados pelo Jest.
- O ESLint verifica a qualidade estática do código.
- O pipeline de CI executa instalação, lint e testes.
- O projeto utiliza limites mínimos de cobertura configurados.

## 3. Alternativas consideradas

| Alternativa | Decisão |
|---|---|
| Persistência diretamente nos controladores | Não adotada no fluxo de criação, para separar responsabilidades. |
| Acesso direto ao Sequelize pelo caso de uso | Não adotado; foi utilizada a abstração de repositório. |
| Gravações independentes dos relacionamentos | Não adotadas na criação; foi utilizada uma transação. |
| Execução manual do ambiente | Substituída pela utilização de Docker Compose. |

## 4. Consequências gerais

### Benefícios

- Melhor separação de responsabilidades.
- Regras de negócio concentradas na entidade de domínio.
- Menor acoplamento entre o caso de uso e a persistência.
- Facilidade para testar o fluxo de criação.
- Consistência na gravação dos dados relacionados.
- Ambiente de execução padronizado.

### Limitações e pontos de evolução

- A arquitetura ainda é híbrida, pois operações existentes continuam utilizando diretamente serviços e controladores.
- A aplicação pode evoluir gradualmente para uma separação mais uniforme das camadas.
- Novos casos de uso podem adotar o mesmo padrão de injeção de dependência e repositório.
- A documentação arquitetural deve acompanhar as mudanças relevantes do projeto.

## 5. Resultado

As decisões adotadas buscam equilibrar simplicidade, manutenção, testabilidade e consistência, respeitando o escopo da Digital Store Backend.

A arquitetura não pretende introduzir complexidade desnecessária, mas estabelecer uma base organizada para a evolução da aplicação.