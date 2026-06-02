# Testes — InvestSmart

## Objetivo

A estratégia de testes do InvestSmart busca garantir confiabilidade nas regras de negócio, estabilidade da API e validação dos principais componentes do frontend.

---

## Testes do Backend

Tecnologias:

- Django TestCase;
- Django REST Framework APITestCase;
- coverage.py;
- settings específico para teste.

Executar testes:

```bash
cd backend
python manage.py test --settings=config.settings_test
```

Executar com cobertura:

```bash
coverage run manage.py test --settings=config.settings_test
coverage report
coverage xml -o coverage.xml
```

Arquivo de cobertura gerado:

```text
backend/coverage.xml
```

---

## Testes do Frontend

Tecnologias:

- Vitest;
- Testing Library;
- jsdom.

Executar testes:

```bash
cd frontend
npm test
```

Executar com cobertura:

```bash
npm run test:coverage
```

Arquivo de cobertura gerado:

```text
frontend/coverage/lcov.info
```

---

## Metas de Cobertura

| Camada | Meta Acadêmica |
|---|---|
| Backend | 75% |
| Frontend | 25% |

---

## Estratégia

### Backend

Prioridade de testes:

- serviços de valuation;
- serializers;
- views/endpoints;
- serviços de simulação;
- serviços de alertas;
- autenticação;
- regras de negócio críticas.

### Frontend

Prioridade de testes:

- renderização das páginas principais;
- comportamento dos formulários;
- autenticação;
- chamadas de API mockadas;
- componentes de dashboard;
- exibição de erros e estados de carregamento.

---
