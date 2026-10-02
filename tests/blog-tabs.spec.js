import { test, expect } from '../fixtures/test-fixtures.js';
import { getGirirajData } from '../utils/test-data.js';

const testData = getGirirajData();
const blogsData = testData.blogs;

test.describe('Giriraj Digital - Blog Tab Wrapper Section Automation', () => {
  test.beforeEach(async ({ gdBlogsPage, page }) => {
    // Navigate directly to the Blogs page using centralized route
    await page.goto(blogsData.route, { waitUntil: 'domcontentloaded' });
  });

  test('TC01 - Verify blog-tab-wrapper section is visible on /blogs/ page', async ({ gdBlogsPage }) => {
    // Verify blog-tab-wrapper container exists and is visible
    await expect(gdBlogsPage.blogTabWrapper).toBeVisible();
    
  });

  test('TC02 - Verify total count of blog filter tabs', async ({ gdBlogsPage }) => {
    // Verify total number of tab buttons matches expected tab count (10)
    const tabCount = await gdBlogsPage.getTabsCount();
    expect(tabCount).toBe(blogsData.expectedTabs.length);
  });

  test('TC03 - Verify all expected category tabs are available and displayed', async ({ gdBlogsPage }) => {
    // Verify each expected tab is rendered with correct text and visibility
    for (const expectedTab of blogsData.expectedTabs) {
      const tabLocator = gdBlogsPage.getTabByName(expectedTab);
      await expect(tabLocator).toBeVisible();
      await expect(tabLocator).toHaveText(expectedTab);
    }
  });

  test('TC04 - Verify availability of all requested category topics including .NET CMS', async ({ gdBlogsPage }) => {
    const tabTexts = await gdBlogsPage.getTabTexts();

    // Verify all single-token categories exist directly in tab texts
    const singleCategories = ['All', 'Umbraco', 'Headless', 'Vue JS', 'React JS', 'Node JS', 'ECommerce', 'IT'];
    for (const category of singleCategories) {
      expect(tabTexts).toContain(category);
    }

    // Verify .NET CMS category is covered by the dedicated .NET and CMS tabs
    expect(tabTexts).toContain('.NET');
    expect(tabTexts).toContain('CMS');

    // Verify both .NET and CMS elements are visible in the wrapper
    await expect(gdBlogsPage.getTabByName('.NET')).toBeVisible();
    await expect(gdBlogsPage.getTabByName('CMS')).toBeVisible();
  });

  test('TC05 - Verify "All" tab is active by default', async ({ gdBlogsPage }) => {
    // Verify default active tab is visible and displays "All"
    await expect(gdBlogsPage.activeTab).toBeVisible();
    await expect(gdBlogsPage.activeTab).toHaveText('All');
  });

  test('TC06 - Verify each tab in blog-tab-wrapper is clickable and enabled', async ({ gdBlogsPage }) => {
    const tabCount = await gdBlogsPage.getTabsCount();
    for (let i = 0; i < tabCount; i++) {
      const tab = gdBlogsPage.getTabByIndex(i);

      // Verify tab is visible and enabled
      await expect(tab).toBeVisible();
      await expect(tab).toBeEnabled();

      // Verify tab contains an onclick navigation handler for the blogs section
      const onclickAttr = await tab.getAttribute('onclick');
      expect(onclickAttr).toBeTruthy();
      expect(onclickAttr).toContain('/blogs/');
    }
  });
});
