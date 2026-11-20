/*
 * Guia do Investidor — Sprint 2
 * resultado.js: tela 05. RF03 — mostra a pontuação e a classificação calculadas.
 */
(function () {
  'use strict';
  var u = Dados.exigirLogin();
  if (!u) return;
  if (!u.perfil) { location.replace('04-questionario.html'); return; }

  var faixa = Regras.FAIXAS.filter(function (f) { return f.classe === u.perfil.classe; })[0];
  document.getElementById('classe').textContent = u.perfil.classe;
  document.getElementById('pontos').textContent =
    'Pontuação: ' + u.perfil.pontos + ' de 32 (faixa ' + faixa.classe + ': ' + faixa.min + ' a ' + faixa.max + ').';
  document.getElementById('frase').textContent = faixa.frase;
})();
