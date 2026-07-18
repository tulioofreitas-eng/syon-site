# Site Syon Incorporações

Site institucional + captação de leads + vitrine pública de progresso de obra.

## ⚠️ IMPORTANTE — não divulgar ainda

Por decisão do Marco (17/jul): construir e publicar num link do Vercel agora,
mas **não divulgar publicamente** até existirem 3 empreendimentos prontos em
paralelo (dá mais credibilidade que lançar só com o Alvin). Até lá, o link
fica só pra uso interno/apresentação.

## Setup

Segue o mesmo processo já usado pro Royal Splash e pro Viabilix:

```bash
npm install
npm run build   # confere que builda limpo antes de publicar
```

Variáveis de ambiente necessárias (Vercel → Settings → Environment Variables,
e `.env` local pra testar):

```
SUPABASE_URL=https://ndabjzvtuelpuooyngdw.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<secret key do Supabase — Project Settings > API>
PUBLIC_SUPABASE_URL=https://ndabjzvtuelpuooyngdw.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=<publishable key do Supabase — a pública, não a secreta>
```

Repara que tem **duas** variáveis de URL — `SUPABASE_URL` (sem prefixo, só
usada no servidor pelo endpoint `/api/lead`) e `PUBLIC_SUPABASE_URL` (com
prefixo `PUBLIC_`, exposta no navegador, usada pela vitrine de progresso pra
buscar os dados direto do banco). O prefixo `PUBLIC_` é o que o Astro exige
pra uma variável ficar disponível no código que roda no navegador — não
esquece dele, senão a vitrine de progresso não funciona.

A `PUBLIC_SUPABASE_PUBLISHABLE_KEY` é a chave **pública** (não a secreta) —
tudo bem ela aparecer no código do navegador, é pra isso que ela existe. A
tabela que ela consulta (`obra_fases_publicas`) só permite leitura pública
mesmo, protegida por RLS — não dá pra escrever com essa chave.

## Estrutura

```
src/pages/
  index.astro           → /
  empreendimentos/
    index.astro          → /empreendimentos
    alvin.astro           → /empreendimentos/alvin
  sobre.astro            → /sobre
  contato.astro          → /contato
  api/lead.ts            → endpoint de captura de lead
```

## Pendências de conteúdo

- Domínio próprio (`.inc` é caro — decisão adiada, sem prazo)
- E-mail de contato ainda é placeholder (`contato@syon.example.com.br`)
- Fotos reais do Projeto Alvin (hoje é um ícone genérico de prédio)
- Alimentar `obra_fases_publicas` com o progresso real quando a obra começar
  (ver exemplo de INSERT no chat com o Claude)
- 2º e 3º empreendimentos, quando fecharem — replica o padrão de
  `empreendimentos/alvin.astro` pra cada um novo
