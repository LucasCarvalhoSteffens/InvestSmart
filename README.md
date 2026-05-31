# InvestSmart

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=bugs)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)

Plataforma web educacional para análise fundamentalista de ações, cálculo multimétodo de preço justo, simulação de carteiras, dashboards financeiros e alertas automáticos de preço em relação ao preço teto.

O InvestSmart foi desenvolvido como projeto de Portfólio em Engenharia de Software, com foco em arquitetura em camadas, autenticação JWT, integração com dados externos, persistência real, testes automatizados, CI/CD, deploy em nuvem e análise contínua de qualidade de código.

> **Aplicação em produção:** https://investsmartlcs.com  
> **Repositório:** https://github.com/LucasCarvalhoSteffens/InvestSmart  
> **Status:** em produção e em evolução para entrega final do Portfólio  
> **Branch principal:** `main`  
> **Natureza:** projeto acadêmico/profissional  
> **Aviso:** este sistema possui finalidade educacional e de apoio à análise. Não constitui recomendação de investimento.

---

## Sumário

- [Objetivo](#objetivo)
- [Problema que o Projeto Resolve](#problema-que-o-projeto-resolve)
- [Principais Diferenciais](#principais-diferenciais)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Funcionalidades](#funcionalidades)
- [Métodos de Valuation](#métodos-de-valuation)
- [Carteiras e Simulação](#carteiras-e-simulação)
- [Alertas Automáticos](#alertas-automáticos)
- [Dashboard](#dashboard)
- [Fluxos de Negócio](#fluxos-de-negócio)
- [Endpoints Principais](#endpoints-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Executar em Desenvolvimento](#como-executar-em-desenvolvimento)
- [Deploy em Produção](#deploy-em-produção)
- [CI/CD](#cicd)
- [Testes e Cobertura](#testes-e-cobertura)
- [Qualidade de Código](#qualidade-de-código)
- [Segurança](#segurança)
- [Checklist para Finalização do Portfólio](#checklist-para-finalização-do-portfólio)
- [Contexto Acadêmico](#contexto-acadêmico)
- [Licença](#licença)
- [Autor](#autor)

---

## Objetivo

O objetivo do InvestSmart é oferecer uma plataforma web integrada para auxiliar investidores pessoa física no estudo de análise fundamentalista e na simulação de carteiras de investimento.

A aplicação permite:

- calcular preço justo de ações por diferentes métodos;
- comparar abordagens de valuation;
- cadastrar e organizar carteiras simuladas;
- acompanhar ativos por preço teto;
- visualizar métricas consolidadas em dashboards;
- gerar alertas automáticos quando o preço atual ultrapassar ou ficar abaixo do preço teto;
- apoiar decisões educacionais por meio de dados, simulações e projeções.

A proposta central é reunir, em um único ambiente, funcionalidades que normalmente ficam distribuídas entre planilhas, ferramentas pagas e plataformas separadas.

---

## Problema que o Projeto Resolve

Investidores iniciantes e intermediários enfrentam dificuldades para realizar análises fundamentalistas completas, pois muitas soluções existentes apresentam limitações como:

- funcionalidades fragmentadas;
- ausência de comparação entre métodos de valuation;
- baixa personalização dos cálculos;
- dificuldade para integrar análise de ativos com carteiras;
- falta de simulações consolidadas;
- dificuldade para acompanhar oportunidades de preço;
- dependência de planilhas manuais;
- restrições em planos gratuitos de plataformas de mercado.

O InvestSmart busca reduzir essa fragmentação por meio de uma solução própria, modular, navegável e evolutiva.

---

## Principais Diferenciais

- Calculadora multimétodo de preço justo.
- Métodos de Graham, Barsi e Preço Teto Projetivo.
- Persistência automática das análises realizadas.
- Histórico de cálculos por método.
- Autenticação com JWT.
- Refresh token em cookie HTTP-only.
- Renovação automática do access token.
- Rotas protegidas no frontend.
- Integração entre frontend React e backend Django REST Framework.
- Integração com Yahoo Finance via `yfinance`.
- Cache/fallback local de dados de mercado.
- CRUD de carteiras por usuário autenticado.
- CRUD de itens de carteira.
- Simulação consolidada de carteira.
- Priorização automática do preço teto.
- Eventos de alerta automático.
- Rotina periódica para verificação de alertas em produção.
- Tela específica para histórico de alertas.
- Dashboard com gráficos, KPIs, oportunidades e projeções.
- Deploy público em VPS com Docker Compose, Caddy e HTTPS.
- CI/CD com GitHub Actions, SonarCloud e deploy automático para produção.

---

## Stack Tecnológica

### Backend

- Python 3.11
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- yfinance
- python-dotenv
- coverage.py
- Gunicorn

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- Axios
- Recharts
- Vitest
- Testing Library
- CSS estruturado para layout responsivo

### Banco de Dados

- PostgreSQL no ambiente principal e de produção
- SQLite em memória para testes automatizados

### DevOps e Qualidade

- GitHub
- GitHub Actions
- SonarCloud
- Docker
- Docker Compose
- Caddy
- Nginx em container para servir o frontend
- Hostinger VPS
- Coverage
- Vitest Coverage

---

## Arquitetura

O projeto segue uma arquitetura **client-server em camadas**, separando apresentação, API, regras de negócio, persistência e integração externa.

```text
Usuário
  |
  | HTTPS
  v
Caddy
  |
  v
Frontend React/Vite servido por Nginx
  |
  | /api
  v
Backend Django REST Framework + Gunicorn
  |
  | ORM
  v
PostgreSQL
  |
  v
Yahoo Finance / yfinance
```

### Camadas

| Camada | Responsabilidade |
|---|---|
| Apresentação | Interface React, rotas, formulários, dashboards e componentes visuais |
| Proxy/HTTPS | Caddy como entrada pública com HTTPS automático |
| Servidor estático | Nginx em container servindo o build do frontend |
| API | Endpoints REST com Django REST Framework |
| Negócio | Serviços de valuation, simulação, alertas e sincronização de ativos |
| Persistência | Models Django e banco PostgreSQL |
| Integração externa | Consulta de cotações, indicadores e dividendos via Yahoo Finance |
| Rotina periódica | Scheduler em container para executar verificação de alertas |

---

## Funcionalidades

### Backend

- API REST modularizada.
- Separação por domínios:
  - `accounts`
  - `assets`
  - `valuation`
  - `portfolios`
- Autenticação JWT.
- Refresh token com cookie HTTP-only.
- Endpoint para recuperar usuário autenticado.
- CRUD de ativos.
- Sincronização de ativos com Yahoo Finance.
- Persistência de dividendos dos últimos 12 meses.
- Cálculo e persistência de análises.
- Histórico de análises por método.
- CRUD de carteiras.
- CRUD de itens de carteira.
- CRUD de alertas manuais por item.
- Simulação de carteira.
- Eventos de alerta automáticos.
- Marcação de alerta como lido.
- Verificação manual de alertas via endpoint.
- Comando de gerenciamento para verificação automática de preço.
- Testes unitários e de API.

### Frontend

- Projeto React com Vite.
- Organização por:
  - `app`
  - `components`
  - `contexts`
  - `pages`
  - `services`
- Tela de login.
- Gerenciamento global de autenticação com `AuthProvider`.
- Bootstrap automático da sessão.
- Renovação de access token via refresh token.
- Rotas protegidas.
- Layout principal com sidebar.
- Página inicial.
- Página do método Graham.
- Página do método Barsi.
- Página do método Projetivo.
- Página de carteiras.
- Página de alertas automáticos.
- Dashboard com gráficos e KPIs.
- Componentes reutilizáveis para formulários, cards, alertas, simulações e resumos.
- Testes automatizados com Vitest.

---

## Métodos de Valuation

### 1. Método Graham

Método utilizado para estimar o preço justo de uma ação com base em indicadores fundamentalistas clássicos.

#### Entradas principais

- Ativo
- LPA — Lucro por Ação
- VPA — Valor Patrimonial por Ação

#### Fórmula base

```text
Preço Justo = √(22.5 × LPA × VPA)
```

#### Saída

- Preço justo estimado

---

### 2. Método Barsi

Método focado em dividendos, utilizado para calcular o preço teto com base no dividendo anual e no dividend yield alvo.

#### Entradas principais

- Ativo
- Preço atual
- Dividend yield alvo
- Dividendos informados

#### Lógica base

```text
Dividendo Anual = soma dos dividendos informados
Preço Teto = Dividendo Anual / Dividend Yield Alvo
Margem = Preço Teto - Preço Atual
```

#### Saídas

- Dividendo anual
- Preço teto
- Margem de segurança
- Indicação de oportunidade

---

### 3. Preço Teto Projetivo

Método voltado para estimar o preço teto com base no dividendo por ação e no dividend yield médio.

#### Entradas principais

- Ativo
- DPA — Dividendo por Ação
- Dividend yield médio

#### Lógica base

```text
Preço Teto = DPA / Dividend Yield Médio
```

#### Saídas

- Preço bruto estimado
- Preço teto ajustado

---

## Carteiras e Simulação

O módulo de carteiras permite que o usuário autenticado organize ativos, quantidades, preços médios, preço teto manual e observações.

A simulação consolida os ativos de uma carteira e calcula métricas financeiras com base em:

- preço atual;
- quantidade;
- preço médio;
- valor investido;
- valor atual;
- preço teto;
- fonte do preço teto;
- retorno estimado;
- margem de segurança;
- oportunidades.

### Fontes de preço teto

A simulação utiliza a seguinte prioridade para resolver o preço de referência:

1. Preço teto manual definido no item da carteira.
2. Preço teto do método Projetivo.
3. Preço teto do método Barsi.
4. Preço justo de Graham como referência complementar.

### Endpoint

```http
GET /api/portfolios/{id}/simulation/
```

---

## Alertas Automáticos

O sistema possui um serviço de alertas para verificar o preço atual dos ativos em relação ao preço teto.

### Como funciona

1. O sistema busca os itens das carteiras dos usuários ativos.
2. Atualiza a cotação do ativo via Yahoo Finance, quando configurado para atualizar.
3. Resolve o preço teto do item.
4. Compara o preço atual com o preço teto.
5. Gera um evento de alerta quando o preço está abaixo, igual ou acima do preço teto.
6. Evita alertas duplicados dentro de uma janela de cooldown.
7. Permite marcar eventos como lidos.

### Rotina em produção

Em produção, o `docker-compose.prod.yml` possui um serviço `scheduler`, responsável por executar periodicamente o comando:

```bash
python manage.py check_price_alerts
```

A rotina atual executa a verificação em ciclos de aproximadamente 15 minutos.

### Tipos de evento

| Tipo | Descrição |
|---|---|
| `below_or_equal_ceiling` | Preço abaixo ou igual ao preço teto |
| `above_ceiling` | Preço acima do preço teto |

---

## Dashboard

O dashboard consolida os dados da carteira selecionada e apresenta uma visão rápida para tomada de decisão educacional.

### Recursos do dashboard

- Seleção de carteira.
- KPIs consolidados.
- Valor investido.
- Valor atual.
- Ganho ou perda não realizada.
- Total de oportunidades.
- Gráfico de alocação por ativo.
- Gráfico de preço atual versus preço teto.
- Lista de oportunidades.
- Lista de alertas recentes.
- Projeção de crescimento patrimonial com taxa anual simulada.
- Botão para verificar alertas manualmente.

---

## Fluxos de Negócio

### 1. Fluxo de autenticação

1. Usuário acessa `/login`.
2. Envia credenciais.
3. Backend valida os dados.
4. Access token é retornado.
5. Refresh token é gerenciado em cookie HTTP-only.
6. Frontend mantém a sessão autenticada.
7. Perfil do usuário é carregado via `/api/auth/me/`.
8. Rotas internas passam a ficar disponíveis.

### 2. Fluxo de valuation

1. Usuário escolhe um método de cálculo.
2. Seleciona ou informa um ativo.
3. Preenche os dados necessários.
4. Frontend envia os dados para a API.
5. Backend executa o cálculo.
6. Backend persiste a análise.
7. Resultado é retornado para a interface.
8. A análise fica disponível no histórico.

### 3. Fluxo de carteiras

1. Usuário autenticado cria uma carteira.
2. Adiciona ativos à carteira.
3. Informa quantidade e preço médio.
4. Define opcionalmente um preço teto manual.
5. Backend salva os dados vinculados ao usuário.
6. Frontend exibe posição, métricas e simulação.

### 4. Fluxo de simulação

1. Sistema busca os itens da carteira.
2. Resolve a melhor referência de preço teto.
3. Calcula métricas por ativo.
4. Consolida o resumo da carteira.
5. Identifica oportunidades.
6. Exibe os dados em cards, tabelas e gráficos.

### 5. Fluxo de alertas automáticos

1. Usuário acessa a tela de alertas ou o dashboard.
2. Aciona a verificação manual ou aguarda rotina periódica.
3. Sistema compara preço atual e preço teto.
4. Eventos de alerta são criados.
5. Usuário acompanha alertas novos e lidos.
6. Usuário pode marcar alertas como lidos.

---

## Endpoints Principais

### Auth

```http
POST /api/auth/login/
POST /api/auth/refresh/
POST /api/auth/logout/
GET  /api/auth/me/
```

### Assets

```http
GET    /api/assets/
POST   /api/assets/
GET    /api/assets/{id}/
PUT    /api/assets/{id}/
PATCH  /api/assets/{id}/
DELETE /api/assets/{id}/
```

### Valuation

```http
POST /api/valuation/graham/
POST /api/valuation/barsi/
POST /api/valuation/projected/
```

### Histórico de Valuation

```http
GET /api/valuation/graham/history/
GET /api/valuation/barsi/history/
GET /api/valuation/projected/history/
```

### Portfolios

```http
GET    /api/portfolios/
POST   /api/portfolios/
GET    /api/portfolios/{id}/
PUT    /api/portfolios/{id}/
PATCH  /api/portfolios/{id}/
DELETE /api/portfolios/{id}/
```

### Simulação

```http
GET /api/portfolios/{id}/simulation/
```

### Itens de Carteira

```http
GET    /api/portfolios/items/
POST   /api/portfolios/items/
GET    /api/portfolios/items/{id}/
PUT    /api/portfolios/items/{id}/
PATCH  /api/portfolios/items/{id}/
DELETE /api/portfolios/items/{id}/
```

### Eventos de Alerta Automático

```http
GET   /api/portfolios/alert-events/
POST  /api/portfolios/alert-events/check/
GET   /api/portfolios/alert-events/{id}/
PATCH /api/portfolios/alert-events/{id}/
PATCH /api/portfolios/alert-events/{id}/mark-as-read/
```

---

## Estrutura do Projeto

```text
InvestSmart/
├── .github/
│   └── workflows/
│       ├── sonar.yml
│       └── deploy-production.yml
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── assets/
│   │   ├── portfolios/
│   │   │   ├── management/
│   │   │   │   └── commands/
│   │   │   │       └── check_price_alerts.py
│   │   │   ├── services/
│   │   │   │   ├── alerts.py
│   │   │   │   └── simulation.py
│   │   │   └── tests/
│   │   └── valuation/
│   ├── config/
│   │   ├── settings.py
│   │   ├── settings_test.py
│   │   └── urls.py
│   ├── core/
│   ├── Dockerfile
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── nginx/
│   └── default.conf
├── Caddyfile
├── docker-compose.yml
├── docker-compose.prod.yml
├── sonar-project.properties
├── .env.production.example
└── README.md
```

---

## Rotas do Frontend

### Pública

```text
/login
```

### Protegidas

```text
/
/graham
/projected
/barsi
/portfolios
/alerts
```

---

## Variáveis de Ambiente

### Desenvolvimento

Crie um arquivo `.env` na raiz do projeto, ou configure as variáveis conforme o ambiente.

```env
POSTGRES_DB=investsmart
POSTGRES_USER=investsmart_user
POSTGRES_PASSWORD=investsmart_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
SECRET_KEY_DJANGO=your_secret_key
DEBUG=True

ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
AUTH_COOKIE_SECURE=False
AUTH_COOKIE_SAMESITE=Lax
AUTH_COOKIE_DOMAIN=
```

### Frontend local

Crie um arquivo `.env` dentro de `frontend/`, caso deseje definir explicitamente a URL base da API:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Produção

O arquivo real de produção deve existir somente na VPS:

```text
.env.production
```

Ele não deve ser enviado ao GitHub. O repositório deve conter apenas um exemplo seguro:

```text
.env.production.example
```

Exemplo:

```env
DEBUG=False
SECRET_KEY_DJANGO=change-me

POSTGRES_DB=investsmart
POSTGRES_USER=investsmart_user
POSTGRES_PASSWORD=change-me
POSTGRES_HOST=db
POSTGRES_PORT=5432

ALLOWED_HOSTS=investsmartlcs.com,www.investsmartlcs.com
CORS_ALLOWED_ORIGINS=https://investsmartlcs.com,https://www.investsmartlcs.com
CSRF_TRUSTED_ORIGINS=https://investsmartlcs.com,https://www.investsmartlcs.com

AUTH_COOKIE_SECURE=True
AUTH_COOKIE_SAMESITE=Lax
CSRF_COOKIE_SECURE=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SAMESITE=Lax
SESSION_COOKIE_SAMESITE=Lax

SECURE_SSL_REDIRECT=False
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=False
```

---

## Como Executar em Desenvolvimento

### 1. Clonar o repositório

```bash
git clone https://github.com/LucasCarvalhoSteffens/InvestSmart.git
cd InvestSmart
```

### 2. Criar e ativar o ambiente virtual

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux / macOS

```bash
python -m venv venv
source venv/bin/activate
```

### 3. Instalar as dependências do backend

```bash
pip install -r backend/requirements.txt
```

### 4. Subir o banco de dados local

```bash
docker compose up -d
```

### 5. Aplicar as migrations

```bash
cd backend
python manage.py migrate
```

### 6. Criar um superusuário

```bash
python manage.py createsuperuser
```

### 7. Subir o backend

Ainda dentro da pasta `backend/`:

```bash
python manage.py runserver
```

Backend disponível em:

```text
http://127.0.0.1:8000
```

### 8. Instalar as dependências do frontend

Em outro terminal:

```bash
cd frontend
npm install
```

### 9. Rodar o frontend

```bash
npm run dev
```

Frontend disponível em:

```text
http://localhost:5173
```

---

## Deploy em Produção

A aplicação está publicada em uma VPS da Hostinger com Docker Compose.

### Ambiente de produção

- Provedor: Hostinger VPS
- Entrada pública: Caddy
- HTTPS: Caddy com certificado automático
- Frontend: React buildado e servido por Nginx em container
- Backend: Django + Gunicorn
- Banco de dados: PostgreSQL em container
- Rotina automática: container `scheduler`
- Domínio: https://investsmartlcs.com

### Serviços principais do `docker-compose.prod.yml`

| Serviço | Função |
|---|---|
| `db` | Banco PostgreSQL |
| `backend` | API Django REST com Gunicorn |
| `scheduler` | Executa verificação periódica de alertas |
| `frontend` | Build React servido por Nginx |
| `caddy` | Reverse proxy público com HTTPS |

### Comandos úteis na VPS

```bash
cd /opt/InvestSmart
```

Ver containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

Ver logs do backend:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 backend
```

Ver logs do scheduler:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 scheduler
```

Rodar migrations manualmente:

```bash
docker compose -f docker-compose.prod.yml run --rm backend python manage.py migrate
```

Coletar arquivos estáticos:

```bash
docker compose -f docker-compose.prod.yml run --rm backend python manage.py collectstatic --noinput
```

Subir a aplicação:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

---

## CI/CD

O projeto utiliza GitHub Actions para integração contínua, análise de qualidade e deploy automatizado em produção.

### Fluxo atual

```text
Push/Merge na branch main
  |
  v
Workflow SonarCloud
  |
  | executa testes backend
  | executa testes frontend
  | gera relatórios de cobertura
  | envia análise para SonarCloud
  v
Se o SonarCloud finalizar com sucesso
  |
  v
Workflow Deploy Production
  |
  | conecta na VPS via SSH
  | atualiza código com git fetch/reset
  | valida arquivos obrigatórios
  | executa docker compose build
  | aplica migrations
  | executa collectstatic
  | sobe containers em produção
  v
Aplicação atualizada em https://investsmartlcs.com
```

### Workflows

```text
.github/workflows/sonar.yml
.github/workflows/deploy-production.yml
```

### Secrets necessários no GitHub

Os secrets são configurados em:

```text
Settings → Secrets and variables → Actions
```

Secrets utilizados:

```text
SONAR_TOKEN
VPS_HOST
VPS_PORT
VPS_USER
VPS_SSH_KEY
VPS_PROJECT_PATH
```

### Deploy manual

Também é possível executar o deploy manualmente pelo GitHub:

```text
Actions → Deploy Production → Run workflow
```

---

## Testes e Cobertura

### Backend

O backend possui configuração específica para testes com `settings_test.py`.

Rodar testes:

```bash
cd backend
python manage.py test --settings=config.settings_test
```

Rodar com coverage:

```bash
cd backend
coverage run manage.py test --settings=config.settings_test
coverage report
coverage xml -o coverage.xml
```

### Frontend

Rodar testes:

```bash
cd frontend
npm test
```

Rodar testes com cobertura:

```bash
cd frontend
npm run test:coverage
```

### Estratégia de cobertura

O projeto utiliza duas estratégias de validação de cobertura:

- Backend: cobertura analisada pelo SonarCloud a partir de `backend/coverage.xml`.
- Frontend: cobertura validada no CI com Vitest, gerando `frontend/coverage/lcov.info`.

Essa separação foi adotada porque o SonarCloud Free utiliza Quality Gate padrão para código novo, enquanto os critérios acadêmicos do projeto exigem cobertura mínima específica para backend e frontend.

### Metas acadêmicas

| Camada | Meta mínima |
|---|---:|
| Backend | 75% |
| Frontend | 25% |

---

## Qualidade de Código

O projeto utiliza SonarCloud para acompanhar:

- bugs;
- vulnerabilidades;
- code smells;
- duplicação de código;
- cobertura;
- qualidade em código novo.

O workflow `SonarCloud` é executado em:

- push na `main`;
- push na `master`;
- push na `Dev`;
- pull requests.

---

## Segurança

Medidas aplicadas ou previstas no projeto:

- autenticação com JWT;
- refresh token em cookie HTTP-only;
- rotas protegidas no frontend;
- variáveis sensíveis fora do repositório;
- `.env.production` mantido somente na VPS;
- HTTPS em produção;
- CORS e CSRF configurados por ambiente;
- uso de ORM do Django para reduzir risco de SQL Injection;
- senhas gerenciadas pelo sistema de autenticação do Django;
- separação entre ambiente de desenvolvimento, testes e produção.

---

## Checklist para Finalização do Portfólio

### Concluído

- [x] Repositório público no GitHub.
- [x] Backend Django REST Framework.
- [x] Frontend React/Vite.
- [x] PostgreSQL.
- [x] Autenticação JWT.
- [x] Refresh token com cookie HTTP-only.
- [x] Calculadora Graham.
- [x] Calculadora Barsi.
- [x] Calculadora Projetiva.
- [x] CRUD de carteiras.
- [x] Simulação de carteiras.
- [x] Dashboard com KPIs e gráficos.
- [x] Alertas automáticos.
- [x] Scheduler de alertas em produção.
- [x] Integração com Yahoo Finance.
- [x] Testes automatizados backend.
- [x] Testes automatizados frontend.
- [x] SonarCloud.
- [x] Deploy público em VPS.
- [x] HTTPS em produção.
- [x] CI/CD com deploy automático após análise de qualidade.

### Pendente para fechamento acadêmico

- [ ] Criar ou atualizar documentação final em `/docs` ou GitHub Wiki.
- [ ] Criar diagrama C4 atualizado da arquitetura em produção.
- [ ] Documentar user stories ou casos de uso finais.
- [ ] Documentar instruções de deploy com prints da VPS e GitHub Actions.
- [ ] Adicionar ferramenta de observabilidade/monitoramento.
- [ ] Registrar evidências de monitoramento em produção.
- [ ] Registrar prints dos principais fluxos funcionando no domínio público.
- [ ] Registrar validação com usuários reais ou colegas.
- [ ] Registrar evidências das orientações com professor/orientador.
- [ ] Criar roteiro de apresentação para o Demo Day.
- [ ] Criar pôster A0 com QR Code para a aplicação.
- [ ] Criar QR Code para GitHub, documentação e vídeo demo.
- [ ] Gravar vídeo curto de demonstração.
- [ ] Criar tag/release `v1.0.0` quando a versão final estiver estável.

### Sugestão de próximos passos

1. Configurar observabilidade com Uptime Kuma, UptimeRobot, Grafana Cloud, New Relic ou ferramenta equivalente.
2. Criar a pasta `/docs` ou GitHub Wiki.
3. Adicionar diagramas C4 e roteiro técnico da arquitetura.
4. Tirar prints da aplicação em produção.
5. Validar todos os fluxos em produção com pelo menos um usuário externo.
6. Criar o pôster do Demo Day com QR Code para `https://investsmartlcs.com`.

---

## Contexto Acadêmico

Projeto desenvolvido para a disciplina de Portfólio em Engenharia de Software.

### Linha de projeto

Aplicações Web.

### Aderência à linha Web Apps

O projeto contempla:

- aplicação web completa;
- interface navegável;
- arquitetura client-server em camadas;
- backend próprio;
- banco de dados relacional persistente;
- deploy público em nuvem;
- CI/CD;
- testes automatizados;
- análise estática de código;
- documentação técnica;
- três ou mais fluxos de negócio completos;
- integração com API externa;
- uso de Docker;
- autenticação e segurança básica.

---

## Licença

Este projeto é distribuído sob a licença MIT, permitindo uso, modificação e distribuição, desde que mantidos os créditos autorais originais.

---

## Autor

**Lucas de Carvalho Steffens**  
Engenharia de Software — Católica de Santa Catarina

GitHub: https://github.com/LucasCarvalhoSteffens
