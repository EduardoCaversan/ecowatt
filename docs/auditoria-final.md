# Auditoria de conformidade — EcoWatt

Data: 24/11/2026. Responsável acadêmico: Eduardo Caversan da Silva Rocha. R.A.: 2475391. Turma: ES46B-ES61. Campus: Cornélio Procópio — Paraná. Tema aprovado pela professora, conforme confirmação do acadêmico. Projeto individual. Esta auditoria distingue execução técnica comprovada de responsabilidades pessoais ainda não confirmadas. Não atribui nota.

## Planejamento

- [x] Nome do projeto definido: EcoWatt.
- [x] Problema identificado: contribuição dos aparelhos para o consumo residencial.
- [x] Objetivo definido: estimar consumo/custo e demonstrar CI/CD confiável.
- [x] Funcionalidades especificadas e implementadas.
- [x] Modalidade individual corretamente identificada.
- [x] Necessidade de aprovação do tema próprio informada ao acadêmico.

## Aplicação

- [x] Interface inicial organizada e estado vazio, sem dados pré-carregados.
- [x] Pelo menos duas funcionalidades reais e manipulação de dados.
- [x] Cadastro de equipamentos com UUID.
- [x] Consulta de equipamentos, potência, horas, quantidade, consumo e custo.
- [x] Configuração e persistência da tarifa, com aviso sobre o valor ilustrativo.
- [x] Consumo correto: 180 kWh e 45 kWh; total 225 kWh.
- [x] Custos corretos: R$ 162,00 e R$ 40,50; total R$ 202,50.
- [x] Resumo energético, unidades totais e maior grupo consumidor.
- [x] Distribuição proporcional em HTML/CSS.
- [x] Exclusão com confirmação e cancelamento.
- [x] Validações de nome, potência, horas, quantidade, tarifa e limites numéricos.
- [x] Persistência após recarga e fechamento/reabertura do navegador.
- [x] Dados corrompidos preservados até descarte explícito; falhas de acesso/escrita comunicadas.
- [x] Interface responsiva verificada em desktop e mobile.
- [x] Acessibilidade básica: labels, teclado, foco visível, status/erros e tabela sem transbordamento da página.
- [x] Renderização segura de entradas como texto.
- [x] Aplicação executável e publicada com HTTP 200.

Evidências: `evidencias/publicada-final/`, `evidencias/acessibilidade-persistencia.json`, testes T01–T19 e UI01–UI05. A verificação básica não equivale a certificação WCAG nem cobertura de todos os navegadores.

## Controle de versão

- [x] Repositório remoto público criado e acessível.
- [x] Arquivos organizados e lockfile versionado.
- [x] Histórico incremental com mensagens compreensíveis.
- [x] Cinco branches de desenvolvimento/demonstração utilizadas, além da main.
- [x] Cinco pull requests reais integrados com merge commits.
- [x] Tag anotada v1.0.0 no commit funcional publicado.
- [x] Histórico da regressão preservado, sem force push, alteração de datas ou autores fictícios.

Evidências: `evidencias/git-log.txt`, `git-branches.txt`, `pull-requests.json` e capturas GitHub. O commit documental final e a contagem final estão no `Links-Entrega.txt` externo.

## Testes

- [x] Mais de três testes significativos: 19 Vitest e cinco Playwright.
- [x] Assertions reais sobre funções e interface efetivamente utilizadas.
- [x] Execução local comprovada.
- [x] Execução no GitHub Actions comprovada.
- [x] Resultados e logs preservados, inclusive da falha.
- [x] Todos os testes aprovados no estado final: 19/19 e 5/5.

Ressalva histórica: o artefato inicial conservou logs unitários, mas seus arquivos JSON/JUnit foram removidos pela limpeza padrão do Playwright. A configuração foi corrigida; o artefato final contém os quatro relatórios. Não se marca como existente um arquivo unitário remoto ausente do run inicial.

## Pipeline CI

- [x] Workflow versionado em `.github/workflows/ci-cd.yml`.
- [x] Acionamento automático por push/PR e opção manual.
- [x] Instalação reprodutível com npm ci.
- [x] Build e testes automatizados.
- [x] Critérios reais de aprovação/reprovação, sem mascarar códigos de saída.
- [x] Dependências efetivas entre os quatro jobs.
- [x] Pipeline inicial aprovado na main.

## Entrega e publicação

- [x] Artefato intermediário de Build identificado pelo SHA.
- [x] Artefato final github-pages produzido somente após validação.
- [x] Package condicionado a Build/Test; Deploy condicionado a Package.
- [x] Mesmo build recuperado entre jobs, com verificação SHA-256.
- [x] GitHub Pages configurado com origem workflow.
- [x] PRs não publicam em produção.
- [x] Permissões restritas de Pages/OIDC e concorrência configurada.
- [x] Publicação pública e acesso funcional verificados.
- [x] Rodapé e version.json correspondem ao commit publicado.

## Falha e recuperação

- [x] Regressão real: período de 30 alterado para 31 dias.
- [x] Commit de origem 677a1a3 preservado e PR #4 reprovado.
- [x] Demonstração em push na main elegível para deploy, sem desabilitar proteções.
- [x] Build aprovado e Test reprovado: nove falhas em 19 casos.
- [x] Teste T01: esperado 180 kWh; obtido 186 kWh.
- [x] Package e Deploy ignorados por dependência.
- [x] Ausência de artefato final github-pages no run defeituoso.
- [x] Versão inicial 0a27562 preservada e funcionando após a falha.
- [x] Commit defeituoso e4e229b não publicado.
- [x] Correção cfe9f3d preserva os testes e restaura 30 dias.
- [x] PR #5 aprovado e integrado.
- [x] Recuperação aprovada e publicada no commit 7b9b10a.
- [x] Histórico SUCCESS → FAILURE → SUCCESS mantido.

| Cenário | Run | Build | Test | Package | Deploy |
|---|---|---|---|---|---|
| Inicial | 45315409008 | success | success | success | success |
| Regressão | 45316735655 | success | failure | skipped | skipped |
| Recuperação | 45318646338 | success | success | success | success |

## Documentação e evidências

- [x] README com instalação, uso, testes, build, pipeline, links e limitações.
- [x] Links reais de aplicação, repositório, PRs, runs e tag.
- [x] Capturas reais, figuras numeradas e legendas explicativas.
- [x] Logs, relatórios estruturados, metadados e versões públicas preservados.
- [x] Relatório Markdown e PDF com exatamente 13 seções principais.
- [x] Referências oficiais consultadas e declaração transparente de uso de IA.
- [x] PDF A4 abre corretamente, com sumário, páginas numeradas e links.
- [x] Todas as páginas do PDF renderizadas e revisadas visualmente.
- [x] Revisão verificou margens, hierarquia, quebras, tabelas, figuras, ausência de sobreposições e correspondência com a fonte.

O PDF possui 23 páginas, necessárias para manter o conteúdo e as figuras legíveis. A inspeção automática não encontrou blocos fora da página e contou 55 links. As folhas de contato serviram à revisão de todas as páginas e estão na pasta externa de entrega. Capturas ampliadas de regiões reais complementam os originais integrais.

Limitação visual explicitada: a tela autenticada de logs detalhados do GitHub não foi capturada. O resumo real do Actions, os logs exportados via CLI e a captura da visualização local do JUnit original estão disponíveis. Essa captura local não é apresentada como interface autenticada do GitHub.

## Pacote de entrega — verificação de fechamento

- [x] Código do ZIP extraído e aprovado em npm ci, npm test e npm run build; integridade e equivalência do código conferidas no ZIP final.
- [x] PDF final copiado para o pacote de entrega.
- [x] Links-Entrega.txt consolidado com HEAD documental final, no pacote externo.
- [x] Evidências e renderizações organizadas na pasta externa.
- [x] Roteiro de apresentação de 11 minutos preparado.
- [x] Material de revisão técnica e perguntas preparado.
- [x] Ausência de credenciais e dependências desnecessárias no ZIP verificada.
- [x] Main em estado funcional e tag coerente com a publicação.
- [x] Working tree limpa e sincronizada após o commit documental; resultado final registrado fora do repositório.

Os resultados de fechamento estão guardados em `entrega-operacao-deploy/evidencias/`. A instalação extraída aprovou 19/19 testes e gerou `dist/`; o build identifica `local-sem-git` porque o ZIP não contém `.git`. A atualização final da auditoria não altera arquivos funcionais, cuja igualdade é verificada entre a extração testada e o ZIP final. Nenhuma submissão no Moodle foi realizada.

## Dados confirmados e responsabilidades do acadêmico

- [x] Aprovação do tema próprio pela professora, confirmada pelo acadêmico.
- [x] Nome completo, R.A. 2475391 e turma ES46B-ES61 informados pelo acadêmico.
- [x] Campus Cornélio Procópio — Paraná informado pelo acadêmico.
- [ ] Conferência final dos dados.
- [ ] Revisão pessoal do código e das configurações.
- [ ] Compreensão do funcionamento e dos conceitos demonstrados.
- [ ] Revisão pessoal do relatório e da declaração de ferramentas/modelo.
- [ ] Ensaio e realização da apresentação oral.
- [ ] Envio dos materiais ao Moodle.

Os itens ainda desmarcados dependem do acadêmico e não são presumidos como atendidos pela conclusão técnica.
