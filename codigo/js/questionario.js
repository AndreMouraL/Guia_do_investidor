/*
 * Guia do Investidor — Sprint 2
 * questionario.js: tela 04. RF02 (responder as 8 perguntas) e RF03 (calcular o perfil ao final).
 * Mostra uma pergunta por vez; só avança se a pergunta atual tiver resposta.
 */
(function () {
  'use strict';
  if (!Dados.exigirLogin()) return;

  var CHAVE = 'gi_respostas';
  var P = Regras.PERGUNTAS;
  var estado;
  try { estado = JSON.parse(sessionStorage.getItem(CHAVE)); } catch (e) { estado = null; }
  if (!estado || !Array.isArray(estado.respostas) || estado.respostas.length !== P.length) {
    estado = { atual: 0, respostas: P.map(function () { return null; }) };
  }

  var form = document.getElementById('form-quest');
  var prog = document.getElementById('prog');
  var barra = document.getElementById('barra');
  var area = document.getElementById('pergunta');
  var erro = document.getElementById('quest-erro');
  var btnAnt = document.getElementById('anterior');
  var btnProx = document.getElementById('proxima');

  function salvar() { sessionStorage.setItem(CHAVE, JSON.stringify(estado)); }

  function desenhar() {
    var i = estado.atual, q = P[i];
    prog.textContent = 'Pergunta ' + (i + 1) + ' de ' + P.length;
    barra.setAttribute('aria-valuenow', i + 1);
    barra.firstElementChild.style.width = ((i + 1) / P.length * 100) + '%';
    erro.hidden = true;

    var html = '<legend>' + q.texto + '</legend>';
    q.opcoes.forEach(function (txt, k) {
      var pontos = k + 1, id = 'q' + i + '_' + k, marcado = estado.respostas[i] === pontos;
      html += '<div class="opt' + (marcado ? ' sel' : '') + '"><input type="radio" name="resp" id="' + id +
        '" value="' + pontos + '"' + (marcado ? ' checked' : '') + '><label for="' + id + '">' + txt + '</label></div>';
    });
    area.innerHTML = html;
    area.querySelectorAll('input').forEach(function (r) {
      r.addEventListener('change', function () {
        estado.respostas[i] = Number(r.value); salvar(); erro.hidden = true;
        area.querySelectorAll('.opt').forEach(function (o) { o.classList.remove('sel'); });
        r.closest('.opt').classList.add('sel');
      });
    });
    btnAnt.hidden = i === 0;
    btnProx.textContent = i === P.length - 1 ? 'Finalizar' : 'Próxima';
  }

  btnAnt.addEventListener('click', function () {
    if (estado.atual > 0) { estado.atual--; salvar(); desenhar(); area.querySelector('input').focus(); }
  });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (estado.respostas[estado.atual] === null) { // critério de aceite: não avança sem resposta
      erro.hidden = false; area.querySelector('input').focus(); return;
    }
    if (estado.atual < P.length - 1) { estado.atual++; salvar(); desenhar(); area.querySelector('input').focus(); return; }

    // Última pergunta: calcula o perfil (RF03) e guarda no usuário.
    var perfil = Regras.calcularPerfil(estado.respostas);
    Dados.atualizarUsuario({
      perfil: { pontos: perfil.pontos, classe: perfil.classe, data: new Date().toISOString() },
      respostas: estado.respostas.slice()
    });
    sessionStorage.removeItem(CHAVE);
    location.href = '05-resultado-perfil.html';
  });

  desenhar();
})();
