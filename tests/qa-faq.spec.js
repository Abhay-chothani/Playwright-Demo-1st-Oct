import { test, expect } from '../fixtures/test-fixtures.js';
import { getGirirajData } from '../utils/test-data.js';

const testData = getGirirajData();
const faqData = testData.qaFaq;

test.describe('Giriraj Digital - QA Services FAQ Section Automation', () => {
  test.beforeEach(async ({ gdQAPage, page }) => {
    // Navigate directly to the Quality Assurance services page
    await page.goto(testData.routes.qaServices, { waitUntil: 'domcontentloaded' });
  });

  test('TC01 - Verify FAQ section container and headings are visible on the page', async ({ gdQAPage }) => {
    // 1. Verify FAQ section is visible on the page
    await expect(gdQAPage.faqSection).toBeVisible();

    // 2. Verify FAQ section main title
    await expect(gdQAPage.faqTitle).toBeVisible();
    await expect(gdQAPage.faqTitle).toContainText(faqData.sectionTitle);

    // 3. Verify FAQ section subtitle / kicker
    await expect(gdQAPage.faqSubtitle).toBeVisible();
    await expect(gdQAPage.faqSubtitle).toContainText(faqData.sectionSubtitle);
  });

  test('TC02 - Verify all FAQ questions are displayed correctly', async ({ gdQAPage }) => {
    // 1. Verify total number of FAQ items matches expected configuration
    const actualCount = await gdQAPage.getFaqCount();
    expect(actualCount).toBe(faqData.items.length);

    // 2. Verify each FAQ question text matches expected content
    for (let i = 0; i < faqData.items.length; i++) {
      const expectedItem = faqData.items[i];
      const questionLocator = gdQAPage.getFaqQuestion(i);

      await expect(questionLocator).toBeVisible();
      await expect(questionLocator).toContainText(expectedItem.question);
    }
  });

  test('TC03 - Verify each FAQ question is clickable and initially collapsed', async ({ gdQAPage }) => {
    for (let i = 0; i < faqData.items.length; i++) {
      const questionLocator = gdQAPage.getFaqQuestion(i);
      const answerLocator = gdQAPage.getFaqAnswer(i);

      // Verify question element is visible and enabled (clickable)
      await expect(questionLocator).toBeVisible();
      await expect(questionLocator).toBeEnabled();

      // Verify answer is collapsed / hidden prior to interaction
      await expect(answerLocator).toBeHidden();
    }
  });

  test('TC04 - Click each FAQ question and verify that its corresponding answer is expanded with expected content', async ({ gdQAPage }) => {
    for (let i = 0; i < faqData.items.length; i++) {
      const expectedItem = faqData.items[i];
      const questionLocator = gdQAPage.getFaqQuestion(i);
      const answerLocator = gdQAPage.getFaqAnswer(i);

      // Click the FAQ question to expand
      await questionLocator.click();

      // Verify answer container is expanded and visible
      await expect(answerLocator).toBeVisible();

      // Verify expanded answer contains the expected answer content snippet
      await expect(answerLocator).toContainText(expectedItem.expectedAnswerSnippet);

      // Verify expanded answer contains all expected domain keywords
      for (const keyword of expectedItem.expectedKeywords) {
        await expect(answerLocator).toContainText(keyword);
      }
    }
  });

  test('TC05 - Click the same FAQ question again and verify that the answer is collapsed', async ({ gdQAPage }) => {
    for (let i = 0; i < faqData.items.length; i++) {
      const questionLocator = gdQAPage.getFaqQuestion(i);
      const answerLocator = gdQAPage.getFaqAnswer(i);

      // Ensure answer is initially hidden
      await expect(answerLocator).toBeHidden();

      // 1st Click: expand
      await questionLocator.click();
      await expect(answerLocator).toBeVisible();

      // 2nd Click on the same question: collapse
      await questionLocator.click();
      await expect(answerLocator).toBeHidden();
    }
  });

  test('TC06 - Verify end-to-end accordion toggle behavior across all FAQ items', async ({ gdQAPage }) => {
    const faqCount = await gdQAPage.getFaqCount();
    expect(faqCount).toBeGreaterThan(0);

    for (let i = 0; i < faqCount; i++) {
      const expectedItem = faqData.items[i];
      const questionLocator = gdQAPage.getFaqQuestion(i);
      const answerLocator = gdQAPage.getFaqAnswer(i);

      // Initial state: hidden
      await expect(answerLocator).toBeHidden();

      // Expand action
      await questionLocator.click();
      await expect(answerLocator).toBeVisible();
      await expect(answerLocator).toContainText(expectedItem.expectedAnswerSnippet);

      // Collapse action
      await questionLocator.click();
      await expect(answerLocator).toBeHidden();
    }
  });
});
