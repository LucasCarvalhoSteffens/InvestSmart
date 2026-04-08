# 📊 InvestSmart

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=bugs)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)

Plataforma web para **análise fundamentalista de ações**, com **calculadora multimétodo de valuation**, **autenticação JWT com refresh token**, **persistência de análises** e evolução para **simulação de carteiras de investimento**.

O projeto foi desenvolvido para concentrar, em um único ambiente, funcionalidades que normalmente ficam espalhadas em diferentes plataformas do mercado, com foco em **valuation**, **investimento em dividendos**, **comparação entre métodos de precificação** e futura **simulação de carteiras**.

> **Status do projeto:** em desenvolvimento  
> **Estado descrito neste README:** reflete a branch **Dev**  
> **Natureza do projeto:** acadêmico/profissional, desenvolvido para a disciplina de **Portfólio** em **Engenharia de Software**  
> **Observação:** esta aplicação tem caráter educacional e de apoio à análise, não constituindo recomendação de investimento.

---

## 🚀 Objetivo do Projeto

O **InvestSmart** busca oferecer uma experiência unificada para investidores pessoa física, principalmente iniciantes e intermediários, permitindo:

- cálculo de preço justo por múltiplos métodos;
- comparação entre abordagens de valuation;
- centralização de análises em uma única plataforma;
- persistência e histórico de cálculos;
- autenticação e organização das análises por fluxo protegido;
- evolução para simulador de carteiras;
- visualização futura de dashboards de dividendos, valuation e projeções;
- apoio educacional no estudo de análise fundamentalista.

---

## ❗ Problema que o Projeto Resolve

Hoje, boa parte das ferramentas de análise de ações apresenta pelo menos um destes problemas:

- funcionalidades fragmentadas em várias plataformas;
- limitação de recursos em planos gratuitos;
- ausência de comparação entre diferentes métodos de valuation;
- pouca flexibilidade para projeções e simulações personalizadas;
- dificuldade de uso para investidores iniciantes.

O **InvestSmart** foi proposto para reduzir essa fragmentação e concentrar os principais recursos em uma solução própria, organizada e evolutiva.

---

## ✨ Principais Diferenciais

- **Calculadora multimétodo integrada** em uma única plataforma;
- **Autenticação com JWT + refresh token** já estruturada;
- **Refresh token com cookie HTTP-only** e renovação automática do access token;
- **Carregamento do perfil do usuário autenticado** no frontend;
- **Rotas protegidas no frontend**;
- **Persistência automática das análises** no backend;
- **Endpoints de histórico** para Graham, Barsi e Projetivo;
- **Arquitetura modular** para facilitar manutenção e evolução;
- **Backend desacoplado do frontend** via API REST;
- **Integração com SonarCloud** para qualidade contínua;
- **Base pronta para simulador de carteiras, alertas e dashboards**;
- **Foco em boas práticas de Engenharia de Software**, com separação por responsabilidade, organização em camadas e crescimento incremental.

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura **client-server em camadas**, conforme definido no RFC.

### Stack principal

- **Frontend:** React + Vite
- **Backend:** Django + Django REST Framework
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT com access token e refresh token
- **Comunicação:** API REST
- **Qualidade:** SonarCloud
- **Infraestrutura local:** Docker / Docker Compose
- **Versionamento:** GitHub

### Camadas

- **Camada de Apresentação:** React
- **Camada de Lógica de Negócio:** Django REST Framework
- **Camada de Persistência:** PostgreSQL

---

## 🧠 Métodos de Valuation Implementados

### 1. Método Graham

Utilizado para cálculo de preço justo com base em indicadores fundamentalistas clássicos.

**Entradas principais:**
- ativo;
- LPA;
- VPA.

**Fórmula base:**
```text
Preço Justo = √(22.5 × LPA × VPA)
```

**Saída principal:**
- preço justo estimado.

---

### 2. Método Barsi

Método focado em dividendos, calculando o preço teto com base no dividendo anual e no dividend yield alvo.

**Entradas principais:**
- ativo;
- preço atual;
- dividend yield alvo;
- dividendos informados.

**Lógica base:**
```text
Dividendo Anual = soma dos dividendos informados
Preço Teto = Dividendo Anual / Dividend Yield Alvo
Margem = Preço Teto - Preço Atual
```

**Saídas principais:**
- dividendo anual;
- preço teto;
- margem;
- indicação de oportunidade.

---

### 3. Preço Teto Projetivo

Método voltado para projeção do preço teto com base em dividendo por ação e dividend yield médio.

**Entradas principais:**
- ativo;
- DPA;
- dividend yield médio.

**Lógica base:**
```text
Preço Teto = DPA / Dividend Yield Médio
```

**Saídas principais:**
- preço bruto estimado;
- preço teto ajustado.

---

## ✅ O que já está funcionando

### Backend

- API REST modularizada em `apps`;
- separação entre domínio de autenticação, ativos e valuation;
- configuração com **Django REST Framework** e **Simple JWT**;
- proteção padrão das APIs com autenticação JWT;
- uso de **PostgreSQL** no ambiente principal;
- configuração de ambiente de testes com **SQLite em memória**;
- CRUD de ativos via `ViewSet`;
- persistência relacional com banco de dados;
- endpoints de cálculo para:
  - **Graham**
  - **Barsi**
  - **Preço Teto Projetivo**
- persistência automática das análises realizadas;
- endpoints de histórico para:
  - **Graham**
  - **Barsi**
  - **Projetivo**
- uso de Django Admin para administração dos dados;
- organização preparada para expansão de regras de negócio.

### Autenticação

- login via API;
- refresh token via API;
- logout via API;
- endpoint `/auth/me/` para obter o usuário autenticado;
- geração de access token e refresh token;
- refresh token configurado em cookie **HTTP-only**;
- suporte a rotação de refresh token;
- limpeza de sessão local no frontend em caso de falha ou logout.

### Frontend

- frontend reestruturado em **React**;
- organização por `app`, `components`, `contexts`, `pages` e `services`;
- `AuthProvider` para gerenciamento de sessão;
- bootstrap automático da autenticação ao carregar a aplicação;
- carregamento do perfil do usuário autenticado após refresh;
- interceptor HTTP com renovação automática do access token;
- rotas protegidas com `ProtectedRoute`;
- layout principal com navegação entre páginas;
- tela de login;
- tela inicial da calculadora multimétodo;
- páginas individuais para:
  - **Graham**
  - **Barsi**
  - **Projetivo**
- componente para seleção de ativos;
- componente para exibição dos resultados;
- integração com o backend via API REST.

### Qualidade e organização

- workflow do **GitHub Actions** para **SonarCloud**;
- análise de qualidade contínua no repositório;
- métricas de:
  - Quality Gate
  - Bugs
  - Vulnerabilities
  - Code Smells
  - Coverage
  - Duplicated Lines
- estrutura pronta para evolução de testes e cobertura.

---

## 🔐 Fluxo de Autenticação Atual

O fluxo atual de autenticação do projeto funciona da seguinte forma:

1. o usuário acessa a tela de login;
2. envia usuário e senha;
3. o backend valida as credenciais;
4. o sistema retorna o access token e controla o refresh token;
5. o frontend salva o access token em memória;
6. ao iniciar a aplicação, o frontend tenta restaurar a sessão com `refresh`;
7. após obter um token válido, o frontend chama `/auth/me/`;
8. o usuário autenticado é carregado no contexto global;
9. caso uma requisição autenticada retorne `401`, o interceptor tenta renovar o token automaticamente;
10. se a renovação falhar, a sessão local é encerrada.

---

## 🔄 Fluxos Principais do Sistema

### 1. Fluxo de autenticação
1. usuário acessa `/login`;
2. envia credenciais;
3. backend valida os dados;
4. tokens de sessão são gerenciados;
5. frontend mantém o estado autenticado;
6. perfil do usuário autenticado é carregado;
7. as rotas internas passam a ficar acessíveis.

### 2. Fluxo de gestão de ativos
1. o ativo é cadastrado via backend;
2. o ativo é persistido no banco;
3. o frontend consome a lista de ativos;
4. os ativos ficam disponíveis para os cálculos nas páginas de valuation.

### 3. Fluxo de cálculo de valuation
1. usuário escolhe um método;
2. seleciona um ativo;
3. preenche os dados necessários;
4. frontend envia os dados para a API;
5. backend executa o cálculo;
6. backend persiste a análise correspondente;
7. resultado é retornado e exibido na interface;
8. a análise fica disponível para histórico no backend.

---

## 🌐 Endpoints Principais

### Auth
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`
- `POST /api/auth/logout/`
- `GET /api/auth/me/`

### Assets
- `GET /api/assets/`
- `POST /api/assets/`
- `PUT /api/assets/{id}/`
- `PATCH /api/assets/{id}/`
- `DELETE /api/assets/{id}/`

### Valuation
- `POST /api/valuation/graham/`
- `POST /api/valuation/projected/`
- `POST /api/valuation/barsi/`

### Histórico
- `GET /api/valuation/graham/history/`
- `GET /api/valuation/projected/history/`
- `GET /api/valuation/barsi/history/`

---

## 🧱 Modelos Principais

### Assets
- `Asset`
- `Dividend`

### Valuation
- `GrahamAnalysis`
- `ProjectedAnalysis`
- `BarsiAnalysis`

---

## 📁 Estrutura do Projeto

```text
InvestSmart/
├── .github/
│   └── workflows/
│       └── sonar.yml
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   │   ├── api/
│   │   │   ├── migrations/
│   │   │   ├── tests/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   ├── services.py
│   │   │   └── urls.py
│   │   ├── assets/
│   │   │   ├── api/
│   │   │   ├── migrations/
│   │   │   ├── tests/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   └── models.py
│   │   ├── valuation/
│   │   │   ├── api/
│   │   │   ├── migrations/
│   │   │   ├── services/
│   │   │   ├── tests/
│   │   │   ├── admin.py
│   │   │   ├── apps.py
│   │   │   └── models.py
│   │   └── __init__.py
│   ├── config/
│   │   ├── settings.py
│   │   ├── settings_test.py
│   │   └── urls.py
│   ├── core/
│   ├── Dockerfile
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx
│   │   │   └── routes.jsx
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── .env.example
├── docker-compose.yml
├── requirements.txt
├── sonar-project.properties
└── README.md
```

---

## 🖥️ Rotas do Frontend

### Públicas
- `/login`

### Protegidas
- `/`
- `/graham`
- `/projected`
- `/barsi`

---

## ⚙️ Variáveis de Ambiente

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
Se quiser definir explicitamente a URL base da API no frontend, crie um `.env` dentro de `frontend/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

> Se essa variável não for definida, o frontend já utiliza `http://127.0.0.1:8000/api` como padrão.

---

## 🧪 Como Executar o Projeto

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

### 6. Criar um superusuário (opcional, mas recomendado)
```bash
python manage.py createsuperuser
```

### 7. Subir o backend
Ainda dentro de `backend/`:

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

Frontend disponível em algo como:

```text
http://localhost:5173
```

---

## 🧪 Como Testar o Projeto

### Fluxo mínimo recomendado

1. iniciar backend e frontend;
2. criar ou ter um usuário válido;
3. fazer login no sistema;
4. validar a restauração da sessão;
5. validar o carregamento do perfil do usuário autenticado;
6. garantir que existam ativos cadastrados;
7. acessar as páginas:
   - Graham
   - Projetivo
   - Barsi
8. executar os cálculos;
9. validar se os resultados estão sendo exibidos corretamente;
10. validar no Admin ou no banco se as análises estão sendo persistidas;
11. validar os endpoints de histórico, se desejado.

### Acesso ao Admin
```text
http://127.0.0.1:8000/admin/
```

---

## 🧪 Testes Automatizados

O projeto possui configuração específica para testes com `settings_test.py`.

### Rodar testes
```bash
cd backend
python manage.py test --settings=config.settings_test
```

### Rodar com coverage
```bash
coverage run manage.py test --settings=config.settings_test
coverage report
coverage xml
```

### Ambiente de testes
O ambiente de testes utiliza:
- **SQLite em memória**;
- hasher simplificado para senhas;
- ajustes de segurança desabilitados para facilitar a execução local dos testes.

---

## 🧰 Tecnologias Utilizadas

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- python-dotenv
- django-cors-headers

### Frontend
- React
- Vite
- React Router DOM
- Axios
- Context API

### DevOps / Qualidade
- Docker
- Docker Compose
- GitHub
- GitHub Actions
- SonarCloud
- Coverage.py

### Engenharia de Software
- Arquitetura em camadas
- API REST
- Separação por responsabilidade
- Componentização
- Evolução incremental
- Base para TDD e testes automatizados
- Documentação orientada ao RFC

---

## 📌 Boas Práticas Aplicadas

- organização modular por domínio;
- separação entre frontend e backend;
- API REST desacoplada;
- componentização no frontend;
- contexto centralizado de autenticação;
- rotas protegidas;
- renovação automática de token no cliente;
- uso de variáveis sensíveis fora do código-fonte;
- autenticação baseada em JWT;
- uso de cookie HTTP-only para refresh token;
- persistência das análises no backend;
- histórico de cálculos por endpoint dedicado;
- uso de análise estática de código;
- crescimento guiado por requisitos do RFC e pelas entregas do Portfólio.

---

## 📚 Documentação do Projeto

A documentação do projeto contempla e/ou prevê:

- requisitos funcionais e não funcionais;
- casos de uso;
- decisões arquiteturais;
- diagramas de arquitetura;
- instruções de execução;
- histórico versionado no GitHub;
- base para documentação complementar em Wiki/repositório;
- material para apresentação no **Poster + Demo Day**.

---

## 📈 Roadmap

### Próximas evoluções
- interface para histórico de análises no frontend;
- cadastro/edição de ativos diretamente pela interface web;
- simulador de carteiras;
- dashboards de dividendos e valuation;
- integração com APIs externas de mercado;
- alertas automáticos por preço teto;
- ampliação dos testes automatizados;
- pipeline CI/CD mais completo;
- deploy público estável;
- observabilidade e monitoramento;
- melhorias contínuas de UX e responsividade.

---

## 📝 Status do MVP

O estado atual do MVP já contempla:

- autenticação com login, logout, refresh e `/me`;
- rotas protegidas no frontend;
- bootstrap automático de sessão;
- integração frontend ↔ backend funcional para autenticação;
- cálculo dos métodos **Graham**, **Barsi** e **Projetivo**;
- persistência das análises no banco;
- endpoints de histórico no backend;
- listagem de ativos para uso nos cálculos;
- organização sólida da arquitetura;
- base de qualidade com SonarCloud.

---

## 👨‍💻 Autor

**Lucas de Carvalho Steffens**  
Estudante de Engenharia de Software  
GitHub: [LucasCarvalhoSteffens](https://github.com/LucasCarvalhoSteffens)

---

## 🔗 Repositório

```text
https://github.com/LucasCarvalhoSteffens/InvestSmart
```