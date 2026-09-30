/**
 * GDFooter Page Object
 * Encapsulates footer elements, global office locations, social links, and accolades.
 */
export class GDFooter {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Footer Container
    this.footerContainer = page.locator('footer');
    this.footerLogo = page.locator('footer .ftr-logo a');

    // Global Office Locations
    this.locationCards = page.locator('footer .location-each');
    this.denmarkCountry = page.locator('footer .country-name:has-text("DENMARK")');
    this.ahmedabadCity = page.locator('footer .city-name:has-text("AHMEDABAD")');
    this.usaCountry = page.locator('footer .country-name:has-text("USA")');
    this.addressParagraphs = page.locator('footer .loc-address p');

    // Certification & Partner Logos
    this.certifiedLogos = page.locator('footer .certified-logo .individual-logo img');

    // Social Media Links
    this.socialLinks = page.locator('footer .social-icon a');
    this.facebookLink = page.locator('footer a[title="Facebook"]');
    this.linkedInLink = page.locator('footer a[title="LinkedIn"]');
    this.twitterLink = page.locator('footer a[title="Twitter"]');
    this.instagramLink = page.locator('footer a[title="Instagram"]');

    // Copyright & Legal
    this.copyrightText = page.locator('footer .right-side p:has-text("Copyright")');
    this.backToTopButton = page.locator('.backto-top');
  }

  /**
   * Check if footer is visible in DOM
   * @returns {Promise<boolean>}
   */
  async isVisible() {
    return await this.footerContainer.isVisible();
  }

  /**
   * Get copyright string text
   * @returns {Promise<string|null>}
   */
  async getCopyright() {
    return await this.copyrightText.textContent();
  }

  /**
   * Get count of office address blocks displayed in footer
   * @returns {Promise<number>}
   */
  async getAddressCount() {
    return await this.addressParagraphs.count();
  }

  /**
   * Get all office address texts
   * @returns {Promise<string[]>}
   */
  async getAllAddresses() {
    return await this.addressParagraphs.allTextContents();
  }

  /**
   * Get count of social media links in footer
   * @returns {Promise<number>}
   */
  async getSocialLinkCount() {
    return await this.socialLinks.count();
  }
}
