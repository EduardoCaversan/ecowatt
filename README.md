# EcoWatt

Monitoramento de Consumo Energético Residencial. Projeto individual de Eduardo Caversan para a atividade **Operação Deploy — Do código à produção**, da disciplina de Gerência de Configuração e Manutenção de Software, UTFPR, professora Eduarda Maganha de Almeida.

## Objetivo e escopo

Estimar consumo e custo de equipamentos residenciais com potência constante, utilização média diária, quantidade e tarifa manual. Mês padronizado de 30 dias. Os resultados não substituem medições nem a fatura da concessionária.

Aplicação estática em HTML, CSS e JavaScript modular, com Vite, Vitest e LocalStorage. Sem backend, autenticação ou serviços de medição. A aplicação inicia sem equipamentos.

## Regras e critérios

- Consumo mensal: `(potência / 1000) × horas por dia × quantidade × 30`.
- Custo mensal: `consumo × tarifa` (inicial ilustrativa: R$ 0,90/kWh).
- Nome obrigatório até 100 caracteres; potência e tarifa positivas e finitas; horas entre zero (exclusive) e 24; quantidade inteira positiva.
- Cadastro, consulta, exclusão confirmada, totais, maior consumidor e barras proporcionais.
- Persistência validada; corrupção ou falha de armazenamento comunicada ao usuário.
- Build → Test → Package → Deploy; falhas de teste impedem entrega e publicação.
- Evidência real de sucesso, regressão de 30 para 31 dias e recuperação.

## Responsabilidade acadêmica

Trabalho individual, com apoio de ferramentas de inteligência artificial declarado no relatório. Aprovação do tema próprio, conferência dos dados acadêmicos, revisão, compreensão e envio ao Moodle são responsabilidades do acadêmico. Aprovação do tema ainda não confirmada. RA, turma e campus não informados.
