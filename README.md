# 📊 InvestSmart

Aplicação web para **análise fundamentalista de ativos financeiros**, com foco em **valuation**, **investimento em dividendos** e evolução incremental de uma arquitetura organizada para o projeto de **Portfólio em Engenharia de Software**.

O projeto já possui uma base funcional em **Django + PostgreSQL**, com **CRUD de ativos**, **persistência das análises** e uma **calculadora multimétodo de preço justo**, contemplando os métodos **Barsi**, **Graham** e **Preço Teto Projetivo**.

Além disso, o projeto já iniciou a implementação da **parte de autenticação**, com **fluxo de login em andamento**. Essa funcionalidade **ainda não está concluída**, mas já faz parte da evolução atual do sistema e da documentação do projeto.

---

## Code Quality

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=bugs)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)

---

## ✨ Visão Geral

O **InvestSmart** foi criado para centralizar, em um único ambiente, funcionalidades que normalmente ficam dispersas em várias plataformas de análise financeira.

Atualmente, o sistema já contempla:

- cadastro, edição, listagem e remoção de ativos;
- cálculo de preço teto pelo **método Barsi**;
- cálculo de preço justo pelo **método Graham**;
- cálculo de **Preço Teto Projetivo**;
- armazenamento do histórico das análises no banco de dados;
- uso do **Django Admin** para administração;
- banco de dados **PostgreSQL** executado com **Docker Compose**;
- integração de qualidade com **SonarCloud**;
- estrutura preparada para evolução contínua do sistema.

---

## ✅ Funcionalidades Implementadas

### Gestão de ativos
- CRUD completo de ativos;
- listagem de ativos cadastrados;
- criação, edição e exclusão de registros;
- persistência em PostgreSQL.

### Calculadora multimétodo
- **Método Barsi**;
- **Método Graham**;
- **Preço Teto Projetivo**;
- página principal para centralizar as calculadoras;
- formulários específicos para cada método.

### Persistência de análises
- armazenamento do histórico das execuções;
- associação entre ativo e análise realizada;
- base preparada para futuras comparações e dashboards.

### Infraestrutura e qualidade
- banco relacional em **PostgreSQL**;
- subida do banco com **Docker Compose**;
- configuração de análise com **SonarCloud**;
- base preparada para evolução de testes automatizados.

### Segurança básica já aplicada
- uso de variáveis sensíveis via `.env`;
- separação entre credenciais e código-fonte;
- proteção CSRF nativa do Django nos formulários;
- uso de `django.contrib.auth` no projeto;
- `.env` e `venv/` fora do versionamento.

---

## 🔐 Login e Autenticação

A parte de autenticação **já entrou no escopo implementado do projeto**, porém **ainda não está finalizada**.

### Status atual
- estrutura de autenticação já considerada na evolução do sistema;
- implementação de **login** em andamento;
- definição e estudo do fluxo com **JWT + Refresh Token**;
- autenticação ainda **não totalmente integrada** às rotas públicas atuais da aplicação;
- proteção completa de páginas/fluxos por usuário ainda está em evolução.

### Objetivo dessa funcionalidade
A autenticação será usada para:

- permitir acesso individual de usuários;
- associar análises e futuras carteiras ao usuário autenticado;
- proteger funcionalidades restritas;
- evoluir para um fluxo mais seguro de sessão com **access token** e **refresh token**.

### Observação
Mesmo já fazendo parte da implementação discutida e iniciada, o **login ainda está em desenvolvimento** e por isso não é tratado neste momento como funcionalidade concluída do MVP público atual.

---

## 🧮 Métodos de Valuation Disponíveis

## 1. Método Barsi

Método baseado em dividendos e dividend yield alvo.

### Lógica principal

```text
Dividendo Anual = soma dos dividendos informados
Preço Teto = Dividendo Anual / Dividend Yield Alvo
Margem = Preço Teto - Cotação Atual
```

### Saídas calculadas
- dividendo anual;
- dividend yield atual;
- preço teto;
- margem;
- indicação de oportunidade de compra.

---

## 2. Método Graham

Método baseado na fórmula clássica de Graham.

### Fórmula

```text
Preço Justo = √(22.5 × LPA × VPA)
```

### Entradas
- LPA;
- VPA.

### Saída
- preço justo.

---

## 3. Preço Teto Projetivo

Método baseado em dividendo por ação e dividend yield médio.

### Fórmula principal

```text
Preço Teto = MROUND(DPA / Dividend Yield Médio, 0.8)
```

### Entradas
- DPA;
- dividend yield médio.

### Saídas
- preço bruto;
- preço teto arredondado.

---

## 🏗️ Stack Atual

### Backend
- Python 3.11
- Django 5.2.1

### Banco de dados
- PostgreSQL 15

### Interface atual
- HTML
- Templates Django

### Infraestrutura
- Docker
- Docker Compose

### Qualidade e análise estática
- SonarCloud

### Dependências atualmente utilizadas
- `asgiref==3.11.1`
- `Django==5.2.1`
- `psycopg2-binary==2.9.11`
- `python-dotenv==1.2.1`
- `sqlparse==0.5.5`
- `tzdata==2025.3`

---

## 🧱 Arquitetura Atual do Projeto

A implementação atual segue uma organização modular baseada em Django, com separação entre:

- **camada de apresentação** via templates e views;
- **lógica de cálculo** isolada em módulos específicos;
- **persistência** com models Django e PostgreSQL;
- **configuração** centralizada no projeto Django;
- **qualidade de código** com SonarCloud.

### Estrutura principal

```text
InvestSmart
├── .github/
├── backend/
│   ├── assets/
│   │   ├── calculators/
│   │   │   ├── barsi_method.py
│   │   │   ├── graham_method.py
│   │   │   └── projected_method.py
│   │   ├── migrations/
│   │   ├── templates/
│   │   │   └── assets/
│   │   ├── tests/
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── forms.py
│   │   ├── models.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views.py
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   ├── core/
│   ├── Dockerfile
│   └── manage.py
├── docker-compose.yml
├── requirements.txt
├── sonar-project.properties
└── README.md
```

---

## 🌐 Rotas Públicas Atuais

## Ativos
- `GET /assets/` → lista de ativos;
- `GET /assets/create/` → cadastro de ativo;
- `GET /assets/<id>/update/` → edição de ativo;
- `GET /assets/<id>/delete/` → remoção de ativo.

## Calculadoras
- `GET /assets/calculator/` → página principal das calculadoras;
- `GET /assets/barsi/` → calculadora do método Barsi;
- `GET /assets/graham/` → calculadora do método Graham;
- `GET /assets/projected/` → calculadora do preço teto projetivo.

## Administração
- `GET /admin/` → painel administrativo do Django.

> **Nota:** as rotas públicas de autenticação ainda estão em fase de implementação e integração, por isso não entram nesta lista como funcionalidades concluídas.

---

## 🗄️ Modelagem de Dados Atual

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

## 🔁 Fluxo das Calculadoras

### Método Barsi
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

### Método Graham
```text
Usuário
   ↓
Formulário Django
   ↓
Lógica de cálculo Graham
   ↓
Resultado salvo em GrahamAnalysis
   ↓
Histórico exibido na tela
```

### Método Projetivo
```text
Usuário
   ↓
Formulário Django
   ↓
Lógica de cálculo Projetivo
   ↓
Resultado salvo em ProjectedAnalysis
   ↓
Histórico exibido na tela
```

---

## ⚙️ Como Executar o Projeto

## 1. Clonar o repositório

```bash
git clone https://github.com/LucasCarvalhoSteffens/InvestSmart.git
cd InvestSmart
```

## 2. Criar e ativar o ambiente virtual

```bash
python -m venv venv
```

### Windows
```bash
venv\Scripts\activate
```

### Linux / macOS
```bash
source venv/bin/activate
```

## 3. Instalar as dependências

```bash
pip install -r requirements.txt
```

## 4. Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
POSTGRES_DB=investsmart
POSTGRES_USER=investsmart_user
POSTGRES_PASSWORD=investsmart_pass
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

SECRET_KEY_DJANGO=your_secret_key
```

## 5. Subir o banco de dados com Docker

```bash
docker compose up -d
```

Para verificar o container:

```bash
docker ps
```

## 6. Entrar na pasta do backend

```bash
cd backend
```

## 7. Gerar e aplicar migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## 8. Criar superusuário

```bash
python manage.py createsuperuser
```

## 9. Executar o servidor

```bash
python manage.py runserver
```

## 10. Acessar a aplicação

### Interface principal
```text
http://127.0.0.1:8000/assets/
```

### Calculadoras
```text
http://127.0.0.1:8000/assets/calculator/
```

### Admin
```text
http://127.0.0.1:8000/admin/
```

---

## 🧪 Testes

Para executar os testes automatizados:

```bash
python manage.py test
```

A estrutura de testes já existe no projeto e pode ser expandida conforme a evolução do sistema.

---

## 🐘 Banco de Dados

O banco é executado em container Docker com PostgreSQL.

### Configuração atual do container
- imagem: `postgres:15`
- nome do container: `investsmart_db`
- porta: `5432:5432`

### Acessar manualmente o banco

```bash
docker exec -it investsmart_db psql -U investsmart_user -d investsmart
```

### Exemplo de consulta de usuários

```sql
SELECT username, email, is_superuser
FROM auth_user;
```

---

## 🔍 Qualidade de Código

O projeto já possui configuração para análise com **SonarCloud**.

### Configuração atual
- **Project Key:** `LucasCarvalhoSteffens_InvestSmart`
- **Organization:** `lucascarvalhosteffens`
- **Sources:** `backend`
- **Python version:** `3.11`

---

## 📌 Status Atual do Projeto

### Concluído no estado atual da branch principal
- CRUD de ativos;
- persistência em PostgreSQL;
- método Barsi;
- método Graham;
- método Projetivo;
- histórico de análises;
- Django Admin;
- Docker Compose para banco;
- integração com SonarCloud;
- estrutura de testes em evolução.

### Em desenvolvimento
- login de usuários;
- autenticação com JWT;
- fluxo com refresh token;
- proteção de rotas autenticadas;
- associação de funcionalidades por usuário;
- ampliação do fluxo de autenticação para o sistema completo.

---

## 🛣️ Roadmap

Próximas evoluções planejadas para o projeto:

- finalizar o fluxo de login e autenticação;
- concluir a integração de **access token + refresh token**;
- proteger páginas e funcionalidades restritas;
- associar análises e futuras carteiras aos usuários autenticados;
- ampliar testes automatizados;
- integrar APIs financeiras externas;
- preencher dados de ativos automaticamente;
- criar dashboards com indicadores fundamentalistas;
- permitir comparação entre empresas e entre métodos;
- implementar simulador de carteira;
- gerar alertas de preço teto;
- realizar deploy em nuvem;
- evoluir observabilidade e monitoramento.

---

## 🎓 Contexto Acadêmico

O **InvestSmart** é desenvolvido como projeto de **Portfólio em Engenharia de Software**, com foco em:

- organização arquitetural;
- evolução incremental;
- qualidade de código;
- uso de banco relacional;
- versionamento contínuo;
- documentação técnica;
- aderência a boas práticas de engenharia de software.

Além do valor técnico, o projeto busca entregar uma solução útil para estudo e apoio à análise fundamentalista de investimentos.

---

## 👨‍💻 Autor

**Lucas de Carvalho Steffens**

- GitHub: [LucasCarvalhoSteffens](https://github.com/LucasCarvalhoSteffens)
