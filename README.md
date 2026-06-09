# InvestSmart

Plataforma web educacional para análise fundamentalista de ações, cálculo multimétodo de preço justo, simulação de carteiras, projeções de longo prazo, dashboards financeiros e alertas automáticos.

> Aplicação em produção: https://investsmartlcs.com
> Repositório: https://github.com/LucasCarvalhoSteffens/InvestSmart
> Linha de projeto: Web Apps
> Status: em produção e em fase de finalização acadêmica
> Aviso: este sistema possui finalidade educacional e não constitui recomendação de investimento.

---

## Visão Geral

O InvestSmart tem como objetivo centralizar, em uma única aplicação web, recursos que normalmente ficam espalhados em planilhas, sites financeiros e ferramentas pagas.

A plataforma permite que o usuário:

* calcule preço justo de ações por diferentes métodos;
* simule carteiras de investimento;
* acompanhe preço atual versus preço teto;
* visualize indicadores em dashboards;
* acompanhe projeções de longo prazo em 5, 10 e 20 anos;
* receba alertas automáticos;
* acesse a aplicação em ambiente produtivo;
* acompanhe a saúde da aplicação por meio de observabilidade com Prometheus e Grafana.

---

## Funcionalidades Principais

* Autenticação de usuários com JWT.
* Calculadora de Graham.
* Calculadora de Barsi.
* Calculadora de Preço Teto Projetivo.
* Cadastro e gerenciamento de carteiras.
* Cadastro de ativos nas carteiras.
* Simulação consolidada de carteiras.
* Projeções de longo prazo em 5, 10 e 20 anos.
* Dashboard com KPIs e gráficos financeiros.
* Histórico de alertas automáticos.
* Scheduler para verificação periódica de alertas.
* Integração com dados de mercado via Yahoo Finance.
* Deploy público com Docker, Caddy e HTTPS.
* CI/CD com GitHub Actions.
* Análise de qualidade com SonarCloud.
* Testes automatizados no backend e frontend.
* Observabilidade com Prometheus e Grafana.

---

## Stack Tecnológica

| Camada             | Tecnologias                                                 |
| ------------------ | ----------------------------------------------------------- |
| Frontend           | React, Vite, JavaScript, Axios, React Router, Recharts      |
| Backend            | Python, Django, Django REST Framework, Simple JWT, Gunicorn |
| Banco de Dados     | PostgreSQL                                                  |
| Integração Externa | Yahoo Finance / yfinance                                    |
| Infraestrutura     | Docker, Docker Compose, Caddy, Nginx, VPS                   |
| Observabilidade    | Prometheus, Grafana, django-prometheus                      |
| Qualidade          | SonarCloud, coverage.py, Vitest, Testing Library            |
| CI/CD              | GitHub Actions                                              |

---

## Arquitetura Resumida

```text
Usuário
  |
  | HTTPS
  v
Caddy
  |
  +-------------------------------+
  |                               |
  v                               v
Frontend React/Vite          Backend Django REST Framework
servido por Nginx            Gunicorn
  |                               |
  | Requisições /api              | ORM
  |                               v
  |                          PostgreSQL
  |                               ^
  |                               |
  |                       Scheduler de Alertas
  |                               |
  |                               v
  |                       Yahoo Finance / yfinance
  |
  +-------------------------------+

Backend Django
  |
  | expõe métricas em /metrics
  v
Prometheus
  |
  v
Grafana
```

A documentação detalhada da arquitetura está em:

* [docs/arquitetura.md](docs/arquitetura.md)

---

## Documentação do Projeto

A documentação técnica foi separada da página principal para manter o README limpo e facilitar a avaliação.

| Documento                                              | Descrição                                           |
| ------------------------------------------------------ | --------------------------------------------------- |
| [docs/README.md](docs/README.md)                       | Índice geral da documentação                        |
| [docs/arquitetura.md](docs/arquitetura.md)             | Arquitetura, camadas e visão C4                     |
| [docs/requisitos.md](docs/requisitos.md)               | Requisitos funcionais e não funcionais              |
| [docs/user-stories.md](docs/user-stories.md)           | Histórias de usuário e fluxos de negócio            |
| [docs/deploy.md](docs/deploy.md)                       | Instruções de deploy e ambiente de produção         |
| [docs/testes.md](docs/testes.md)                       | Estratégia de testes e cobertura                    |
| [docs/qualidade.md](docs/qualidade.md)                 | SonarCloud, qualidade e critérios técnicos          |
| [docs/observabilidade.md](docs/observabilidade.md)     | Prometheus, Grafana, logs, métricas e monitoramento |
| [docs/seguranca.md](docs/seguranca.md)                 | Segurança, autenticação e proteção de dados         |
| [docs/decisoes-tecnicas.md](docs/decisoes-tecnicas.md) | Decisões arquiteturais, escopo e justificativas     |
| [docs/evidencias/README.md](docs/evidencias/README.md) | Organização das evidências da entrega               |

---

## Fluxos de Negócio Implementados

### 1. Autenticação

O usuário realiza login, recebe token de acesso e passa a acessar rotas protegidas.

### 2. Valuation

O usuário seleciona um método de cálculo, informa os dados necessários e recebe o preço justo ou preço teto calculado.

Métodos disponíveis:

* Graham;
* Barsi;
* Projetivo.

### 3. Carteiras

O usuário cria carteiras, adiciona ativos e acompanha valores consolidados.

### 4. Simulação

O sistema calcula posição atual, valor investido, preço teto, margem de segurança e oportunidades da carteira.

### 5. Projeções de Longo Prazo

O sistema apresenta projeções em horizontes de 5, 10 e 20 anos, permitindo visualizar cenários futuros relacionados à carteira e aos resultados simulados.

### 6. Alertas Automáticos

O sistema compara periodicamente o preço atual dos ativos com o preço teto e gera eventos de alerta automaticamente.

### 7. Dashboard

O usuário visualiza KPIs, gráficos financeiros, oportunidades, alertas recentes e informações consolidadas da carteira.

### 8. Observabilidade

O sistema expõe métricas do backend em `/metrics`, que são coletadas pelo Prometheus e visualizadas em dashboards no Grafana.

---

## Escopo da Versão Final

A versão final do InvestSmart prioriza os fluxos principais de análise fundamentalista, simulação de carteiras, projeções financeiras, alertas automáticos, dashboards e observabilidade.

A funcionalidade de comparação setorial entre empresas, prevista inicialmente como diferencial, foi movida para evolução futura. Essa decisão foi tomada para concentrar a entrega final em funcionalidades completas, estáveis e bem documentadas, evitando a inclusão de recursos incompletos no MVP apresentado no Poster + Demo Day.

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

* [docs/testes.md](docs/testes.md)

---

## CI/CD

O projeto utiliza GitHub Actions para:

* executar testes do backend;
* executar testes do frontend;
* gerar relatórios de cobertura;
* enviar análise para o SonarCloud;
* validar qualidade do código;
* realizar deploy automático em produção.

Mais detalhes:

* [docs/deploy.md](docs/deploy.md)
* [docs/qualidade.md](docs/qualidade.md)

---

## Observabilidade

A observabilidade do projeto está documentada em:

* [docs/observabilidade.md](docs/observabilidade.md)

A estratégia atual contempla:

* Prometheus para coleta de métricas;
* Grafana para visualização de dashboards;
* endpoint `/metrics` no backend Django;
* monitoramento de targets online;
* métricas de requisições HTTP;
* métricas de latência da API;
* métricas de queries no banco;
* métricas de latência do banco;
* métricas de memória e CPU do processo, quando disponíveis;
* logs dos containers Docker;
* logs do backend;
* logs do scheduler;
* logs do Caddy;
* acompanhamento do deploy e workflows de CI/CD.

---

## Evidências

As evidências de execução, produção, testes, SonarCloud, telas, monitoramento, validações e orientações devem ser armazenadas em:

* [docs/evidencias/](docs/evidencias/)

Evidências recomendadas:

* prints da aplicação em produção;
* prints das principais telas;
* prints do dashboard financeiro;
* prints das projeções 5, 10 e 20 anos;
* prints dos alertas automáticos;
* prints do Grafana;
* prints dos targets do Prometheus;
* logs do backend;
* logs do scheduler;
* execução dos workflows de CI/CD;
* resultado do SonarCloud;
* cobertura de testes;
* registros das orientações;
* validações com usuários.

---

## Checklist Acadêmico

| Critério                                 | Status             |
| ---------------------------------------- | ------------------ |
| Aplicação web completa                   | Atendido           |
| Interface navegável                      | Atendido           |
| Backend próprio                          | Atendido           |
| Banco PostgreSQL                         | Atendido           |
| Repositório público                      | Atendido           |
| Histórico de commits                     | Atendido           |
| Deploy público                           | Atendido           |
| HTTPS em produção                        | Atendido           |
| CI/CD                                    | Atendido           |
| Testes automatizados                     | Atendido           |
| SonarCloud                               | Atendido           |
| Docker                                   | Atendido           |
| Integração com API externa               | Atendido           |
| Três ou mais fluxos de negócio           | Atendido           |
| Dashboards financeiros                   | Atendido           |
| Projeções 5, 10 e 20 anos                | Atendido           |
| Alertas automáticos                      | Atendido           |
| Scheduler                                | Atendido           |
| Observabilidade com Prometheus e Grafana | Atendido           |
| Documentação técnica                     | Em finalização     |
| Evidências finais                        | Em organização     |
| Pôster Demo Day                          | Em desenvolvimento |
| Comparação setorial entre empresas       | Evolução futura    |

---

## Roadmap / Evoluções Futuras

Melhorias previstas para versões futuras:

* comparação setorial entre empresas;
* métricas de negócio no Prometheus, como total de cálculos, carteiras, simulações e alertas gerados;
* instrumentação personalizada por rota, método HTTP e status;
* alertas automáticos no Grafana;
* cache com Redis;
* testes de carga com JMeter ou Locust;
* infraestrutura como código;
* monitoramento externo de disponibilidade.

---

## Autor

Lucas de Carvalho Steffens
Engenharia de Software — Católica de Santa Catarina

GitHub: https://github.com/LucasCarvalhoSteffens
