/**
 * GDBlogsPage Page Object
 * Encapsulates the Giriraj Digital Blogs page (/blogs/) and specifically its
 * blog-tab-wrapper filter bar and category navigation tabs.
 *
 * Adheres strictly to the framework Page Object Model (POM) standards:
 * - Contains only element locators and user actions.
 * - Contains zero test assertions (assertions reside exclusively in test specs).
 */
export class GDBlogsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = '/blogs/';

    // Scoped locators for the blog-tab-wrapper section
    this.blogTabWrapper = page.locator('.blog-tab-wrapper');
    this.tabs = this.blogTabWrapper.locator('a.filterbtn');
    this.activeTab = this.blogTabWrapper.locator('a.filterbtn.active');
  }

  /**
   * Navigate to the Blogs page
   * @param {string} [path]
   */
  async goto(path = this.path) {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Check if the blog tab wrapper container is visible
   * @returns {Promise<boolean>}
   */
  async isTabWrapperVisible() {
    return await this.blogTabWrapper.isVisible();
  }

  /**
   * Get total count of tab elements in the wrapper
   * @returns {Promise<number>}
   */
  async getTabsCount() {
    return await this.tabs.count();
  }

  /**
   * Retrieve all tab text strings
   * @returns {Promise<string[]>}
   */
  async getTabTexts() {
    const rawTexts = await this.tabs.allTextContents();
    return rawTexts.map((text) => text.trim());
  }

  /**
   * Get a tab Locator by index (0-based)
   * @param {number} index
   * @returns {import('@playwright/test').Locator}
   */
  getTabByIndex(index) {
    return this.tabs.nth(index);
  }

  /**
   * Get a tab Locator by exact text
   * @param {string} tabName
   * @returns {import('@playwright/test').Locator}
   */
  getTabByName(tabName) {
    return this.tabs.filter({ hasText: new RegExp(`^\\s*${tabName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`) }).first();
  }

  /**
   * Click a specific tab by name
   * @param {string} tabName
   */
  async clickTabByName(tabName) {
    await this.getTabByName(tabName).click();
  }

  /**
   * Get the text of the currently active tab
   * @returns {Promise<string|null>}
   */
  async getActiveTabText() {
    const text = await this.activeTab.textContent();
    return text ? text.trim() : null;
  }
}
