(() => {
  const themeRoot = document.documentElement;
  const themeKey = 'theme-preference';
  const themeButton = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem(themeKey);

  themeRoot.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';

  const updateThemeButton = () => {
    if (!themeButton) return;
    const isLight = themeRoot.dataset.theme === 'light';
    themeButton.textContent = isLight ? 'Dark' : 'Light';
    themeButton.setAttribute('aria-label', isLight ? '다크 모드로 전환' : '라이트 모드로 전환');
  };

  if (themeButton) {
    themeButton.addEventListener('click', () => {
      themeRoot.dataset.theme = themeRoot.dataset.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem(themeKey, themeRoot.dataset.theme);
      updateThemeButton();
    });
  }

  updateThemeButton();
})();
