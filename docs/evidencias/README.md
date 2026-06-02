# Evidências — InvestSmart

Esta pasta deve reunir as evidências finais do projeto para comprovar funcionamento, qualidade, deploy, testes, monitoramento e validações.

---

## Estrutura Recomendada

```text
evidencias/
├── README.md
├── github-actions/
├── sonarcloud/
├── producao/
├── telas/
├── monitoramento/
├── orientacoes/
└── validacao-usuarios/
```

---

## 1. GitHub Actions

Pasta:

```text
docs/evidencias/github-actions/
```

Salvar evidências de:

- workflow de testes executado com sucesso;
- workflow do SonarCloud;
- workflow de deploy;
- histórico de execuções;
- logs resumidos do pipeline.

Sugestão de nomes:

```text
github-actions-sonar-sucesso.png
github-actions-deploy-sucesso.png
```

---

## 2. SonarCloud

Pasta:

```text
docs/evidencias/sonarcloud/
```

Salvar evidências de:

- Quality Gate;
- cobertura;
- bugs;
- vulnerabilidades;
- code smells;
- duplicação;
- histórico do projeto.

Sugestão de nomes:

```text
sonar-quality-gate.png
sonar-coverage.png
sonar-bugs-vulnerabilities.png
```

---

## 3. Produção

Pasta:

```text
docs/evidencias/producao/
```

Salvar evidências de:

- domínio em produção;
- HTTPS ativo;
- aplicação carregando;
- login funcionando;
- backend respondendo;
- containers ativos na VPS.

Sugestão de nomes:

```text
producao-home.png
producao-login.png
producao-https.png
vps-containers.png
```

---

## 4. Telas do Sistema

Pasta:

```text
docs/evidencias/telas/
```

Salvar prints de:

- login;
- tela inicial;
- calculadora Graham;
- calculadora Barsi;
- calculadora Projetiva;
- carteiras;
- simulação de carteira;
- dashboard;
- alertas.

Sugestão de nomes:

```text
tela-login.png
tela-dashboard.png
tela-graham.png
tela-barsi.png
tela-projetivo.png
tela-carteiras.png
tela-alertas.png
```

---

## 5. Monitoramento

Pasta:

```text
docs/evidencias/monitoramento/
```

Salvar evidências de:

- logs do backend;
- logs do scheduler;
- containers em execução;
- dashboard de monitoramento;
- uptime;
- métricas de resposta.

Sugestão de nomes:

```text
monitoramento-containers.png
monitoramento-logs-backend.png
monitoramento-logs-scheduler.png
monitoramento-dashboard.png
```

---

## 6. Orientações

Pasta:

```text
docs/evidencias/orientacoes/
```

Salvar evidências de:

- atas de orientação;
- e-mails;
- prints de reuniões;
- fotos;
- registros de encontros.

Sugestão de nomes:

```text
orientacao-01.png
orientacao-02.png
orientacao-03.png
orientacao-04.png
```

---

## 7. Validação com Usuários

Pasta:

```text
docs/evidencias/validacao-usuarios/
```

Salvar evidências de:

- feedback de colegas;
- testes de usabilidade;
- respostas de formulário;
- issues abertas por avaliadores;
- melhorias aplicadas após feedback.

Sugestão de nomes:

```text
validacao-feedback-usuario-01.png
validacao-formulario-resultados.png
validacao-issues-feedback.png
```

---

## Checklist de Evidências

- [ ] Aplicação em produção.
- [ ] HTTPS ativo.
- [ ] Workflow de CI passando.
- [ ] Workflow de deploy passando.
- [ ] SonarCloud atualizado.
- [ ] Testes backend.
- [ ] Testes frontend.
- [ ] Dashboard.
- [ ] Calculadoras.
- [ ] Carteiras.
- [ ] Alertas.
- [ ] Logs do scheduler.
- [ ] Observabilidade.
- [ ] Orientações.
- [ ] Validação com usuários.
