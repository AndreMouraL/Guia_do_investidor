/*
 * Guia do Investidor — Sprint 2
 * regras.js: regras de negócio puras (sem tela, sem localStorage).
 * Por serem funções puras, podem ser testadas no Node (ver testes/regras.test.js).
 *
 * RF02 · perguntas do questionário (8 perguntas, opções de 1 a 4 pontos)
 * RF03 · cálculo do perfil pela pontuação (8 a 32 pontos)
 * RF04 · validação de objetivo, aporte e prazo
 * RF05 · geração determinística da carteira (soma sempre 100%)
 */
(function (raiz) {
  'use strict';

  // RF02 — cada opção vale de 1 (mais conservadora) a 4 pontos (mais arrojada).
  var PERGUNTAS = [
    { texto: 'Qual é a sua experiência com investimentos?',
      opcoes: ['Nunca investi', 'Só poupança ou renda fixa', 'Já investi em fundos ou fundos imobiliários', 'Invisto em ações há algum tempo'] },
    { texto: 'Por quanto tempo você pretende deixar o dinheiro investido?',
      opcoes: ['Menos de 1 ano', 'De 1 a 3 anos', 'De 3 a 5 anos', 'Mais de 5 anos'] },
    { texto: 'Se seus investimentos caíssem 10% em um mês, o que você faria?',
      opcoes: ['Venderia tudo para evitar mais perdas', 'Venderia uma parte e esperaria', 'Manteria e aguardaria a recuperação', 'Investiria mais, aproveitando preços menores'] },
    { texto: 'Qual é o seu principal objetivo ao investir?',
      opcoes: ['Preservar o dinheiro, sem perdas', 'Ter uma renda extra estável', 'Fazer o dinheiro crescer, aceitando algum risco', 'Buscar o maior retorno no longo prazo'] },
    { texto: 'Quanto da sua renda mensal você consegue investir?',
      opcoes: ['Até 5%', 'De 5% a 10%', 'De 10% a 20%', 'Mais de 20%'] },
    { texto: 'Você tem uma reserva de emergência?',
      opcoes: ['Não tenho', 'Sim, para menos de 3 meses de gastos', 'Sim, para 3 a 6 meses de gastos', 'Sim, para mais de 6 meses de gastos'] },
    { texto: 'Qual frase descreve melhor você?',
      opcoes: ['Não aceito perder dinheiro', 'Aceito pequenas perdas de vez em quando', 'Aceito perdas temporárias moderadas', 'Aceito grandes oscilações em troca de mais retorno'] },
    { texto: 'Que parte do seu dinheiro você colocaria em ações ou outros ativos que oscilam?',
      opcoes: ['Nada', 'Até 10%', 'De 10% a 30%', 'Mais de 30%'] }
  ];

  // RF03 — faixas de pontuação (mínimo 8, máximo 32).
  var FAIXAS = [
    { classe: 'Conservador', min: 8, max: 16,
      frase: 'Você prioriza a segurança e prefere evitar oscilações, mesmo que isso signifique um retorno menor.' },
    { classe: 'Moderado', min: 17, max: 24,
      frase: 'Você aceita alguma oscilação em troca de um retorno maior, mas ainda quer uma base de segurança.' },
    { classe: 'Arrojado', min: 25, max: 32,
      frase: 'Você aceita oscilações maiores em busca de mais retorno no longo prazo.' }
  ];

  // RF05 — classes de ativo e percentuais por perfil (cada linha soma 100).
  var CLASSES = [
    'Renda fixa pós-fixada (Selic/CDI)',
    'Renda fixa atrelada à inflação',
    'Fundos imobiliários',
    'Ações brasileiras',
    'Investimentos no exterior'
  ];
  var ALOCACAO = {
    Conservador: [60, 25, 5, 5, 5],
    Moderado:    [35, 25, 10, 20, 10],
    Arrojado:    [15, 15, 15, 35, 20]
  };
  var ORDEM = ['Conservador', 'Moderado', 'Arrojado'];

  /** RF03: recebe um vetor com 8 respostas (1 a 4) e devolve {pontos, classe, frase}. */
  function calcularPerfil(respostas) {
    if (!Array.isArray(respostas) || respostas.length !== PERGUNTAS.length) {
      throw new Error('Responda todas as ' + PERGUNTAS.length + ' perguntas.');
    }
    var pontos = 0;
    respostas.forEach(function (r) {
      var v = Number(r);
      if (!(v >= 1 && v <= 4) || Math.floor(v) !== v) throw new Error('Resposta inválida: ' + r);
      pontos += v;
    });
    var faixa = FAIXAS.filter(function (f) { return pontos >= f.min && pontos <= f.max; })[0];
    return { pontos: pontos, classe: faixa.classe, frase: faixa.frase };
  }

  /** RF04: valida os dados do objetivo. Devolve um objeto com as mensagens de erro (vazio = válido). */
  function validarObjetivo(dados) {
    var erros = {};
    var objetivo = String(dados.objetivo || '').trim();
    var aporte = Number(String(dados.aporte).replace(',', '.'));
    var prazo = Number(dados.prazo);
    if (!objetivo) erros.objetivo = 'Informe o seu objetivo.';
    if (String(dados.aporte).trim() === '' || isNaN(aporte) || aporte <= 0) erros.aporte = 'O aporte deve ser maior que zero.';
    if (String(dados.prazo).trim() === '' || isNaN(prazo) || prazo <= 0 || Math.floor(prazo) !== prazo) {
      erros.prazo = 'Informe o prazo em meses (número inteiro maior que zero).';
    }
    return erros;
  }

  /**
   * RF05: perfil usado na carteira, considerando o prazo.
   * Prazo curto pede mais segurança: até 24 meses usa a carteira Conservadora;
   * de 25 a 60 meses, no máximo a Moderada; acima de 60 meses, vale o perfil calculado.
   */
  function perfilParaCarteira(classe, prazo) {
    var i = ORDEM.indexOf(classe);
    if (prazo <= 24) i = 0;
    else if (prazo <= 60) i = Math.min(i, 1);
    return ORDEM[i];
  }

  /** RF05: gera a carteira: lista de {classe, percentual, valor}. Percentuais somam 100. */
  function gerarCarteira(classe, aporte, prazo) {
    if (!ALOCACAO[classe]) throw new Error('Perfil desconhecido: ' + classe);
    var usado = perfilParaCarteira(classe, prazo);
    var pcts = ALOCACAO[usado];
    var itens = CLASSES.map(function (nome, i) {
      return { classe: nome, percentual: pcts[i], valor: Math.round(aporte * pcts[i]) / 100 };
    });
    // Ajusta o arredondamento de centavos na maior classe, para o total bater com o aporte.
    var soma = itens.reduce(function (s, it) { return s + Math.round(it.valor * 100); }, 0);
    var dif = Math.round(aporte * 100) - soma;
    if (dif !== 0) itens[0].valor = (Math.round(itens[0].valor * 100) + dif) / 100;
    return { perfilUsado: usado, ajustadoPeloPrazo: usado !== classe, itens: itens };
  }

  /** Formata número como moeda brasileira: 1500 -> "R$ 1.500,00". */
  function moeda(v) {
    return 'R$ ' + Number(v).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  var Regras = {
    PERGUNTAS: PERGUNTAS, FAIXAS: FAIXAS, CLASSES: CLASSES, ALOCACAO: ALOCACAO,
    calcularPerfil: calcularPerfil, validarObjetivo: validarObjetivo,
    perfilParaCarteira: perfilParaCarteira, gerarCarteira: gerarCarteira, moeda: moeda
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Regras; // Node (testes)
  else raiz.Regras = Regras;                                                     // navegador
})(this);
