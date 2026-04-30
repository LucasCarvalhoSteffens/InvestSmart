# InvestSmart

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=bugs)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)

Plataforma web para análise fundamentalista de ações, cálculo multimétodo de preço justo, simulação de carteiras de investimento, dashboards financeiros e alertas automáticos de preço em relação ao preço teto.

O InvestSmart foi desenvolvido como projeto de Portfólio em Engenharia de Software, com foco em aplicar arquitetura em camadas, autenticação JWT, integração com dados externos, persistência real, testes automatizados, CI/CD e análise contínua de qualidade de código.

> **Status:** em desenvolvimento  
> **Branch principal:** `main`  
> **Branch de evolução:** `Dev`  
> **Última atualização considerada:** branch `main`, branch `Dev` e PR #18  
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
- [Modelos Principais](#modelos-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas do Frontend](#rotas-do-frontend)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Como Testar](#como-testar)
- [Testes Automatizados](#testes-automatizados)
- [Cobertura de Testes](#cobertura-de-testes)
- [Qualidade de Código](#qualidade-de-código)
- [Segurança](#segurança)
- [Roadmap](#roadmap)
- [Contexto Acadêmico](#contexto-acadêmico)
- [Licença](#licença)
- [Autor](#autor)

---

## Objetivo

O objetivo do InvestSmart é oferecer uma plataforma web integrada para auxiliar investidores pessoa física no estudo de análise fundamentalista.

A aplicação permite:

- calcular preço justo de ações por diferentes métodos;
- comparar abordagens de valuation;
- cadastrar e organizar carteiras simuladas;
- acompanhar ativos por preço teto;
- visualizar métricas consolidadas em dashboards;
- gerar alertas automáticos quando o preço atual ultrapassar ou ficar abaixo do preço teto;
- apoiar decisões educacionais por meio de dados, simulações e projeções.

A proposta central é reunir em um único ambiente funcionalidades que normalmente ficam distribuídas entre planilhas, ferramentas pagas e plataformas separadas.

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
- Refresh token com cookie HTTP-only.
- Renovação automática do access token.
- Rotas protegidas no frontend.
- Integração entre frontend React e backend Django REST Framework.
- CRUD de ativos.
- Integração com Yahoo Finance via `yfinance`.
- Cache local de dados de mercado.
- CRUD de carteiras por usuário autenticado.
- CRUD de itens de carteira.
- Alertas manuais por item.
- Simulação consolidada de carteira.
- Priorização automática do preço teto.
- Eventos de alerta automático.
- Tela específica para histórico de alertas.
- Dashboard com gráficos, KPIs, oportunidades e projeções.
- Testes automatizados no backend.
- Testes automatizados no frontend com Vitest.
- Pipeline de qualidade com GitHub Actions e SonarCloud.

---

## Stack Tecnológica

### Backend

- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- yfinance
- python-dotenv
- coverage.py

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

- PostgreSQL no ambiente principal
- SQLite em memória para testes automatizados

### DevOps e Qualidade

- GitHub
- GitHub Actions
- SonarCloud
- Docker
- Docker Compose
- Coverage
- Vitest Coverage

---

## Arquitetura

O projeto segue uma arquitetura **client-server em camadas**, separando apresentação, API, regras de negócio, persistência e integração externa.

```text
Frontend React/Vite
        |
        | HTTP/JSON
        v
Backend Django REST Framework
        |
        | ORM
        v
PostgreSQL
        |
        | Integração externa
        v
Yahoo Finance / yfinance
```

### Camadas

| Camada | Responsabilidade |
|---|---|
| Apresentação | Interface React, rotas, formulários, dashboards e componentes visuais |
| API | Endpoints REST com Django REST Framework |
| Negócio | Serviços de valuation, simulação, alertas e sincronização de ativos |
| Persistência | Models Django e banco PostgreSQL |
| Integração externa | Consulta de cotações, indicadores e dividendos via Yahoo Finance |

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
- Componentes reutilizáveis para:
  - formulários de carteira;
  - formulários de ativos;
  - alertas;
  - cards de resultado;
  - painel de simulação;
  - resumo de carteira.
- Testes automatizados com Vitest.

---

## Métodos de Valuation

### 1. Método Graham

Método utilizado para estimar o preço justo de uma ação com base em indicadores fundamentalistas clássicos.

#### Entradas principais

- Ativo
- LPA - Lucro por Ação
- VPA - Valor Patrimonial por Ação

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
- DPA - Dividendo por Ação
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

### Métricas calculadas

- Total de itens da carteira.
- Itens cobertos por algum preço de referência.
- Itens sem cobertura.
- Valor total investido.
- Valor atual da carteira.
- Ganho ou perda não realizada.
- Percentual de ganho ou perda.
- Valor alvo total.
- Retorno estimado.
- Percentual de retorno estimado.
- Quantidade de oportunidades.
- Margem até o preço teto.
- Valor de oportunidade por ativo.

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
3. Resolve o preço teto do item:
   - preço manual;
   - preço teto projetivo;
   - preço teto Barsi.
4. Compara o preço atual com o preço teto.
5. Gera um evento de alerta quando:
   - o preço está abaixo ou igual ao preço teto;
   - o preço está acima do preço teto.
6. Evita alertas duplicados dentro de uma janela de cooldown.
7. Permite marcar eventos como lidos.

### Tipos de evento

| Tipo | Descrição |
|---|---|
| `below_or_equal_ceiling` | Preço abaixo ou igual ao preço teto |
| `above_ceiling` | Preço acima do preço teto |

### Verificação manual de alertas

```http
POST /api/portfolios/alert-events/check/
```

#### Exemplo de corpo da requisição

```json
{
  "portfolio_id": 1,
  "cooldown_hours": 24,
  "force_refresh": true
}
```

### Marcar alerta como lido

```http
PATCH /api/portfolios/alert-events/{id}/mark-as-read/
```

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

### Bibliotecas utilizadas

- Recharts para gráficos.
- React para componentização.
- Axios para integração com a API.

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

---

### 2. Fluxo de valuation

1. Usuário escolhe um método de cálculo.
2. Seleciona ou informa um ativo.
3. Preenche os dados necessários.
4. Frontend envia os dados para a API.
5. Backend executa o cálculo.
6. Backend persiste a análise.
7. Resultado é retornado para a interface.
8. A análise fica disponível no histórico.

---

### 3. Fluxo de carteiras

1. Usuário autenticado cria uma carteira.
2. Adiciona ativos à carteira.
3. Informa quantidade e preço médio.
4. Define opcionalmente um preço teto manual.
5. Cria alertas manuais por ativo.
6. Backend salva os dados vinculados ao usuário.
7. Frontend exibe posição, métricas e simulação.

---

### 4. Fluxo de simulação

1. Sistema busca os itens da carteira.
2. Resolve a melhor referência de preço teto.
3. Calcula métricas por ativo.
4. Consolida o resumo da carteira.
5. Identifica oportunidades.
6. Exibe os dados em cards, tabelas e gráficos.

---

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

### Alertas Manuais por Item

```http
GET    /api/portfolios/alerts/
POST   /api/portfolios/alerts/
GET    /api/portfolios/alerts/{id}/
PUT    /api/portfolios/alerts/{id}/
PATCH  /api/portfolios/alerts/{id}/
DELETE /api/portfolios/alerts/{id}/
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

## Modelos Principais

### Accounts

- Usuário padrão do Django.
- Autenticação via JWT.
- Access token.
- Refresh token.
- Refresh token com cookie HTTP-only.

### Assets

- `Asset`
- `Dividend`

### Valuation

- `GrahamAnalysis`
- `BarsiAnalysis`
- `ProjectedAnalysis`

### Portfolios

- `Portfolio`
- `PortfolioItem`
- `PortfolioItemAlert`
- `PortfolioAlertEvent`

---

## Estrutura do Projeto

```text
InvestSmart/
├── .github/
│   └── workflows/
│       └── sonar.yml
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   │   └── api/
│   │   ├── assets/
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   └── tests/
│   │   ├── portfolios/
│   │   │   ├── api/
│   │   │   ├── management/
│   │   │   │   └── commands/
│   │   │   │       └── check_price_alerts.py
│   │   │   ├── services/
│   │   │   │   ├── alerts.py
│   │   │   │   └── simulation.py
│   │   │   └── tests/
│   │   └── valuation/
│   │       ├── api/
│   │       └── tests/
│   ├── config/
│   │   ├── settings.py
│   │   ├── settings_test.py
│   │   └── urls.py
│   ├── core/
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   └── routes.jsx
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   │   ├── AlertEventsPage.jsx
│   │   │   ├── BarsiPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── GrahamPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PortfolioSimulatorPage.jsx
│   │   │   ├── PortfoliosPage.jsx
│   │   │   └── ProjectedPage.jsx
│   │   ├── services/
│   │   ├── test/
│   │   └── styles.css
│   ├── coverage/
│   │   └── lcov.info
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── docker-compose.yml
├── requirements.txt
├── sonar-project.properties
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

Crie um arquivo `.env` na raiz do projeto.

### Exemplo base

```env
POSTGRES_DB=investsmart
POSTGRES_USER=investsmart_user
POSTGRES_PASSWORD=investsmart_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
SECRET_KEY_DJANGO=your_secret_key
DEBUG=True
```

### Recomendado para desenvolvimento local com frontend separado

```env
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
CSRF_TRUSTED_ORIGINS=http://127.0.0.1:5173,http://localhost:5173
AUTH_COOKIE_SECURE=False
AUTH_COOKIE_SAMESITE=Lax
AUTH_COOKIE_DOMAIN=
```

### Variável opcional do frontend

Crie um arquivo `.env` dentro de `frontend/`, caso deseje definir explicitamente a URL base da API.

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## Como Executar o Projeto

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
pip install -r requirements.txt
```

### 4. Subir o banco de dados com Docker

```bash
docker compose up -d
```

### 5. Aplicar as migrations

```bash
cd backend
python manage.py makemigrations
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

## Como Testar

### Fluxo mínimo recomendado para validação manual

1. Iniciar backend e frontend.
2. Criar ou utilizar um usuário válido.
3. Fazer login no sistema.
4. Validar restauração da sessão.
5. Validar carregamento do usuário autenticado.
6. Garantir que existam ativos cadastrados.
7. Acessar as páginas de valuation.
8. Executar cálculos de Graham, Barsi e Projetivo.
9. Validar se os resultados são exibidos corretamente.
10. Conferir se as análises foram persistidas.
11. Criar uma carteira.
12. Adicionar ativos à carteira.
13. Definir preço teto manual ou utilizar análises existentes.
14. Executar a simulação.
15. Criar alertas por ativo.
16. Acessar a tela de alertas.
17. Executar a verificação de alertas.
18. Validar dashboard, gráficos, KPIs e oportunidades.

### Acesso ao Admin

```text
http://127.0.0.1:8000/admin/
```

---

## Testes Automatizados

O backend possui configuração específica para testes com `settings_test.py`.

### Rodar testes do backend

```bash
cd backend
python manage.py test --settings=config.settings_test
```

### Rodar testes específicos

```bash
cd backend
python manage.py test apps.accounts.tests apps.assets.tests apps.valuation.tests apps.portfolios.tests --settings=config.settings_test --verbosity 2
```

### Rodar com coverage

```bash
cd backend
coverage run manage.py test --settings=config.settings_test
coverage report
coverage xml -o coverage.xml
```

### Rodar testes do frontend

```bash
cd frontend
npm test
```

### Rodar testes do frontend com cobertura

```bash
cd frontend
npm run coverage
```

### Ambiente de testes

O ambiente de testes utiliza:

- SQLite em memória no backend;
- hasher simplificado para senhas;
- configurações específicas em `settings_test.py`;
- isolamento do banco principal;
- ajustes de segurança adequados para execução automatizada;
- Vitest para testes unitários do frontend;
- Testing Library para validação de componentes React.

---

## Cobertura de Testes

O projeto utiliza duas estratégias de validação de cobertura, separando backend e frontend conforme as ferramentas utilizadas no pipeline de qualidade.

### Backend

A cobertura do backend é analisada pelo SonarCloud a partir do relatório gerado em:

```text
backend/coverage.xml
```

Esse relatório é produzido durante a execução dos testes automatizados com `coverage.py` e enviado ao SonarCloud pelo workflow do GitHub Actions.

### Frontend

A cobertura do frontend é validada diretamente no CI com Vitest, gerando o relatório em:

```text
frontend/coverage/lcov.info
```

Os limites mínimos de cobertura do frontend são definidos no arquivo:

```text
frontend/vite.config.js
```

### Justificativa da separação

Essa separação foi adotada porque o SonarCloud Free utiliza o Quality Gate padrão **Sonar way**, que considera cobertura mínima de **80% em código novo**.

No entanto, os critérios acadêmicos do projeto exigem metas específicas por camada:

| Camada | Meta mínima de cobertura |
|---|---:|
| Backend | 75% |
| Frontend | 25% |

Dessa forma, o backend permanece integrado à análise do SonarCloud, enquanto o frontend é validado no pipeline por meio do Vitest e dos thresholds configurados no `vite.config.js`.

---

## Qualidade de Código

O projeto possui integração com SonarCloud e workflow no GitHub Actions.

### Configuração atual

- Project Key: `LucasCarvalhoSteffens_InvestSmart`
- Organization: `lucascarvalhosteffens`
- Workflow: `.github/workflows/sonar.yml`
- Arquivo de configuração: `sonar-project.properties`
- Pipeline com:
  - instalação de dependências;
  - execução de testes do backend;
  - execução de testes do frontend;
  - geração de coverage do backend;
  - geração de coverage do frontend;
  - análise no SonarCloud;
  - validação de thresholds mínimos do frontend no Vitest.

### Comando usado no pipeline para backend

```bash
coverage run backend/manage.py test apps.accounts.tests apps.assets.tests apps.valuation.tests apps.portfolios.tests --settings=config.settings_test --verbosity 2
coverage xml -o backend/coverage.xml
coverage report -m
```

### Comando usado no pipeline para frontend

```bash
cd frontend
npm ci
npm run coverage
```

---

## Segurança

O projeto aplica práticas básicas de segurança para aplicações web modernas.

### Recursos implementados

- Autenticação baseada em JWT.
- Access token com tempo de vida reduzido.
- Refresh token com rotação.
- Blacklist de refresh token após rotação.
- Refresh token em cookie HTTP-only.
- Rotas protegidas no frontend.
- Proteção padrão das APIs com autenticação.
- Uso de variáveis de ambiente para dados sensíveis.
- Configurações de CORS e CSRF por ambiente.
- Senhas armazenadas com os mecanismos seguros do Django.
- Uso do ORM do Django para reduzir risco de SQL Injection.
- Configurações de segurança para produção quando `DEBUG=False`.

### Aviso de uso

O InvestSmart não realiza ordens de compra ou venda, não se conecta a corretoras e não substitui análise profissional. A aplicação é voltada para estudo, simulação e apoio educacional em análise fundamentalista.

---

## Roadmap

### Concluído ou em funcionamento

- Estrutura backend com Django REST Framework.
- Estrutura frontend com React e Vite.
- Autenticação JWT.
- Refresh token com cookie HTTP-only.
- Rotas protegidas.
- CRUD de ativos.
- Integração com Yahoo Finance.
- Métodos de valuation:
  - Graham;
  - Barsi;
  - Projetivo.
- Histórico de análises.
- CRUD de carteiras.
- CRUD de itens de carteira.
- Alertas manuais por item.
- Simulação consolidada de carteira.
- Eventos de alerta automático.
- Tela de alertas automáticos.
- Dashboard com gráficos e KPIs.
- Pipeline SonarCloud.
- Testes automatizados no backend.
- Testes automatizados no frontend.
- Validação separada de cobertura para backend e frontend.

### Em evolução

- Melhorias de UI/UX e responsividade.
- Refinamento visual dos dashboards.
- Ampliação dos testes de integração.
- Documentação complementar de arquitetura.
- Deploy público.
- Observabilidade em ambiente produtivo.
- Validação com usuários reais.
- Poster + Demo Day.

---

## Contexto Acadêmico

Este projeto foi desenvolvido para a disciplina de Portfólio do curso de Engenharia de Software.

A proposta atende à linha de **Web Apps**, contemplando:

- aplicação web navegável;
- frontend e backend próprios;
- arquitetura client-server;
- persistência real com banco relacional;
- integração com API externa;
- autenticação;
- testes automatizados;
- CI/CD;
- análise estática de qualidade;
- documentação técnica;
- evolução incremental por branches e pull requests.

---

## Autor

**Lucas de Carvalho Steffens**

Projeto de Portfólio  
Engenharia de Software  
Católica de Santa Catarina

GitHub: https://github.com/LucasCarvalhoSteffens  
Repositório: https://github.com/LucasCarvalhoSteffens/InvestSmart
