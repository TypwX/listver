// Interações da página de download. Sem bibliotecas: a página funciona inteira
// sem este arquivo; ele só acrescenta as entradas suaves e as bolinhas do carrossel.
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

// No celular, as telas ficam num carrossel: as bolinhas mostram a posição e levam a cada tela.
const carrossel = document.querySelector('.telas');
const telas = [...document.querySelectorAll('.tela')];
const pontos = [...document.querySelectorAll('.ponto')];

function marcar(indice) {
  pontos.forEach((p, i) => {
    p.classList.toggle('ativo', i === indice);
    if (i === indice) p.setAttribute('aria-current', 'true');
    else p.removeAttribute('aria-current');
  });
}

carrossel.addEventListener(
  'scroll',
  () => {
    // Distância entre o começo de uma tela e o da seguinte (largura + espaço).
    const passo = telas[1].offsetLeft - telas[0].offsetLeft;
    if (passo > 0) marcar(Math.min(telas.length - 1, Math.round(carrossel.scrollLeft / passo)));
  },
  { passive: true },
);

pontos.forEach((ponto, i) =>
  ponto.addEventListener('click', () => {
    carrossel.scrollTo({ left: telas[i].offsetLeft - telas[0].offsetLeft, behavior: 'smooth' });
  }),
);
