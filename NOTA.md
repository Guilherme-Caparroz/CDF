> Este arquivo e **gerado automaticamente** pelo CI a cada push na branch `main`.
> Nao edite a mao: o proximo commit do CI sobrescreve. Para ver a rodada no Actions:
> https://github.com/Guilherme-Caparroz/CDF/actions/workflows/pam-ci.yml

## Nota PAM I — Controle Financeiro Diário (lançamentos)

![](https://img.shields.io/static/v1?label=Nota%20PAM%20I&message=MB&color=green)

**Nota atual: MB** · 89% (49/55 pontos) · rodada de 2026-10-05 23:26:22 · commit `local`

Legenda: I = Insuficiente (0–25%) · R = Regular (25–50%) · B = Bom (50–75%) · MB = Muito bom (75–100%)

| Fase | Pontos | Situação |
|---|---|---|
| Fase 1 — Estrutura | 9/10 | em desenvolvimento |
| Fase 2 — AsyncStorage | 14/15 | em desenvolvimento |
| Fase 3 — SQLite | 26/30 | em desenvolvimento |

## Checklist validado

### Fase 1 — Estrutura do projeto (9/10 pts)

- [x] **(+1 pts)** README.md existe e fala do projeto/grupo — `README.md`
- [x] **(+1 pts)** Arquivo principal do app existe (src/app/_layout.tsx) — `src/app/_layout.tsx`
- [x] **(+1 pts)** package.json existe com a dependência "expo" — `expo ~57.0.15`
- [x] **(+1 pts)** Existe tela de LISTAGEM — `src/app/(tabs)/index.tsx`
- [x] **(+1 pts)** Existem dados iniciais (seed) em arquivo de dados — `src/app/dados.js`
- [x] **(+1 pts)** Existe tela de FORMULÁRIO — `src/app/adicionar.tsx`
- [x] **(+1 pts)** Existe tela de DETALHE — `src/app/detalhes.tsx`
- [ ] **(+1 pts)** Dependências importadas existem no package.json (app não quebra ao abrir) — `fs, path, readline, @/components/animated-icon, @/components/app-tabs`
- [x] **(+1 pts)** app.json identifica o app (name/slug preenchidos) — `app.json`
- [x] **(+1 pts)** Projeto tem pelo menos 2 arquivos de tela/código — `2 arquivos de tela`

### Fase 2 — Persistência com AsyncStorage (14/15 pts)

- [x] **(+1 pts)** Dependência async-storage está no package.json — `no package.json`
- [x] **(+1 pts)** Existe import do AsyncStorage no código — `src/app/dados.js`
- [x] **(+1 pts)** Storage faz leitura com AsyncStorage.getItem — `src/app/dados.js`
- [x] **(+1 pts)** Storage grava com AsyncStorage.setItem — `src/app/dados.js`
- [x] **(+1 pts)** Existe função de CARREGAR a lista (carregar/load) — `src/app/(tabs)/index.tsx`
- [x] **(+1 pts)** Existe função de ADICIONAR/CADASTRAR — `src/app/(tabs)/index.tsx`
- [x] **(+1 pts)** Existe busca por id (buscar/find/getItem) — `src/app/dados.js`
- [x] **(+1 pts)** Existe função de EXCLUIR/remover — `src/app/(tabs)/index.tsx`
- [x] **(+1 pts)** Formulário lê entradas com TextInput — `src/app/adicionar.tsx`
- [x] **(+1 pts)** Formulário salva chamando adicionar/salvar — `src/app/adicionar.tsx`
- [x] **(+1 pts)** Lista é alimentada a partir do storage — `src/app/(tabs)/index.tsx`
- [x] **(+1 pts)** Tela de detalhe usa busca/dados do storage — `src/app/detalhes.tsx`
- [x] **(+1 pts)** Exclusão usa confirmação (Alert.alert) — `src/app/(tabs)/index.tsx`
- [x] **(+1 pts)** Dados iniciais/seed são gravados na 1ª execução — `src/app/dados.js`
- [ ] **(+1 pts)** Formulário valida campos (trim/length/vazio) — `src/app/adicionar.tsx`

### Fase 3 — Banco de dados SQLite (26/30 pts)

- [x] **(+2x2 pts)** Dependência expo-sqlite está no package.json — `no package.json`
- [x] **(+2x2 pts)** Existe import do expo-sqlite — `src/database/database.ts`
- [x] **(+2x2 pts)** Existe arquivo de banco de dados — `src/database/database.ts`
- [x] **(+2x2 pts)** Cria a tabela com CREATE TABLE IF NOT EXISTS — `src/database/database.ts`
- [x] **(+2x2 pts)** Insere dados com INSERT INTO — `src/database/database.ts`
- [x] **(+2x2 pts)** Consulta com SELECT — `src/components/themed-text.tsx`
- [x] **(+2x2 pts)** Atualiza com UPDATE — `src/database/database.ts`
- [x] **(+2x2 pts)** Exclui com DELETE FROM — `src/database/database.ts`
- [x] **(+2x2 pts)** Usa filtros com WHERE — `src/app/(tabs)/index.tsx`
- [x] **(+2x2 pts)** Banco aberto com openDatabaseAsync/openDatabase — `src/database/database.ts`
- [x] **(+2x2 pts)** Tela de lista carrega dados do banco — `src/app/(tabs)/index.tsx`
- [ ] **(+2x2 pts)** Formulário salva no banco (INSERT/runAsync) — `src/app/adicionar.tsx`
- [ ] **(+2x2 pts)** Detalhe busca no banco com WHERE/SELECT — `src/app/detalhes.tsx`
- [x] **(+2x2 pts)** Usa async/await corretamente (mais de 2 await) — `scripts/reset-project.js`
- [x] **(+2x2 pts)** Banco possui dados iniciais (seed inserido em SQL) — `src/database/database.ts`

## Para evoluir a nota

Os itens **desmarcados** acima são exatamente o que falta no projeto. Cada rodada deste CI (a cada push) recalcula e atualiza a nota — o artefato `nota-pam` sempre mostra o valor mais recente.
