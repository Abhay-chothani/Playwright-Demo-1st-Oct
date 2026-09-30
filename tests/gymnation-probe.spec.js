import { test } from '@playwright/test';

test('probe GymNation DOM structure across desktop and mobile', async ({ page }) => {
  // Test desktop first
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('https://gymnation.com/', { waitUntil: 'domcontentloaded' });

  // Extract header and nav details
  const desktopHeader = await page.evaluate(() => {
    const header = document.querySelector('header') || document.querySelector('nav');
    const links = Array.from(document.querySelectorAll('header a, nav a')).map(a => a.textContent.trim()).filter(Boolean);
    const logo = document.querySelector('header img, nav img, a[href="/"] img');
    return {
      headerTag: header?.tagName,
      headerClass: header?.className,
      links: links.slice(0, 10),
      hasLogo: !!logo,
      logoSrc: logo?.getAttribute('src') || logo?.getAttribute('alt')
    };
  });
  console.log('Desktop Header:\n', JSON.stringify(desktopHeader, null, 2));

  // Check mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(1000);

  const mobileHeader = await page.evaluate(() => {
    // Find burger / menu buttons
    const togglers = Array.from(document.querySelectorAll('button, a, div[role="button"], span'))
      .filter(el => {
        const cls = (el.className || '').toString().toLowerCase();
        const aria = (el.getAttribute('aria-label') || '').toLowerCase();
        return cls.includes('burger') || cls.includes('hamburger') || cls.includes('menu') || cls.includes('toggle') || aria.includes('menu');
      })
      .map(el => ({
        tag: el.tagName,
        class: el.className,
        ariaLabel: el.getAttribute('aria-label'),
        rect: el.getBoundingClientRect()
      }));

    // Check horizontal scroll
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const innerWidth = window.innerWidth;

    return {
      scrollWidth,
      clientWidth,
      innerWidth,
      hasHorizontalScroll: scrollWidth > innerWidth,
      togglers: togglers.slice(0, 8)
    };
  });
  console.log('Mobile Header & Viewport:\n', JSON.stringify(mobileHeader, null, 2));

  // Check cards and sections
  const sections = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('section, main > div, [class*="card"], [class*="plan"], [class*="grid"]'))
      .slice(0, 10)
      .map(s => ({
        tag: s.tagName,
        class: s.className,
        rect: {
          width: s.getBoundingClientRect().width,
          height: s.getBoundingClientRect().height,
          left: s.getBoundingClientRect().left,
          right: s.getBoundingClientRect().right
        }
      }));
  });
  console.log('Sections & Cards sample:\n', JSON.stringify(sections.slice(0, 6), null, 2));

  // Check footer
  const footerData = await page.evaluate(() => {
    const ftr = document.querySelector('footer');
    return {
      footerClass: ftr?.className,
      rect: ftr ? ftr.getBoundingClientRect() : null,
      columnsCount: ftr ? ftr.querySelectorAll('[class*="col"]').length : 0,
      linksCount: ftr ? ftr.querySelectorAll('a').length : 0
    };
  });
  console.log('Footer Data:\n', JSON.stringify(footerData, null, 2));
});
