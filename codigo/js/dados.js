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

  /** Fallback SHA-256 em JS puro para contextos sem crypto.subtle (ex.: file:// em alguns navegadores). */
  function sha256Puro(texto) {
    var bytes = typeof TextEncoder !== 'undefined'
      ? new TextEncoder().encode(texto)
      : new Uint8Array(unescape(encodeURIComponent(texto)).split('').map(function (c) { return c.charCodeAt(0); }));
    var K = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];
    var H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var bitLen = bytes.length * 8;
    var padLen = ((bytes.length + 9 + 63) >> 6) << 6;
    var buf = new Uint8Array(padLen);
    buf.set(bytes);
    buf[bytes.length] = 0x80;
    var view = new DataView(buf.buffer);
    view.setUint32(padLen - 8, Math.floor(bitLen / 0x100000000), false);
    view.setUint32(padLen - 4, bitLen >>> 0, false);
    var W = new Uint32Array(64);
    for (var offset = 0; offset < padLen; offset += 64) {
      var i;
      for (i = 0; i < 16; i++) W[i] = view.getUint32(offset + i * 4, false);
      for (i = 16; i < 64; i++) {
        var s0 = ((W[i - 15] >>> 7) | (W[i - 15] << 25)) ^ ((W[i - 15] >>> 18) | (W[i - 15] << 14)) ^ (W[i - 15] >>> 3);
        var s1 = ((W[i - 2] >>> 17) | (W[i - 2] << 15)) ^ ((W[i - 2] >>> 19) | (W[i - 2] << 13)) ^ (W[i - 2] >>> 10);
        W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
      }
      var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
      for (i = 0; i < 64; i++) {
        var S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        var ch = (e & f) ^ (~e & g);
        var t1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
        var S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var t2 = (S0 + maj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H[0] = (H[0] + a) >>> 0; H[1] = (H[1] + b) >>> 0; H[2] = (H[2] + c) >>> 0; H[3] = (H[3] + d) >>> 0;
      H[4] = (H[4] + e) >>> 0; H[5] = (H[5] + f) >>> 0; H[6] = (H[6] + g) >>> 0; H[7] = (H[7] + h) >>> 0;
    }
    return H.map(function (v) { return ('00000000' + v.toString(16)).slice(-8); }).join('');
  }

  /** A senha nunca é guardada em texto: guardamos o resumo SHA-256 dela. */
  async function resumoSenha(senha) {
    if (window.crypto && crypto.subtle) {
      var bytes = new TextEncoder().encode(senha);
      var hash = await crypto.subtle.digest('SHA-256', bytes);
      return Array.from(new Uint8Array(hash)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
    }
    return sha256Puro(senha);
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

  function sair() {
    var email = localStorage.getItem(CHAVE_SESSAO);
    localStorage.removeItem(CHAVE_SESSAO);
    try {
      sessionStorage.removeItem('gi_respostas');
      if (email) sessionStorage.removeItem('gi_respostas_' + email);
    } catch (e) { /* ignora se sessionStorage indisponível */ }
  }

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
