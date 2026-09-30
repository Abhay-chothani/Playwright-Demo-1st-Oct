/**
 * GDHeaderNav Page Object
 * Encapsulates header navigation elements, mega-dropdown menus, and top-level CTAs for Giriraj Digital.
 */
export class GDHeaderNav {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Header Branding & Actions
    this.navbarBrand = page.locator('a.navbar-brand');
    this.inquireNowButton = page.getByRole('link', { name: 'Inquire Now' });
    this.searchInput = page.getByPlaceholder('What are you looking For?');

    // Main Top Navigation Links
    this.navHome = page.locator('.navbar-nav').getByRole('link', { name: 'Home', exact: true });
    this.navWhoWeAre = page.locator('.navbar-nav').getByRole('link', { name: 'Who we are' });
    this.navWhatWeDo = page.locator('.navbar-nav').getByRole('link', { name: 'What we do' });
    this.navResources = page.locator('.navbar-nav').getByRole('link', { name: 'Resources' });
    this.navCareer = page.locator('.navbar-nav').getByRole('link', { name: 'Career', exact: true });

    // Mega Submenu Links
    this.submenuCompanyOverview = page.getByRole('link', { name: 'Company Overview' }).first();
    this.submenuLeadershipTeam = page.getByRole('link', { name: 'Leadership Team' }).first();
    this.submenuAwardsCertifications = page.getByRole('link', { name: 'Awards Certifications' }).first();
    this.submenuCSR = page.getByRole('link', { name: 'CSR' }).first();
    this.submenuCaseStudy = page.getByRole('link', { name: 'Case Study' }).first();
    this.submenuBlogs = page.getByRole('link', { name: 'Blogs' }).first();

    // Mobile Navbar Toggler
    this.mobileToggler = page.locator('button.navbar-toggler');
  }

  /**
   * Navigate to home or given relative path
   * @param {string} [path='/']
   */
  async goto(path = '/') {
    await this.page.goto(path);
  }

  /**
   * Click on the brand logo
   */
  async clickLogo() {
    await this.navbarBrand.click();
  }

  /**
   * Click the primary 'Inquire Now' CTA button
   */
  async clickInquireNow() {
    await this.inquireNowButton.click();
  }

  /**
   * Hover over 'Who we are' dropdown menu
   */
  async hoverWhoWeAre() {
    await this.navWhoWeAre.hover();
  }

  /**
   * Hover over 'What we do' dropdown menu
   */
  async hoverWhatWeDo() {
    await this.navWhatWeDo.hover();
  }

  /**
   * Hover over 'Resources' dropdown menu
   */
  async hoverResources() {
    await this.navResources.hover();
  }
}
