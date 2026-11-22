/*
 * Guia do Investidor — Sprint 2
 * dashboard.js: tela 08.
 *   RF05 — gera a carteira pelas regras (Regras.gerarCarteira)
 *   RF06 — mostra perfil, objetivo, aporte, prazo, gráfico de rosca e tabela com percentual e valor
 */
(function () {
  'use strict';
  var u = Dados.exigirLogin();
  if (!u) return;
  if (!u.perfil) { location.replace('04-questionario.html'); return; }
  if (!u.objetivo) { location.replace('06-objetivo.html'); return; }

  var CORES = ['#ff7a00', '#ffc27a', '#ffffff', '#8c8c8c', '#b34700'];
  var M = Regras.moeda;
  var o = u.objetivo;
  var cart = Regras.gerarCarteira(u.perfil.classe, o.aporte, o.prazo);

  function el(id) { return document.getElementById(id); }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }

  // Indicadores
  el('k-perfil').textContent = u.perfil.classe;
  el('k-objetivo').textContent = o.objetivo;
  el('k-aporte').textContent = M(o.aporte);
  el('k-prazo').textContent = o.prazo + (o.prazo === 1 ? ' mês' : ' meses');
  var FEM = { Conservador: 'Conservadora', Moderado: 'Moderada', Arrojado: 'Arrojada' };
  el('d-centro').textContent = FEM[cart.perfilUsado];

  // Gráfico de rosca (SVG): circunferência = 100, então cada % vira 1 unidade de traço.
  var svg = '', acumulado = 0;
  cart.itens.forEach(function (it, i) {
    if (it.percentual > 0) {
      var traco = Math.max(it.percentual - 0.6, 0.1);
      svg += '<circle class="seg" data-i="' + i + '" cx="21" cy="21" r="15.9155" stroke="' + CORES[i] +
        '" stroke-dasharray="' + traco + ' ' + (100 - traco) + '" stroke-dashoffset="' + (-acumulado) + '"/>';
    }
    acumulado += it.percentual;
  });
  el('d-svg').innerHTML = svg;
  el('donut').setAttribute('aria-label', 'Gráfico de rosca: ' +
    cart.itens.map(function (it) { return it.percentual + '% ' + it.classe; }).join(', '));

  // Tabela
  var linhas = cart.itens.map(function (it, i) {
    return '<tr data-i="' + i + '" tabindex="0"><td><span class="sw" style="background:' + CORES[i] + '"></span>' +
      esc(it.classe) + '</td><td class="n">' + it.percentual + '%</td><td class="n">' + M(it.valor) + '</td></tr>';
  }).join('');
  var totalPct = cart.itens.reduce(function (s, it) { return s + it.percentual; }, 0);
  var totalVal = cart.itens.reduce(function (s, it) { return s + Math.round(it.valor * 100); }, 0) / 100;
  linhas += '<tr><th>Total</th><th class="n">' + totalPct + '%</th><th class="n">' + M(totalVal) + '</th></tr>';
  el('t-corpo').innerHTML = linhas;

  // Como as regras chegaram a esta carteira
  var prazoTxt = o.prazo + (o.prazo === 1 ? ' mês' : ' meses');
  var regra = 'Pontuação ' + u.perfil.pontos + ' (' + u.perfil.classe + ') e prazo de ' + prazoTxt + ': ';
  if (!cart.ajustadoPeloPrazo) regra += 'vale a carteira do perfil calculado.';
  else regra += 'como o prazo é curto, usamos a carteira ' + FEM[cart.perfilUsado] +
    ' (até 24 meses: Conservadora; de 25 a 60 meses: no máximo Moderada).';
  el('regra').textContent = regra;

  // Realce entre tabela e gráfico
  var donut = el('donut');
  var itens = document.querySelectorAll('[data-i]');
  function on(i) { donut.classList.add('dim'); itens.forEach(function (e) { e.classList.toggle('hl', e.dataset.i === i); }); }
  function off() { donut.classList.remove('dim'); itens.forEach(function (e) { e.classList.remove('hl'); }); }
  itens.forEach(function (e) {
    e.addEventListener('mouseenter', function () { on(e.dataset.i); }); e.addEventListener('mouseleave', off);
    e.addEventListener('focus', function () { on(e.dataset.i); }); e.addEventListener('blur', off);
  });
})();
