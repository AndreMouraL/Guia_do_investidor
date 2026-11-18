/*
 * Guia do Investidor — Sprint 2
 * app.js: comportamentos comuns a todas as telas (sem regras de negócio).
 *  - mostrar/ocultar senha
 *  - destaque da opção marcada no questionário
 *  - link "Sair" encerra a sessão
 *  - nome do usuário logado no menu
 *  - funções para mostrar e limpar erros de formulário (usadas pelas telas)
 */
(function () {
  'use strict';

  /* Mostrar/ocultar senha */
  document.querySelectorAll('input[type=password]').forEach(function (i) {
    var w = document.createElement('div'); w.className = 'pw'; i.parentNode.insertBefore(w, i); w.appendChild(i);
    var b = document.createElement('button'); b.type = 'button'; b.textContent = 'Mostrar'; b.setAttribute('aria-label', 'Mostrar senha');
    b.addEventListener('click', function () {
      var s = i.type === 'password'; i.type = s ? 'text' : 'password';
      b.textContent = s ? 'Ocultar' : 'Mostrar'; b.setAttribute('aria-label', s ? 'Ocultar senha' : 'Mostrar senha');
    });
    w.appendChild(b);
  });

  /* "Sair": encerra a sessão antes de ir para o login */
  document.querySelectorAll('[data-sair]').forEach(function (a) {
    a.addEventListener('click', function () { if (window.Dados) Dados.sair(); });
  });

  /* Nome do usuário no menu das telas internas */
  var ola = document.getElementById('ola');
  if (ola && window.Dados) {
    var u = Dados.usuarioAtual();
    if (u) ola.textContent = 'Olá, ' + u.nome.split(' ')[0];
  }

  /* Erros de formulário: borda vermelha + mensagem em texto ligada ao campo */
  function limparErros(form) {
    form.querySelectorAll('.erro[data-gerado], .alerta[data-gerado]').forEach(function (e) { e.remove(); });
    form.querySelectorAll('.campo-erro').forEach(function (c) {
      c.classList.remove('campo-erro'); c.removeAttribute('aria-invalid'); c.removeAttribute('aria-describedby');
    });
  }
  function mostrarErros(form, erros, resumo) {
    limparErros(form);
    var primeiro = null;
    Object.keys(erros).forEach(function (id) {
      var campo = form.querySelector('#' + id);
      if (!campo) return;
      campo.classList.add('campo-erro'); campo.setAttribute('aria-invalid', 'true');
      if (String(erros[id]).trim()) {
        var p = document.createElement('p');
        p.className = 'erro'; p.id = id + '-e'; p.textContent = erros[id]; p.setAttribute('data-gerado', '');
        var depois = campo.parentNode.classList.contains('pw') ? campo.parentNode : campo;
        depois.insertAdjacentElement('afterend', p);
        campo.setAttribute('aria-describedby', p.id);
      }
      if (!primeiro) primeiro = campo;
    });
    if (resumo) {
      var a = document.createElement('p');
      a.className = 'alerta'; a.setAttribute('role', 'alert'); a.setAttribute('data-gerado', ''); a.textContent = resumo;
      var h1 = form.querySelector('h1') || form.firstElementChild;
      h1.insertAdjacentElement('afterend', a);
    }
    if (primeiro) primeiro.focus();
  }

  window.UI = { mostrarErros: mostrarErros, limparErros: limparErros };
})();
