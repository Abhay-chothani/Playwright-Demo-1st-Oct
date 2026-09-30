/**
 * GDContactPage Page Object
 * Encapsulates the Contact Us / Get In Touch inquiry form locators, validation states, and input actions.
 */
export class GDContactPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Contact Form Container & Header
    this.form = page.locator('.getintouchform form');
    this.pageHeading = page.locator('h1, h2').first();

    // Input Fields
    this.firstNameInput = page.locator('input[placeholder*="First Name"]');
    this.lastNameInput = page.locator('input[placeholder*="Last Name"]');
    this.emailInput = page.locator('input[placeholder*="Email"]');
    this.phoneNumberInput = page.locator('input[placeholder*="Phone Number"]');
    this.descriptionInput = page.locator('input[placeholder*="Description"]');
    this.fileUploadInput = page.locator('input[type="file"]');
    this.submitButton = page.locator('button[data-umb="submit-forms-form"]');

    // Required Field Asterisk Indicators
    this.firstNameIndicator = page.locator('.firstname .umbraco-forms-indicator');
    this.emailIndicator = page.locator('.email .umbraco-forms-indicator');
    this.descriptionIndicator = page.locator('.description .umbraco-forms-indicator');

    // Validation Error Message Spans
    this.firstNameError = page.locator('.firstname .form-text span');
    this.emailError = page.locator('.email .form-text span');
    this.descriptionError = page.locator('.description .form-text span');
    this.phoneNumberError = page.locator('.phonenumber .form-text span');
  }

  /**
   * Navigate to the Contact Us page
   */
  async goto() {
    await this.page.goto('/contact-us/');
  }

  /**
   * Fill out the contact form fields
   * @param {{ firstName?: string, lastName?: string, email?: string, phone?: string, description?: string }} data
   */
  async fillForm(data) {
    if (data.firstName !== undefined) {
      await this.firstNameInput.fill(data.firstName);
    }
    if (data.lastName !== undefined) {
      await this.lastNameInput.fill(data.lastName);
    }
    if (data.email !== undefined) {
      await this.emailInput.fill(data.email);
    }
    if (data.phone !== undefined) {
      await this.phoneNumberInput.fill(data.phone);
    }
    if (data.description !== undefined) {
      await this.descriptionInput.fill(data.description);
    }
  }

  /**
   * Clear all text input fields
   */
  async clearAllFields() {
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.emailInput.clear();
    await this.phoneNumberInput.clear();
    await this.descriptionInput.clear();
  }
}
