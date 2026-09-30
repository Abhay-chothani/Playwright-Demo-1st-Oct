import { test, expect } from '../fixtures/test-fixtures.js';
import { getContactFormData } from '../utils/test-data.js';

const contactData = getContactFormData();

test.describe('Giriraj Digital - Form Validation & Input Constraints Regression Tests', () => {
  test.beforeEach(async ({ gdContactPage, page }) => {
    // Fail-safe protection: Block all POST network requests to ensure no live submission occurs
    await page.route('**/contact-us/**', (route, request) => {
      if (request.method() === 'POST') {
        return route.abort();
      }
      return route.continue();
    });

    await gdContactPage.goto();
  });

  test('should display required indicators (*) on all mandatory fields', async ({ gdContactPage }) => {
    await expect(gdContactPage.firstNameIndicator).toBeVisible();
    await expect(gdContactPage.firstNameIndicator).toHaveText('*');

    await expect(gdContactPage.emailIndicator).toBeVisible();
    await expect(gdContactPage.emailIndicator).toHaveText('*');

    await expect(gdContactPage.descriptionIndicator).toBeVisible();
    await expect(gdContactPage.descriptionIndicator).toHaveText('*');
  });

  test('should verify required validation error attributes on mandatory inputs', async ({ gdContactPage }) => {
    // First Name validation attributes
    await expect(gdContactPage.firstNameInput).toHaveAttribute(
      'data-val-required',
      contactData.expectedValidation.firstNameRequired
    );
    await expect(gdContactPage.firstNameInput).toHaveAttribute('aria-required', 'true');

    // Email validation attributes
    await expect(gdContactPage.emailInput).toHaveAttribute(
      'data-val-required',
      contactData.expectedValidation.emailRequired
    );
    await expect(gdContactPage.emailInput).toHaveAttribute('aria-required', 'true');

    // Description validation attributes
    await expect(gdContactPage.descriptionInput).toHaveAttribute(
      'data-val-required',
      contactData.expectedValidation.descriptionRequired
    );
    await expect(gdContactPage.descriptionInput).toHaveAttribute('aria-required', 'true');
  });

  test('should verify field type constraints and regex validation attributes', async ({ gdContactPage }) => {
    // Email type and regex pattern
    await expect(gdContactPage.emailInput).toHaveAttribute('type', contactData.fieldAttributes.emailType);
    await expect(gdContactPage.emailInput).toHaveAttribute('data-val-regex', contactData.expectedValidation.invalidEmailRegex);

    // Phone type and regex pattern
    await expect(gdContactPage.phoneNumberInput).toHaveAttribute('type', contactData.fieldAttributes.phoneType);
    await expect(gdContactPage.phoneNumberInput).toHaveAttribute('data-val-regex', contactData.expectedValidation.phoneRegex);

    // Maximum character limits (255 chars)
    await expect(gdContactPage.firstNameInput).toHaveAttribute('maxlength', contactData.fieldAttributes.maxLength);
    await expect(gdContactPage.lastNameInput).toHaveAttribute('maxlength', contactData.fieldAttributes.maxLength);
    await expect(gdContactPage.emailInput).toHaveAttribute('maxlength', contactData.fieldAttributes.maxLength);
    await expect(gdContactPage.phoneNumberInput).toHaveAttribute('maxlength', contactData.fieldAttributes.maxLength);
    await expect(gdContactPage.descriptionInput).toHaveAttribute('maxlength', contactData.fieldAttributes.maxLength);
  });

  test('should allow entering, verifying, and clearing input field values', async ({ gdContactPage }) => {
    await gdContactPage.fillForm({
      firstName: contactData.validDummyData.firstName,
      lastName: contactData.validDummyData.lastName,
      email: contactData.validDummyData.email,
      phone: contactData.validDummyData.phone,
      description: contactData.validDummyData.description,
    });

    await expect(gdContactPage.firstNameInput).toHaveValue(contactData.validDummyData.firstName);
    await expect(gdContactPage.lastNameInput).toHaveValue(contactData.validDummyData.lastName);
    await expect(gdContactPage.emailInput).toHaveValue(contactData.validDummyData.email);
    await expect(gdContactPage.phoneNumberInput).toHaveValue(contactData.validDummyData.phone);
    await expect(gdContactPage.descriptionInput).toHaveValue(contactData.validDummyData.description);

    // Clear all inputs and verify they reset
    await gdContactPage.clearAllFields();
    await expect(gdContactPage.firstNameInput).toHaveValue('');
    await expect(gdContactPage.lastNameInput).toHaveValue('');
    await expect(gdContactPage.emailInput).toHaveValue('');
    await expect(gdContactPage.phoneNumberInput).toHaveValue('');
    await expect(gdContactPage.descriptionInput).toHaveValue('');
  });

  test('should verify submit button element without triggering submission', async ({ gdContactPage }) => {
    await expect(gdContactPage.submitButton).toBeVisible();
    await expect(gdContactPage.submitButton).toHaveAttribute('type', 'submit');
    await expect(gdContactPage.submitButton).toHaveAttribute('data-umb', 'submit-forms-form');
    await expect(gdContactPage.submitButton).toHaveText(/submit/i);
  });
});
