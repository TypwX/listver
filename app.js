// Interações da página de download. Sem bibliotecas: a página funciona inteira
// sem este arquivo; ele só acrescenta as entradas suaves e o passo a passo das telas.
// Navegador antigo sem IntersectionObserver: nada fica escondido nem animado.
const observa = 'IntersectionObserver' in window;
if (observa) document.documentElement.classList.add('js');

// Seções aparecem ao rolar, uma vez só.
const revelar = observa && new IntersectionObserver(
  (entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('visivel');
      revelar.unobserve(e.target);
    }
  },
  { rootMargin: '0px 0px -10% 0px' },
);
if (revelar) document.querySelectorAll('.revela').forEach((el) => revelar.observe(el));

// "Como o app funciona": no computador o celular fixo mostra a tela do passo que
// está no meio da tela; no celular, as bolinhas acompanham o carrossel.
const passos = [...document.querySelectorAll('.passo')];
const telas = [...document.querySelectorAll('.vitrine-tela')];
const pontos = [...document.querySelectorAll('.ponto')];
const carrossel = document.querySelector('.passos-app');
const largo = window.matchMedia('(min-width: 900px)');

function mostrar(indice) {
  passos.forEach((p, i) => p.classList.toggle('ativo', i === indice));
  telas.forEach((t, i) => t.classList.toggle('ativa', i === indice));
  pontos.forEach((p, i) => {
    p.classList.toggle('ativo', i === indice);
    if (i === indice) p.setAttribute('aria-current', 'true');
    else p.removeAttribute('aria-current');
  });
}

// No computador: o passo cujo centro está mais perto do centro da janela
// (só 4 medidas por rolagem, leve o bastante para não precisar adiar).
function passoNoMeio() {
  if (!largo.matches) return;
  const meio = window.innerHeight / 2;
  const distancias = passos.map((p) => {
    const r = p.getBoundingClientRect();
    return Math.abs(r.top + r.height / 2 - meio);
  });
  mostrar(distancias.indexOf(Math.min(...distancias)));
}
window.addEventListener('scroll', passoNoMeio, { passive: true });
window.addEventListener('resize', passoNoMeio);
// Segundo gatilho: quando um passo cruza a tela (cobre rolagens bruscas, como links e teclado).
if (observa) {
  const cruzou = new IntersectionObserver(passoNoMeio, { threshold: [0, 0.25, 0.5, 0.75, 1] });
  passos.forEach((p) => cruzou.observe(p));
}

let quadro = 0;
carrossel.addEventListener(
  'scroll',
  () => {
    cancelAnimationFrame(quadro);
    quadro = requestAnimationFrame(() => {
      // Distância entre o começo de uma tela e o da seguinte (largura + espaço).
      const passo = passos[1].offsetLeft - passos[0].offsetLeft;
      mostrar(Math.min(passos.length - 1, Math.round(carrossel.scrollLeft / passo)));
    });
  },
  { passive: true },
);

pontos.forEach((ponto, i) =>
  ponto.addEventListener('click', () => {
    passos[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }),
);

mostrar(0);
