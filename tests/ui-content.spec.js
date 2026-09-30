import { test, expect } from '../fixtures/test-fixtures.js';
import { getGirirajData } from '../utils/test-data.js';

const testData = getGirirajData();

test.describe('Giriraj Digital - UI Elements & Content Regression Tests', () => {
  test.beforeEach(async ({ gdHomePage }) => {
    await gdHomePage.goto();
  });

  test('should display hero section with correct heading and branding', async ({ gdHomePage }) => {
    await expect(gdHomePage.heroHeading).toBeVisible();
    await expect(gdHomePage.heroHeading).toContainText(testData.site.heroHeading);
  });

  test('should display FAQ accordion title and expected questions', async ({ gdHomePage }) => {
    // Assert FAQ Section Title
    await expect(gdHomePage.faqTitle).toBeVisible();
    await expect(gdHomePage.faqTitle).toContainText(testData.uiContent.faqSectionTitle);

    // Assert FAQ Items Count
    const faqCount = await gdHomePage.getFaqCount();
    expect(faqCount).toBeGreaterThanOrEqual(testData.uiContent.faqQuestions.length);

    // Verify key FAQ questions are present in content
    const faqTexts = await gdHomePage.getFaqQuestionTexts();
    for (const expectedQuestion of testData.uiContent.faqQuestions) {
      const matchFound = faqTexts.some((text) => text.includes(expectedQuestion));
      expect(matchFound).toBeTruthy();
    }
  });

  test('should render global office locations with correct addresses in footer', async ({ gdFooter }) => {
    await expect(gdFooter.footerContainer).toBeVisible();

    // Verify presence of office location country badges
    await expect(gdFooter.denmarkCountry).toBeVisible();
    await expect(gdFooter.ahmedabadCity).toBeVisible();
    await expect(gdFooter.usaCountry).toBeVisible();

    // Verify all 3 configured office addresses are displayed
    const addresses = await gdFooter.getAllAddresses();
    expect(addresses.length).toBeGreaterThanOrEqual(testData.uiContent.officeLocations.length);

    for (const office of testData.uiContent.officeLocations) {
      const addressMatch = addresses.some((addr) => addr.includes(office.country) || addr.includes(office.address.slice(0, 15)));
      expect(addressMatch).toBeTruthy();
    }
  });

  test('should display certified partner and accolade badges', async ({ gdFooter }) => {
    const certifiedBadgesCount = await gdFooter.certifiedLogos.count();
    expect(certifiedBadgesCount).toBeGreaterThanOrEqual(testData.uiContent.certifications.length);

    // Verify Umbraco Gold Partner alt text exists
    const umbracoBadge = gdFooter.certifiedLogos.filter({ has: gdFooter.page.locator('[alt*="umbraco Gold Partner"]') });
    await expect(umbracoBadge.first()).toBeAttached();
  });

  test('should display social media links and correct copyright in footer', async ({ gdFooter }) => {
    // Verify copyright text
    const copyright = await gdFooter.getCopyright();
    expect(copyright).toContain(testData.site.copyright);

    // Verify social channels
    await expect(gdFooter.facebookLink).toBeVisible();
    await expect(gdFooter.linkedInLink).toBeVisible();
    await expect(gdFooter.twitterLink).toBeVisible();
    await expect(gdFooter.instagramLink).toBeVisible();
  });
});
