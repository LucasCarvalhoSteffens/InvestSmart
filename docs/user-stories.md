# User Stories e Fluxos de Negócio — InvestSmart

## User Stories

### Autenticação

Como usuário, quero fazer login na plataforma para acessar minhas carteiras e análises.

Critérios de aceite:

- o usuário consegue informar credenciais;
- o sistema valida login e senha;
- o usuário autenticado acessa rotas protegidas;
- o usuário pode encerrar sessão.

---

### Cálculo Graham

Como usuário, quero calcular o preço justo de uma ação pelo método de Graham para avaliar seu valor fundamentalista.

Critérios de aceite:

- o usuário informa ativo, LPA e VPA;
- o sistema calcula o preço justo;
- o resultado é exibido claramente na tela.

---

### Cálculo Barsi

Como usuário, quero calcular o preço teto pelo método Barsi para avaliar ações com foco em dividendos.

Critérios de aceite:

- o usuário informa dividendos, preço atual e yield alvo;
- o sistema calcula preço teto e margem;
- o sistema indica se existe oportunidade.

---

### Cálculo Projetivo

Como usuário, quero calcular o preço teto projetivo para simular cenários com base em dividendos e yield médio.

Critérios de aceite:

- o usuário informa DPA e dividend yield médio;
- o sistema calcula o preço teto;
- o resultado é apresentado de forma compreensível.

---

### Gerenciamento de Carteiras

Como usuário, quero criar carteiras e adicionar ativos para acompanhar minhas simulações.

Critérios de aceite:

- o usuário cria uma carteira;
- o usuário adiciona ativos;
- o usuário informa quantidade, preço médio e preço teto;
- os dados ficam persistidos.

---

### Simulação de Carteira

Como usuário, quero visualizar o resumo da minha carteira para entender exposição, oportunidades e margem de segurança.

Critérios de aceite:

- o sistema calcula valor investido;
- o sistema calcula valor atual;
- o sistema compara preço atual com preço teto;
- o sistema exibe oportunidades.

---

### Alertas Automáticos

Como usuário, quero receber alertas quando o preço de um ativo ficar acima ou abaixo do preço teto.

Critérios de aceite:

- o sistema verifica periodicamente os ativos;
- o sistema gera eventos de alerta;
- o usuário consegue visualizar alertas recentes;
- o usuário consegue marcar alertas como lidos.

---

### Dashboard

Como usuário, quero visualizar gráficos e indicadores da carteira para compreender rapidamente minha posição.

Critérios de aceite:

- o dashboard exibe KPIs;
- o dashboard exibe gráficos;
- o dashboard lista oportunidades;
- o dashboard mostra alertas recentes.

---

## Fluxos de Negócio

### Fluxo 1 — Login

```text
Usuário acessa /login
  -> informa credenciais
  -> backend valida
  -> frontend recebe token
  -> usuário acessa área protegida
```

### Fluxo 2 — Valuation

```text
Usuário escolhe método
  -> informa dados
  -> frontend envia para API
  -> backend calcula
  -> resultado é retornado
  -> usuário visualiza preço justo/preço teto
```

### Fluxo 3 — Carteira

```text
Usuário cria carteira
  -> adiciona ativos
  -> informa quantidade e preço médio
  -> sistema salva no PostgreSQL
  -> usuário consulta a carteira posteriormente
```

### Fluxo 4 — Simulação

```text
Usuário acessa carteira
  -> sistema busca ativos
  -> sistema resolve preço atual e preço teto
  -> sistema calcula métricas
  -> frontend exibe resumo e oportunidades
```

### Fluxo 5 — Alertas

```text
Scheduler executa rotina
  -> busca itens das carteiras
  -> atualiza cotações
  -> compara preço atual e preço teto
  -> cria eventos de alerta
  -> usuário visualiza na tela de alertas
```
