# dashboard-pot

Dashboard do Programa Operação Trabalho (POT) com suporte a múltiplos anos.

## Dados por ano

- Manifesto: `client/public/data/pot/years.json`
- Arquivos anuais: `client/public/data/pot/<ano>.json` (ex.: `2025.json`)
- Fallback legado: `client/public/pot_dashboard_data.json`

### Como adicionar um novo ano

1. Crie `client/public/data/pot/<ano>.json` seguindo o mesmo schema de `2025.json`.
2. Adicione uma entrada em `client/public/data/pot/years.json`:
   - `year`: número do ano
   - `label` (opcional): texto exibido no seletor
   - `file`: caminho público do JSON (ex.: `/data/pot/2026.json`)
   - `sourceUrl` (opcional): link da fonte/dados abertos daquele ano
3. Ajuste `defaultYear` no manifesto se desejar mudar o ano padrão.

O visitante pode selecionar o ano no cabeçalho; a seleção também é refletida na URL via `?ano=<ano>`.

## Scripts

- `npm run dev` — ambiente de desenvolvimento
- `npm run check` — checagem TypeScript
- `npm run build` — build de produção


