# InvestSmart

Plataforma web educacional para análise fundamentalista de ações, cálculo multimétodo de preço justo, simulação de carteiras, dashboards financeiros e alertas automáticos.

> Aplicação em produção: https://investsmartlcs.com  
> Repositório: https://github.com/LucasCarvalhoSteffens/InvestSmart  
> Linha de projeto: Web Apps  
> Status: em produção e em fase de finalização acadêmica  
> Aviso: este sistema possui finalidade educacional e não constitui recomendação de investimento.

---

## Visão Geral

O InvestSmart tem como objetivo centralizar, em uma única aplicação web, recursos que normalmente ficam espalhados em planilhas, sites financeiros e ferramentas pagas.

A plataforma permite que o usuário:

- calcule preço justo de ações por diferentes métodos;
- simule carteiras de investimento;
- acompanhe preço atual versus preço teto;
- visualize indicadores em dashboards;
- receba alertas automáticos;
- acesse a aplicação em ambiente produtivo.

---

## Funcionalidades Principais

- Autenticação de usuários com JWT.
- Calculadora de Graham.
- Calculadora de Barsi.
- Calculadora de Preço Teto Projetivo.
- Cadastro e gerenciamento de carteiras.
- Cadastro de ativos nas carteiras.
- Simulação consolidada de carteiras.
- Dashboard com KPIs e gráficos.
- Histórico de alertas automáticos.
- Integração com dados de mercado via Yahoo Finance.
- Deploy público com Docker, Caddy e HTTPS.
- CI/CD com GitHub Actions.
- Análise de qualidade com SonarCloud.
- Testes automatizados no backend e frontend.
- Estratégia de observabilidade em produção.

---

## Stack Tecnológica

| Camada | Tecnologias |
|---|---|
| Frontend | React, Vite, JavaScript, Axios, React Router, Recharts |
| Backend | Python, Django, Django REST Framework, Simple JWT |
| Banco de Dados | PostgreSQL |
| Integração Externa | Yahoo Finance / yfinance |
| Infraestrutura | Docker, Docker Compose, Caddy, Nginx, VPS |
| Qualidade | SonarCloud, coverage.py, Vitest, Testing Library |
| CI/CD | GitHub Actions |

---

## Arquitetura Resumida

```text
Usuário
  |
  | HTTPS
  v
Caddy
  |
  v
Frontend React servido por Nginx
  |
  | /api
  v
Backend Django REST Framework
  |
  v
PostgreSQL
  |
  v
Yahoo Finance / yfinance
```

A documentação detalhada da arquitetura está em:

- [docs/arquitetura.md](docs/arquitetura.md)

---

## Documentação do Projeto

A documentação técnica foi separada da página principal para manter o README limpo e facilitar a avaliação.

| Documento | Descrição |
|---|---|
| [docs/README.md](docs/README.md) | Índice geral da documentação |
| [docs/arquitetura.md](docs/arquitetura.md) | Arquitetura, camadas e visão C4 |
| [docs/requisitos.md](docs/requisitos.md) | Requisitos funcionais e não funcionais |
| [docs/user-stories.md](docs/user-stories.md) | Histórias de usuário e fluxos de negócio |
| [docs/deploy.md](docs/deploy.md) | Instruções de deploy e ambiente de produção |
| [docs/testes.md](docs/testes.md) | Estratégia de testes e cobertura |
| [docs/qualidade.md](docs/qualidade.md) | SonarCloud, qualidade e critérios técnicos |
| [docs/observabilidade.md](docs/observabilidade.md) | Logs, métricas e monitoramento |
| [docs/seguranca.md](docs/seguranca.md) | Segurança, autenticação e proteção de dados |
| [docs/decisoes-tecnicas.md](docs/decisoes-tecnicas.md) | Decisões arquiteturais e justificativas |
| [docs/evidencias/README.md](docs/evidencias/README.md) | Organização das evidências da entrega |

---

## Fluxos de Negócio Implementados

### 1. Autenticação

O usuário realiza login, recebe token de acesso e passa a acessar rotas protegidas.

### 2. Valuation

O usuário seleciona um método de cálculo, informa os dados necessários e recebe o preço justo ou preço teto calculado.

### 3. Carteiras

O usuário cria carteiras, adiciona ativos e acompanha valores consolidados.

### 4. Simulação

O sistema calcula posição atual, valor investido, preço teto, margem e oportunidades da carteira.

### 5. Alertas Automáticos

O sistema compara periodicamente o preço atual dos ativos com o preço teto e gera eventos de alerta.

### 6. Dashboard

O usuário visualiza KPIs, gráficos e oportunidades de forma consolidada.

---

## Como Executar Localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/LucasCarvalhoSteffens/InvestSmart.git
cd InvestSmart
```

### 2. Criar ambiente virtual

```bash
python -m venv venv
```

Windows:

```bash
venv\Scripts\activate
```

Linux/macOS:

```bash
source venv/bin/activate
```

### 3. Instalar dependências do backend

```bash
pip install -r backend/requirements.txt
```

### 4. Subir o banco local

```bash
docker compose up -d
```

### 5. Aplicar migrations

```bash
cd backend
python manage.py migrate
```

### 6. Criar superusuário

```bash
python manage.py createsuperuser
```

### 7. Rodar backend

```bash
python manage.py runserver
```

### 8. Rodar frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## Testes

### Backend

```bash
cd backend
python manage.py test --settings=config.settings_test
```

Com coverage:

```bash
coverage run manage.py test --settings=config.settings_test
coverage report
coverage xml -o coverage.xml
```

### Frontend

```bash
cd frontend
npm test
```

Com coverage:

```bash
npm run test:coverage
```

Mais detalhes:

- [docs/testes.md](docs/testes.md)

---

## CI/CD

O projeto utiliza GitHub Actions para:

- executar testes;
- gerar relatórios de cobertura;
- enviar análise para o SonarCloud;
- realizar deploy automático em produção.

Mais detalhes:

- [docs/deploy.md](docs/deploy.md)
- [docs/qualidade.md](docs/qualidade.md)

---

## Observabilidade

A observabilidade do projeto está documentada em:

- [docs/observabilidade.md](docs/observabilidade.md)

A estratégia contempla logs dos containers, status da aplicação, execução do scheduler, acompanhamento do deploy e evolução futura para Grafana/Prometheus ou ferramenta equivalente.

---

## Evidências

As evidências de execução, produção, testes, SonarCloud, telas, monitoramento, validações e orientações devem ser armazenadas em:

- [docs/evidencias/](docs/evidencias/)

---

## Checklist Acadêmico

| Critério | Status |
|---|---|
| Aplicação web completa | Atendido |
| Interface navegável | Atendido |
| Backend próprio | Atendido |
| Banco PostgreSQL | Atendido |
| Repositório público | Atendido |
| Histórico de commits | Atendido |
| Deploy público | Atendido |
| CI/CD | Atendido |
| Testes automatizados | Atendido |
| SonarCloud | Atendido |
| Docker | Atendido |
| Integração com API externa | Atendido |
| Três ou mais fluxos de negócio | Atendido |
| Documentação técnica | Em finalização |
| Observabilidade dedicada | Em evolução |
| Evidências finais | Em organização |

---

## Autor

Lucas de Carvalho Steffens  
Engenharia de Software — Católica de Santa Catarina  

GitHub: https://github.com/LucasCarvalhoSteffens
