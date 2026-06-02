# Deploy — InvestSmart

## Visão Geral

O InvestSmart está publicado em ambiente de produção utilizando VPS, Docker Compose, Caddy, Nginx, Django, React e PostgreSQL.

Aplicação em produção:

```text
https://investsmartlcs.com
```

---

## Arquitetura de Produção

```text
Internet
  |
  | HTTPS
  v
Caddy
  |
  +--> Frontend React servido por Nginx
  |
  +--> Backend Django REST Framework + Gunicorn
            |
            v
        PostgreSQL
```

---

## Serviços de Produção

| Serviço | Responsabilidade |
|---|---|
| `caddy` | Entrada pública, HTTPS e reverse proxy |
| `frontend` | Servir build React via Nginx |
| `backend` | API Django REST com Gunicorn |
| `db` | Banco PostgreSQL |
| `scheduler` | Verificação periódica de alertas |

---

## Variáveis de Ambiente

O ambiente de produção utiliza o arquivo:

```text
.env.production
```

Esse arquivo existe somente na VPS e não deve ser versionado.

O repositório deve conter apenas:

```text
.env.production.example
```

---

## Comandos Úteis na VPS

Acessar pasta do projeto:

```bash
cd /opt/InvestSmart
```

Ver containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

Subir aplicação:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Ver logs do backend:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 backend
```

Ver logs do scheduler:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 scheduler
```

Executar migrations:

```bash
docker compose -f docker-compose.prod.yml run --rm backend python manage.py migrate
```

Coletar arquivos estáticos:

```bash
docker compose -f docker-compose.prod.yml run --rm backend python manage.py collectstatic --noinput
```

---

## CI/CD

O deploy é automatizado por GitHub Actions.

Fluxo:

```text
Push ou merge na main
  -> executa testes
  -> gera cobertura
  -> envia análise para SonarCloud
  -> executa deploy na VPS
  -> sobe containers atualizados
```

Workflows principais:

```text
.github/workflows/sonar.yml
.github/workflows/deploy-production.yml
```

---

## Secrets do GitHub Actions

Os secrets devem ser configurados em:

```text
Settings -> Secrets and variables -> Actions
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

---
