# InvestSmart

![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=alert_status)
![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=bugs)
![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=vulnerabilities)
![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=code_smells)
![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=coverage)
![Duplicated Lines](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=duplicated_lines_density)

Plataforma web para análise fundamentalista de ações, cálculo multimétodo de preço justo, simulação de carteiras de investimento e alertas automáticos de preço em relação ao preço teto.

O InvestSmart foi desenvolvido como projeto de Portfólio em Engenharia de Software, com foco em aplicar arquitetura em camadas, autenticação JWT, integração com dados externos, persistência real, testes automatizados, CI/CD e análise contínua de qualidade de código.

> Status do projeto: em desenvolvimento  
> Branch de referência: `main`  
> Natureza do projeto: acadêmico/profissional  
> Observação: este sistema possui finalidade educacional e de apoio à análise. Não constitui recomendação de investimento.

---

## Sumário

- [Objetivo](#objetivo)
- [Problema que o Projeto Resolve](#problema-que-o-projeto-resolve)
- [Principais Diferenciais](#principais-diferenciais)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Funcionalidades Implementadas](#funcionalidades-implementadas)
- [Métodos de Valuation](#métodos-de-valuation)
- [Simulação de Carteiras](#simulação-de-carteiras)
- [Alertas Automáticos](#alertas-automáticos)
- [Fluxos de Negócio](#fluxos-de-negócio)
- [Endpoints Principais](#endpoints-principais)
- [Modelos Principais](#modelos-principais)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Como Testar](#como-testar)
- [Qualidade de Código](#qualidade-de-código)
- [Roadmap](#roadmap)
- [Contexto Acadêmico](#contexto-acadêmico)
- [Autor](#autor)

---

## Objetivo

O objetivo do InvestSmart é oferecer uma plataforma web integrada para auxiliar investidores pessoa física no estudo de análise fundamentalista, permitindo calcular preço justo de ações, comparar métodos de valuation, organizar carteiras simuladas e acompanhar oportunidades por meio de alertas.

A proposta central é reunir em um único ambiente funcionalidades que normalmente ficam distribuídas entre diferentes plataformas, planilhas ou ferramentas pagas.

---

## Problema que o Projeto Resolve

Investidores iniciantes e intermediários enfrentam dificuldades para analisar ações de forma organizada, pois muitas ferramentas disponíveis apresentam limitações como:

- funcionalidades fragmentadas;
- ausência de comparação entre métodos de valuation;
- pouca personalização nos cálculos;
- baixa integração entre análise de ativos e carteira;
- dificuldade para acompanhar oportunidades de preço;
- dependência de planilhas manuais;
- restrições em planos gratuitos de plataformas de mercado.

O InvestSmart busca reduzir essa fragmentação por meio de uma solução própria, modular e evolutiva.

---

## Principais Diferenciais

- Calculadora multimétodo de preço justo.
- Métodos de Graham, Barsi e Preço Teto Projetivo.
- Persistência automática das análises realizadas.
- Histórico de cálculos por método.
- Autenticação com JWT e refresh token.
- Refresh token com cookie HTTP-only.
- Rotas protegidas no frontend.
- Integração do frontend React com backend Django REST Framework.
- CRUD de ativos.
- CRUD de carteiras por usuário autenticado.
- CRUD de itens de carteira.
- Simulação consolidada de carteira.
- Priorização automática de preço teto por fonte.
- Alertas automáticos de preço vs. preço teto.
- Eventos de alerta com leitura/não leitura.
- Integração com Yahoo Finance via `yfinance`.
- Cache local de dados de mercado.
- Testes automatizados no backend.
- SonarCloud integrado ao GitHub Actions.

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
- CSS modularizado por estrutura de componentes

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

---

## Arquitetura

O projeto segue uma arquitetura client-server em camadas.

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

- **Camada de Apresentação:** frontend React, responsável pela navegação, telas, formulários e exibição dos resultados.
- **Camada de API:** Django REST Framework, responsável pelos endpoints REST.
- **Camada de Negócio:** serviços de valuation, simulação de carteira, alertas e sincronização de ativos.
- **Camada de Persistência:** modelos Django e banco PostgreSQL.
- **Camada de Integração Externa:** serviço de consulta ao Yahoo Finance via `yfinance`.

---

## Funcionalidades Implementadas

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
- Renovação de access token via refresh.
- Rotas protegidas.
- Página inicial.
- Página do método Graham.
- Página do método Barsi.
- Página do método Projetivo.
- Página de carteiras.
- Integração com APIs de:
  - autenticação;
  - ativos;
  - valuation;
  - carteiras.

### Qualidade

- Pipeline com GitHub Actions.
- Integração com SonarCloud.
- Execução de testes com coverage.
- Configuração de ambiente de testes isolado.
- Separação entre settings de desenvolvimento e settings de teste.

---

## Métodos de Valuation

### 1. Método Graham

Método utilizado para estimar o preço justo de uma ação com base no lucro por ação e no valor patrimonial por ação.

#### Entradas

- Ativo
- LPA
- VPA

#### Fórmula

```text
Preço Justo = √(22.5 × LPA × VPA)
```

#### Saída

- Preço justo estimado

---

### 2. Método Barsi

Método focado em dividendos, usado para calcular o preço teto de uma ação considerando o dividendo anual e o dividend yield alvo.

#### Entradas

- Ativo
- Preço atual
- Dividend yield alvo
- Dividendos informados

#### Lógica

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

#### Entradas

- Ativo
- DPA
- Dividend yield médio

#### Lógica

```text
Preço Teto = DPA / Dividend Yield Médio
```

#### Saídas

- Preço bruto
- Preço teto ajustado

---

## Simulação de Carteiras

O módulo de simulação consolida os ativos de uma carteira e calcula métricas financeiras com base em preços atuais, preço médio, quantidade e preço teto.

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
2. Atualiza a cotação do ativo via Yahoo Finance, se configurado para atualizar.
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

- `below_or_equal_ceiling`: preço abaixo ou igual ao preço teto.
- `above_ceiling`: preço acima do preço teto.

### Endpoint para verificar alertas

```http
POST /api/portfolios/alert-events/check/
```

### Exemplo de corpo da requisição

```json
{
  "portfolio_id": 1,
  "cooldown_hours": 24,
  "force_refresh": true
}
```

### Comando de gerenciamento

Também é possível executar a verificação via terminal:

```bash
python manage.py check_price_alerts
```

Com opções:

```bash
python manage.py check_price_alerts --no-refresh
python manage.py check_price_alerts --cooldown-hours 12
python manage.py check_price_alerts --portfolio-id 1
```

Esse comando pode ser usado posteriormente em cronjob, agendador do servidor ou container para executar a rotina de forma periódica.

---

## Fluxos de Negócio

### 1. Fluxo de autenticação

1. O usuário acessa a tela de login.
2. Envia usuário e senha.
3. O backend valida as credenciais.
4. O access token é retornado.
5. O refresh token é controlado via cookie HTTP-only.
6. O frontend carrega o usuário autenticado por `/api/auth/me/`.
7. As rotas protegidas são liberadas.
8. Caso o access token expire, o frontend tenta renová-lo.

---

### 2. Fluxo de valuation

1. O usuário escolhe o método de cálculo.
2. Seleciona ou informa o ativo.
3. Preenche os indicadores necessários.
4. O frontend envia os dados para a API.
5. O backend executa o cálculo.
6. A análise é persistida no banco.
7. O resultado é retornado para o frontend.
8. O histórico fica disponível para consulta.

---

### 3. Fluxo de carteira

1. O usuário autenticado cria uma carteira.
2. Adiciona ativos à carteira.
3. Informa quantidade, preço médio e observações.
4. Pode definir preço teto manual.
5. Pode cadastrar alertas manuais por item.
6. O sistema calcula os totais da carteira.

---

### 4. Fluxo de simulação

1. O usuário acessa a simulação de uma carteira.
2. O backend busca todos os itens da carteira.
3. O sistema resolve o preço teto de cada ativo.
4. Calcula métricas individuais e consolidadas.
5. Retorna resumo da carteira e lista de ativos simulados.

---

### 5. Fluxo de alertas automáticos

1. A rotina de alertas é executada via API ou comando.
2. O sistema atualiza cotações, quando habilitado.
3. Compara preço atual com preço teto.
4. Gera eventos de alerta.
5. Evita duplicidade por cooldown.
6. O usuário consulta os eventos no frontend.
7. O usuário pode marcar alertas como lidos.

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
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   │   ├── BarsiPage.jsx
│   │   │   ├── GrahamPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── PortfoliosPage.jsx
│   │   │   └── ProjectedPage.jsx
│   │   └── services/
│   │       ├── assetsApi.js
│   │       ├── authApi.jsx
│   │       ├── http.js
│   │       ├── portfoliosApi.js
│   │       └── valuationApi.js
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

### Públicas

```text
/login
```

### Protegidas

```text
/
 /graham
 /barsi
 /projected
 /portfolios
```

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto.

### Backend

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

### Frontend

Crie um arquivo `.env` dentro de `frontend/`, se quiser configurar a URL da API explicitamente:

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

---

### 2. Criar e ativar o ambiente virtual

#### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

#### Linux/macOS

```bash
python -m venv venv
source venv/bin/activate
```

---

### 3. Instalar as dependências do backend

```bash
pip install -r requirements.txt
```

---

### 4. Subir o banco de dados com Docker

```bash
docker compose up -d
```

---

### 5. Aplicar as migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

---

### 6. Criar superusuário

```bash
python manage.py createsuperuser
```

---

### 7. Subir o backend

Ainda dentro da pasta `backend/`:

```bash
python manage.py runserver
```

Backend disponível em:

```text
http://127.0.0.1:8000
```

Admin disponível em:

```text
http://127.0.0.1:8000/admin/
```

---

### 8. Instalar as dependências do frontend

Em outro terminal:

```bash
cd frontend
npm install
```

---

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

### Rodar todos os testes

A partir da pasta `backend/`:

```bash
python manage.py test --settings=config.settings_test
```

### Rodar testes com coverage

```bash
coverage run manage.py test --settings=config.settings_test
coverage report
coverage xml -o coverage.xml
```

### Rodar testes específicos

```bash
python manage.py test apps.accounts.tests --settings=config.settings_test
python manage.py test apps.assets.tests --settings=config.settings_test
python manage.py test apps.valuation.tests --settings=config.settings_test
python manage.py test apps.portfolios.tests --settings=config.settings_test
```

---

## Fluxo Mínimo de Validação Manual

1. Subir o PostgreSQL com Docker.
2. Subir o backend.
3. Subir o frontend.
4. Criar um superusuário.
5. Cadastrar ativos no Admin ou via API.
6. Acessar o frontend.
7. Realizar login.
8. Executar cálculos Graham, Barsi e Projetivo.
9. Validar se as análises foram persistidas.
10. Criar uma carteira.
11. Adicionar itens à carteira.
12. Executar a simulação da carteira.
13. Criar alertas por item.
14. Executar a verificação de alertas.
15. Consultar eventos de alerta.
16. Marcar eventos como lidos.

---

## Qualidade de Código

O projeto utiliza SonarCloud para análise contínua de qualidade, segurança e cobertura.

### Configuração

```text
Project Key: LucasCarvalhoSteffens_InvestSmart
Organization: lucascarvalhosteffens
```

### Métricas acompanhadas

- Quality Gate
- Bugs
- Vulnerabilities
- Code Smells
- Coverage
- Duplicated Lines

### Pipeline

O workflow do GitHub Actions executa:

1. Checkout do repositório.
2. Configuração do Python.
3. Instalação das dependências.
4. Execução dos testes.
5. Geração do relatório de coverage.
6. Envio da análise para o SonarCloud.

---

## Segurança

O projeto aplica práticas básicas de segurança para aplicações web:

- Autenticação com JWT.
- Refresh token via cookie HTTP-only.
- Proteção de rotas no frontend.
- Separação de variáveis sensíveis em `.env`.
- Uso de CORS e CSRF configuráveis por ambiente.
- Uso do ORM do Django para reduzir risco de SQL Injection.
- Controle de acesso por usuário nas carteiras.
- Validação de entradas nos serializers.
- Isolamento entre ambiente de desenvolvimento e ambiente de testes.

---

## Integração com Dados de Mercado

O projeto possui integração com Yahoo Finance por meio da biblioteca `yfinance`.

### Dados tratados

- Ticker normalizado.
- Nome do ativo.
- Setor.
- Preço atual.
- Moeda.
- LPA.
- VPA.
- Dividendo anual.
- Dividend yield.
- Payout ratio.
- Quantidade de ações.
- Dividendos dos últimos 12 meses.

### Estratégias utilizadas

- Cache de dados por período definido.
- Tentativas automáticas em caso de falha.
- Fallback com dados já persistidos.
- Persistência dos dividendos no banco.

---

## Contexto Acadêmico

O InvestSmart foi desenvolvido para a disciplina de Portfólio em Engenharia de Software.

O projeto busca atender critérios técnicos como:

- repositório público no GitHub;
- histórico de commits;
- arquitetura definida;
- documentação técnica;
- funcionalidades reais;
- interface navegável;
- persistência em banco relacional;
- autenticação;
- testes automatizados;
- CI/CD;
- análise estática de código;
- preparação para deploy público;
- demonstração funcional para Poster + Demo Day.

---

## Status Atual

### Consolidado na branch `main`

- Backend Django REST Framework.
- Frontend React/Vite.
- Autenticação JWT.
- Refresh token.
- Recuperação do usuário autenticado.
- CRUD de ativos.
- Integração com Yahoo Finance.
- Cálculos Graham, Barsi e Projetivo.
- Histórico de análises.
- Carteiras por usuário.
- Itens de carteira.
- Alertas por item.
- Eventos de alerta automático.
- Simulação consolidada de carteira.
- Comando `check_price_alerts`.
- Testes automatizados.
- SonarCloud configurado.

### Em evolução

- Refinamento visual do frontend.
- Dashboard com gráficos.
- Melhorias de UX nas carteiras.
- Exibição mais completa dos eventos de alerta.
- Agendamento periódico real da rotina de alertas em ambiente produtivo.
- Deploy final em nuvem.
- Observabilidade em produção.
- Ampliação da cobertura de testes no frontend.

---

## Roadmap

- [x] Estruturar backend Django.
- [x] Criar frontend React.
- [x] Implementar autenticação JWT.
- [x] Implementar refresh token.
- [x] Criar rotas protegidas.
- [x] Criar CRUD de ativos.
- [x] Implementar método Graham.
- [x] Implementar método Barsi.
- [x] Implementar método Projetivo.
- [x] Persistir análises.
- [x] Criar histórico de análises.
- [x] Criar módulo de carteiras.
- [x] Criar itens de carteira.
- [x] Criar simulação de carteira.
- [x] Criar alertas de preço.
- [x] Criar eventos de alerta automático.
- [x] Criar comando para rotina de alertas.
- [x] Integrar Yahoo Finance.
- [x] Configurar SonarCloud.
- [ ] Melhorar interface de carteiras.
- [ ] Criar dashboards de dividendos e valuation.
- [ ] Adicionar gráficos no frontend.
- [ ] Criar rotina agendada em produção.
- [ ] Finalizar deploy público.
- [ ] Documentar arquitetura com diagrama C4.
- [ ] Documentar instruções finais de deploy.
- [ ] Ampliar testes de integração.
- [ ] Adicionar observabilidade.

---

## Autor

**Lucas de Carvalho Steffens**

- GitHub: [LucasCarvalhoSteffens](https://github.com/LucasCarvalhoSteffens)
- Projeto: [InvestSmart](https://github.com/LucasCarvalhoSteffens/InvestSmart)