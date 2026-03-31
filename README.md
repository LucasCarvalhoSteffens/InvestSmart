# 📊 InvestSmart

Aplicação web desenvolvida com **Django** para **análise fundamentalista de ativos financeiros**, com foco em **valuation**, **investimento em dividendos** e evolução incremental de uma arquitetura backend organizada.

O projeto implementa uma **calculadora multi-método de valuation**, com os seguintes métodos já disponíveis:

- **Método Barsi** — preço teto com base em dividendos e dividend yield alvo
- **Método Graham** — preço justo com base em **LPA** e **VPA**
- **Preço Teto Projetivo** — cálculo baseado em **DPA** e **Dividend Yield médio**

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

## Backend
- Python
- Django

## Banco de dados
- PostgreSQL

## Infraestrutura
- Docker
- Docker Compose

## Frontend atual
- HTML
- Templates Django

## Qualidade de código
- SonarCloud

---

# 🏗️ Arquitetura do Projeto

```text
InvestSmart
│
├── backend
│   │
│   ├── assets
│   │   ├── calculators
│   │   │   ├── barsi_method.py
│   │   │   ├── graham_method.py
│   │   │   └── projected_method.py
│   │   │
│   │   ├── migrations
│   │   ├── templates
│   │   │   └── assets
│   │   │       ├── asset_confirm_delete.html
│   │   │       ├── asset_form.html
│   │   │       ├── asset_list.html
│   │   │       ├── barsi_calculator.html
│   │   │       ├── calculator.html
│   │   │       ├── graham_calculator.html
│   │   │       └── projected_calculator.html
│   │   │
│   │   ├── admin.py
│   │   ├── forms.py
│   │   ├── models.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── config
│   │   ├── settings.py
│   │   └── urls.py
│   │
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

## 2️⃣ Criar ambiente virtual

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

## 3️⃣ Instalar dependências

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
POSTGRES_DB=investsmart
POSTGRES_USER=investsmart_user
POSTGRES_PASSWORD=investsmart_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

SECRET_KEY_DJANGO=your_secret_key
```

Esse arquivo **não deve ser versionado**.

---

## 5️⃣ Subir banco de dados com Docker

```bash
docker compose up -d
```

Verificar container:

```bash
docker ps
```

---

## 6️⃣ Rodar migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

---

## 7️⃣ Criar superusuário

```bash
python manage.py createsuperuser
```

Acesse o painel administrativo:

```text
http://127.0.0.1:8000/admin/
```

---

## 8️⃣ Executar servidor

```bash
python manage.py runserver
```

Aplicação disponível em:

```text
http://127.0.0.1:8000/assets/
```

---

# 🧭 Rotas Principais

## Ativos
- `GET /assets/` → lista de ativos
- `GET /assets/create/` → cadastro de ativo
- `GET /assets/<id>/update/` → edição de ativo
- `GET /assets/<id>/delete/` → remoção de ativo

## Calculadoras
- `GET /assets/calculator/` → página principal das calculadoras
- `GET /assets/barsi/` → calculadora do método Barsi
- `GET /assets/graham/` → calculadora do método Graham
- `GET /assets/projected/` → calculadora do preço teto projetivo

---

# 📦 Modelagem de Dados

## Asset

Representa um ativo financeiro.

### Campos principais
- `ticker`
- `name`
- `sector`
- `current_price`
- `created_at`

---

## Dividend

Armazena o histórico de dividendos pagos por um ativo.

### Relacionamento

```text
Asset 1 ---- N Dividend
```

### Campos principais
- `asset`
- `value`
- `payment_date`
- `created_at`

---

## BarsiAnalysis

Armazena o resultado das análises pelo método Barsi.

### Relacionamento

```text
Asset 1 ---- N BarsiAnalysis
```

### Campos principais
- `asset`
- `annual_dividend`
- `current_price`
- `target_yield`
- `price_ceiling`
- `margin`
- `opportunity`
- `created_at`

---

## GrahamAnalysis

Armazena o resultado das análises pelo método Graham.

### Relacionamento

```text
Asset 1 ---- N GrahamAnalysis
```

### Campos principais
- `asset`
- `lpa`
- `vpa`
- `fair_price`
- `created_at`

---

## ProjectedAnalysis

Armazena o resultado das análises pelo método projetivo.

### Relacionamento

```text
Asset 1 ---- N ProjectedAnalysis
```

### Campos principais
- `asset`
- `dpa`
- `average_dividend_yield`
- `raw_price`
- `price_ceiling`
- `created_at`

---

# 📈 Métodos de Valuation Implementados

## 1. Método Barsi

Método baseado em dividendos e dividend yield alvo.

### Lógica

```text
Dividendo Anual = soma dos dividendos informados
Preço Teto = Dividendo Anual / Dividend Yield Alvo
Margem = Preço Teto - Cotação Atual
```

### Saídas calculadas
- dividendo anual
- dividend yield atual
- preço teto
- margem
- oportunidade de compra

---

## 2. Método Graham

Método baseado na fórmula clássica de Graham:

```text
Preço Justo = √(22.5 × LPA × VPA)
```

### Entradas
- LPA
- VPA

### Saída
- preço justo

---

## 3. Preço Teto Projetivo

Método baseado em dividendos projetados por ação e dividend yield médio.

### Fórmula principal

```text
Preço Teto = MROUND(DPA / Dividend Yield Médio, 0.8)
```

### Entradas
- DPA
- Dividend Yield médio

### Saídas
- preço bruto
- preço teto arredondado

---

# 🧮 Fluxo das Calculadoras

## Método Barsi

```text
Usuário
   ↓
Formulário Django
   ↓
BarsiCalculator
   ↓
Resultado salvo em BarsiAnalysis
   ↓
Histórico exibido na tela
```

## Método Graham

```text
Usuário
   ↓
Formulário Django
   ↓
calculate_graham_price
   ↓
Resultado salvo em GrahamAnalysis
   ↓
Histórico exibido na tela
```

## Método Projetivo

```text
Usuário
   ↓
Formulário Django
   ↓
calculate_projected_price
   ↓
Resultado salvo em ProjectedAnalysis
   ↓
Histórico exibido na tela
```

---

# 📊 Funcionalidades Atuais

- CRUD completo de ativos
- Persistência em PostgreSQL
- Integração com Docker
- Interface administrativa via Django Admin
- Página principal de calculadoras
- Calculadora do método Barsi
- Calculadora do método Graham
- Calculadora do preço teto projetivo
- Histórico de análises salvo no banco
- Estrutura modular para expansão de novos métodos
- Testes automatizados em evolução

---

# 🧪 Testes

Para executar os testes automatizados:

```bash
python manage.py test
```

Os testes atuais cobrem a lógica dos métodos de valuation e parte do comportamento das views.

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

- variáveis sensíveis em `.env`
- `.env` no `.gitignore`
- `venv/` não versionado
- credenciais separadas da aplicação
- uso de formulários Django com proteção CSRF nas calculadoras

---

# 🛠️ Roadmap

Próximos recursos planejados:

- integração com APIs financeiras
- preenchimento automático de indicadores
- dashboard com indicadores fundamentalistas
- melhoria visual das páginas e templates
- API REST com Django REST Framework
- autenticação e autorização
- cobertura de testes ampliada
- deploy em cloud
- observabilidade e monitoramento
- comparação entre múltiplos métodos de valuation

---

# 🎯 Objetivo do Projeto

Este projeto foi desenvolvido com foco em **portfólio de engenharia de software**, demonstrando:

- arquitetura backend organizada
- modelagem de dados
- integração com banco relacional
- uso de containers
- criação de regras de negócio financeiras
- evolução incremental de funcionalidades
- separação entre cálculo, persistência e interface

---

# 📌 Status Atual

O projeto já evoluiu de uma calculadora inicial focada apenas no método Barsi para uma estrutura com **múltiplos métodos de valuation**, mantendo a aplicação em Django com persistência de histórico e organização modular.

Atualmente, o InvestSmart já permite:

- cadastrar ativos
- calcular preço teto por dividendos
- calcular preço justo por Graham
- calcular preço teto projetivo
- armazenar o histórico de análises realizadas

---