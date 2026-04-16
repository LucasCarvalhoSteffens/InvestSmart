# 📊 InvestSmart

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=bugs)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)

Plataforma web para **análise fundamentalista de ações**, com **calculadora multimétodo de valuation**, **autenticação JWT com refresh token**, **persistência de análises** e evolução para **simulação de carteiras de investimento**.

O projeto foi desenvolvido para concentrar, em um único ambiente, funcionalidades que normalmente ficam espalhadas em diferentes plataformas do mercado, com foco em **valuation**, **investimento em dividendos**, **comparação entre métodos de precificação** e expansão contínua do módulo de **carteiras e simulações**.

> **Status do projeto:** em desenvolvimento  
> **Estado descrito neste README:** considera a base estável da `main`, a evolução mais recente da `Dev` e os ajustes discutidos recentemente no projeto  
> **Natureza do projeto:** acadêmico/profissional, desenvolvido para a disciplina de **Portfólio** em **Engenharia de Software**  
> **Observação:** esta aplicação tem caráter educacional e de apoio à análise, não constituindo recomendação de investimento

---

## 🎯 Objetivo do Projeto

O **InvestSmart** busca oferecer uma experiência unificada para investidores pessoa física, principalmente iniciantes e intermediários, permitindo:

- cálculo de preço justo por múltiplos métodos;
- comparação entre abordagens de valuation;
- centralização de análises em uma única plataforma;
- persistência e histórico de cálculos;
- autenticação e organização das informações por usuário;
- gestão de carteiras com itens e alertas;
- evolução para simulação consolidada de carteiras;
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
- **Frontend React** desacoplado do backend via API REST;
- **Autenticação com JWT + refresh token** já estruturada;
- **Refresh token com cookie HTTP-only** e renovação automática do access token;
- **Carregamento do perfil do usuário autenticado** no frontend;
- **Rotas protegidas no frontend**;
- **Persistência automática das análises** no backend;
- **Endpoints de histórico** para Graham, Barsi e Projetivo;
- **Módulo de carteiras** com carteiras, itens e alertas por usuário;
- **Base pronta para simulação de carteiras**, consolidando preços-alvo manuais e referências vindas das análises;
- **Integração com SonarCloud** e pipeline de qualidade;
- **Arquitetura modular** para facilitar manutenção, testes e evolução do projeto.

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura **client-server em camadas**, alinhada ao RFC.

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

## 📐 Métodos de Valuation Implementados

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
- separação entre os domínios de **accounts**, **assets**, **valuation** e **portfolios**;
- configuração com **Django REST Framework** e **Simple JWT**;
- proteção padrão das APIs com autenticação JWT;
- uso de **PostgreSQL** no ambiente principal;
- configuração de ambiente de testes com **SQLite em memória**;
- CRUD de ativos via API;
- endpoints de cálculo para:
  - **Graham**
  - **Barsi**
  - **Preço Teto Projetivo**
- persistência automática das análises realizadas;
- endpoints de histórico para:
  - **Graham**
  - **Barsi**
  - **Projetivo**
- CRUD de carteiras por usuário autenticado;
- CRUD de itens das carteiras;
- CRUD de alertas vinculados aos itens da carteira;
- uso de Django Admin para administração dos dados.

### Autenticação

- login via API;
- refresh token via API;
- logout via API;
- endpoint `/api/auth/me/` para obter o usuário autenticado;
- geração de access token e refresh token;
- refresh token configurado em cookie **HTTP-only**;
- suporte a rotação de refresh token.

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

### Carteiras e simulação

- estrutura de carteiras persistida no banco;
- itens de carteira com quantidade, preço médio, preço-alvo manual e observações;
- alertas por item com gatilhos de preço;
- base de simulação em evolução para consolidar diferentes fontes de referência, priorizando:
  1. preço-alvo manual do item;
  2. preço teto projetivo;
  3. preço teto do método Barsi;
- suporte à exibição paralela do **fair price** de Graham como referência complementar.

### Qualidade e organização

- workflow do **GitHub Actions** para **SonarCloud**;
- análise de qualidade contínua no repositório;
- pipeline com execução de testes e geração de coverage;
- estrutura pronta para evolução de cobertura e testes automatizados.

---

## 🔐 Fluxo de Autenticação Atual

O fluxo atual de autenticação do projeto funciona da seguinte forma:

1. o usuário acessa a tela de login;
2. envia usuário e senha;
3. o backend valida as credenciais;
4. o sistema retorna o access token e controla o refresh token;
5. o frontend salva o access token em memória;
6. ao iniciar a aplicação, o frontend tenta restaurar a sessão com `refresh`;
7. após obter um token válido, o frontend chama `/api/auth/me/`;
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

### 2. Fluxo de valuation

1. usuário escolhe um método;
2. seleciona um ativo;
3. preenche os dados necessários;
4. frontend envia os dados para a API;
5. backend executa o cálculo;
6. backend persiste a análise correspondente;
7. resultado é retornado e exibido na interface;
8. a análise fica disponível para histórico.

### 3. Fluxo de carteiras

1. usuário autenticado cria uma carteira;
2. adiciona ativos com quantidade e preço médio;
3. define opcionalmente um preço-alvo manual;
4. cadastra alertas por item;
5. backend persiste os dados vinculados ao usuário;
6. frontend consome a carteira e seus itens para evolução das simulações.

### 4. Fluxo de simulação de carteira

1. o sistema busca os itens da carteira e seus ativos;
2. resolve a melhor referência de preço para cada item;
3. calcula métricas como valor investido, valor atual, cobertura e retorno estimado;
4. consolida um resumo da carteira;
5. prepara a base para exibição de oportunidades e comparações futuras.

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

### Portfolios

- `GET /api/portfolios/`
- `POST /api/portfolios/`
- `GET /api/portfolios/items/`
- `POST /api/portfolios/items/`
- `GET /api/portfolios/alerts/`
- `POST /api/portfolios/alerts/`

---

## 🧱 Modelos Principais

### Assets

- `Asset`
- `Dividend`

### Valuation

- `GrahamAnalysis`
- `ProjectedAnalysis`
- `BarsiAnalysis`

### Portfolios

- `Portfolio`
- `PortfolioItem`
- `PortfolioItemAlert`

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
│   │   ├── assets/
│   │   ├── portfolios/
│   │   └── valuation/
│   ├── config/
│   │   ├── settings.py
│   │   └── settings_test.py
│   ├── core/
│   └── manage.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── services/
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

## 🚀 Como Executar o Projeto

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
7. acessar as páginas de valuation;
8. executar os cálculos;
9. validar se os resultados estão sendo exibidos corretamente;
10. validar no Admin ou no banco se as análises estão sendo persistidas;
11. validar o módulo de carteiras;
12. validar os endpoints de histórico, se desejado.

### Acesso ao Admin

```text
http://127.0.0.1:8000/admin/
```

---

## ✅ Testes Automatizados

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
coverage xml -o coverage.xml
```

### Ambiente de testes

O ambiente de testes utiliza:

- **SQLite em memória**;
- hasher simplificado para senhas;
- ajustes de segurança desabilitados para facilitar a execução local dos testes.

---

## 🔍 Qualidade de Código

O projeto possui integração com **SonarCloud** e workflow no **GitHub Actions**.

### Configuração atual

- **Project Key:** `LucasCarvalhoSteffens_InvestSmart`
- **Organization:** `lucascarvalhosteffens`
- **Pipeline com testes e coverage** antes da análise do SonarCloud
- **Análise contínua** para Quality Gate, Bugs, Vulnerabilities, Code Smells, Coverage e Duplicated Lines

---

## 🌿 Organização das Branches

### `main`

Branch de referência mais estável do projeto, ideal para representar a base principal já consolidada.

### `Dev`

Branch de evolução mais recente, concentrando ajustes e incrementos do frontend, autenticação, carteiras, testes e simulações antes da consolidação final.

---

## 📌 Status Atual do Projeto

### Já consolidado

- calculadora multimétodo;
- persistência de análises;
- frontend React integrado ao backend;
- autenticação com JWT e refresh token;
- rotas protegidas;
- CRUD de ativos;
- histórico de análises;
- módulo inicial de carteiras;
- alertas por item;
- SonarCloud com workflow de qualidade.

### Em evolução

- consolidação completa da simulação de carteiras;
- refinamento das métricas agregadas da carteira;
- ampliação da cobertura de testes;
- integração com fontes externas de dados de mercado;
- dashboards de dividendos, comparação e projeções;
- deploy final em nuvem com observabilidade mais robusta.

---

## 🗺️ Roadmap

Próximas evoluções planejadas para o projeto:

- finalizar e estabilizar o fluxo completo do simulador de carteiras;
- expandir os testes unitários e de integração;
- integrar APIs financeiras externas;
- preencher dados de ativos automaticamente;
- criar dashboards com indicadores fundamentalistas;
- permitir comparação entre empresas e entre métodos;
- ampliar os alertas e a visão consolidada da carteira;
- realizar deploy em nuvem;
- evoluir observabilidade e monitoramento;
- concluir a documentação técnica final para entrega acadêmica.

---

## 🎓 Contexto Acadêmico

O **InvestSmart** é desenvolvido como projeto de **Portfólio em Engenharia de Software**, com foco em:

- organização arquitetural;
- evolução incremental;
- qualidade de código;
- versionamento contínuo;
- documentação técnica;
- testes automatizados;
- integração contínua;
- deploy e apresentação pública do projeto.

---

## 👨‍💻 Autor

**Lucas de Carvalho Steffens**

- GitHub: [LucasCarvalhoSteffens](https://github.com/LucasCarvalhoSteffens)

