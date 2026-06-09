# Arquitetura — InvestSmart

## Visão Geral

O InvestSmart utiliza uma arquitetura **client-server em camadas**, separando interface, API, lógica de negócio, persistência, integração externa, rotinas periódicas, observabilidade e infraestrutura.

A aplicação foi estruturada para atender aos requisitos da linha de Web Apps, com frontend navegável, backend próprio, banco de dados persistente, deploy público, CI/CD, testes automatizados, análise estática de código e monitoramento em produção.

A aplicação é composta por:

* Frontend React/Vite;
* Servidor Nginx para servir o build do frontend;
* Backend Django REST Framework;
* Gunicorn como servidor WSGI do backend;
* Banco de dados PostgreSQL;
* Integração externa com Yahoo Finance via `yfinance`;
* Scheduler para execução periódica dos alertas;
* Reverse proxy com Caddy;
* HTTPS automático via Caddy;
* Containers Docker;
* Pipeline de CI/CD com GitHub Actions;
* Análise de qualidade com SonarCloud;
* Observabilidade com Prometheus e Grafana.

---

## Diagrama Geral

```text
Usuário
  |
  | HTTPS
  v
Caddy
  |
  +------------------------------+
  |                              |
  v                              v
Frontend React/Vite          Backend Django REST Framework
servido por Nginx            Gunicorn
  |                              |
  | Requisições /api             | ORM
  |                              v
  |                          PostgreSQL
  |                              ^
  |                              |
  |                      Scheduler de Alertas
  |                              |
  |                              v
  |                      Yahoo Finance / yfinance
  |
  +------------------------------+

Backend Django
  |
  | expõe métricas em /metrics
  v
Prometheus
  |
  v
Grafana
```

---

## Visão de Implantação

Em produção, o InvestSmart é executado em uma VPS utilizando Docker Compose. Cada serviço roda em um container separado, mantendo responsabilidades isoladas e facilitando manutenção, atualização e monitoramento.

```text
VPS / Docker Compose
│
├── caddy
│   ├── HTTPS
│   └── reverse proxy
│
├── frontend
│   ├── React/Vite build
│   └── Nginx
│
├── backend
│   ├── Django REST Framework
│   ├── Gunicorn
│   ├── autenticação JWT
│   ├── regras de negócio
│   └── endpoint /metrics
│
├── db
│   └── PostgreSQL
│
├── scheduler
│   └── rotina periódica de alertas
│
├── prometheus
│   └── coleta de métricas
│
└── grafana
    └── dashboards de observabilidade
```

---

## Camadas da Arquitetura

| Camada             | Tecnologia                  | Responsabilidade                                            |
| ------------------ | --------------------------- | ----------------------------------------------------------- |
| Apresentação       | React/Vite                  | Interface, rotas, formulários, dashboards e componentes     |
| Servidor estático  | Nginx                       | Servir o build do frontend em produção                      |
| Proxy reverso      | Caddy                       | Entrada pública, HTTPS e roteamento entre frontend/backend  |
| API                | Django REST Framework       | Endpoints REST, autenticação, serialização e validações     |
| Servidor WSGI      | Gunicorn                    | Execução da aplicação Django em produção                    |
| Negócio            | Serviços Django             | Valuation, simulações, projeções, carteiras e alertas       |
| Persistência       | PostgreSQL                  | Armazenamento relacional dos dados                          |
| Rotina periódica   | Scheduler container         | Atualização de cotações e verificação automática de alertas |
| Integração externa | yfinance/Yahoo Finance      | Consulta de dados de mercado                                |
| Observabilidade    | Prometheus/Grafana          | Coleta, armazenamento e visualização de métricas            |
| Qualidade/Entrega  | GitHub Actions e SonarCloud | Testes, análise estática, cobertura e deploy                |

---

## Visão C4 — Nível 1: Contexto

```text
[Usuário Investidor]
        |
        | HTTPS
        v
[InvestSmart Web App]
        |
        +--> [Yahoo Finance / yfinance]
        |
        +--> [GitHub Actions]
        |
        +--> [SonarCloud]
        |
        +--> [Prometheus / Grafana]
```

O usuário acessa o InvestSmart para realizar cálculos de valuation, criar carteiras, simular investimentos, visualizar dashboards, acompanhar projeções de longo prazo e receber alertas automáticos.

O sistema consulta dados externos de mercado por meio do Yahoo Finance, utiliza GitHub Actions e SonarCloud para qualidade e entrega contínua, e conta com Prometheus e Grafana para observabilidade em produção.

---

## Visão C4 — Nível 2: Containers

```text
[Browser do Usuário]
        |
        | HTTPS
        v
[Caddy]
        |
        +-------------------------------+
        |                               |
        v                               v
[Frontend React/Nginx]          [Backend Django/Gunicorn]
        |                               |
        | chamadas /api                 | ORM
        |                               v
        |                         [PostgreSQL]
        |                               ^
        |                               |
        |                         [Scheduler]
        |                               |
        |                               v
        |                       [Yahoo Finance]
        |
        +-------------------------------+

[Prometheus] ---> coleta métricas de ---> [Backend /metrics]
[Grafana] -----> consulta dados de -----> [Prometheus]

[GitHub Actions] ---> executa testes, build, análise e deploy
[SonarCloud] -------> analisa qualidade, cobertura e segurança
```

---

## Visão C4 — Nível 3: Componentes do Backend

```text
Backend Django REST Framework
│
├── accounts
│   ├── login
│   ├── logout
│   ├── refresh token
│   └── usuário autenticado
│
├── assets
│   ├── cadastro de ativos
│   ├── consulta de ativos
│   └── sincronização de dados de mercado
│
├── valuation
│   ├── cálculo Graham
│   ├── cálculo Barsi
│   ├── cálculo Projetivo
│   └── histórico de análises
│
├── portfolios
│   ├── cadastro de carteiras
│   ├── itens da carteira
│   ├── simulação de carteira
│   └── projeções de 5, 10 e 20 anos
│
├── alerts
│   ├── eventos de alerta
│   ├── verificação de preço teto
│   └── registro de alertas automáticos
│
└── core/config
    ├── configurações Django
    ├── URLs principais
    ├── autenticação JWT
    ├── CORS/CSRF
    └── métricas Prometheus
```

---

## Principais Módulos do Backend

| App           | Responsabilidade                                           |
| ------------- | ---------------------------------------------------------- |
| `accounts`    | Autenticação, login, logout, refresh e usuário autenticado |
| `assets`      | Cadastro, consulta e sincronização de ativos               |
| `valuation`   | Métodos de cálculo Graham, Barsi e Projetivo               |
| `portfolios`  | Carteiras, itens, simulações e projeções                   |
| `alerts`      | Alertas automáticos e eventos de preço teto                |
| `core/config` | Configurações centrais, rotas, segurança e métricas        |

---

## Principais Módulos do Frontend

| Diretório        | Responsabilidade                                |
| ---------------- | ----------------------------------------------- |
| `src/pages`      | Páginas principais da aplicação                 |
| `src/components` | Componentes reutilizáveis                       |
| `src/contexts`   | Contextos globais, como autenticação            |
| `src/services`   | Cliente HTTP e integração com a API             |
| `src/app`        | Configurações de rotas e estrutura da aplicação |
| `src/assets`     | Imagens e recursos estáticos                    |

---

## Fluxos Principais da Aplicação

### 1. Fluxo de autenticação

```text
Usuário
  |
  v
Frontend React
  |
  v
Backend Django REST
  |
  v
JWT / Refresh Token
```

O usuário realiza login pela interface web. O backend valida as credenciais e retorna tokens JWT para controle de sessão e acesso às rotas protegidas.

---

### 2. Fluxo de cálculo de valuation

```text
Usuário
  |
  v
Calculadora Graham/Barsi/Projetivo
  |
  v
Backend Django REST
  |
  v
Serviços de Valuation
  |
  v
Resultado retornado ao Frontend
```

O usuário informa os dados necessários para os cálculos. O backend aplica as regras de negócio e retorna o preço justo, margem de segurança e demais indicadores.

---

### 3. Fluxo de carteira e simulação

```text
Usuário
  |
  v
Frontend React
  |
  v
Backend Django REST
  |
  v
PostgreSQL
  |
  v
Serviços de Simulação
  |
  v
Dashboard / Projeções
```

O usuário cria carteiras, adiciona ativos e simula cenários de investimento. O sistema calcula métricas consolidadas e projeções de longo prazo em horizontes de 5, 10 e 20 anos.

---

### 4. Fluxo de alertas automáticos

```text
Scheduler
  |
  v
Consulta ativos e carteiras
  |
  v
Atualiza cotações via yfinance
  |
  v
Recalcula preços e margens
  |
  v
Registra alertas no banco
  |
  v
Frontend exibe eventos de alerta
```

O scheduler executa periodicamente a verificação de ativos cadastrados nas carteiras. Quando uma condição de preço é atendida, o sistema registra eventos de alerta para consulta pelo usuário.

---

### 5. Fluxo de observabilidade

```text
Backend Django
  |
  | /metrics
  v
Prometheus
  |
  v
Grafana
  |
  v
Dashboard de Observabilidade
```

O backend expõe métricas por meio do endpoint `/metrics`. O Prometheus coleta essas métricas e o Grafana as apresenta em dashboards de monitoramento.

---

## Observabilidade

A arquitetura atual inclui observabilidade com Prometheus e Grafana.

O backend Django expõe métricas como:

* requisições HTTP;
* latência da API;
* queries no banco de dados;
* latência do banco;
* novas conexões com o banco;
* memória do processo;
* CPU do processo, quando disponível;
* status dos targets monitorados.

Essas métricas permitem acompanhar a saúde da aplicação em produção e gerar evidências técnicas para a entrega final.

---

## Segurança

A arquitetura considera práticas básicas de segurança para aplicações web:

* comunicação pública via HTTPS;
* autenticação com JWT;
* variáveis sensíveis configuradas por ambiente;
* banco de dados não exposto diretamente ao público;
* backend isolando o acesso ao PostgreSQL;
* validação de permissões nas rotas protegidas;
* configuração de CORS e CSRF;
* uso de Caddy como ponto de entrada público;
* separação entre frontend, backend e banco em containers distintos.

---

## CI/CD e Qualidade

O fluxo de qualidade e entrega utiliza GitHub Actions e SonarCloud.

```text
Desenvolvedor
  |
  v
GitHub
  |
  v
GitHub Actions
  |
  +--> Testes Backend
  +--> Testes Frontend
  +--> Relatórios de Cobertura
  +--> SonarCloud
  +--> Build
  +--> Deploy em Produção
```

Esse processo reduz o risco de falhas em produção, automatiza validações e mantém histórico de evolução técnica do projeto.

---

## Decisões Arquiteturais

| Decisão                          | Justificativa                                                   |
| -------------------------------- | --------------------------------------------------------------- |
| React no frontend                | Permite interface componentizada, dinâmica e reutilizável       |
| Django REST Framework no backend | Facilita criação de APIs REST, autenticação e regras de negócio |
| PostgreSQL como banco            | Garante persistência relacional robusta e integridade dos dados |
| Docker Compose                   | Padroniza ambiente local e produção                             |
| Caddy                            | Simplifica HTTPS e reverse proxy                                |
| Nginx no frontend                | Serve arquivos estáticos do build React com boa performance     |
| Scheduler em container separado  | Isola a rotina periódica de alertas da API principal            |
| Prometheus e Grafana             | Permitem observabilidade com métricas e dashboards              |
| GitHub Actions                   | Automatiza testes, build e deploy                               |
| SonarCloud                       | Mede qualidade, cobertura e segurança do código                 |

---

## Escopo da Versão Final

A versão final do InvestSmart prioriza os fluxos principais definidos para o MVP:

* autenticação de usuários;
* cálculo de preço justo pelo método de Graham;
* cálculo de preço teto pelo método Barsi;
* cálculo de preço teto pelo método Projetivo;
* cadastro e simulação de carteiras;
* projeções de 5, 10 e 20 anos;
* alertas automáticos;
* dashboards financeiros;
* integração com dados de mercado;
* deploy público com HTTPS;
* CI/CD;
* testes automatizados;
* análise estática com SonarCloud;
* observabilidade com Prometheus e Grafana.

A funcionalidade de comparação setorial entre empresas foi movida para evolução futura. Essa decisão foi tomada para manter o foco na estabilidade, documentação e qualidade das funcionalidades centrais do MVP.

---

## Justificativa Arquitetural

A arquitetura foi escolhida por oferecer:

* separação clara de responsabilidades;
* facilidade de manutenção;
* organização modular;
* possibilidade de testes por camada;
* escalabilidade gradual;
* boa integração entre frontend e backend;
* aderência à linha Web Apps;
* compatibilidade com deploy em Docker;
* suporte a CI/CD;
* suporte a observabilidade;
* segurança básica para ambiente produtivo;
* facilidade para evolução futura do projeto.

---

## Evoluções Futuras

Como evolução futura, a arquitetura pode ser expandida com:

* instrumentação personalizada de métricas por rota, método HTTP e status;
* alertas automáticos no Grafana;
* comparação setorial entre empresas;
* cache com Redis;
* testes de carga com JMeter ou Locust;
* infraestrutura como código;
* monitoramento externo de disponibilidade;
* métricas de negócio, como total de cálculos, carteiras, simulações e alertas gerados.

---
