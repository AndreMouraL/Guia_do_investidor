/*
 * Testes das regras de negócio (RF03, RF04, RF05). Rodar com: node testes/regras.test.js
 * Não precisa instalar nada (usa o módulo assert do próprio Node).
 */
const assert = require('assert');
const R = require('../codigo/js/regras.js');
let ok = 0;
function teste(nome, fn) { fn(); ok++; console.log('ok -', nome); }

teste('RF03: 8 respostas "1" = 8 pontos, Conservador', () => {
  const p = R.calcularPerfil([1, 1, 1, 1, 1, 1, 1, 1]);
  assert.strictEqual(p.pontos, 8); assert.strictEqual(p.classe, 'Conservador');
});
teste('RF03: limites das faixas (16, 17, 24, 25)', () => {
  assert.strictEqual(R.calcularPerfil([2, 2, 2, 2, 2, 2, 2, 2]).classe, 'Conservador'); // 16
  assert.strictEqual(R.calcularPerfil([3, 2, 2, 2, 2, 2, 2, 2]).classe, 'Moderado');    // 17
  assert.strictEqual(R.calcularPerfil([3, 3, 3, 3, 3, 3, 3, 3]).classe, 'Moderado');    // 24
  assert.strictEqual(R.calcularPerfil([4, 3, 3, 3, 3, 3, 3, 3]).classe, 'Arrojado');    // 25
});
teste('RF03: exemplo do protótipo, 21 pontos = Moderado', () => {
  const p = R.calcularPerfil([3, 3, 3, 2, 3, 2, 3, 2]);
  assert.strictEqual(p.pontos, 21); assert.strictEqual(p.classe, 'Moderado');
});
teste('RF02/RF03: questionário incompleto é recusado', () => {
  assert.throws(() => R.calcularPerfil([1, 2, 3]));
});
teste('RF04: aporte 0 e prazo vazio geram as duas mensagens', () => {
  const e = R.validarObjetivo({ objetivo: 'Aposentadoria', aporte: '0', prazo: '' });
  assert.strictEqual(e.aporte, 'O aporte deve ser maior que zero.');
  assert.ok(e.prazo);
  assert.strictEqual(e.objetivo, undefined);
});
teste('RF04: dados válidos não geram erro', () => {
  assert.deepStrictEqual(R.validarObjetivo({ objetivo: 'Casa', aporte: '1500', prazo: '120' }), {});
});
teste('RF05: Moderado, R$ 1.500, 120 meses = 35/25/10/20/10 e R$ 525/375/150/300/150', () => {
  const c = R.gerarCarteira('Moderado', 1500, 120);
  assert.deepStrictEqual(c.itens.map(i => i.percentual), [35, 25, 10, 20, 10]);
  assert.deepStrictEqual(c.itens.map(i => i.valor), [525, 375, 150, 300, 150]);
});
teste('RF05: toda carteira soma 100% e o total bate com o aporte', () => {
  for (const perfil of ['Conservador', 'Moderado', 'Arrojado']) {
    for (const prazo of [6, 36, 120]) {
      const c = R.gerarCarteira(perfil, 333.33, prazo);
      assert.strictEqual(c.itens.reduce((s, i) => s + i.percentual, 0), 100);
      assert.strictEqual(Math.round(c.itens.reduce((s, i) => s + i.valor * 100, 0)), 33333);
    }
  }
});
teste('RF05: prazo curto deixa a carteira mais segura', () => {
  assert.strictEqual(R.gerarCarteira('Arrojado', 1000, 12).perfilUsado, 'Conservador');
  assert.strictEqual(R.gerarCarteira('Arrojado', 1000, 48).perfilUsado, 'Moderado');
  assert.strictEqual(R.gerarCarteira('Arrojado', 1000, 61).perfilUsado, 'Arrojado');
});
teste('moeda: 1500 = "R$ 1.500,00"', () => {
  assert.strictEqual(R.moeda(1500), 'R$ 1.500,00');
});
console.log(`\n${ok} testes passaram.`);
