# Framework Knowledge Base & Findings

This document serves as the persistent knowledge base, operational findings log, and technical reference for the **Giriraj Digital Playwright POM Automation Framework**. Agents and engineers should consult and update this file as new lessons, environment behaviors, or test cases emerge.

---

## 1. System & Architecture Overview

### 1.1 Page Object Model (POM) Design
- **Separation of Concerns**:
  - `pages/GDHeaderNav.js`: Encapsulates header branding, search input, mega-dropdown navigation (`Who we are`, `What we do`, `Resources`), and CTA buttons (`Inquire Now`).
  - `pages/GDHomePage.js`: Encapsulates hero section, FAQ accordion questions & answers, and banner components.
  - `pages/GDQualityAssurancePage.js`: Encapsulates Quality Assurance services page (`/services/quality-assurance/`) and specifically the FAQ accordion list locators, toggle interactions, and text extractors.
  - `pages/GDBlogsPage.js`: Encapsulates Blogs page (`/blogs/`) and specifically the `.blog-tab-wrapper` category filter tabs, active tab states, and navigation triggers.
  - `pages/GDContactPage.js`: Encapsulates inquiry / Get In Touch form inputs, required indicators (`*`), and safe input actions.
  - `pages/GDFooter.js`: Encapsulates global footer container, office locations (Denmark, Ahmedabad, USA), certification badges, and social links.
- **Playwright Test Fixtures (`fixtures/test-fixtures.js`)**:
  - Leverages Playwright's `test.extend()` to instantiate Page Objects on demand (`gdHeaderNav`, `gdHomePage`, `gdContactPage`, `gdFooter`, `gdQAPage`, `gdBlogsPage`).
  - Eliminates repetitive instantiation boilerplate in tests and preserves context isolation.
- **Data-Driven Architecture (`utils/test-data.js` & `test-data/giriraj-data.json`)**:
  - Node.js ESM mode uses `createRequire(import.meta.url)` in `utils/test-data.js` to synchronously and safely load JSON data without experimental flags or import assertion deprecation issues.
  - Centralizes application route paths, menu structures, expected form validation messages, service FAQ datasets, and blog category tabs.

---

## 2. Environment Findings & Gotchas

### 2.1 Windows PowerShell Script Execution Policy
- **Symptom**:
  Executing `npm test` or `npx playwright` in Windows PowerShell throws:
  ```text
  npm : File C:\Program Files\nodejs\npm.ps1 cannot be loaded because running scripts is disabled on this system.
  ```
- **Root Cause**:
  Windows PowerShell defaults to `Restricted` or `RemoteSigned` execution policy, which blocks execution of unsigned `.ps1` wrapper scripts installed by Node.js.
- **Resolution**:
  Use the `.cmd` command extensions directly:
  - Use `npm.cmd test` instead of `npm test`
  - Use `npx.cmd playwright test` instead of `npx playwright test`
  - Use `npm.cmd run test:headed`, `npm.cmd run test:debug`, `npm.cmd run report`
- **Rule for Automated Agents**:
  Always use `npm.cmd` / `npx.cmd` in Windows terminal executions.

### 2.2 Windows WebKit Binary Access Violation (0xC0000005)
- **Symptom**:
  Running tests on WebKit on certain Windows builds crashes during browser launch with `exitCode=3236495362` (`0xC0000005` access violation).
- **Resolution**:
  Run regression suites primarily on `chromium` and `firefox` (`npx.cmd playwright test --project=chromium` or `--project=firefox`) which are 100% stable in the local Windows environment.

---

## 3. Application Under Test (Giriraj Digital) Quirks & Findings

### 3.1 Website Technology Stack
- **Target URL**: `https://www.girirajdigital.com/`
- **CMS / Platform**: Umbraco CMS with Umbraco Forms (`umbraco-forms-form getintouchform`).
- **Framework & CSS**: Bootstrap with custom responsive stylesheets and FontAwesome icons.

### 3.2 Header & Mega-Menu Navigation
- Submenus (e.g. `Who we are`, `What we do`, `Resources`) are structured with CSS hover states and collapsible mobile accordions.
- **Finding**: On desktop viewport, dropdown contents exist in the DOM with `display: none` until hovered/activated. To assert submenu items reliably without flaky hover timing in headless mode, use `toBeAttached()` or hover explicitly before triggering click actions.

### 3.3 FAQ Accordion Component Structure & Interaction (`/services/quality-assurance/`)
- **Structure**:
  - Main container: `.faq-global`
  - Title: `.faq-global .global-title h4` ("Frequently Asked Questions")
  - Subtitle: `.faq-global .global-title small` ("Your Curiosities, Our Clarity")
  - FAQ list: `.faq-global .each-faq`
  - Question header: `h3` inside `.each-faq`
  - Answer container: `.answer` inside `.each-faq` with inner `<p>` tags
- **State Toggle**:
  - Initial state: `.answer` has inline `style="display: none;"` and `.each-faq` does not have active class.
  - On 1st click: jQuery slideDown is triggered, `.answer` style changes to `display: block;`, and `.each-faq` gets class `hover-item`.
  - On 2nd click (collapse): jQuery slideUp is triggered, `.answer` reverts to `display: none;`, and `hover-item` class is removed.
  - Playwright's `await expect(answerLocator).toBeVisible()` and `await expect(answerLocator).toBeHidden()` seamlessly auto-wait for the slide animation transitions without requiring hardcoded `waitForTimeout()`.

### 3.4 Contact Us / Get In Touch Form Validation
- **Form URL**: `https://www.girirajdigital.com/contact-us/`
- **Mandatory Fields & Validation Rules**:
  - **First Name**: Required (`Please enter your first name`) & regex (`^[a-zA-Z]+$`).
  - **Email**: Required (`Please enter your email address`) & regex format validation (`Please enter valid email address `).
  - **Description**: Required (`Please enter description`).
  - **ReCAPTCHA**: Protected by Google reCAPTCHA v3.
- **Strict Production Safety Protocol**:
  - The live inquiry form on production MUST NEVER be submitted by automated regression tests.
  - Test suites verify form field presence, input interactivity, and HTML/Umbraco validation attributes (`data-val-required`, `aria-required`, `type="email"`).
  - All automated specs implement network request abort (`page.route('**/contact-us/**', ... route.abort())`) to guarantee POST requests never exit the test browser.

### 3.5 Blog Tab Wrapper Component Structure (`/blogs/`)
- **Structure**:
  - Main container: `.blog-tab-wrapper`
  - Filter tab links: `a.filterbtn`
  - Active tab selector: `a.filterbtn.active`
- **Tabs Rendered**:
  - 10 total tabs: `All`, `Umbraco`, `.NET`, `CMS`, `Headless`, `Vue JS`, `React JS`, `Node JS`, `ECommerce`, `IT`.
  - Notice that `.NET` and `CMS` are two adjacent category buttons serving the `.NET CMS` topic.
  - Navigation handlers: Each button uses inline `onclick="window.location.href='/blogs/<category>/'"`.
  - Initial active state: The `"All"` filter button has class `active` on `/blogs/`.

---

## 4. Test Execution & Debugging Playbook

### 4.1 Reporting & Artifacts
- **HTML Report**: Generated into `playwright-report/`. Run `npm.cmd run report` to serve and inspect failure details, console logs, and step timelines.
- **Failure Artifacts**:
  - `screenshot: 'only-on-failure'`: Screenshots saved automatically in `test-results/` for failed test cases.
  - `video: 'retain-on-failure'`: Full session video recordings saved in `test-results/`.
  - `trace: 'on-first-retry'`: Playwright Trace files recorded during test retries. Can be inspected via:
    ```bash
    npx.cmd playwright show-trace test-results/.../trace.zip
    ```

### 4.2 Running Specific Test Scenarios
- **Run all tests (headless)**:
  ```bash
  npm.cmd test
  ```
- **Run navigation suite**:
  ```bash
  npx.cmd playwright test tests/navigation.spec.js
  ```
- **Run form validation & input constraints suite**:
  ```bash
  npx.cmd playwright test tests/validations.spec.js
  ```
- **Run UI elements & content suite**:
  ```bash
  npx.cmd playwright test tests/ui-content.spec.js
  ```
- **Run smoke & route status checks**:
  ```bash
  npx.cmd playwright test tests/smoke-pages.spec.js
  ```
- **Run in headed mode**:
  ```bash
  npm.cmd run test:headed
  ```
- **Run step-by-step inspector**:
  ```bash
  npm.cmd run test:debug
  ```

### 4.3 GitHub Actions CI/CD & Manual Dispatch Workflow
- **Workflow Location**: `.github/workflows/playwright.yml`
- **Auto-Trigger Status**: Disabled (`push`, `pull_request`, and `schedule` are explicitly turned off/commented out).
- **Manual Trigger**: Configured via `workflow_dispatch`.
- **Inputs Configured**:
  - `browser`: Select `all`, `chromium`, `firefox`, or `webkit` (defaults to `all`).
  - `test_suite`: Select `all` or target an individual spec (e.g., `tests/qa-faq.spec.js`, `tests/blog-tabs.spec.js`).
- **Artifacts**: Playwright HTML report (`playwright-report/`) automatically uploaded and retained for 30 days (`if: always()`).

---

## 5. Maintenance Protocol for New Findings

Whenever you discover a new pattern, bug, or environment behavior:
1. **Add an entry** under the appropriate section above.
2. **Update `AGENTS.md`** if the finding requires new agent instructions or operational rules.
3. **Update `README.md`** if the finding affects user-facing instructions or project structure.

### 5.1 Findings Log

| Date | Topic | Summary of Finding / Action Taken |
|---|---|---|
| 2026-09-25 | Framework Setup | Scaffolded Node.js ESM framework with POM, fixtures, and data loader. |
| 2026-09-28 | SauceDemo Validation | Verified cross-browser test suite passes with SauceDemo auth & inventory flows. |
| 2026-09-29 | Windows CLI | Documented `npm.ps1` ExecutionPolicy block and established `npm.cmd` / `npx.cmd` standard. |
| 2026-09-29 | Agent & Knowledge Base | Created `AGENTS.md` and `docs/KNOWLEDGE_BASE.md` to persist rules and findings. |
| 2026-09-29 | Giriraj Digital Migration | Transitioned framework to `https://www.girirajdigital.com/` regression testing. Created `GDHeaderNav`, `GDHomePage`, `GDContactPage` POMs, route tests, and form validation tests. |
| 2026-09-29 | Live Production Safety | Enforced strict no-submit rule for `/contact-us/`. Replaced submit tests with attribute checks, field typing/clearing, and network POST route aborts. |
| 2026-09-29 | POM Architecture Expansion | Organized modular POM classes (`GDHeaderNav`, `GDHomePage`, `GDContactPage`, `GDFooter`). Added dedicated `ui-content.spec.js` and `validations.spec.js` test suites. |
| 2026-09-30 | QA FAQ Automation | Created `GDQualityAssurancePage` POM, registered `gdQAPage` fixture, centralized QA FAQ dataset in `giriraj-data.json`, and implemented complete 6-test suite in `tests/qa-faq.spec.js` covering visibility, question text, clickability, expanded answer validation, and collapse toggle. |
| 2026-09-30 | Blog Tab Wrapper Automation | Created `GDBlogsPage` POM, registered `gdBlogsPage` fixture, centralized blog tabs dataset in `giriraj-data.json`, and created 6-test suite in `tests/blog-tabs.spec.js` verifying visibility, tab count, individual tabs (All, Umbraco, .NET, CMS, Headless, Vue JS, React JS, Node JS, ECommerce, IT), default active state, and clickability. |
| 2026-09-30 | GitHub Actions Workflow | Created `.github/workflows/playwright.yml` with auto-triggers (`push`, `pull_request`, `schedule`) disabled and manual on-demand trigger configured via `workflow_dispatch` with browser and test suite selection inputs. |


