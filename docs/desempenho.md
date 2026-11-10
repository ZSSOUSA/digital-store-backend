# Relatório de Desempenho — Digital Store API

## 1. Objetivo

Este documento registra o teste de desempenho de fumaça (smoke test) realizado na Digital Store API utilizando o k6.

O objetivo é verificar se o endpoint de busca de produtos responde corretamente e atende ao objetivo de desempenho definido para o projeto.

## 2. Ferramenta utilizada

- **Ferramenta:** Grafana k6.
- **Execução:** container Docker.
- **Ambiente:** ambiente local, com a API e o banco de dados executados pelo Docker Compose.
- **Endpoint testado:** `GET /v1/product/search`.

## 3. Configuração do teste

| Parâmetro | Configuração |
|---|---|
| Usuários virtuais (VUs) | 1 |
| Duração | 10 segundos |
| Requisições realizadas | 10 |
| Verificação HTTP | Status 200 |
| Limite de p95 | Menor que 500 ms |
| Limite de falhas | Inferior a 1% |

## 4. Resultados obtidos

O teste foi executado com sucesso e apresentou os seguintes resultados:

| Métrica | Resultado |
|---|---:|
| Total de requisições | 10 |
| Verificações aprovadas | 10 (100%) |
| Verificações reprovadas | 0 |
| Tempo médio | 41,13 ms |
| Tempo mínimo | 4,51 ms |
| Tempo mediano | 5,60 ms |
| Tempo máximo | 347,80 ms |
| Percentil 90 (p90) | 48,32 ms |
| Percentil 95 (p95) | 198,06 ms |
| Taxa de falhas HTTP | 0% |

## 5. Verificação do SLO

O objetivo de nível de serviço (SLO) definido para o projeto é:

**95% das requisições devem responder em até 500 ms.**

Resultado da execução:

- p95 medido: 198,06 ms.
- Limite estabelecido: 500 ms.
- Resultado: objetivo atendido.

O teste também apresentou taxa de falhas HTTP de 0%, atendendo ao limite configurado de menos de 1%.

## 6. Análise

O resultado demonstra que, durante a execução do teste de fumaça no ambiente local, o endpoint de busca de produtos apresentou respostas dentro do limite de desempenho estabelecido.

Todas as 10 verificações retornaram HTTP 200, sem falhas registradas.

O p95 de 198,06 ms ficou abaixo do limite de 500 ms definido no SLO.

## 7. Limitações

Este procedimento caracteriza um teste de fumaça, com apenas um usuário virtual e duração de 10 segundos.

Portanto, os resultados não representam um teste de carga ou estresse e não permitem afirmar como a API se comportará com muitos usuários simultâneos.

Os valores medidos são referentes ao ambiente local de execução e podem variar em outros ambientes.

## 8. Conclusão

O teste de fumaça realizado com Grafana k6 foi aprovado.

O endpoint `GET /v1/product/search` respondeu corretamente às 10 requisições realizadas, com p95 de 198,06 ms e taxa de falhas HTTP de 0%.

Dessa forma, o objetivo de desempenho definido para este teste foi atendido.