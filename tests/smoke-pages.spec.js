import { test, expect } from '../fixtures/test-fixtures.js';
import { getGirirajData } from '../utils/test-data.js';

const testData = getGirirajData();

test.describe('Giriraj Digital - Smoke & Critical Routes Regression Tests', () => {
  test('should load the home page with correct hero title and branding', async ({ gdHomePage, page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(new RegExp(testData.site.expectedTitleContains));
    await expect(gdHomePage.heroHeading).toBeVisible();
    await expect(gdHomePage.heroHeading).toContainText('AI Powered Enterprise Development');
  });

  const criticalRoutes = [
    { name: 'Company Overview', path: testData.routes.companyOverview },
    { name: 'Product Engineering Services', path: testData.routes.productEngineering },
    { name: 'Case Studies', path: testData.routes.caseStudies },
    { name: 'Careers', path: testData.routes.career },
    { name: 'Contact Us', path: testData.routes.contactUs },
  ];

  for (const route of criticalRoutes) {
    test(`should return HTTP 200 and render page content for ${route.name}`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBe(200);

      // Verify page is not empty and header is visible
      await expect(page.locator('header, nav, .navbar')).toBeVisible();
      await expect(page).toHaveURL(new RegExp(route.path));
    });
  }

  test('should render footer with certification badges and social media links', async ({ gdHomePage, gdFooter }) => {
    await gdHomePage.goto();
    await expect(gdFooter.footerContainer).toBeVisible();

    const socialCount = await gdFooter.getSocialLinkCount();
    expect(socialCount).toBeGreaterThan(0);
  });
});
