/*
 * Guia do Investidor — Sprint 3
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
    var campoSenha = document.getElementById('senha');
    var dicaSenha = document.getElementById('dica-senha');
    var btnCadastrar = document.getElementById('btn-cadastrar');

    /* S3: feedback preventivo em tempo real sobre os critérios da senha */
    if (campoSenha && dicaSenha) {
      campoSenha.addEventListener('input', function () {
        var tam = campoSenha.value.length;
        if (tam >= 8) {
          dicaSenha.textContent = 'Senha válida (' + tam + ' caracteres).';
          dicaSenha.classList.add('ok');
        } else {
          var faltam = 8 - tam;
          dicaSenha.textContent = 'Use pelo menos 8 caracteres (faltam ' + faltam + ').';
          dicaSenha.classList.remove('ok');
        }
      });
    }

    cadastro.addEventListener('submit', async function (ev) {
      ev.preventDefault();
      if (btnCadastrar) {
        btnCadastrar.disabled = true;
        btnCadastrar.textContent = 'Criando conta...';
      }

      var r = await Dados.cadastrar(cadastro.nome.value, cadastro.email.value, cadastro.senha.value);
      if (!r.ok) {
        if (btnCadastrar) {
          btnCadastrar.disabled = false;
          btnCadastrar.textContent = 'Cadastrar';
        }
        UI.mostrarErros(cadastro, r.erros, 'Não foi possível criar a conta. Corrija os campos destacados.');
        return;
      }

      /* S3: confirmação visual antes de redirecionar */
      var avisoSucesso = document.createElement('p');
      avisoSucesso.className = 'info';
      avisoSucesso.setAttribute('role', 'status');
      avisoSucesso.textContent = 'Conta criada com sucesso! Redirecionando...';
      cadastro.insertBefore(avisoSucesso, btnCadastrar);

      setTimeout(function () {
        location.href = '04-questionario.html';
      }, 600);
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