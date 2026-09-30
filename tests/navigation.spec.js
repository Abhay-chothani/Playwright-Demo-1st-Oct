import { test, expect } from '../fixtures/test-fixtures.js';
import { getGirirajData } from '../utils/test-data.js';

const testData = getGirirajData();

test.describe('Giriraj Digital - Header Navigation & Routing Regression Tests', () => {
  test.beforeEach(async ({ gdHeaderNav }) => {
    await gdHeaderNav.goto();
  });

  test('should display brand logo and navigate to homepage on click', async ({ gdHeaderNav, page }) => {
    await expect(gdHeaderNav.navbarBrand).toBeVisible();
    await gdHeaderNav.clickLogo();
    await expect(page).toHaveURL(new RegExp(testData.site.baseUrl + '/?$'));
  });

  test('should display all primary navigation menu items', async ({ gdHeaderNav }) => {
    await expect(gdHeaderNav.navHome).toBeVisible();
    await expect(gdHeaderNav.navWhoWeAre).toBeVisible();
    await expect(gdHeaderNav.navWhatWeDo).toBeVisible();
    await expect(gdHeaderNav.navResources).toBeVisible();
    await expect(gdHeaderNav.navCareer).toBeVisible();
  });

  test('should reveal "Who we are" submenu options', async ({ gdHeaderNav }) => {
    await gdHeaderNav.hoverWhoWeAre();
    await expect(gdHeaderNav.submenuCompanyOverview).toBeAttached();
    await expect(gdHeaderNav.submenuLeadershipTeam).toBeAttached();
  });

  test('should reveal "Resources" submenu options', async ({ gdHeaderNav }) => {
    await gdHeaderNav.hoverResources();
    await expect(gdHeaderNav.submenuCaseStudy).toBeAttached();
    await expect(gdHeaderNav.submenuBlogs).toBeAttached();
  });

  test('should navigate to Contact Us page when clicking "Inquire Now"', async ({ gdHeaderNav, page }) => {
    await expect(gdHeaderNav.inquireNowButton).toBeVisible();
    await gdHeaderNav.clickInquireNow();
    await expect(page).toHaveURL(/.*\/contact-us\/?$/);
  });

  test('should display the header search bar', async ({ gdHeaderNav }) => {
    await expect(gdHeaderNav.searchInput).toBeAttached();
  });
});
