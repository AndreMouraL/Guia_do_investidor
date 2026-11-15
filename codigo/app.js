/* Efeitos visuais opcionais (sem lógica de negócio). As páginas funcionam sem este arquivo. */
document.querySelectorAll('.opt input[type=radio]').forEach(function(r){
  r.addEventListener('change',function(){
    document.querySelectorAll('.opt').forEach(function(o){o.classList.remove('sel')});
    r.closest('.opt').classList.add('sel');
  });
});
document.querySelectorAll('input[type=password]').forEach(function(i){
  var w=document.createElement('div');w.className='pw';i.parentNode.insertBefore(w,i);w.appendChild(i);
  var b=document.createElement('button');b.type='button';b.textContent='Mostrar';b.setAttribute('aria-label','Mostrar senha');
  b.addEventListener('click',function(){var s=i.type==='password';i.type=s?'text':'password';b.textContent=s?'Ocultar':'Mostrar';b.setAttribute('aria-label',s?'Ocultar senha':'Mostrar senha');});
  w.appendChild(b);
});
var d=document.querySelector('.donut');
if(d){
  var items=document.querySelectorAll('[data-i]');
  function on(i){d.classList.add('dim');items.forEach(function(e){e.classList.toggle('hl',e.dataset.i===i)});}
  function off(){d.classList.remove('dim');items.forEach(function(e){e.classList.remove('hl')});}
  items.forEach(function(e){
    e.addEventListener('mouseenter',function(){on(e.dataset.i)});e.addEventListener('mouseleave',off);
    e.addEventListener('focus',function(){on(e.dataset.i)});e.addEventListener('blur',off);
  });
}
