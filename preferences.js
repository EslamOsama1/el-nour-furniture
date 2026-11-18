const siteRoot = document.documentElement;
const languageButton = document.querySelector('.language-toggle');
const themeButton = document.querySelector('.theme-toggle');

function uiText(arabic, english) {
  return siteRoot.lang === 'en' ? english : arabic;
}

function savePreference(key, value) {
  try { localStorage.setItem('el-nour-' + key, value); } catch {}
}

const translatedAttributes = ['alt', 'aria-label', 'data-title', 'data-label', 'content'];
const translatedText = [];
const translatedLabels = [];

function englishFor(arabic) {
  const photo = /^انتقل للصورة (\d+)$/.exec(arabic);
  return photo ? 'Go to photo ' + photo[1] : SITE_ENGLISH[arabic];
}

function indexTranslations() {
  const walker = document.createTreeWalker(siteRoot, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement.closest('script, style, .slide-pause')) continue;
    const original = node.nodeValue;
    const translated = englishFor(original.trim());
    if (translated) translatedText.push([node, original, original.replace(original.trim(), translated)]);
  }
  const selector = translatedAttributes.map(attribute => '[' + attribute + ']').join(',');
  document.querySelectorAll(selector).forEach(element => {
    if (element.matches('.menu-button, .theme-toggle, .language-toggle')) return;
    translatedAttributes.forEach(attribute => {
      const original = element.getAttribute(attribute);
      const translated = original && englishFor(original);
      if (translated) translatedLabels.push([element, attribute, original, translated]);
    });
  });
}

function applyLanguage(language) {
  const english = language === 'en';
  siteRoot.lang = english ? 'en' : 'ar';
  siteRoot.dir = english ? 'ltr' : 'rtl';
  translatedText.forEach(([node, original, translation]) => {
    node.nodeValue = english ? translation : original;
  });
  translatedLabels.forEach(([element, attribute, original, translation]) => {
    element.setAttribute(attribute, english ? translation : original);
  });
  languageButton.textContent = english ? 'العربية' : 'EN';
  languageButton.lang = english ? 'ar' : 'en';
  languageButton.setAttribute('aria-label', uiText('التبديل إلى الإنجليزية', 'Switch to Arabic'));
  themeButton.setAttribute('aria-label', uiText('الوضع الداكن', 'Dark mode'));
  document.dispatchEvent(new Event('site-language-change'));
}

function applyTheme(dark) {
  siteRoot.dataset.theme = dark ? 'dark' : 'light';
  themeButton.setAttribute('aria-pressed', String(dark));
  themeButton.textContent = dark ? '☀' : '☾';
  document.querySelector('meta[name="theme-color"]').content = dark ? '#1d1b18' : '#302b24';
}

function initializePreferences() {
  indexTranslations();
  applyLanguage(siteRoot.lang);
  applyTheme(siteRoot.dataset.theme === 'dark');
  languageButton.addEventListener('click', () => {
    applyLanguage(siteRoot.lang === 'en' ? 'ar' : 'en');
    savePreference('language', siteRoot.lang);
  });
  themeButton.addEventListener('click', () => {
    applyTheme(siteRoot.dataset.theme !== 'dark');
    savePreference('theme', siteRoot.dataset.theme);
  });
}
