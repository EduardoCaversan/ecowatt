# Índice de evidências reais

As evidências foram coletadas durante o desenvolvimento e a demonstração. Capturas PNG são de interfaces reais; nenhuma imagem simula resultados do GitHub. Os JSONs/JUnit e logs são registros de execução, não dados ilustrativos.

| Requisito demonstrado | Evidência |
|---|---|
| Aplicação, cadastro, cálculos e indicadores | `publicada-final/desktop-02-cenario-c.png`, `publicada-final/ui.json` |
| Estado vazio | `publicada-final/desktop-01-vazio.png` |
| Rejeição de utilização inválida | `publicada-final/desktop-03-validacao.png` |
| Interface mobile | `publicada-final/mobile-02-cenario-c.png` e fluxo UI02 |
| Corrupção e preservação de dados | `publicada-final/armazenamento-corrompido.png` e UI03 |
| Tarifa, exclusão cancelada/confirmada e recarga | Casos UI01/UI02 em `publicada-final/ui.json` e `ui.xml` |
| Histórico incremental | `git-log.txt`, `github/commits-final.png` |
| Branches reais e preservadas | `git-branches.txt`, `github/branches-final.png` |
| PRs integrados | `pull-requests.json`, `github/pr-02-integrado.png`, `github/pr-03-integrado.png` |
| Pipeline inicial aprovado | `runs/inicial/run.json`, `github/pipeline-inicial.png` |
| Resultados automatizados locais | `local/`, `local-recuperacao/` |
| Resultados automatizados do CI | `runs/*/logs.txt` e relatórios baixados em `artifacts/` |
| Falha no PR de regressão | `runs/regressao-pr/`, `github/regressao-pr.png` |
| Falha elegível para deploy na main | `runs/falha/run.json`, `github/pipeline-falha.png` |
| Resultado esperado 180 / obtido 186 | `runs/falha/artifacts/resultados-testes-*/unit.json`, `unit.xml` e `github/teste-reprovado-junit-local.png` |
| Package e Deploy ignorados | Jobs com `conclusion: skipped` em `runs/falha/run.json` |
| Ausência de pacote final no run defeituoso | `runs/falha/artifacts.json` contém apenas build intermediário e resultados |
| Versão anterior preservada | `publicacao/inicial/`, `publicacao/durante-falha/`, `publicada-durante-falha/` |
| Condições anteriores à regressão | `preflight-regressao.json`: Pages por workflow, main sem proteção/rulesets e um workflow ativo |
| Commit de correção | `github/commit-correcao.png`, PR #5 e histórico |
| Recuperação e artefato final | `runs/recuperacao/`, `github/pipeline-recuperacao.png` |
| Publicação final e identificação | `publicacao/final/`, `publicada-final/`, `rastreabilidade.json` |
| Revisão do PDF | `revisao-pdf.json` e registro da revisão visual em `../auditoria-final.md` |

## Organização e interpretação

- `runs/inicial`: run **45315409008**, push na main, commit **0a27562758e50f421e965f922e5cc7fb9a1c5b2f**.
- `runs/falha`: run **45316735655**, push na main, commit **e4e229bc9989aefc83fa4268c441075e5e2f53eb**.
- `runs/recuperacao`: run **45318646338**, push na main, commit **7b9b10a7ef2493f01aa6c03ca377c22c80bd0092**.
- `runs/regressao-pr` e `runs/recuperacao-pr`: verificações adicionais dos PRs; não são as três execuções de produção da tabela principal.
- `artifacts.json`: metadados originais da API, incluindo nomes, IDs, digest, tamanho e retenção.
- `artifacts/`: conteúdo baixado dos artefatos. O `artifact.tar` de `github-pages` contém a distribuição aprovada. Os builds com regressão são preservados apenas como evidência histórica, não como código funcional atual.
- `publicacao/*/http.json`: consulta com URL única, horário, headers, SHA esperado/observado e hash da página. A aplicação e o version.json retornaram 200 nos cenários registrados.
- `interface-local`: capturas de desenvolvimento anteriores à versão final; o rodapé pode mostrar um commit anterior ou alterações locais. Para avaliar a entrega, use `publicada-final`.
- `investigacao/mobile-overflow-antes.json`: falha de responsividade encontrada e corrigida antes da primeira publicação. Não é a regressão matemática da atividade.

## Limitações registradas

O GitHub permite consultar o resumo do workflow publicamente, mas o detalhe dos logs na interface exigiu login. Os logs foram exportados de forma autenticada via GitHub CLI. A imagem `teste-reprovado-junit-local.png` é uma captura do **JUnit original aberto no Chromium local**, não da interface autenticada do GitHub.

No run inicial aprovado, o Playwright limpou a pasta compartilhada e removeu os arquivos unitários JSON/JUnit antes do upload. Os resultados dos 19 testes estão no log original; os relatórios unitários locais equivalentes também foram preservados. O problema foi corrigido em `d513874`, separando o diretório de saída do navegador. O run final preserva os quatro relatórios: unit.json, unit.xml, ui.json e ui.xml. Não foram fabricados arquivos faltantes da execução inicial.

O código de saída reprovado dos testes permanece reprovado; a preservação de evidências não altera conclusões. Os testes de interface não foram executados no run com regressão, porque a etapa Vitest falhou antes deles. O teste de interface da **publicação anterior**, realizado após a falha, é um procedimento separado e está em `publicada-durante-falha/`.

As renderizações integrais do PDF e o registro da verificação do ZIP ficam também na pasta externa `entrega-operacao-deploy/evidencias/`, evitando adicionar arquivos temporários ao repositório. O estado final do Git e os links do commit documental estão no pacote externo de entrega.
