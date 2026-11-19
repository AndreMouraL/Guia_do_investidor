/*
 * Guia do Investidor — Sprint 2
 * auth.js: telas de cadastro (02) e login (01). RF01.
 */
(function () {
  'use strict';

  /* Depois de entrar: quem ainda não tem perfil vai ao questionário;
     quem já tem perfil e objetivo vai direto ao dashboard. */
  function proximaTela(u) {
    if (!u.perfil) return '04-questionario.html';
    if (!u.objetivo) return '05-resultado-perfil.html';
    return '08-dashboard.html';
  }

  var cadastro = document.getElementById('form-cadastro');
  if (cadastro) {
    cadastro.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      var r = await Dados.cadastrar(cadastro.nome.value, cadastro.email.value, cadastro.senha.value);
      if (!r.ok) { UI.mostrarErros(cadastro, r.erros, 'Não foi possível criar a conta. Corrija os campos destacados.'); return; }
      location.href = '04-questionario.html';
    });
  }

  var login = document.getElementById('form-login');
  if (login) {
    login.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      var r = await Dados.entrar(login.email.value, login.senha.value);
      if (!r.ok) { UI.mostrarErros(login, { email: ' ', senha: r.erro }, r.erro); return; }
      location.href = proximaTela(r.usuario);
    });
  }
})();
