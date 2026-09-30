import { test as base, expect } from '@playwright/test';
import { GDHeaderNav } from '../pages/GDHeaderNav.js';
import { GDHomePage } from '../pages/GDHomePage.js';
import { GDContactPage } from '../pages/GDContactPage.js';
import { GDFooter } from '../pages/GDFooter.js';
import { GDQualityAssurancePage } from '../pages/GDQualityAssurancePage.js';
import { GDBlogsPage } from '../pages/GDBlogsPage.js';

/**
 * Custom Playwright test fixture extending base test.
 * Pre-instantiates Giriraj Digital Page Objects for clean and scalable test scenarios.
 */
export const test = base.extend({
  gdHeaderNav: async ({ page }, use) => {
    const gdHeaderNav = new GDHeaderNav(page);
    await use(gdHeaderNav);
  },

  gdHomePage: async ({ page }, use) => {
    const gdHomePage = new GDHomePage(page);
    await use(gdHomePage);
  },

  gdContactPage: async ({ page }, use) => {
    const gdContactPage = new GDContactPage(page);
    await use(gdContactPage);
  },

  gdFooter: async ({ page }, use) => {
    const gdFooter = new GDFooter(page);
    await use(gdFooter);
  },

  gdQAPage: async ({ page }, use) => {
    const gdQAPage = new GDQualityAssurancePage(page);
    await use(gdQAPage);
  },

  gdBlogsPage: async ({ page }, use) => {
    const gdBlogsPage = new GDBlogsPage(page);
    await use(gdBlogsPage);
  },
});

export { expect };
