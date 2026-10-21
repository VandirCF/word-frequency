# CLAUDE.md

Guia para o Claude Code (e para quem mais trabalhar neste repositório).

## Descrição

**Word Frequency**: app web (Tier 1, iniciante) que conta a frequência das palavras de um texto.
O usuário digita ou cola um texto (máx. **2048 caracteres**), clica no botão de análise e vê uma
tabela com cada palavra única e o número de ocorrências, em **ordem decrescente de frequência**.

Especificação completa: [App.md](App.md). As regras de contagem e os textos de erro estão na seção
"Definitions" do App.md. Siga essa seção sempre que houver dúvida.

### Escopo obrigatório
- Tela com caixa de texto, botão "Translate" (rótulo definido pelo enunciado) e tabela.
- Textarea aceita blocos grandes, limitado a 2048 caracteres.
- Clicar no botão analisa o texto.
- Mensagem de erro "Please enter some text to analyze." se o texto estiver vazio (inclui só espaços).
- Tabela com uma linha por palavra: palavra | ocorrências.
- Ordenação decrescente por frequência.

### Extras (implementados)
- Gráfico de barras com as 15 palavras mais frequentes (Chart.js).
- Analisar o conteúdo de uma URL em vez de texto digitado (função serverless com proteção SSRF).
- Melhorias: filtro de palavras comuns, resumo (total e únicas), exportar CSV e botão limpar.

## Stack

| Camada    | Tecnologia                                                |
|-----------|-----------------------------------------------------------|
| Base      | HTML + CSS + JavaScript puro (ES modules), sem framework  |
| Dev/build | Vite                                                      |
| Testes    | Vitest                                                    |
| Gráfico   | Chart.js                                                  |
| URL       | Função serverless em `api/` (Vercel) + middleware no Vite |
| Deploy    | Vercel ou Netlify                                         |

## Estrutura de pastas

```
Word_Fre/
├── index.html              # Página única: formulários, tabela, resumo, gráfico
├── package.json
├── vite.config.js          # Vite + middleware de /api/fetch-url para o desenvolvimento local
├── App.md                  # Especificação original
├── CLAUDE.md
├── src/
│   ├── main.js             # Ponto de entrada: liga eventos da UI à lógica
│   ├── wordFrequency.js    # Lógica pura: normalize, isBlank, countWords, sortByFrequency, summarize
│   ├── stopwords.js        # Lista de palavras comuns e removeStopwords
│   ├── csv.js              # Gera o conteúdo do CSV
│   ├── fetchPage.js        # Chamada do navegador para /api/fetch-url
│   ├── ui/
│   │   ├── table.js        # Renderiza a tabela e mensagens na tabela
│   │   ├── errors.js       # Exibe/limpa mensagens de erro
│   │   ├── counter.js      # Contador de caracteres (ex.: "120 / 2048")
│   │   ├── chart.js        # Gráfico com Chart.js
│   │   └── download.js     # Download do CSV no navegador
│   └── styles/
│       └── main.css
├── api/
│   └── fetch-url.js        # Handler HTTP (Vercel): valida a requisição e responde JSON
├── server/                 # Lógica do servidor, fora de api/ para não virar endpoint
│   ├── fetchPageText.js    # Busca a página com timeout, limite de tamanho e redirecionamentos validados
│   ├── extractText.js      # Extrai o texto visível do HTML
│   └── isPrivateAddress.js # Bloqueia IPs privados, de loopback e link-local (SSRF)
└── tests/
    ├── wordFrequency.test.js
    ├── stopwords.test.js
    ├── csv.test.js
    ├── extractText.test.js
    ├── isPrivateAddress.test.js
    └── fetchPageText.test.js
```

## Comandos

```bash
npm install          # Instalar dependências
npm run dev          # Servidor de desenvolvimento (Vite) em http://localhost:5173
npm run build        # Build de produção em dist/
npm run preview      # Servir o build localmente
npm test             # Rodar os testes (Vitest) uma vez
npm run test:watch   # Testes em modo watch
```

## Fases de desenvolvimento

Trabalhe uma fase por vez. Ao concluir uma fase, marque-a aqui com `[x]`.

- [x] **Fase 0: Configuração**: projeto Vite, estrutura de pastas, Vitest, `git init`.
- [x] **Fase 1: Lógica principal (sem UI)**: `normalize`, `countWords`, `sortByFrequency` em
      `src/wordFrequency.js` + testes unitários (vazio, pontuação, acentos, maiúsculas, empates).
- [x] **Fase 2: Interface mínima (MVP)**: textarea com `maxlength="2048"`, botão, tabela
      preenchida pela lógica.
- [x] **Fase 3: Validação e UX**: erro para texto vazio/só espaços, contador de caracteres,
      estado vazio da tabela. *Fim do escopo obrigatório.*
- [x] **Fase 4: Estilo e acessibilidade**: layout responsivo, `<label>`, `aria-live` no erro,
      navegação por teclado (wrapper da tabela com `tabindex`).
- [x] **Fase 5: Extra: gráfico**: Chart.js com as 15 palavras mais frequentes, atualizado a
      cada análise.
- [x] **Fase 6: Melhorias opcionais**: filtro de stopwords, resumo (total/únicas), exportar CSV,
      botão limpar.
- [x] **Fase 7: Extra: análise de URL**: função serverless que busca o HTML e extrai o texto
      visível; trata URL inválida, timeout, página vazia; analisa só os 2048 primeiros
      caracteres e avisa o usuário; bloqueia endereços internos (SSRF) e revalida redirecionamentos.
- [x] **Fase 8: Deploy**: publicado na Vercel em https://word-frequency-liard.vercel.app.
      Testado em produção: página carrega e `/api/fetch-url` bloqueia endereços internos e extrai texto de páginas públicas.

## Convenções de código

### Arquitetura
- **A lógica fica separada da UI.** `src/wordFrequency.js` contém só funções puras: sem DOM,
  sem `fetch`, sem estado global. Tabela, gráfico e URL reutilizam essas funções.
- Os módulos em `src/ui/` recebem dados e renderizam; não contam nem ordenam palavras.
- `main.js` só orquestra: lê a entrada, valida, chama a lógica e passa o resultado para a UI.
- Código que roda só no servidor fica em `server/`. `api/` tem apenas os handlers HTTP.

### Regras de contagem
- Tudo em minúsculas (`toLocaleLowerCase()`), e o apóstrofo curvo `’` vira `'` antes da contagem.
- Palavras definidas por regex Unicode: `/[\p{L}\p{N}]+(?:['-][\p{L}\p{N}]+)*/gu`, que preserva
  acentos ("ação"), contrações ("don't") e hífens ("guarda-chuva"). Apóstrofo ou hífen só fazem
  parte da palavra entre letras/dígitos. Números isolados ("2024") contam como palavra.
- Ordenação: frequência decrescente; empate em ordem alfabética (`localeCompare`).
- Formato de saída: array de `{ word, count }`.

### Segurança (análise de URL)
- Aceitar só `http:` e `https:`, sem credenciais na URL.
- Bloquear hosts que resolvem para endereços privados, de loopback, link-local ou multicast.
- Timeout de 5 segundos, limite de 2 MB de resposta e no máximo 3 redirecionamentos, cada um revalidado.
- Limitação conhecida: a checagem de DNS e a requisição são duas etapas, então um DNS que muda
  de resposta entre elas (DNS rebinding) não é coberto.

### Estilo JavaScript
- ES modules (`import`/`export`), `const` por padrão, `let` só quando houver reatribuição; nunca `var`.
- Funções nomeadas e pequenas; prefira `Map` para contagens.
- Nomes de código (variáveis, funções, arquivos) em **inglês**, em `camelCase`; textos visíveis
  ao usuário também em **inglês**, como no App.md. Documentação de projeto (CLAUDE.md, comentários
  de planejamento) pode ser em português.
- Arquivos em `camelCase.js`, exceto o handler em `api/fetch-url.js`, que segue a rota; testes em
  `nome.test.js` dentro de `tests/`.
- Indentação de 2 espaços, aspas simples, ponto e vírgula.
- Nunca inserir texto do usuário com `innerHTML`; use `textContent` ou `createElement` (evita XSS).

### HTML/CSS
- HTML semântico (`<main>`, `<form>`, `<label>`, `<table>` com `<thead>`/`<tbody>`).
- Classes CSS em `kebab-case`; cores e espaçamentos como variáveis CSS em `:root`.
- Mobile-first.

### Testes
- Toda função de `wordFrequency.js` tem teste antes de ser usada na UI.
- Rode `npm test` antes de dar uma fase por concluída.

### Git
- Commits pequenos, um por passo lógico, mensagem no imperativo
  (ex.: `Adiciona contagem de palavras`).
