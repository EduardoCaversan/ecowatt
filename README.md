# EcoWatt

[![EcoWatt CI/CD](https://github.com/EduardoCaversan/ecowatt/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/EduardoCaversan/ecowatt/actions/workflows/ci-cd.yml)

**Monitoramento de Consumo Energético Residencial.** Uma aplicação simples para estimar quanto cada equipamento contribui para o consumo e o custo mensal de energia.

- **Aplicação:** https://eduardocaversan.github.io/ecowatt/
- **Relatório:** [PDF oficial](docs/relatorio-tecnico.pdf) · [fonte Markdown](docs/relatorio-tecnico.md)
- **Entrega funcional:** [tag v1.0.0](https://github.com/EduardoCaversan/ecowatt/tree/v1.0.0), commit `7b9b10a7ef2493f01aa6c03ca377c22c80bd0092`.
- **Auditoria:** [checklist de conformidade](docs/auditoria-final.md) · [índice de evidências](docs/evidencias/README.md).

## Contexto e autoria

Projeto individual de **Eduardo Caversan da Silva Rocha**, para a atividade **Operação Deploy — Do código à produção**, da disciplina **Gerência de Configuração e Manutenção de Software**, curso de Engenharia de Software da **UTFPR**, professora **Eduarda Maganha de Almeida**. Equipe: EcoWatt — Projeto Individual. Entrega prevista: 25/11/2026.

Não existem outros integrantes. O desenvolvimento, a integração, os testes, o pipeline, a documentação e a preparação técnica tiveram apoio direto de inteligência artificial, declarado na seção 13 do relatório. **R.A.: 2475391. Turma: ES46B-ES61. Tema aprovado pela professora, conforme confirmação do acadêmico.** O campus ainda não foi informado. A revisão e compreensão final antes da entrega permanecem sob responsabilidade do acadêmico.

## Problema e funcionalidades

A fatura de energia não mostra diretamente quanto cada aparelho contribui para o total. O EcoWatt estima essa participação a partir da potência, do tempo de uso e da quantidade informados.

- Cadastro e consulta de equipamentos com identificador único, nome, watts, horas/dia e quantidade.
- Configuração de tarifa em R$/kWh; R$ 0,90 é apenas um exemplo inicial.
- Consumo e custo mensais por grupo, totais, quantidade de unidades e maior consumidor.
- Distribuição proporcional com barras em HTML/CSS.
- Exclusão mediante confirmação, com possibilidade de cancelamento.
- Persistência em LocalStorage, validação de esquema e proteção contra sobrescrita silenciosa de dados corrompidos.
- Avisos de falhas de acesso/escrita, estado vazio, layout responsivo, labels, teclado e foco visível.
- Rodapé com versão e SHA do build publicado.

A aplicação começa sem equipamentos cadastrados. Dados de demonstração das capturas foram inseridos somente em contextos de teste.

## Exemplo de uso

Cadastre **Aquecedor**, com **1500 W**, **4 h/dia** e **1 unidade**. Com tarifa **R$ 0,90/kWh**, o resultado é **180 kWh/mês** e **R$ 162,00/mês**. Acrescente **Lâmpadas**, **100 W**, **5 h/dia**, **3 unidades**: o total passa a **225 kWh** e **R$ 202,50**, para quatro unidades. Ao atualizar a tarifa para **R$ 1,20**, o custo total passa a **R$ 270,00**, sem alterar o consumo.

```text
consumoMensalKwh = (potenciaWatts / 1000) × horasDiarias × quantidade × 30
custoMensal = consumoMensalKwh × tarifaKwh
```

Nome é obrigatório e tem limite de 100 caracteres; potência e tarifa são positivas e finitas; horas pertencem a (0, 24]; quantidade é inteira positiva segura. Totais fora do intervalo numérico suportado são rejeitados. Os cálculos não arredondam valores intermediários; a apresentação usa `Intl.NumberFormat` em `pt-BR`. Nomes são renderizados como texto, sem interpretar HTML.

## Tecnologias e estrutura

HTML5, CSS3, JavaScript com ES Modules, LocalStorage, Node.js 22 LTS, NPM, Vite 8.3.8, Vitest 5.1.1, Playwright 1.65.1, Git, GitHub Actions e GitHub Pages. Sem framework frontend, backend ou banco remoto.

```text
.github/workflows/ci-cd.yml   # Build → Test → Package → Deploy
src/
  energy.js                 # regras e validações
  storage.js                # persistência e esquema
  main.js                   # eventos e renderização segura
  styles.css                # layout e responsividade
tests/
  energy.test.js            # 14 testes de regras
  storage.test.js           # 5 testes de persistência
  ui/app.spec.js            # 5 testes de navegador
scripts/generate-version.js # versão, commit, horário e run
public/favicon.svg
docs/                       # relatório, evidências e auditoria
index.html
vite.config.js
playwright.config.js
package.json
package-lock.json
```

## Pré-requisitos e execução local

Node.js **22 LTS atualizado, mínimo 22.12.0**, NPM e Git para clonar. A instalação requer acesso ao registro NPM. O CI usa a linha Node 22 (versão observada: 22.23.5).

```bash
git clone https://github.com/EduardoCaversan/ecowatt.git
cd ecowatt
npm ci
npm run dev
```

Abra http://127.0.0.1:5173/ecowatt/. Se estiver usando o ZIP, extraia e execute os comandos dentro da pasta que contém `package.json`. Não abra `index.html` diretamente pelo explorador de arquivos.

## Testes

```bash
npm test
```

O Vitest executa **19 casos** uma vez e retorna erro se alguma assertion falhar. Os relatórios ficam em `test-results/unit.json` e `test-results/unit.xml`.

Para os **cinco casos Playwright** sobre o build:

```bash
npm run build
npx playwright install chromium
npm run test:ui
```

O teste inicia e encerra seu servidor de preview automaticamente; mantenha a porta 4173 disponível. Em Linux, a preparação do navegador pode exigir `npx playwright install --with-deps chromium`. Os relatórios são `test-results/ui.json` e `ui.xml`; traces/screenshots de falha ficam em `test-results/browser/`, sem remover os relatórios unitários. `APP_URL` permite apontar a verificação a uma publicação existente; `EXPECTED_SHA` acrescenta a comparação com o commit esperado. Não há retries de testes configurados.

## Build e preview

```bash
npm run build
npm run preview
```

O build gera `dist/`. A prévia fica em http://127.0.0.1:4173/ecowatt/. O caminho `/ecowatt/` é configurado no Vite para funcionar tanto localmente quanto no GitHub Pages. `version.json` é gerado a cada build com versão, SHA, horário UTC e run do CI. Em cópia sem Git, o SHA local é `local-sem-git`; no CI, é o SHA real. Alterações locais são sinalizadas pelo campo `dirty`.

## Pipeline, entrega e publicação

O workflow `.github/workflows/ci-cd.yml` roda em push na main, PR para main e execução manual. Alterações exclusivamente em `docs/**` e `README.md` são ignoradas pelos triggers de push/PR para permitir finalizar documentação sem republicar o produto.

| Job | Dependência | Comportamento |
|---|---|---|
| Build | — | Checkout, Node, npm ci, versão, build e hashes; envia `build-intermediario-<SHA>`. |
| Test | Build | Vitest, recuperação do mesmo build, verificação dos hashes e Playwright; preserva resultados inclusive em falha. |
| Package | Build e Test | Confere o build validado e produz o artefato final `github-pages`, sem reconstrução. |
| Deploy | Package | Publica o artefato no Pages somente em eventos elegíveis da main. |

PRs verificam e empacotam, mas não publicam. `needs` impede que Package/Deploy avancem quando os testes falham. Não há `continue-on-error`. `if: always()` existe apenas no step de preservação dos relatórios. Permissões de Pages/OIDC ficam somente em Deploy, e há controle de concorrência. Pages está configurado com origem GitHub Actions.

CI é a integração e verificação automática. Continuous Delivery é a preparação da versão validada; Continuous Deployment é sua publicação automática. O EcoWatt implementa as três práticas. Os artefatos têm retenção configurada de 90 dias; cópias dos runs principais acompanham `docs/evidencias/`.

## Demonstração real: sucesso → falha → recuperação

| Cenário de push na main | Commit | Build | Test | Package | Deploy | Execução |
|---|---|---|---|---|---|---|
| Inicial | `0a27562` | success | success | success | success | [45315409008](https://github.com/EduardoCaversan/ecowatt/actions/runs/45315409008) |
| Regressão | `e4e229b` | success | failure | skipped | skipped | [45316735655](https://github.com/EduardoCaversan/ecowatt/actions/runs/45316735655) |
| Recuperação | `7b9b10a` | success | success | success | success | [45318646338](https://github.com/EduardoCaversan/ecowatt/actions/runs/45318646338) |

A regressão real alterou **30 para 31 dias**, fazendo o cenário A produzir **186 kWh**, enquanto o teste original exigia **180 kWh**. Nove dos 19 testes falharam. A regressão foi registrada no [PR #4](https://github.com/EduardoCaversan/ecowatt/pull/4) e integrada deliberadamente à main do repositório acadêmico isolado, após verificar as condições da demonstração e sem remover proteções existentes. A main era elegível para deploy; a falha dos testes bloqueou o pacote e a publicação.

Durante a falha, o Pages permaneceu no commit `0a27562758e50f421e965f922e5cc7fb9a1c5b2f`, com HTTP 200 e cálculos corretos. Os registros de versão antes/durante/depois estão em `docs/evidencias/publicacao/`. A correção `cfe9f3da1749fb0fc8b89a7e531db16a8b1d401e` restaurou os 30 dias e preservou os testes, no [PR #5](https://github.com/EduardoCaversan/ecowatt/pull/5). O merge publicado foi `7b9b10a7ef2493f01aa6c03ca377c22c80bd0092`.

O run inicial conserva os resultados unitários nos logs, mas o Playwright removeu os arquivos JSON/JUnit unitários de sua pasta padrão. A correção de configuração separou o diretório de saída do navegador; o run final preserva ambos os relatórios. A limitação inicial está documentada sem fabricar artefatos ausentes.

Branches e PRs de desenvolvimento: [#1 — regras](https://github.com/EduardoCaversan/ecowatt/pull/1), [#2 — interface/persistência](https://github.com/EduardoCaversan/ecowatt/pull/2), [#3 — CI/CD](https://github.com/EduardoCaversan/ecowatt/pull/3). Os merges e a regressão permanecem no histórico.

## Rastreabilidade e documentação

A tag `v1.0.0` aponta para a versão funcional publicada. Commits posteriores exclusivos de documentação podem alterar o HEAD da main sem alterar a publicação. Consulte o SHA do rodapé e [version.json](https://eduardocaversan.github.io/ecowatt/version.json) para identificar o build público. Evidências relacionam commit, run, artefato e publicação, com consultas para evitar cache.

O [relatório técnico](docs/relatorio-tecnico.pdf) contém as 13 seções acadêmicas, figuras e referências. Sua fonte está em Markdown. Para regenerar o PDF, use Python com o pacote `Markdown`, execute `python docs/render-report.py` e `node docs/print-report.mjs` com Chromium instalado. A revisão de todas as páginas renderizadas é registrada nas evidências.

## Limitações conhecidas

Os resultados são **estimativas para 30 dias e potência constante**, não substituem medições reais ou a fatura. Os dados ficam apenas no navegador, sem sincronização ou backup remoto. A tarifa é manual, e não são modelados impostos, bandeiras tarifárias, ciclos dos aparelhos ou variação de potência. Não há conexão com medidores ou concessionárias. Acessibilidade básica e cenários Chromium foram verificados; isso não equivale a uma auditoria completa de WCAG ou cobertura de todos os navegadores.

Os detalhes dos logs na interface pública do GitHub exigem login; logs completos e JUnit reais foram coletados via CLI, e a captura do JUnit mostra sua visualização local, claramente identificada. A revisão pessoal, o domínio da apresentação, a informação do campus e o envio ao Moodle permanecem responsabilidades do acadêmico.
