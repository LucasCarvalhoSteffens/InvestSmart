# Decisões Técnicas — InvestSmart

Este documento registra decisões técnicas relevantes do projeto e suas justificativas.

---

## 1. Uso de Django REST Framework no Backend

### Decisão

Utilizar Django REST Framework para construir a API backend.

### Justificativa

- Framework maduro;
- integração nativa com ORM;
- boa estrutura para autenticação;
- facilidade para serializers e views;
- aderência ao padrão MVC/camadas;
- bom suporte a testes.

---

## 2. Uso de React com Vite no Frontend

### Decisão

Utilizar React com Vite para a interface web.

### Justificativa

- bom desempenho em desenvolvimento;
- componentização;
- ecossistema amplo;
- compatibilidade com dashboards;
- facilidade para rotas protegidas;
- bom suporte a testes com Vitest.

---

## 3. Uso de PostgreSQL

### Decisão

Utilizar PostgreSQL como banco relacional.

### Justificativa

- banco robusto;
- suporte a integridade relacional;
- boa compatibilidade com Django;
- adequado para produção;
- evita uso de banco local em disco.

---

## 4. Uso de Docker e Docker Compose

### Decisão

Containerizar frontend, backend, banco e serviços auxiliares.

### Justificativa

- padronização de ambiente;
- facilidade de deploy;
- isolamento dos serviços;
- reprodutibilidade;
- aderência aos critérios de infraestrutura.

---

## 5. Uso de Caddy em Produção

### Decisão

Utilizar Caddy como reverse proxy e gerenciador de HTTPS.

### Justificativa

- configuração simples;
- HTTPS automático;
- boa integração com Docker;
- reduz complexidade de certificados.

---

## 6. Uso de SonarCloud

### Decisão

Utilizar SonarCloud para análise contínua de qualidade.

### Justificativa

- análise de bugs, vulnerabilidades e code smells;
- integração com GitHub Actions;
- evidência objetiva para avaliação;
- suporte a badges no README.

---

## 7. Uso de JWT

### Decisão

Utilizar autenticação JWT com refresh token protegido.

### Justificativa

- adequado para APIs REST;
- permite proteger rotas no frontend;
- separa autenticação da sessão tradicional;
- compatível com SPA.

---

## 8. Uso de Yahoo Finance/yfinance

### Decisão

Utilizar yfinance como fonte de dados de mercado.

### Justificativa

- acesso simplificado a cotações e informações financeiras;
- suficiente para contexto educacional;
- reduz necessidade de API paga;
- permite demonstrar integração externa real.

---

## 9. Separação da Documentação em `/docs`

### Decisão

Manter o README principal mais objetivo e mover documentação detalhada para `/docs`.

### Justificativa

- melhora organização;
- facilita avaliação;
- evita README excessivamente longo;
- permite evidências organizadas;
- facilita manutenção futura.
