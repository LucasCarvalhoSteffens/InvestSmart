# 📊 InvestSmart

Aplicação web desenvolvida com **Django** para **análise fundamentalista de ativos financeiros**, com foco em estratégias de **investimento em dividendos** e arquitetura backend escalável.

O projeto implementa uma **calculadora multi-método de valuation**, iniciando pela estratégia de dividendos utilizada por **Luiz Barsi**.

---

# Code Quality

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)  
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=bugs)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)  
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)  
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)  
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)  
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)

---

# 🚀 Tecnologias Utilizadas

Backend:

- Python
- Django

Banco de dados:

- PostgreSQL

Infraestrutura:

- Docker
- Docker Compose

Frontend (atual):

- HTML
- JavaScript

Qualidade de código:

- SonarCloud

---

# 🏗️ Arquitetura do Projeto

```
InvestSmart
│
├── backend
│   │
│   ├── assets
│   │   ├── calculators
│   │   │   └── barsi_method.py
│   │   │
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── templates
│   │        └── assets
│   │             └── calculator.html
│   │
│   ├── config
│   └── manage.py
│
├── docker-compose.yml
├── requirements.txt
├── .env
└── README.md
```

---

# ⚙️ Como Executar o Projeto

## 1️⃣ Clonar o repositório

```bash
git clone https://github.com/LucasCarvalhoSteffens/InvestSmart
cd InvestSmart
```

---

# 2️⃣ Criar ambiente virtual

```bash
python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / Mac

```bash
source venv/bin/activate
```

---

# 3️⃣ Instalar dependências

```bash
pip install -r requirements.txt
```

---

# 4️⃣ Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```
POSTGRES_DB=investsmart
POSTGRES_USER=investsmart_user
POSTGRES_PASSWORD=investsmart_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

SECRET_KEY_DJANGO=your_secret_key
```

Esse arquivo **não deve ser versionado**.

---

# 5️⃣ Subir banco de dados com Docker

```bash
docker compose up -d
```

Verificar container:

```bash
docker ps
```

---

# 6️⃣ Rodar migrations

```bash
cd backend
python manage.py migrate
```

---

# 7️⃣ Criar superusuário

```bash
python manage.py createsuperuser
```

Acesse o painel administrativo:

```
http://127.0.0.1:8000/admin
```

---

# 8️⃣ Executar servidor

```bash
python manage.py runserver
```

Aplicação disponível em:

```
http://127.0.0.1:8000/assets
```

---

# 📦 Modelagem de Dados

### Asset

Representa um ativo financeiro.

Campos principais:

- ticker
- name
- sector
- current_price

---

### Dividend

Armazena histórico de dividendos pagos pelo ativo.

Relacionamento:

```
Asset 1 ---- N Dividend
```

---

### BarsiAnalysis

Armazena o resultado das análises feitas pela calculadora.

Relacionamento:

```
Asset 1 ---- N BarsiAnalysis
```

---

# 📈 Calculadora Barsi

A aplicação implementa o método de valuation baseado em dividendos utilizado por **Luiz Barsi**.

A lógica calcula:

- Dividendos anuais
- Dividend Yield alvo
- Preço teto
- Margem de segurança
- Oportunidade de compra

Fluxo:

```
Frontend
   ↓
POST /assets/barsi
   ↓
BarsiCalculator
   ↓
Resultado salvo em BarsiAnalysis
```

---

# 📊 Funcionalidades Atuais

✔ CRUD completo de ativos  
✔ Persistência em PostgreSQL  
✔ Integração com Docker  
✔ Interface administrativa via Django Admin  
✔ Calculadora de valuation (método Barsi)  
✔ Histórico de análises salvo no banco

---

# 🐳 Banco de Dados

Banco executado em container Docker.

Para acessar manualmente:

```bash
docker exec -it investsmart_db psql -U investsmart_user -d investsmart
```

Consultar usuários:

```sql
SELECT username, email, is_superuser
FROM auth_user;
```

---

# 🔐 Segurança

Boas práticas adotadas:

- Variáveis sensíveis em `.env`
- `.env` no `.gitignore`
- `venv/` não versionado
- Credenciais separadas da aplicação

---

# 🛠️ Roadmap

Próximos recursos planejados:

- Integração com APIs financeiras
- Atualização automática de dividendos
- Dashboard com indicadores
- Suporte a múltiplos métodos de valuation
- Testes automatizados
- API REST
- Deploy em cloud

---

# 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com foco em **portfólio de engenharia de software**, demonstrando:

- arquitetura backend organizada
- modelagem de dados
- integração com banco relacional
- uso de containers
- evolução incremental de features