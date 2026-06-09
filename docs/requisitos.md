# Requisitos — InvestSmart

## Requisitos Funcionais

| Código | Requisito | Status |
|---|---|---|
| RF01 | Calcular preço justo pelo método de Graham | Implementado |
| RF02 | Calcular preço teto projetivo | Implementado |
| RF03 | Calcular preço teto pelo método Barsi | Implementado |
| RF04 | Permitir cadastro, edição e exclusão de carteiras | Implementado |
| RF05 | Permitir cadastro, edição e exclusão de itens de carteira | Implementado |
| RF06 | Simular carteira com base em preço atual, preço médio e preço teto | Implementado |
| RF07 | Integrar dados de mercado por API externa | Implementado |
| RF08 | Exibir dashboards com indicadores e gráficos | Implementado |
| RF09 | Gerar alertas automáticos de preço versus preço teto | Implementado |
| RF10 | Realizar autenticação de usuários com JWT | Implementado |

---

## Requisitos Não Funcionais

| Código | Requisito | Status |
|---|---|---|
| RNF01 | Interface web responsiva e navegável | Implementado |
| RNF02 | Backend próprio com API REST | Implementado |
| RNF03 | Persistência em banco relacional PostgreSQL | Implementado |
| RNF04 | Autenticação e proteção de rotas | Implementado |
| RNF05 | Deploy público em ambiente de produção | Implementado |
| RNF06 | CI/CD com GitHub Actions | Implementado |
| RNF07 | Testes automatizados | Implementado |
| RNF08 | Análise estática com SonarCloud | Implementado |
| RNF09 | Uso de Docker para padronização de ambiente | Implementado |
| RNF10 | Estratégia de observabilidade | Implementado |
| RNF11 | Documentação técnica no repositório | Implementado |
| RNF12 | HTTPS em produção | Implementado |

---

## Requisitos da Linha Web Apps

| Critério | Evidência |
|---|---|
| Aplicação web completa | Frontend React + Backend Django |
| Interface navegável | Rotas protegidas e páginas principais |
| Arquitetura definida | Documento `docs/arquitetura.md` |
| Código modular | Apps Django e componentes React |
| Repositório público | GitHub |
| Histórico de commits | Git |
| Pipeline CI/CD | GitHub Actions |
| Deploy público | Domínio em produção |
| Banco persistente | PostgreSQL |
| Testes automatizados | Backend e frontend |
| SonarCloud | Workflow de qualidade |
| Observabilidade | Logs, containers, scheduler e monitoramento em evolução |

---

## Regras de Negócio Principais

### Valuation

- O usuário pode calcular preço justo utilizando métodos diferentes.
- Cada método possui entradas e saídas próprias.
- Os resultados podem ser utilizados como referência nas simulações.

### Carteiras

- Cada carteira pertence a um usuário autenticado.
- Cada carteira pode possuir vários ativos.
- O sistema calcula métricas consolidadas da carteira.

### Alertas

- O sistema compara preço atual com preço teto.
- Um alerta é criado quando o ativo está acima ou abaixo/igual ao teto.
- Eventos podem ser marcados como lidos.
- O scheduler executa a verificação periodicamente.
