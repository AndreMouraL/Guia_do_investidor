# Relatório da sprint 2 — Guia do Investidor (Equipe GuiaInvest)

Link do repositório: https://github.com/AndreMouraL/Guia_do_investidor · Link funcionando: não há (abrir `codigo/index.html`) · Commit desta entrega: _(preencher)_

## 1. Planejado e feito

| RF | Descrição curta | Prioridade | Responsável | Planejado | Feito? |
|---|---|---|---|---|---|
| RF01 | criar conta e entrar | essencial | _(preencher)_ | sim | sim |
| RF02 | responder o questionário | essencial | _(preencher)_ | sim | sim |
| RF03 | calcular o perfil | essencial | _(preencher)_ | sim | sim |
| RF04 | objetivo, aporte e prazo | essencial | _(preencher)_ | sim | sim |
| RF05 | gerar carteira por regras | essencial | _(preencher)_ | sim | sim |
| RF06 | dashboard com gráfico e tabela | essencial | _(preencher)_ | sim | sim |
| RF13 | aviso educacional | essencial | _(preencher)_ | sim | sim |
| RF07–RF12 | IA, salvar, listar, exportar, excluir, conta | importante/desejável | — | não (S3) | não; telas continuam como prévia |

Conta da meta: essenciais funcionando = 7 de 7 = 100% (mínimo da sprint: 25% de 7 = 1,75 → 2).

## 2. Roteiro de teste

| RF | Passos | Resultado esperado | Obtido |
|---|---|---|---|
| RF01 | Criar conta "Camila Ribeiro", camila@exemplo.com, senha 12345678 | Conta criada; abre o questionário | ok |
| RF01 | Criar conta de novo com o mesmo e-mail e senha "1234" | "Este e-mail já está em uso…" e "A senha deve ter 8 ou mais caracteres"; nada é salvo | ok |
| RF01 | Sair e entrar com senha errada | "E-mail ou senha incorretos."; não entra | ok |
| RF02 | Clicar "Próxima" sem marcar opção | "Escolha uma opção para continuar…"; não avança | ok |
| RF03 | Responder 3,3,3,2,3,2,3,2 e finalizar | 21 de 32, perfil Moderado | ok |
| RF04 | Aporte 0 e prazo vazio, "Gerar carteira" | "O aporte deve ser maior que zero" e "Informe o prazo…"; não gera | ok |
| RF05 | Moderado, R$ 1.500, 120 meses | 35/25/10/20/10%; R$ 525/375/150/300/150; total 100% e R$ 1.500,00 | ok |
| RF05 | Mesmo perfil, R$ 800, 18 meses | Carteira Conservadora 60/25/5/5/5; total R$ 800,00 | ok |
| RF06 | Abrir o dashboard; mouse/Tab nas linhas | Indicadores, rosca e tabela coerentes; linha realça o gráfico | ok |
| RF13 | Percorrer todas as telas | Aviso educacional visível | ok |

Testes automáticos das regras: `node testes/regras.test.js` (13 testes passando).

## 3. O que a equipe aprendeu

Trocar links por formulários com validação exigiu separar as regras (`regras.js`) da tela, o que permitiu testar o perfil e a carteira no Node. Valores em centavos evitaram diferença de arredondamento no total. Para a S3 ficam RF07 a RF12.

## 4. Uso de IA

Claude (Anthropic): JavaScript das telas da S2, regras de pontuação e alocação e testes, a partir do protótipo da S1. A equipe rodou o fluxo completo no navegador (computador e celular 360 px), os 10 testes e os critérios de aceite acima.
