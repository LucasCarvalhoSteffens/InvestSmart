# Decisões Técnicas — InvestSmart

Este documento registra decisões técnicas relevantes do projeto InvestSmart, suas justificativas e impactos no desenvolvimento da aplicação.

O objetivo é manter rastreabilidade sobre escolhas de arquitetura, infraestrutura, tecnologias, escopo e qualidade, facilitando a avaliação, manutenção e evolução futura do sistema.

---

## 1. Uso de Django REST Framework no Backend

### Decisão

Utilizar Django REST Framework para construir a API backend.

### Justificativa

* Framework maduro e amplamente utilizado;
* integração nativa com o ORM do Django;
* boa estrutura para autenticação e permissões;
* facilidade para criação de serializers, views e endpoints REST;
* aderência à arquitetura em camadas;
* bom suporte a testes automatizados;
* compatibilidade com autenticação JWT.

### Impacto

Essa decisão permitiu estruturar o backend de forma modular, separando regras de negócio, persistência e endpoints da API.

---

## 2. Uso de React com Vite no Frontend

### Decisão

Utilizar React com Vite para a interface web.

### Justificativa

* bom desempenho durante o desenvolvimento;
* suporte à componentização;
* ecossistema amplo;
* compatibilidade com dashboards e gráficos;
* facilidade para criação de rotas protegidas;
* integração simples com APIs REST;
* bom suporte a testes com Vitest e Testing Library.

### Impacto

Essa escolha permitiu desenvolver uma interface navegável, responsiva e organizada em componentes reutilizáveis.

---

## 3. Uso de PostgreSQL

### Decisão

Utilizar PostgreSQL como banco de dados relacional.

### Justificativa

* banco robusto e adequado para produção;
* suporte a integridade referencial;
* compatibilidade com o Django ORM;
* suporte a transações;
* boa escalabilidade para aplicações web;
* evita o uso de banco local em disco, como SQLite, em ambiente produtivo.

### Impacto

O PostgreSQL garante persistência real dos dados de usuários, ativos, carteiras, simulações, análises e alertas.

---

## 4. Uso de Docker e Docker Compose

### Decisão

Containerizar os serviços da aplicação com Docker e Docker Compose.

### Justificativa

* padronização do ambiente;
* facilidade de deploy;
* isolamento dos serviços;
* reprodutibilidade entre desenvolvimento e produção;
* aderência aos critérios de infraestrutura da linha Web Apps;
* simplificação da execução de múltiplos serviços.

### Impacto

A aplicação passou a ser executada em containers separados, como backend, frontend, banco de dados, scheduler, Caddy, Prometheus e Grafana.

---

## 5. Uso de Caddy em Produção

### Decisão

Utilizar Caddy como reverse proxy e gerenciador de HTTPS.

### Justificativa

* configuração simples;
* HTTPS automático;
* boa integração com Docker;
* redução da complexidade de certificados SSL;
* centralização da entrada pública da aplicação;
* roteamento para frontend, backend e serviços auxiliares quando necessário.

### Impacto

O Caddy permitiu disponibilizar a aplicação em produção com HTTPS, aumentando a segurança e a maturidade da infraestrutura.

---

## 6. Uso de Nginx para Servir o Frontend

### Decisão

Utilizar Nginx no container de frontend para servir o build estático do React/Vite em produção.

### Justificativa

* adequado para servir arquivos estáticos;
* leve e eficiente;
* separa o frontend do backend;
* melhora a organização dos containers;
* evita executar o servidor de desenvolvimento do Vite em produção.

### Impacto

O frontend passou a ser servido de forma mais apropriada para ambiente produtivo, enquanto o Caddy atua como ponto de entrada público.

---

## 7. Uso de Gunicorn no Backend

### Decisão

Utilizar Gunicorn como servidor WSGI para executar a aplicação Django em produção.

### Justificativa

* mais adequado para produção do que o `runserver` do Django;
* compatível com aplicações Python/Django;
* permite melhor controle da execução do backend;
* integra-se bem com Docker e Caddy.

### Impacto

A aplicação backend passou a ser executada com uma configuração mais próxima de um ambiente real de produção.

---

## 8. Uso de SonarCloud

### Decisão

Utilizar SonarCloud para análise contínua de qualidade de código.

### Justificativa

* análise de bugs, vulnerabilidades e code smells;
* integração com GitHub Actions;
* evidência objetiva para avaliação;
* suporte a acompanhamento de cobertura;
* reforço das práticas de qualidade e segurança.

### Impacto

O SonarCloud passou a funcionar como ferramenta de apoio à qualidade, complementando os testes automatizados e o pipeline de CI/CD.

---

## 9. Uso de JWT

### Decisão

Utilizar autenticação JWT com refresh token.

### Justificativa

* adequado para APIs REST;
* compatível com aplicações SPA;
* permite proteger rotas no frontend;
* separa autenticação da sessão tradicional do Django;
* facilita o envio de tokens no cabeçalho `Authorization`.

### Impacto

As rotas protegidas do sistema passaram a exigir autenticação, permitindo controle de acesso aos dados do usuário.

---

## 10. Uso de Yahoo Finance/yfinance

### Decisão

Utilizar `yfinance` como fonte de dados de mercado.

### Justificativa

* acesso simplificado a cotações e informações financeiras;
* suficiente para o contexto educacional do projeto;
* reduz necessidade de API paga;
* permite demonstrar integração externa real;
* facilita a sincronização de preços utilizados em cálculos, carteiras e alertas.

### Impacto

O sistema passou a consultar dados externos de mercado para enriquecer os fluxos de valuation, carteiras e alertas.

### Limitação

Por se tratar de uma fonte externa não controlada pelo projeto, podem ocorrer indisponibilidades, atrasos ou inconsistências nos dados. Por isso, o sistema deve tratar falhas e informar o usuário quando houver limitação na obtenção das informações.

---

## 11. Separação da Documentação em `/docs`

### Decisão

Manter o README principal mais objetivo e mover a documentação detalhada para a pasta `/docs`.

### Justificativa

* melhora a organização do repositório;
* facilita a avaliação;
* evita README excessivamente longo;
* permite separar arquitetura, requisitos, testes, deploy, qualidade, segurança e evidências;
* facilita manutenção futura.

### Impacto

A documentação passou a ser organizada de forma modular, permitindo leitura mais clara por avaliadores, orientadores e possíveis contribuidores.

---

## 12. Uso de Scheduler em Container Separado

### Decisão

Executar a rotina periódica de alertas em um container separado do backend principal.

### Justificativa

* separa a API da rotina periódica;
* evita acoplamento entre requisições HTTP e tarefas automáticas;
* facilita análise de logs do scheduler;
* permite reiniciar ou monitorar a rotina de alertas de forma independente;
* melhora a organização operacional da aplicação.

### Impacto

O sistema passou a verificar periodicamente os ativos das carteiras e registrar alertas automáticos quando o preço atual ultrapassa ou fica abaixo do preço teto definido.

---

## 13. Uso de Prometheus e Grafana para Observabilidade

### Decisão

Implementar observabilidade com Prometheus e Grafana.

### Justificativa

* permite acompanhar a aplicação em produção;
* gera evidências visuais para a entrega acadêmica;
* possibilita monitorar requisições, latência, banco de dados e consumo de recursos;
* é uma solução open-source e aderente ao contexto do projeto;
* fortalece a maturidade técnica da aplicação.

### Impacto

O backend passou a expor métricas no endpoint `/metrics`, coletadas pelo Prometheus e visualizadas em dashboards no Grafana.

As principais métricas monitoradas incluem:

* targets online;
* requisições HTTP;
* latência da API;
* queries no banco de dados;
* latência do banco;
* novas conexões com o banco;
* memória do backend;
* CPU do processo, quando disponível.

### Limitação

A instrumentação atual fornece métricas gerais da aplicação. Métricas detalhadas por rota, método HTTP, status e tipo de exceção podem ser adicionadas futuramente com middleware customizado.

---

## 14. Uso de CI/CD com GitHub Actions

### Decisão

Utilizar GitHub Actions para automação de testes, análise de qualidade e deploy.

### Justificativa

* automatiza validações a cada alteração no código;
* reduz risco de deploy com falhas;
* permite executar testes de backend e frontend;
* integra com SonarCloud;
* evidencia maturidade de engenharia e entrega contínua.

### Impacto

O projeto passou a ter um fluxo automatizado de validação, qualidade e publicação em produção.

---

## 15. Estratégia de Testes Automatizados

### Decisão

Implementar testes automatizados no backend e no frontend.

### Justificativa

* aumenta a confiabilidade do sistema;
* reduz regressões;
* permite validar regras de negócio;
* atende aos critérios acadêmicos da linha Web Apps;
* gera evidências de cobertura e qualidade.

### Impacto

O backend utiliza testes do Django com `coverage.py`, enquanto o frontend utiliza Vitest e Testing Library.

A meta acadêmica considerada para cobertura de testes segue os critérios definidos para a linha Web Apps:

| Camada   | Cobertura mínima exigida | Cobertura atual | Status   |
| -------- | -----------------------: | --------------: | -------- |
| Backend  |                      75% |             90,8% | Atendido |
| Frontend |                      25% |             26,89% | Atendido |

---

## 16. Cálculo Multimétodo de Preço Justo

### Decisão

Implementar três métodos de cálculo de preço justo/preço teto:

* Graham;
* Barsi;
* Projetivo.

### Justificativa

* atende ao objetivo central do projeto;
* permite comparar diferentes abordagens de valuation;
* agrega valor educacional;
* diferencia a plataforma de uma simples carteira de ativos;
* facilita o aprendizado de análise fundamentalista.

### Impacto

O usuário pode realizar cálculos por diferentes métodos e utilizar esses resultados como apoio para simulações, carteiras e alertas.

---

## 17. Projeções de 5, 10 e 20 Anos

### Decisão

Implementar projeções de longo prazo em horizontes de 5, 10 e 20 anos.

### Justificativa

* reforça o caráter educacional da plataforma;
* permite ao usuário visualizar cenários futuros;
* complementa os fluxos de simulação de carteiras;
* atende ao escopo definido no projeto;
* melhora a experiência de análise de longo prazo.

### Impacto

O sistema permite visualizar projeções associadas aos resultados simulados, facilitando a compreensão do potencial de evolução patrimonial ou de resultados ao longo do tempo.

---

## 18. Comparação Setorial como Evolução Futura

### Decisão

Mover a funcionalidade de comparação setorial entre empresas para evolução futura.

### Justificativa

A comparação setorial foi considerada inicialmente como um diferencial do projeto, mas foi retirada do escopo da versão final para priorizar a estabilidade, documentação, testes, observabilidade e entrega completa dos fluxos principais do MVP.

A versão final concentra-se em funcionalidades consideradas mais centrais para o objetivo do InvestSmart:

* cálculo Graham;
* cálculo Barsi;
* cálculo Projetivo;
* cadastro e simulação de carteiras;
* projeções de 5, 10 e 20 anos;
* alertas automáticos;
* dashboards financeiros;
* autenticação;
* integração com dados externos;
* deploy público;
* CI/CD;
* testes automatizados;
* observabilidade.

### Impacto

A decisão evita a inclusão de uma funcionalidade incompleta ou superficial na entrega final. A comparação setorial permanece registrada como melhoria futura, podendo ser implementada com maior qualidade em uma próxima versão.

---

## 19. Deploy em VPS com Docker Compose

### Decisão

Realizar o deploy da aplicação em uma VPS utilizando Docker Compose.

### Justificativa

* maior controle sobre infraestrutura;
* compatibilidade com múltiplos containers;
* possibilidade de hospedar frontend, backend, banco, proxy, monitoramento e scheduler no mesmo ambiente;
* aderência à proposta de uma aplicação web completa;
* evita dependência exclusiva de plataformas voltadas apenas para frontend.

### Impacto

A aplicação passou a estar disponível em ambiente produtivo, com domínio próprio, HTTPS e serviços containerizados.

---

## 20. Uso de Caddy em Conjunto com Nginx

### Decisão

Utilizar Caddy como proxy reverso público e Nginx como servidor interno do frontend.

### Justificativa

* Caddy gerencia HTTPS e roteamento público;
* Nginx serve os arquivos estáticos do frontend React;
* a separação evita misturar responsabilidades;
* a arquitetura fica mais clara e aderente ao ambiente Docker.

### Impacto

O fluxo de acesso público ficou organizado da seguinte forma:

```text
Usuário -> HTTPS -> Caddy -> Frontend/Nginx
Usuário -> HTTPS -> Caddy -> Backend/Django
```

---

## 21. Organização Modular do Código

### Decisão

Organizar o backend em apps Django e o frontend em diretórios separados por responsabilidade.

### Justificativa

* melhora manutenção;
* facilita testes;
* reduz acoplamento;
* permite evolução incremental;
* torna o projeto mais compreensível para avaliação.

### Impacto

O backend foi organizado em módulos como `accounts`, `assets`, `valuation`, `portfolios` e `alerts`. O frontend foi estruturado em páginas, componentes, serviços, contextos e rotas.

---

## 22. Escopo da Versão Final

### Decisão

Consolidar a versão final do InvestSmart como um MVP funcional, estável, documentado e observável.

### Funcionalidades mantidas no escopo final

* autenticação de usuários;
* calculadora Graham;
* calculadora Barsi;
* calculadora Projetiva;
* cadastro e gerenciamento de carteiras;
* simulação consolidada de carteiras;
* projeções de 5, 10 e 20 anos;
* alertas automáticos;
* dashboards financeiros;
* integração com Yahoo Finance/yfinance;
* deploy público com HTTPS;
* CI/CD;
* testes automatizados;
* SonarCloud;
* observabilidade com Prometheus e Grafana.

### Funcionalidades movidas para evolução futura

* comparação setorial entre empresas;
* métricas de negócio customizadas;
* alertas automáticos no Grafana;
* instrumentação por rota, status e método HTTP;
* cache com Redis;
* testes de carga;
* infraestrutura como código.

### Impacto

Essa decisão reduz riscos na entrega final e prioriza funcionalidades completas, testáveis e demonstráveis durante o Poster + Demo Day.

---


A arquitetura adotada permite que o projeto seja executado em produção, monitorado, testado e mantido de forma modular. Além disso, as decisões de escopo registradas neste documento tornam explícitas as prioridades da versão final e as possibilidades de evolução futura.
