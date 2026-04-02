# 📊 InvestSmart

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=bugs)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=coverage)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=LucasCarvalhoSteffens_InvestSmart&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=LucasCarvalhoSteffens_InvestSmart)

Plataforma web para **análise fundamentalista de ações** e evolução para **simulação de carteiras de investimento**, desenvolvida com **Django REST Framework**, **React** e **PostgreSQL**.

O projeto foi idealizado para reunir, em um único ambiente, funcionalidades que normalmente estão espalhadas em diferentes plataformas de mercado, com foco em **valuation**, **investimento em dividendos**, **comparação entre métodos de precificação** e futura **simulação de carteiras**.

> **Status do projeto:** em desenvolvimento  
> **Natureza do projeto:** acadêmico/profissional, desenvolvido para a disciplina de **Portfólio** em **Engenharia de Software**  
> **Observação:** esta aplicação tem caráter educacional e de apoio à análise, não constituindo recomendação de investimento.

---

## 🚀 Objetivo do Projeto

O **InvestSmart** busca oferecer uma experiência unificada para investidores pessoa física, principalmente iniciantes e intermediários, permitindo:

- cálculo de preço justo por múltiplos métodos;
- comparação entre abordagens de valuation;
- centralização de análises em uma única plataforma;
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
- **Arquitetura modular** para facilitar manutenção e evolução;
- **Backend desacoplado do frontend** via API REST;
- **Autenticação com JWT e refresh token** em evolução;
- **Base preparada para histórico de análises** e associação por usuário;
- **Estrutura pronta para simulador de carteiras**, alertas e dashboards;
- **Integração com ferramentas de qualidade**, como SonarCloud;
- **Foco em boas práticas de Engenharia de Software**, com separação por responsabilidade, organização em camadas e crescimento incremental.

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura **client-server em camadas**, conforme definido no RFC.

### Stack principal

- **Frontend:** React
- **Backend:** Django REST Framework
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT com access token e refresh token
- **Comunicação:** API REST
- **Infraestrutura local:** Docker / Docker Compose
- **Qualidade:** SonarCloud
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
- LPA
- VPA

**Fórmula base:**
```text
Preço Justo = √(22.5 × LPA × VPA)
```

**Saída principal:**
- preço justo estimado

---

### 2. Método Barsi

Método focado em dividendos, calculando o preço teto com base no dividendo anual e no dividend yield alvo.

**Entradas principais:**
- dividendos informados
- cotação atual
- dividend yield alvo

**Lógica base:**
```text
Dividendo Anual = soma dos dividendos informados
Preço Teto = Dividendo Anual / Dividend Yield Alvo
Margem = Preço Teto - Cotação Atual
```

**Saídas principais:**
- dividendo anual
- dividend yield atual
- preço teto
- margem
- indicação de oportunidade de compra

---

### 3. Preço Teto Projetivo

Método voltado para projeção do preço teto com base em dividendo por ação e dividend yield médio.

**Entradas principais:**
- DPA
- dividend yield médio

**Lógica base:**
```text
Preço Teto = DPA / Dividend Yield Médio
```

**Saídas principais:**
- preço bruto estimado
- preço teto ajustado

---

## ✅ Funcionalidades Implementadas

### Backend

- API REST modularizada em `apps`;
- separação entre domínio de autenticação, ativos e valuation;
- CRUD de ativos;
- persistência relacional com PostgreSQL;
- endpoints de cálculo para:
  - **Graham**
  - **Barsi**
  - **Preço Teto Projetivo**
- estrutura para persistência de análises;
- uso de Django Admin para administração dos dados;
- organização preparada para expansão de regras de negócio.

### Frontend

- frontend reestruturado em **React**;
- organização por páginas, serviços e contexto;
- tela de login;
- navegação principal para os métodos de cálculo;
- páginas individuais para:
  - **Graham**
  - **Barsi**
  - **Projetivo**
- integração com o backend via API REST;
- base para rotas protegidas;
- fluxo inicial de autenticação em evolução.

### Segurança e organização

- uso de variáveis sensíveis via `.env`;
- autenticação baseada em JWT em evolução;
- separação entre credenciais e código-fonte;
- base preparada para uso de refresh token;
- estrutura desacoplada entre frontend e backend;
- organização modular do código;
- base preparada para testes automatizados e crescimento incremental.

---

## 🔐 Autenticação

A autenticação do sistema está sendo estruturada com foco em:

- **JWT Access Token**
- **Refresh Token**
- proteção de rotas no frontend
- envio de `Authorization: Bearer <token>` para rotas protegidas
- identificação do usuário autenticado via rota `/api/auth/me/`

### Status atual da autenticação

- fluxo de login já entrou no escopo implementado;
- integração com refresh token foi trabalhada no projeto;
- contexto de autenticação no frontend já faz parte da estrutura recente;
- parte da estabilização do fluxo completo ainda está em andamento;
- proteção completa por usuário e refinamento de sessão ainda seguem em evolução.

---

## 🔄 Fluxos Principais do Sistema

### 1. Fluxo de autenticação
1. usuário acessa a tela de login;
2. envia credenciais;
3. backend valida os dados;
4. tokens de sessão são gerenciados;
5. frontend mantém o estado autenticado.

### 2. Fluxo de gestão de ativos
1. usuário cadastra um ativo;
2. ativo é persistido no banco;
3. sistema permite listar, editar e excluir registros;
4. os ativos podem ser utilizados nas análises.

### 3. Fluxo de cálculo de valuation
1. usuário escolhe um método;
2. preenche os dados necessários;
3. frontend envia os dados para a API;
4. backend executa o cálculo;
5. resultado é retornado e exibido na interface;
6. a persistência das análises está em fase de consolidação conforme as migrations da app `valuation`.

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
- `DELETE /api/assets/{id}/`

### Valuation
- `POST /api/valuation/graham/`
- `POST /api/valuation/projected/`
- `POST /api/valuation/barsi/`

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
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   │   ├── api/
│   │   │   ├── services.py
│   │   │   └── apps.py
│   │   ├── assets/
│   │   │   ├── api/
│   │   │   ├── models.py
│   │   │   └── apps.py
│   │   ├── valuation/
│   │   │   ├── api/
│   │   │   ├── services/
│   │   │   ├── models.py
│   │   │   └── apps.py
│   │   └── __init__.py
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── README.md
└── .env.example
```

---

## 🖥️ Estado Atual do Frontend

O frontend foi reorganizado para uma estrutura em **React**, com foco em:

- componentização;
- separação de páginas;
- integração com API REST;
- contexto centralizado de autenticação;
- crescimento futuro para rotas protegidas, dashboard e simulador.

### Fluxo atual esperado

1. o usuário acessa `/login`;
2. realiza autenticação;
3. é redirecionado para a página principal;
4. escolhe o método de cálculo;
5. preenche o formulário;
6. envia os dados para a API;
7. recebe o resultado na própria interface.

---

## ⚠️ Status Atual do Desenvolvimento

### Já funcionando no projeto

- estrutura backend organizada por domínio;
- CRUD de ativos;
- cálculo dos métodos **Graham**, **Barsi** e **Projetivo**;
- integração entre backend e banco PostgreSQL;
- navegação para as calculadoras;
- base de autenticação em evolução;
- integração de qualidade com SonarCloud;
- uso de Docker para banco de dados local;
- organização geral do projeto para evolução contínua.

### Pontos em consolidação

- estabilização completa do fluxo de login/logout/refresh token;
- persistência total das análises de valuation conforme migrations;
- histórico de análises por usuário;
- proteção integral das rotas autenticadas;
- sincronização completa entre backend e frontend reestruturado.

### Próximas entregas previstas

- simulador de carteiras;
- dashboards de dividendos e valuation;
- integração com APIs externas de mercado;
- alertas automáticos por preço teto;
- testes unitários e de integração;
- pipeline CI/CD completo;
- deploy público estável;
- observabilidade/monitoramento;
- documentação complementar para apresentação final.

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
pip install -r backend/requirements.txt
```

### 4. Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as variáveis abaixo:

```env
SECRET_KEY_DJANGO=django-insecure-dev-key
DEBUG=True

POSTGRES_DB=investsmart
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### 5. Subir o banco de dados com Docker

```bash
docker compose up -d
```

### 6. Rodar as migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

Se necessário, gere migrations específicas da app `valuation`:

```bash
python manage.py makemigrations valuation
python manage.py migrate
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

1. criar um usuário no Django;
2. iniciar backend e frontend;
3. fazer login no sistema;
4. cadastrar pelo menos um ativo;
5. testar os métodos:
   - Graham
   - Barsi
   - Projetivo
6. validar se os resultados estão sendo exibidos corretamente;
7. validar no admin ou no banco se as análises estão sendo persistidas.

### Acesso ao Admin

```text
http://127.0.0.1:8000/admin/
```

---

## 🧰 Tecnologias Utilizadas

### Backend
- Python
- Django
- Django REST Framework
- Simple JWT
- PostgreSQL
- psycopg2

### Frontend
- React
- Vite
- React Router DOM
- Axios

### DevOps / Qualidade
- Docker
- Docker Compose
- GitHub
- GitHub Actions
- SonarCloud

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
- organização em camadas;
- uso de variáveis sensíveis fora do código-fonte;
- autenticação baseada em token;
- estrutura preparada para escalabilidade e manutenção;
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

### Curto prazo
- concluir persistência das análises;
- estabilizar autenticação com JWT e refresh token;
- finalizar integração frontend ↔ backend;
- exibir resultados e histórico de forma mais completa na interface.

### Médio prazo
- implementar simulador de carteiras;
- integrar dados externos de mercado;
- desenvolver dashboards de dividendos e valuation;
- adicionar alertas automáticos por preço teto;
- melhorar UX, feedbacks visuais e responsividade.

### Longo prazo
- deploy público em nuvem;
- CI/CD com deploy automatizado;
- monitoramento e observabilidade;
- aumento da cobertura de testes;
- evolução para comparações setoriais e projeções avançadas.

---

## 📝 Status do MVP

O estado atual do MVP prioriza:

- calculadora multimétodo;
- organização sólida da arquitetura;
- integração entre backend e banco de dados;
- evolução do frontend em React;
- base de autenticação;
- crescimento incremental com foco em qualidade de software.

---

## 🔗 Repositório

```text
https://github.com/LucasCarvalhoSteffens/InvestSmart
```
