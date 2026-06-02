# Qualidade de Código — InvestSmart

## Objetivo

A qualidade de código é acompanhada por práticas de organização, testes automatizados, análise estática e integração contínua.

---

## Ferramentas

| Ferramenta | Uso |
|---|---|
| SonarCloud | Análise estática de código |
| GitHub Actions | Execução automatizada de testes e análise |
| coverage.py | Cobertura do backend |
| Vitest | Cobertura do frontend |
| ESLint | Padronização e análise do frontend |
| Docker | Padronização de ambiente |

---

## SonarCloud

O SonarCloud acompanha:

- bugs;
- vulnerabilidades;
- code smells;
- duplicações;
- cobertura de testes;
- qualidade em código novo.

Projeto:

```text
LucasCarvalhoSteffens_InvestSmart
```

---

## Workflow de Qualidade

```text
Push/Pull Request
  -> instala dependências
  -> executa testes backend
  -> gera coverage.xml
  -> executa testes frontend
  -> gera lcov.info
  -> envia análise ao SonarCloud
```

---

## Boas Práticas Aplicadas

- Separação de responsabilidades.
- Apps Django separados por domínio.
- Componentização no frontend.
- Serviços específicos para regras de negócio.
- Variáveis sensíveis fora do repositório.
- Testes automatizados.
- Uso de CI/CD.
- Revisão contínua via SonarCloud.
- Docker para consistência de ambiente.

---
