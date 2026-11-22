# Guia do Investidor

Aplicação web educacional que identifica o perfil do investidor por um questionário curto e sugere, por regras determinísticas, uma carteira diversificada por classe de ativo (soma 100%), exibida em dashboard. Conteúdo educacional; não é recomendação de investimento.

Disciplina: Desenvolvimento de Sistemas Web (EECP0036) · UFMA · 2026.2 · Prof. Renan Sousa Freire

## Equipe GuiaInvest

- André Moura Lima
- Arthur Sampaio Pereira
- Luã Coimbra Santiago Saunders
- Keven Gustavo dos Santos Gomes
- Josean Silva Lima
- Ítalo Matheus Rodrigues Sousa

## Como rodar

Não precisa instalar nada.

1. Baixe ou clone o repositório: `git clone https://github.com/AndreMouraL/Guia_do_investidor.git`
2. Abra `codigo/index.html` no navegador (Chrome, Edge ou Firefox).
3. Clique em **Criar conta**, responda o questionário, informe o objetivo e veja a carteira.

Testes das regras de negócio (precisa do Node.js instalado):

```
node testes/regras.test.js
```

## Onde ficam os dados

No `localStorage` do próprio navegador (chaves `gi_usuarios` e `gi_sessao`). Não há servidor. A senha é guardada como resumo SHA-256, nunca em texto. Para apagar tudo: ferramentas do desenvolvedor → Aplicativo → Armazenamento local → limpar.

## O que cada entrega trouxe

- **S1 (protótipo):** 14 telas e estados em HTML e CSS, ligados por links, com dados de exemplo fixos.
- **S2 (sprint 2):** lógica em JavaScript puro para os requisitos essenciais: cadastro e login (RF01), questionário de 8 perguntas (RF02), cálculo do perfil (RF03), objetivo com validação (RF04), geração da carteira por regras (RF05), dashboard com gráfico e tabela (RF06) e aviso educacional em todas as telas (RF13). Os estados de erro agora são mostrados pela própria lógica. Relatórios em `docs/` (`sprint-2.md`, `relatorio-S1.pdf`, `relatorio-S2.pdf`).
- **S3 (planejado):** explicação por IA (RF07), salvar, listar, exportar e excluir carteiras (RF08 a RF10), refazer questionário com histórico (RF11) e minha conta (RF12). As telas 09 a 13 ainda são prévias do protótipo.

## Estrutura de pastas

```
codigo/
  index.html                 página inicial pública
  01-login.html              login (RF01)
  02-cadastro.html           cadastro (RF01)
  04-questionario.html       questionário (RF02, RF03)
  05-resultado-perfil.html   resultado do perfil (RF03)
  06-objetivo.html           objetivo, aporte e prazo (RF04)
  08-dashboard.html          carteira sugerida (RF05, RF06, RF13)
  09 a 13                    prévias do protótipo (lógica na S3)
  app.js                     comportamentos comuns (senha, sair, erros de formulário)
  style.css                  estilos
  js/regras.js               regras de negócio puras (perguntas, perfil, validação, carteira)
  js/dados.js                localStorage e sessão
  js/auth.js, questionario.js, resultado.js, objetivo.js, dashboard.js   lógica de cada tela
testes/regras.test.js        testes das regras (Node)
docs/sprint-2.md             relatório da sprint 2
```

## Uso de IA

Foi usada a IA Claude (Anthropic) para gerar o protótipo (S1) e o JavaScript da S2 e seus testes. A equipe conferiu as telas no navegador e os critérios de aceite, e todos os integrantes devem saber explicar o código entregue.
