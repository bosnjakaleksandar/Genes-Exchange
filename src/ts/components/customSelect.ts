export function initCustomSelect() {
  const customSelects = document.querySelectorAll('.custom-select') as NodeListOf<HTMLElement>;

  customSelects.forEach((customSelect) => {
    const trigger = customSelect.querySelector('.custom-select__trigger') as HTMLElement;
    const options = customSelect.querySelector('.custom-select__options') as HTMLElement;
    const optionItems = customSelect.querySelectorAll(
      '.custom-select__option'
    ) as NodeListOf<HTMLElement>;
    const flagImg = trigger?.querySelector('.custom-select__flag') as HTMLImageElement;

    if (!trigger || !options || !flagImg) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      customSelect.classList.toggle('active');

      customSelects.forEach((otherSelect) => {
        if (otherSelect !== customSelect) {
          otherSelect.classList.remove('active');
        }
      });
    });

    const slugMap: Record<string, string> = {
      '/evroliga': '/en/euroleague',
      '/en/euroleague': '/evroliga',
      '/blog': '/en/blog',
      '/en/blog': '/blog',
      '/kursna-lista': '/en/exchange-rates',
      '/en/exchange-rates': '/kursna-lista',
      '/': '/en',
      '/en': '/',
    };

    optionItems.forEach((option) => {
      option.addEventListener('click', (e) => {
        if (option.querySelector('.custom-select__disabled')) {
          e.stopPropagation();
          return;
        }
        const value = option.dataset.value;
        const img = option.querySelector('img') as HTMLImageElement;

        if (img) {
          const allFlags = document.querySelectorAll(
            '.custom-select__flag'
          ) as NodeListOf<HTMLImageElement>;
          allFlags.forEach((f) => {
            f.src = img.src;
            f.alt = img.alt;
          });
        }

        customSelect.classList.remove('active');

        let currentPath = window.location.pathname;
        if (currentPath.length > 1 && currentPath.endsWith('/')) {
          currentPath = currentPath.slice(0, -1);
        }
        currentPath = currentPath.toLowerCase();

        const relatedSlugMeta = document.querySelector('meta[name="related-slug"]');
        const relatedSlug = relatedSlugMeta?.getAttribute('content');

        let targetPath = '/';
        if (value === 'en') {
          if (relatedSlug && currentPath.startsWith('/blog/')) {
            targetPath = `/en/blog/${relatedSlug}`;
          } else {
            targetPath =
              slugMap[currentPath] || (currentPath === '/' ? '/en' : '/en' + currentPath);
          }
        } else {
          if (relatedSlug && currentPath.startsWith('/en/blog/')) {
            targetPath = `/blog/${relatedSlug}`;
          } else {
            targetPath = slugMap[currentPath] || currentPath.replace(/^\/en/, '') || '/';
          }
        }
        window.location.href = targetPath;
      });
    });
  });

  document.addEventListener('click', () => {
    customSelects.forEach((customSelect) => {
      customSelect.classList.remove('active');
    });
  });
}
