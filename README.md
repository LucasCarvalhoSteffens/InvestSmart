# 📊 InvestSmart

Aplicação web desenvolvida com Django para gerenciamento e análise fundamentalista de ativos financeiros.

---

## 🚀 Tecnologias Utilizadas

- Python 3
- Django
- PostgreSQL
- Docker
- HTML

---

## 🏗️ Arquitetura do Projeto

```
InvestSmart/
│
├── backend/
│   ├── assets/          # App responsável pelos ativos financeiros
│   ├── config/          # Configurações principais do projeto Django
│   └── manage.py
│
├── docker-compose.yml   # Container PostgreSQL
├── requirements.txt     # Dependências Python
├── .env                 # Variáveis de ambiente (não versionado)
└── README.md
```

---

## ⚙️ Como Executar o Projeto

### 1️⃣ Clonar o repositório

```bash
git clone <url-do-repositorio>
cd InvestSmart
```

---

### 2️⃣ Criar e ativar ambiente virtual

```bash
python -m venv venv
```

#### Windows:
```bash
venv\Scripts\activate
```

#### Linux/Mac:
```bash
source venv/bin/activate
```

---

### 3️⃣ Instalar dependências

```bash
pip install -r requirements.txt
```

---

### 4️⃣ Criar arquivo `.env`

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```
POSTGRES_DB=your_database
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

⚠️ Esse arquivo NÃO deve ser versionado.

---

### 5️⃣ Subir banco de dados com Docker

Certifique-se de que o Docker está instalado e em execução.

```bash
docker compose up -d
```

Verifique se o container está ativo:

```bash
docker ps
```

---

### 6️⃣ Rodar migrations

```bash
cd backend
python manage.py migrate
```

---

### 7️⃣ Criar superusuário (opcional)

```bash
python manage.py createsuperuser
```

---

### 8️⃣ Iniciar servidor

```bash
python manage.py runserver
```

Acesse:

- Admin: http://127.0.0.1:8000/admin/
- Aplicação: http://127.0.0.1:8000/assets/

---

## 📦 Funcionalidades Atuais

- CRUD completo de ativos financeiros
- Persistência em PostgreSQL
- Interface administrativa via Django Admin
- Estrutura preparada para evolução com APIs externas

---

## 🛠️ Roadmap do Projeto

- Integração com API financeira
- Atualização automática de preços
- Dashboard com indicadores
- Testes automatizados
- Dockerização completa do backend
- Deploy em ambiente cloud

---

## 🐳 Banco de Dados

O projeto utiliza PostgreSQL rodando em container Docker.

A configuração é feita via variáveis de ambiente definidas no arquivo `.env`.

---

## 🔐 Segurança

- Credenciais não são versionadas
- Uso de variáveis de ambiente
- `.env` incluído no `.gitignore`
- `venv/` não versionado

---

## 📌 Objetivo do Projeto

Demonstrar:

- Organização de arquitetura backend
- Separação entre aplicação e infraestrutura
- Uso de containers
- Evolução incremental com boas práticas

---

## 🧠 Observações

Antes de rodar o projeto, certifique-se de:

- Docker estar ativo
- Ambiente virtual ativado
- Arquivo `.env` configurado corretamente

Caso altere modelos:

```bash
python manage.py makemigrations
python manage.py migrate
```

---
