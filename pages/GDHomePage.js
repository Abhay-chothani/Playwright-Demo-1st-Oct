/**
 * GDHomePage Page Object
 * Encapsulates hero banner, FAQ accordion, and primary marketing sections on the Giriraj Digital home page.
 */
export class GDHomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Hero Section
    this.heroHeading = page.locator('h1').first();
    this.heroTagline = page.locator('.banner-content p, .hero-section p').first();

    // FAQ Section
    this.faqContainer = page.locator('.faq-global');
    this.faqTitle = page.locator('.faq-global .global-title h4');
    this.faqItems = page.locator('.faq-accordion-list .each-faq');
    this.faqQuestions = page.locator('.faq-accordion-list .each-faq h3');
    this.faqAnswers = page.locator('.faq-accordion-list .each-faq .answer p');
  }

  /**
   * Navigate to homepage
   */
  async goto() {
    await this.page.goto('/');
  }

  /**
   * Check if home page hero heading is visible
   * @returns {Promise<boolean>}
   */
  async isLoaded() {
    return await this.heroHeading.isVisible();
  }

  /**
   * Retrieve text from the hero heading
   * @returns {Promise<string|null>}
   */
  async getHeroHeadingText() {
    return await this.heroHeading.textContent();
  }

  /**
   * Get count of FAQ items displayed
   * @returns {Promise<number>}
   */
  async getFaqCount() {
    return await this.faqItems.count();
  }

  /**
   * Retrieve all FAQ question strings
   * @returns {Promise<string[]>}
   */
  async getFaqQuestionTexts() {
    return await this.faqQuestions.allTextContents();
  }
}
