# Observabilidade — InvestSmart

## Objetivo

A observabilidade permite acompanhar o comportamento da aplicação em produção, identificar falhas e comprovar estabilidade durante a entrega.

---

## Estratégia Atual

Atualmente, a observabilidade do InvestSmart contempla:

- logs dos containers Docker;
- logs do backend Django;
- logs do scheduler de alertas;
- status dos containers em produção;
- acompanhamento dos workflows de CI/CD;
- acompanhamento manual da aplicação pública;
- rastreamento de erros em endpoints;
- verificação da rotina periódica de alertas.

---

## Comandos de Observabilidade Atual

Ver containers:

```bash
docker compose -f docker-compose.prod.yml ps
```

Logs do backend:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 backend
```

Logs do scheduler:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 scheduler
```

Logs do frontend:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 frontend
```

Logs do Caddy:

```bash
docker compose -f docker-compose.prod.yml logs --tail=100 caddy
```

---

## Métricas Importantes

| Métrica | Objetivo |
|---|---|
| Disponibilidade da aplicação | Verificar se o domínio está acessível |
| Tempo de resposta | Identificar lentidão |
| Erros HTTP 4xx e 5xx | Detectar falhas de cliente ou servidor |
| Status dos containers | Confirmar serviços ativos |
| Execução do scheduler | Confirmar geração de alertas automáticos |
| Falhas na API externa | Identificar indisponibilidade do Yahoo Finance |
| Uso de CPU/RAM | Avaliar consumo da VPS |

---

## Próximo Passo Recomendado

Adicionar ferramenta dedicada de monitoramento.

Opções:

- Grafana + Prometheus;
- Uptime Kuma;
- UptimeRobot;
- New Relic;
- Datadog.

Para o contexto acadêmico, uma implementação simples com Grafana/Prometheus ou Uptime Kuma já é suficiente para evidenciar maturidade técnica.

---

## Evidências Recomendadas

Salvar em:

```text
docs/evidencias/monitoramento/
```

Evidências sugeridas:

- dashboard de monitoramento;
- status da aplicação online;
- logs do scheduler;
- logs do backend;
- containers ativos;
- gráfico de disponibilidade;
- gráfico de requisições ou tempo de resposta.
