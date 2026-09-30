/**
 * GDQualityAssurancePage Page Object
 * Encapsulates the Quality Assurance services page (/services/quality-assurance/)
 * and specifically its Frequently Asked Questions (FAQ) accordion section.
 *
 * Adheres strictly to the framework Page Object Model (POM) standards:
 * - Contains only element locators and user actions.
 * - Contains zero test assertions (expectations are kept in test specs).
 */
export class GDQualityAssurancePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = '/services/quality-assurance/';

    // FAQ Section Scoped Locators
    this.faqSection = page.locator('.faq-global');
    this.faqTitle = this.faqSection.locator('.global-title h4');
    this.faqSubtitle = this.faqSection.locator('.global-title small');
    this.faqAccordionLists = this.faqSection.locator('.faq-accordion-list');
    this.faqItems = this.faqSection.locator('.each-faq');
    this.faqQuestions = this.faqSection.locator('.each-faq h3');
    this.faqAnswers = this.faqSection.locator('.each-faq .answer');
  }

  /**
   * Navigate to the Quality Assurance services page
   */
  async goto() {
    await this.page.goto(this.path);
  }

  /**
   * Check if the FAQ section is visible in DOM
   * @returns {Promise<boolean>}
   */
  async isFaqSectionVisible() {
    return await this.faqSection.isVisible();
  }

  /**
   * Get FAQ section title text
   * @returns {Promise<string|null>}
   */
  async getFaqTitleText() {
    return await this.faqTitle.textContent();
  }

  /**
   * Get FAQ section subtitle text
   * @returns {Promise<string|null>}
   */
  async getFaqSubtitleText() {
    return await this.faqSubtitle.textContent();
  }

  /**
   * Get total count of FAQ items
   * @returns {Promise<number>}
   */
  async getFaqCount() {
    return await this.faqItems.count();
  }

  /**
   * Get a specific FAQ item container locator by zero-based index
   * @param {number} index
   * @returns {import('@playwright/test').Locator}
   */
  getFaqItem(index) {
    return this.faqItems.nth(index);
  }

  /**
   * Get a specific FAQ question locator by zero-based index
   * @param {number} index
   * @returns {import('@playwright/test').Locator}
   */
  getFaqQuestion(index) {
    return this.faqQuestions.nth(index);
  }

  /**
   * Get a specific FAQ answer container locator by zero-based index
   * @param {number} index
   * @returns {import('@playwright/test').Locator}
   */
  getFaqAnswer(index) {
    return this.faqAnswers.nth(index);
  }

  /**
   * Retrieve all FAQ question text strings
   * @returns {Promise<string[]>}
   */
  async getFaqQuestionTexts() {
    const texts = await this.faqQuestions.allTextContents();
    return texts.map((t) => t.trim());
  }

  /**
   * Click on a specific FAQ question by index to toggle open/close
   * @param {number} index
   */
  async clickFaqQuestion(index) {
    await this.getFaqQuestion(index).click();
  }

  /**
   * Get the text content of a specific FAQ answer
   * @param {number} index
   * @returns {Promise<string|null>}
   */
  async getFaqAnswerText(index) {
    const text = await this.getFaqAnswer(index).textContent();
    return text ? text.trim() : null;
  }

  /**
   * Check if a specific FAQ answer is currently visible
   * @param {number} index
   * @returns {Promise<boolean>}
   */
  async isFaqAnswerVisible(index) {
    return await this.getFaqAnswer(index).isVisible();
  }
}
