# Arquitetura — InvestSmart

## Visão Geral

O InvestSmart utiliza uma arquitetura client-server em camadas, separando interface, API, lógica de negócio, persistência, integração externa e infraestrutura.

A aplicação é composta por:

- Frontend React;
- Backend Django REST Framework;
- Banco PostgreSQL;
- Integração externa com Yahoo Finance via `yfinance`;
- Reverse proxy com Caddy;
- Servidor de frontend com Nginx;
- Containers Docker;
- Pipeline de CI/CD com GitHub Actions.

---

## Diagrama Geral

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
  | Requisições HTTP /api
  v
Backend Django REST Framework + Gunicorn
  |
  | ORM
  v
PostgreSQL
  |
  | Integração
  v
Yahoo Finance / yfinance
```

---

## Camadas

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Apresentação | React/Vite | Interface, rotas, formulários, dashboards e componentes |
| Proxy | Caddy | Entrada pública, HTTPS e roteamento |
| Servidor estático | Nginx | Servir build do frontend |
| API | Django REST Framework | Endpoints, autenticação e serialização |
| Negócio | Serviços Django | Valuation, simulação, alertas e integração externa |
| Persistência | PostgreSQL | Armazenamento relacional |
| Rotina periódica | Scheduler container | Verificação automática de alertas |
| Qualidade/Entrega | GitHub Actions e SonarCloud | Testes, análise e deploy |

---

## Visão C4 — Nível 1: Contexto

```text
[Usuário Investidor]
        |
        v
[InvestSmart Web App]
        |
        +--> [Yahoo Finance / yfinance]
        |
        +--> [GitHub Actions / SonarCloud]
```

O usuário acessa a aplicação web para realizar análises, simulações e acompanhamento de carteiras. O sistema consulta dados externos de mercado e utiliza serviços de CI/CD e qualidade durante o processo de desenvolvimento.

---

## Visão C4 — Nível 2: Containers

```text
[Browser do Usuário]
        |
        v
[Frontend React]
        |
        v
[Backend Django REST]
        |
        v
[PostgreSQL]

[Backend Django REST] ---> [Yahoo Finance]
[GitHub Actions] -----> [VPS / Docker Compose]
```

---

## Principais Módulos do Backend

| App | Responsabilidade |
|---|---|
| `accounts` | Autenticação, login, logout, refresh e usuário autenticado |
| `assets` | Cadastro e consulta de ativos |
| `valuation` | Métodos de cálculo Graham, Barsi e Projetivo |
| `portfolios` | Carteiras, itens, simulações e alertas |

---

## Principais Módulos do Frontend

| Diretório | Responsabilidade |
|---|---|
| `src/pages` | Páginas principais da aplicação |
| `src/components` | Componentes reutilizáveis |
| `src/contexts` | Contextos globais, como autenticação |
| `src/services` | Cliente HTTP e integração com API |
| `src/app` | Configurações de rotas e aplicação |
| `src/assets` | Imagens e recursos estáticos |

---

## Justificativa Arquitetural

A arquitetura foi escolhida por oferecer:

- separação clara de responsabilidades;
- facilidade de manutenção;
- possibilidade de testes por camada;
- escalabilidade gradual;
- boa integração entre frontend e backend;
- aderência à linha Web Apps;
- compatibilidade com deploy em Docker;
- suporte a CI/CD e observabilidade.
