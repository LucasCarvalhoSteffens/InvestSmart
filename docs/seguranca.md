# Segurança — InvestSmart

## Objetivo

Documentar as práticas de segurança aplicadas no projeto, especialmente autenticação, proteção de dados, comunicação segura e configuração por ambiente.

---

## Autenticação

O sistema utiliza autenticação baseada em JWT.

Fluxo:

```text
Usuário faz login
  -> backend valida credenciais
  -> access token é retornado
  -> refresh token é gerenciado por cookie HTTP-only
  -> frontend acessa rotas protegidas
```

---

## Medidas Aplicadas

| Medida | Descrição |
|---|---|
| JWT | Autenticação baseada em token |
| Cookie HTTP-only | Reduz exposição do refresh token ao JavaScript |
| Rotas protegidas | Impede acesso não autenticado a páginas internas |
| HTTPS | Comunicação criptografada em produção |
| CORS por ambiente | Restringe origens permitidas |
| CSRF configurado | Proteção em requisições sensíveis |
| ORM Django | Reduz risco de SQL Injection |
| Variáveis de ambiente | Evita credenciais no código |
| `.env.production` fora do Git | Protege segredos de produção |
| `DEBUG=False` em produção | Evita exposição de erros sensíveis |

---

## Dados Armazenados

O sistema armazena apenas dados necessários para funcionamento:

- usuário;
- e-mail;
- senha;
- carteiras;
- ativos;
- resultados de análise;
- eventos de alerta.

---

## Cuidados com Produção

Checklist de segurança:

- [ ] `DEBUG=False`;
- [ ] `SECRET_KEY_DJANGO` forte;
- [ ] `.env.production` fora do Git;
- [ ] HTTPS ativo;
- [ ] `ALLOWED_HOSTS` restrito;
- [ ] `CORS_ALLOWED_ORIGINS` restrito;
- [ ] `CSRF_TRUSTED_ORIGINS` restrito;
- [ ] banco não exposto publicamente;
- [ ] containers rodando apenas com portas necessárias;
- [ ] logs sem credenciais.

---

## Limitações

O projeto possui finalidade acadêmica e não contempla:

- autenticação multifator;
- integração com corretoras;
- execução real de ordens;
- custódia de ativos;
- recomendação automatizada de investimento;
- tratamento de dados financeiros sensíveis reais.
