const heroWrap = document.querySelector('.hero-wrap');
const heroPanel = document.querySelector('.hero-panel');

if (heroWrap && heroPanel) {
  const updateHeroMotion = () => {
    const rect = heroWrap.getBoundingClientRect();
    const maxScroll = heroWrap.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    const progress = Math.min(Math.max(-rect.top / maxScroll, 0), 1);
    const shift = progress * -50;
    heroPanel.style.setProperty('--hero-shift', `${shift}px`);
    heroPanel.style.opacity = String(1 - progress * 0.35);
  };

  const revealTargets = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealTargets.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 0.06, 0.24)}s`;
    io.observe(item);
  });

  document.addEventListener('scroll', updateHeroMotion, { passive: true });
  window.addEventListener('resize', updateHeroMotion);
  updateHeroMotion();
}
