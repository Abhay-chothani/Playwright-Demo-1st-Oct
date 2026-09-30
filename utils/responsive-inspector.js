/**
 * Responsive UI Inspector Utility
 *
 * Provides specialized client-side DOM analysis algorithms to detect actual
 * responsive design and layout defects across viewports:
 * - Horizontal scrolling and viewport overflow
 * - Text clipping and cut-off content
 * - Text overlap and bounding box collisions
 * - Button and interactive element collisions
 * - Image and media container overflow
 * - Broken card grids and collapsed layouts
 * - Form and input field boundaries
 * - Header, navigation, and mobile menu alignment
 * - Footer column stacking and overflow
 * - Unexpectedly hidden critical elements
 */

export class ResponsiveInspector {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  /**
   * Check for horizontal scrolling and elements extending outside the viewport
   * @param {number} [tolerance=1.5]
   * @returns {Promise<{ hasOverflow: boolean, scrollWidth: number, innerWidth: number, overflowingElements: Array }>}
   */
  async checkHorizontalOverflow(tolerance = 1.5) {
    return await this.page.evaluate((tol) => {
      const scrollWidth = document.documentElement.scrollWidth;
      const innerWidth = window.innerWidth;
      const bodyScrollWidth = document.body ? document.body.scrollWidth : scrollWidth;
      const effectiveScrollWidth = Math.max(scrollWidth, bodyScrollWidth);
      const hasOverflow = effectiveScrollWidth > innerWidth + tol;

      const overflowingElements = [];
      const allElements = document.querySelectorAll('body *');

      allElements.forEach((el) => {
        // Skip script, style, meta, head tags
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(el.tagName)) return;

        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const style = window.getComputedStyle(el);
          const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity || '1') > 0;

          if (isVisible) {
            // Check if element extends past the right boundary
            if (rect.right > innerWidth + tol) {
              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || undefined,
                className: (el.className || '').toString().slice(0, 60),
                rectRight: Math.round(rect.right),
                excessPx: Math.round(rect.right - innerWidth),
                width: Math.round(rect.width),
                textSnippet: el.textContent?.trim().slice(0, 40) || ''
              });
            }

            // Check if element extends past the left boundary (negative coordinate without overflow hidden)
            if (rect.left < -tol) {
              overflowingElements.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || undefined,
                className: (el.className || '').toString().slice(0, 60),
                rectLeft: Math.round(rect.left),
                excessPx: Math.abs(Math.round(rect.left)),
                width: Math.round(rect.width),
                textSnippet: el.textContent?.trim().slice(0, 40) || ''
              });
            }
          }
        }
      });

      return {
        hasOverflow,
        scrollWidth: effectiveScrollWidth,
        innerWidth,
        overflowingElements: overflowingElements.slice(0, 15)
      };
    }, tolerance);
  }

  /**
   * Check for text clipping (text truncated by overflow:hidden where scrollWidth > clientWidth)
   * @returns {Promise<{ clippedCount: number, clippedElements: Array }>}
   */
  async checkTextClipping() {
    return await this.page.evaluate(() => {
      const candidates = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, .btn, button, a.btn');
      const clippedElements = [];

      candidates.forEach((el) => {
        const style = window.getComputedStyle(el);
        const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity || '1') > 0;

        if (isVisible && el.clientWidth > 0 && el.clientHeight > 0) {
          const hasHorizontalClip = el.scrollWidth > el.clientWidth + 3 &&
            (style.overflow === 'hidden' || style.overflowX === 'hidden' || style.textOverflow === 'ellipsis');

          const hasVerticalClip = el.scrollHeight > el.clientHeight + 4 &&
            (style.overflow === 'hidden' || style.overflowY === 'hidden');

          if (hasHorizontalClip || hasVerticalClip) {
            clippedElements.push({
              tag: el.tagName.toLowerCase(),
              className: (el.className || '').toString().slice(0, 50),
              type: hasHorizontalClip ? 'horizontal-clip' : 'vertical-clip',
              scrollWidth: el.scrollWidth,
              clientWidth: el.clientWidth,
              scrollHeight: el.scrollHeight,
              clientHeight: el.clientHeight,
              textSnippet: el.textContent?.trim().slice(0, 50) || ''
            });
          }
        }
      });

      return {
        clippedCount: clippedElements.length,
        clippedElements: clippedElements.slice(0, 15)
      };
    });
  }

  /**
   * Check for overlapping text elements (headings and paragraphs colliding)
   * @param {number} [minOverlapAreaPx=30]
   * @returns {Promise<{ overlapCount: number, overlappingPairs: Array }>}
   */
  async checkTextOverlap(minOverlapAreaPx = 30) {
    return await this.page.evaluate((minArea) => {
      const textElements = Array.from(
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .heading, .title')
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          parseFloat(style.opacity || '1') > 0
        );
      });

      const overlappingPairs = [];

      for (let i = 0; i < textElements.length; i++) {
        const elA = textElements[i];
        const rectA = elA.getBoundingClientRect();

        for (let j = i + 1; j < textElements.length; j++) {
          const elB = textElements[j];

          // Skip if one contains the other (parent-child relationship)
          if (elA.contains(elB) || elB.contains(elA)) continue;

          const rectB = elB.getBoundingClientRect();

          // Calculate rectangle intersection
          const xOverlap = Math.max(0, Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left));
          const yOverlap = Math.max(0, Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top));
          const overlapArea = xOverlap * yOverlap;

          if (overlapArea >= minArea) {
            overlappingPairs.push({
              elementA: {
                tag: elA.tagName.toLowerCase(),
                class: (elA.className || '').toString().slice(0, 40),
                text: elA.textContent?.trim().slice(0, 30) || '',
                rect: { top: Math.round(rectA.top), left: Math.round(rectA.left), width: Math.round(rectA.width), height: Math.round(rectA.height) }
              },
              elementB: {
                tag: elB.tagName.toLowerCase(),
                class: (elB.className || '').toString().slice(0, 40),
                text: elB.textContent?.trim().slice(0, 30) || '',
                rect: { top: Math.round(rectB.top), left: Math.round(rectB.left), width: Math.round(rectB.width), height: Math.round(rectB.height) }
              },
              overlapAreaPx: Math.round(overlapArea)
            });
          }
        }
      }

      return {
        overlapCount: overlappingPairs.length,
        overlappingPairs: overlappingPairs.slice(0, 10)
      };
    }, minOverlapAreaPx);
  }

  /**
   * Check for overlapping buttons or buttons colliding with other elements
   * @param {number} [minOverlapAreaPx=15]
   * @returns {Promise<{ overlapCount: number, overlappingPairs: Array }>}
   */
  async checkButtonOverlap(minOverlapAreaPx = 15) {
    return await this.page.evaluate((minArea) => {
      const buttons = Array.from(
        document.querySelectorAll('button, a.btn, a.button, input[type="submit"], input[type="button"], .region-badge')
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          style.display !== 'none' &&
          style.visibility !== 'hidden' &&
          parseFloat(style.opacity || '1') > 0
        );
      });

      const overlappingPairs = [];

      for (let i = 0; i < buttons.length; i++) {
        const btnA = buttons[i];
        const rectA = btnA.getBoundingClientRect();

        for (let j = i + 1; j < buttons.length; j++) {
          const btnB = buttons[j];
          if (btnA.contains(btnB) || btnB.contains(btnA)) continue;

          const rectB = btnB.getBoundingClientRect();
          const xOverlap = Math.max(0, Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left));
          const yOverlap = Math.max(0, Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top));
          const overlapArea = xOverlap * yOverlap;

          if (overlapArea >= minArea) {
            overlappingPairs.push({
              buttonA: {
                text: btnA.textContent?.trim().slice(0, 30) || btnA.getAttribute('value') || '',
                class: (btnA.className || '').toString().slice(0, 40)
              },
              buttonB: {
                text: btnB.textContent?.trim().slice(0, 30) || btnB.getAttribute('value') || '',
                class: (btnB.className || '').toString().slice(0, 40)
              },
              overlapAreaPx: Math.round(overlapArea)
            });
          }
        }
      }

      return {
        overlapCount: overlappingPairs.length,
        overlappingPairs: overlappingPairs.slice(0, 10)
      };
    }, minOverlapAreaPx);
  }

  /**
   * Check for image and media elements overflowing their containers or the viewport
   * @returns {Promise<{ overflowingCount: number, overflowingImages: Array }>}
   */
  async checkImageOverflow() {
    return await this.page.evaluate(() => {
      const media = document.querySelectorAll('img, picture, svg, video, iframe');
      const innerWidth = window.innerWidth;
      const overflowingImages = [];

      media.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const style = window.getComputedStyle(el);
          const isVisible = style.display !== 'none' && style.visibility !== 'hidden';

          if (isVisible) {
            // Check if media exceeds viewport width
            const exceedsViewport = rect.right > innerWidth + 2;
            const parent = el.parentElement;
            let exceedsParent = false;

            if (parent) {
              const parentRect = parent.getBoundingClientRect();
              const parentStyle = window.getComputedStyle(parent);
              if (parentStyle.overflow !== 'hidden' && rect.width > parentRect.width + 4) {
                exceedsParent = true;
              }
            }

            if (exceedsViewport || exceedsParent) {
              overflowingImages.push({
                tag: el.tagName.toLowerCase(),
                src: el.getAttribute('src')?.slice(0, 60) || el.getAttribute('alt') || 'svg/media',
                width: Math.round(rect.width),
                rectRight: Math.round(rect.right),
                exceedsViewport,
                exceedsParent
              });
            }
          }
        }
      });

      return {
        overflowingCount: overflowingImages.length,
        overflowingImages: overflowingImages.slice(0, 10)
      };
    });
  }

  /**
   * Check card and grid layout elements for height collapses or broken dimensions
   * @param {string} [cardSelector='[class*="card"], [class*="region"], .col, .grid-item']
   * @returns {Promise<{ brokenCount: number, brokenCards: Array }>}
   */
  async checkCardLayouts(cardSelector = '[class*="card"], [class*="region-badge"], .col') {
    return await this.page.evaluate((selector) => {
      const cards = document.querySelectorAll(selector);
      const brokenCards = [];
      const innerWidth = window.innerWidth;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const style = window.getComputedStyle(card);
        const hasTextContent = (card.textContent || '').trim().length > 0;

        if (style.display !== 'none' && style.visibility !== 'hidden' && hasTextContent) {
          // Check for collapsed height or width with active text
          const isCollapsed = rect.width <= 0 || rect.height <= 0;
          const overflowsViewport = rect.right > innerWidth + 2;

          if (isCollapsed || overflowsViewport) {
            brokenCards.push({
              tag: card.tagName.toLowerCase(),
              class: (card.className || '').toString().slice(0, 50),
              width: Math.round(rect.width),
              height: Math.round(rect.height),
              rectRight: Math.round(rect.right),
              isCollapsed,
              overflowsViewport,
              textSnippet: card.textContent?.trim().slice(0, 40)
            });
          }
        }
      });

      return {
        brokenCount: brokenCards.length,
        brokenCards: brokenCards.slice(0, 10)
      };
    }, cardSelector);
  }

  /**
   * Check form layout, input fields and submit button alignments
   * @param {string} [formSelector='form, .form']
   * @returns {Promise<{ formCount: number, formIssues: Array }>}
   */
  async checkFormLayout(formSelector = 'form, [class*="form"]') {
    return await this.page.evaluate((selector) => {
      const forms = document.querySelectorAll(selector);
      const formIssues = [];
      const innerWidth = window.innerWidth;

      forms.forEach((form) => {
        const inputs = form.querySelectorAll('input, select, textarea, button[type="submit"], .submit-btn');

        inputs.forEach((input) => {
          const rect = input.getBoundingClientRect();
          const style = window.getComputedStyle(input);

          if (style.display !== 'none' && style.visibility !== 'hidden') {
            // Check if input extends beyond viewport
            if (rect.right > innerWidth + 2) {
              formIssues.push({
                type: 'input-overflow',
                inputTag: input.tagName.toLowerCase(),
                inputType: input.getAttribute('type') || 'input',
                rectRight: Math.round(rect.right),
                innerWidth
              });
            }

            // Check if input is unreasonably squashed (< 40px width on a mobile screen)
            if (rect.width > 0 && rect.width < 40 && input.tagName !== 'BUTTON') {
              formIssues.push({
                type: 'input-too-narrow',
                inputTag: input.tagName.toLowerCase(),
                width: Math.round(rect.width)
              });
            }
          }
        });
      });

      return {
        formCount: forms.length,
        formIssues
      };
    }, formSelector);
  }

  /**
   * Check footer layout, column stacking, and horizontal containment
   * @returns {Promise<{ hasFooter: boolean, footerRect: object|null, footerIssues: Array }>}
   */
  async checkFooterLayout() {
    return await this.page.evaluate(() => {
      const footer = document.querySelector('footer, [class*="footer"]');
      if (!footer) return { hasFooter: false, footerRect: null, footerIssues: ['Footer not found in DOM'] };

      const rect = footer.getBoundingClientRect();
      const innerWidth = window.innerWidth;
      const footerIssues = [];

      if (rect.right > innerWidth + 2) {
        footerIssues.push(`Footer overflows viewport: right=${Math.round(rect.right)}px > innerWidth=${innerWidth}px`);
      }

      const footerLinks = footer.querySelectorAll('a');
      if (footerLinks.length === 0) {
        footerIssues.push('Footer has 0 accessible links');
      }

      return {
        hasFooter: true,
        footerRect: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          left: Math.round(rect.left),
          right: Math.round(rect.right)
        },
        footerIssues
      };
    });
  }

  /**
   * Run a complete, comprehensive responsive audit across all layout defect categories
   * @param {object} viewport
   * @returns {Promise<object>}
   */
  async runComprehensiveAudit(viewport) {
    const horizontal = await this.checkHorizontalOverflow();
    const textClipping = await this.checkTextClipping();
    const textOverlap = await this.checkTextOverlap();
    const buttonOverlap = await this.checkButtonOverlap();
    const imageOverflow = await this.checkImageOverflow();
    const cardLayouts = await this.checkCardLayouts();
    const formLayout = await this.checkFormLayout();
    const footerLayout = await this.checkFooterLayout();

    const totalIssues =
      (horizontal.hasOverflow ? 1 : 0) +
      textClipping.clippedCount +
      textOverlap.overlapCount +
      buttonOverlap.overlapCount +
      imageOverflow.overflowingCount +
      cardLayouts.brokenCount +
      formLayout.formIssues.length +
      footerLayout.footerIssues.length;

    return {
      viewport: `${viewport.name} (${viewport.width}x${viewport.height})`,
      passed: totalIssues === 0,
      totalIssues,
      horizontal,
      textClipping,
      textOverlap,
      buttonOverlap,
      imageOverflow,
      cardLayouts,
      formLayout,
      footerLayout
    };
  }
}
