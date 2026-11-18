const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const images = [...document.querySelectorAll('.hero-photo img, .ritual-photo img')];
const ticker = document.querySelector('.ticker-track');
let scheduled = false;
function renderMotion() {
  scheduled = false;
  if (reduced.matches) {
    images.forEach(image => image.style.transform = '');
    ticker.style.transform = '';
    return;
  }
  images.forEach(image => {
    const rect = image.parentElement.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
    image.style.transform = `scale(1.14) translateY(${(progress - .5) * 9}%)`;
  });
  const rect = ticker.parentElement.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)));
  ticker.style.transform = `translateX(${-progress * 20}%)`;
}
function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(renderMotion); } }
addEventListener('scroll', schedule, { passive: true });
addEventListener('resize', schedule);
reduced.addEventListener('change', schedule);
schedule();
if ('IntersectionObserver' in window && !reduced.matches) {
  const targets = document.querySelectorAll('.statement > div, .ritual-copy, .approach-inner > div:not(.orb), .questions > div, .visit-top, .visit-grid');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  targets.forEach(target => { target.classList.add('reveal'); observer.observe(target); });
  document.documentElement.classList.add('js-motion');
}
