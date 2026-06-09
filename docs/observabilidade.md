# Observabilidade — InvestSmart

## Objetivo

A observabilidade no InvestSmart tem como objetivo acompanhar o comportamento da aplicação em produção, identificar falhas, analisar desempenho e comprovar estabilidade técnica durante a entrega do projeto.

A estratégia adotada combina monitoramento automatizado com Prometheus e Grafana, análise de logs dos containers Docker e acompanhamento dos fluxos críticos da aplicação.

---

## Estratégia Atual

Atualmente, a observabilidade do InvestSmart contempla:

* monitoramento com Prometheus;
* dashboard visual no Grafana;
* coleta de métricas do backend Django pelo endpoint `/metrics`;
* acompanhamento de disponibilidade dos targets monitorados;
* métricas de requisições HTTP;
* métricas de latência da API;
* métricas de consultas ao banco de dados;
* métricas de latência do banco de dados;
* acompanhamento de memória e CPU do processo backend, quando disponíveis;
* logs dos containers Docker;
* logs do backend Django;
* logs do scheduler de alertas;
* logs do Caddy;
* acompanhamento dos workflows de CI/CD;
* acompanhamento da aplicação pública em ambiente produtivo.

---

## Arquitetura de Observabilidade

A estrutura de observabilidade implementada segue o seguinte fluxo:

```text
Aplicação Django
      |
      | expõe métricas em /metrics
      v
Prometheus
      |
      | consulta e armazena séries temporais
      v
Grafana
      |
      | exibe dashboards e indicadores
      v
Painéis de monitoramento
```

O Prometheus realiza a coleta periódica das métricas expostas pelo backend Django. O Grafana utiliza o Prometheus como fonte de dados para apresentar os indicadores em painéis visuais.

---

## Ferramentas Utilizadas

| Ferramenta        | Finalidade                             |
| ----------------- | -------------------------------------- |
| Prometheus        | Coleta e armazenamento de métricas     |
| Grafana           | Visualização dos dashboards            |
| django-prometheus | Exposição de métricas do Django        |
| Docker Compose    | Execução dos serviços em containers    |
| Caddy             | Proxy reverso e HTTPS                  |
| GitHub Actions    | CI/CD e validação automatizada         |
| SonarCloud        | Análise estática de código e qualidade |

---

## Métricas Monitoradas

| Métrica                         | Objetivo                                                              |
| ------------------------------- | --------------------------------------------------------------------- |
| Targets online                  | Verificar quais serviços estão sendo monitorados e respondendo        |
| Requisições HTTP por segundo    | Acompanhar o volume de acessos ao backend                             |
| Total de requisições no período | Medir uso da aplicação no intervalo selecionado                       |
| Latência HTTP P95               | Identificar lentidão nas respostas da API                             |
| Latência média HTTP             | Acompanhar o tempo médio de resposta                                  |
| Queries no banco por segundo    | Medir atividade no PostgreSQL                                         |
| Total de queries no banco       | Verificar volume de operações no banco                                |
| Latência P95 do banco           | Identificar lentidão em consultas SQL                                 |
| Novas conexões no banco         | Acompanhar abertura de conexões com o PostgreSQL                      |
| Memória do backend              | Avaliar consumo de memória do processo                                |
| CPU do backend                  | Avaliar consumo de processamento, quando a métrica estiver disponível |

---

## Métricas Disponíveis no Backend

O backend Django expõe métricas por meio do endpoint:

```text
/metrics
```

Entre as principais métricas utilizadas no dashboard estão:

```text
django_http_requests_before_middlewares_total
django_http_requests_latency_including_middlewares_seconds_bucket
django_http_requests_latency_including_middlewares_seconds_sum
django_http_requests_latency_including_middlewares_seconds_count
django_db_execute_total
django_db_new_connections_total
django_db_query_duration_seconds_bucket
django_db_query_duration_seconds_sum
django_db_query_duration_seconds_count
process_resident_memory_bytes
process_cpu_seconds_total
```

---

## Principais Consultas PromQL

### Targets online

```promql
sum(up)
```

### Alvos monitorados

```promql
up
```

### Requisições HTTP por segundo

```promql
sum(rate(django_http_requests_before_middlewares_total[10m])) or vector(0)
```

### Total de requisições HTTP no período

```promql
sum(increase(django_http_requests_before_middlewares_total[$__range])) or vector(0)
```

### Latência HTTP P95

```promql
histogram_quantile(
  0.95,
  sum(rate(django_http_requests_latency_including_middlewares_seconds_bucket[10m])) by (le)
) or vector(0)
```

### Latência média HTTP

```promql
(
  sum(rate(django_http_requests_latency_including_middlewares_seconds_sum[10m]))
  /
  clamp_min(sum(rate(django_http_requests_latency_including_middlewares_seconds_count[10m])), 1)
) or vector(0)
```

### Queries no banco por segundo

```promql
sum(rate(django_db_execute_total[10m])) or vector(0)
```

### Total de queries no banco no período

```promql
sum(increase(django_db_execute_total[$__range])) or vector(0)
```

### Latência P95 do banco

```promql
histogram_quantile(
  0.95,
  sum(rate(django_db_query_duration_seconds_bucket[10m])) by (le)
) or vector(0)
```

### Novas conexões no banco

```promql
sum(rate(django_db_new_connections_total[10m])) or vector(0)
```

### Memória do backend

```promql
sum(process_resident_memory_bytes)
```

### CPU do backend

```promql
sum(rate(process_cpu_seconds_total[10m])) or vector(0)
```

---

## Comandos de Observabilidade

### Ver containers em execução

```bash
docker compose -f docker-compose.prod.yml ps
```

### Logs do backend

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 backend
```

### Logs do scheduler

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 scheduler
```

### Logs do frontend

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 frontend
```

### Logs do Caddy

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 caddy
```

### Logs do Prometheus

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 prometheus
```

### Logs do Grafana

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 grafana
```

---

## Verificação Manual das Métricas

Para validar se o backend está expondo métricas corretamente:

```bash
curl -k https://investsmartlcs.com/metrics
```

Para filtrar métricas HTTP:

```bash
curl -k https://investsmartlcs.com/metrics | grep django_http
```

Para filtrar métricas do banco:

```bash
curl -k https://investsmartlcs.com/metrics | grep django_db
```

---

## Teste de Geração de Tráfego

Para gerar tráfego e validar os painéis HTTP no Grafana:

```bash
for i in {1..100}; do
  curl -k -s -o /dev/null https://investsmartlcs.com/api/auth/login/
done
```

Após executar o comando, aguardar alguns segundos e atualizar o dashboard no Grafana.

---

## Dashboard Grafana

O dashboard do Grafana foi configurado para exibir indicadores relacionados à saúde da aplicação e ao comportamento do backend em produção.

Painéis principais:

* serviços monitorados online;
* requisições por segundo;
* total de requisições no período;
* latência P95 da API;
* latência média da API;
* queries no banco por segundo;
* total de queries no banco;
* latência P95 do banco;
* novas conexões no PostgreSQL;
* memória do backend;
* CPU do backend, quando disponível.

---

## Observações sobre as Métricas HTTP

As métricas atuais expostas pelo `django-prometheus` permitem acompanhar dados gerais da aplicação, como volume de requisições e latência.

No estado atual, o projeto ainda não possui instrumentação personalizada para detalhar requisições por:

* rota;
* método HTTP;
* status HTTP;
* tipo de exceção.

Essa melhoria pode ser adicionada futuramente por meio de um middleware customizado com métricas específicas do InvestSmart.

Mesmo sem essa instrumentação adicional, o dashboard atual já permite acompanhar o comportamento geral da aplicação em produção e comprovar a existência de uma estratégia de observabilidade funcional.

---
