/*
 * Guia do Investidor — Sprint 2
 * objetivo.js: tela 06. RF04 — informar objetivo, aporte mensal e prazo, com validação.
 */
(function () {
  'use strict';
  var u = Dados.exigirLogin();
  if (!u) return;
  if (!u.perfil) { location.replace('04-questionario.html'); return; }

  var form = document.getElementById('form-objetivo');
  if (u.objetivo) { // preenche com o último objetivo informado
    form.obj.value = u.objetivo.objetivo; form.aporte.value = u.objetivo.aporte; form.prazo.value = u.objetivo.prazo;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var dados = { objetivo: form.obj.value, aporte: form.aporte.value, prazo: form.prazo.value };
    var erros = Regras.validarObjetivo(dados);
    if (Object.keys(erros).length) {
      // os ids dos campos na tela são obj, aporte e prazo
      var porCampo = {};
      if (erros.objetivo) porCampo.obj = erros.objetivo;
      if (erros.aporte) porCampo.aporte = erros.aporte;
      if (erros.prazo) porCampo.prazo = erros.prazo;
      UI.mostrarErros(form, porCampo, 'Corrija os campos destacados para gerar a carteira.');
      return;
    }
    Dados.atualizarUsuario({ objetivo: {
      objetivo: dados.objetivo.trim(),
      aporte: Number(String(dados.aporte).replace(',', '.')),
      prazo: Number(dados.prazo)
    } });
    location.href = '08-dashboard.html';
  });
})();
