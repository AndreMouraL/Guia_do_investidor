/*
 * Guia do Investidor — Sprint 2
 * dados.js: guarda e lê os dados no localStorage do navegador e controla a sessão.
 * Não há servidor: cada navegador tem os seus próprios usuários.
 *
 * Chaves usadas:
 *   gi_usuarios  -> lista de usuários [{nome, email, senhaHash, perfil, objetivo}]
 *   gi_sessao    -> e-mail do usuário logado
 *   gi_respostas -> respostas do questionário em andamento (sessionStorage)
 *
 * RF01 · cadastro, login e sessão
 */
(function () {
  'use strict';

  var CHAVE_USUARIOS = 'gi_usuarios';
  var CHAVE_SESSAO = 'gi_sessao';

  function lerUsuarios() {
    try { return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || []; }
    catch (e) { return []; }
  }
  function gravarUsuarios(lista) {
    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(lista));
  }
  function normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  /** A senha nunca é guardada em texto: guardamos o resumo SHA-256 dela. */
  async function resumoSenha(senha) {
    var bytes = new TextEncoder().encode(senha);
    var hash = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(hash)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  function buscarUsuario(email) {
    email = normalizarEmail(email);
    return lerUsuarios().filter(function (u) { return u.email === email; })[0] || null;
  }

  /** RF01: valida e cria a conta. Devolve {ok, erros}. */
  async function cadastrar(nome, email, senha) {
    var erros = {};
    nome = String(nome || '').trim();
    email = normalizarEmail(email);
    if (!nome) erros.nome = 'Informe o seu nome.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.email = 'Informe um e-mail válido, como nome@exemplo.com.';
    else if (buscarUsuario(email)) erros.email = 'Este e-mail já está em uso. Entre ou use outro e-mail.';
    if (String(senha || '').length < 8) erros.senha = 'A senha deve ter 8 ou mais caracteres.';
    if (Object.keys(erros).length) return { ok: false, erros: erros };

    var lista = lerUsuarios();
    lista.push({ nome: nome, email: email, senhaHash: await resumoSenha(senha), perfil: null, objetivo: null });
    gravarUsuarios(lista);
    localStorage.setItem(CHAVE_SESSAO, email);
    return { ok: true, erros: {} };
  }

  /** RF01: confere e-mail e senha. Devolve {ok, erro}. */
  async function entrar(email, senha) {
    var u = buscarUsuario(email);
    if (!u || u.senhaHash !== await resumoSenha(String(senha || ''))) {
      return { ok: false, erro: 'E-mail ou senha incorretos.' };
    }
    localStorage.setItem(CHAVE_SESSAO, u.email);
    return { ok: true, usuario: u };
  }

  function sair() { localStorage.removeItem(CHAVE_SESSAO); }

  function usuarioAtual() {
    var email = localStorage.getItem(CHAVE_SESSAO);
    return email ? buscarUsuario(email) : null;
  }

  /** Páginas internas chamam isto: sem login, volta para a tela de entrar e devolve null. */
  function exigirLogin() {
    var u = usuarioAtual();
    if (!u) location.replace('01-login.html');
    return u;
  }

  /** Atualiza campos do usuário logado (ex.: perfil, objetivo). */
  function atualizarUsuario(campos) {
    var email = localStorage.getItem(CHAVE_SESSAO);
    var lista = lerUsuarios();
    lista.forEach(function (u) { if (u.email === email) Object.assign(u, campos); });
    gravarUsuarios(lista);
    return buscarUsuario(email);
  }

  window.Dados = {
    cadastrar: cadastrar, entrar: entrar, sair: sair,
    usuarioAtual: usuarioAtual, exigirLogin: exigirLogin, atualizarUsuario: atualizarUsuario
  };
})();
