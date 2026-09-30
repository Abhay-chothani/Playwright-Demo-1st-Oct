# Giriraj Digital - Regression Test Automation Framework

A scalable, clean, and professional test automation framework built with [Playwright](https://playwright.dev/) and JavaScript, adhering strictly to the **Page Object Model (POM)** design pattern. It provides automated regression and smoke testing for [GIRIRAJ DIGITAL](https://www.girirajdigital.com/).

---

## 📁 Project Structure

```text
Demo Project/
│
├── .github/                   # GitHub Actions CI/CD workflows
│   └── workflows/
│       └── playwright.yml     # Manual trigger workflow (workflow_dispatch)
│
├── docs/                      # Knowledge base, findings, and troubleshooting
│   └── KNOWLEDGE_BASE.md      # Framework findings, quirks, and debugging logs
│
├── tests/                     # Test scenarios and assertions
│   ├── blog-tabs.spec.js      # Blogs page blog-tab-wrapper filter bar automation suite
│   ├── qa-faq.spec.js         # QA Services page FAQ accordion automation suite
│   ├── navigation.spec.js     # Header navigation, mega menus, and routing
│   ├── validations.spec.js    # Field validations, required attributes, regex, and constraints
│   ├── ui-content.spec.js     # Hero UI, FAQ accordion, office locations, certifications, and footer
│   └── smoke-pages.spec.js    # Core landing pages HTTP 200 checks & metadata
│
├── pages/                     # Page Object Model classes (locators & actions)
│   ├── GDBlogsPage.js         # Blogs page and blog-tab-wrapper filter component POM
│   ├── GDQualityAssurancePage.js # QA services page and FAQ accordion component POM
│   ├── GDHeaderNav.js         # Header navigation, search, and mega-menu locators
│   ├── GDHomePage.js          # Hero section, FAQ accordion, and branding locators
│   ├── GDContactPage.js       # Contact Us form locators and interaction methods
│   └── GDFooter.js            # Footer, global office locations, and social channels
│
├── fixtures/                  # Reusable Playwright test fixtures
│   └── test-fixtures.js       # Custom fixtures extending base test with GD page objects
│
├── utils/                     # Helper utilities and data loaders
│   └── test-data.js           # Type-safe test data accessor with createRequire
│
├── test-data/                 # Test data sets
│   └── giriraj-data.json      # Routes, navigation menus, and form validation expectations
│
├── playwright.config.js       # Playwright runner configuration (baseURL: girirajdigital.com)
├── package.json               # Project manifest, scripts, and dependencies
├── .gitignore                 # Files and folders excluded from git
├── AGENTS.md                  # Agent guidelines, rules, and knowledge maintenance protocol
├── GEMINI.md                  # Gemini / Antigravity rule pointer
└── README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher

### Installation

1. **Open the project folder**:
   ```bash
   cd "C:\Demo Project"
   ```

2. **Install project dependencies**:
   ```bash
   npm.cmd install
   ```

3. **Install Playwright browser binaries**:
   ```bash
   npx.cmd playwright install
   ```
   *(To install only Chromium for faster setup: `npx.cmd playwright install chromium`)*

---

## 🧪 Running Tests

> [!TIP]
> **Windows PowerShell Users**: If your terminal encounters a script execution policy restriction with `.ps1` files, use `npm.cmd` and `npx.cmd` instead of `npm` and `npx`.

Use the predefined npm scripts in `package.json`:

| Command (Cross-Platform) | Windows PowerShell Command | Description |
|---|---|---|
| `npm test` | `npm.cmd test` | Runs all regression tests in headless mode across configured browsers |
| `npm run test:headed` | `npm.cmd run test:headed` | Runs tests in headed mode with visible browser windows |
| `npm run test:debug` | `npm.cmd run test:debug` | Launches the Playwright Inspector for step-by-step debugging |
| `npm run report` | `npm.cmd run report` | Opens the generated HTML test execution report |

### Targeted Spec Runs

- **Run Blogs Page Tab Wrapper tests**:
  ```bash
  npx.cmd playwright test tests/blog-tabs.spec.js
  ```
- **Run QA Services FAQ Accordion tests**:
  ```bash
  npx.cmd playwright test tests/qa-faq.spec.js
  ```
- **Run Header Navigation & Routing tests**:
  ```bash
  npx.cmd playwright test tests/navigation.spec.js
  ```
- **Run Form Validation & Input Constraint tests**:
  ```bash
  npx.cmd playwright test tests/validations.spec.js
  ```
- **Run UI & Content Verification tests**:
  ```bash
  npx.cmd playwright test tests/ui-content.spec.js
  ```
- **Run Smoke & Core Routes tests**:
  ```bash
  npx.cmd playwright test tests/smoke-pages.spec.js
  ```
- **Run on a specific browser (e.g. Chromium)**:
  ```bash
  npx.cmd playwright test --project=chromium
  ```

---

## ⚙️ Configuration Details (`playwright.config.js`)

- **`baseURL`**: `https://www.girirajdigital.com`
- **`timeout`**: 60 seconds per test, 10 seconds for assertions (`expect`)
- **`retries`**: Configured to retry on CI or upon failure
- **`workers`**: Fully parallel local execution
- **`screenshot`**: Captures screenshots automatically `only-on-failure`
- **`video`**: Retains video recording `retain-on-failure`
- **`trace`**: Records complete Playwright trace on first retry for debugging
- **`reporter`**: Generates interactive HTML report (`playwright-report/`) and terminal list output

---

## 💡 Best Practices Implemented

1. **Page Object Model (POM)**:
   - Locators and interactions reside exclusively in [pages/](file:///C:/Demo%20Project/pages/).
   - Assertions and test workflows reside exclusively in [tests/](file:///C:/Demo%20Project/tests/).
2. **Accessible Locators**:
   - Uses user-facing locators (`getByRole`, `getByPlaceholder`, `getByText`) to ensure tests remain resilient.
3. **Custom Fixtures**:
   - Page Objects are injected via Playwright fixtures ([fixtures/test-fixtures.js](file:///C:/Demo%20Project/fixtures/test-fixtures.js)), eliminating boilerplate.
4. **Decoupled Test Data**:
   - Test URLs, menu structures, and validation rules are centralized in [test-data/giriraj-data.json](file:///C:/Demo%20Project/test-data/giriraj-data.json).
5. **Strict Production Safety**:
   - Automated tests never submit the live contact inquiry form. Tests verify element visibility, input editing/clearing, and mandatory validation attributes (`data-val-required`, `aria-required`). All tests enforce network route aborts on POST requests to guarantee no data reaches the live backend.

---

## ⚡ GitHub Actions CI/CD (Manual Trigger)

The project includes an enterprise-grade GitHub Actions workflow at [`.github/workflows/playwright.yml`](file:///C:/Demo%20Project/.github/workflows/playwright.yml).

### Auto-Trigger Status: Disabled 🛑
- **Automatic triggers** on `push`, `pull_request`, and `schedule` are **turned off**.
- Tests will not run automatically when committing, pushing, or creating pull requests, preventing unnecessary CI runner usage and unintended traffic against the target environment.

### Manual Trigger: Enabled via `workflow_dispatch` 🚀
Tests can be executed manually on demand directly from the GitHub interface or GitHub CLI.

#### How to Trigger from GitHub UI:
1. Navigate to your repository on GitHub.
2. Click on the **Actions** tab.
3. Select **Playwright Regression Tests** in the left sidebar.
4. Click the **Run workflow** dropdown on the right.
5. *(Optional)* Select execution parameters:
   - **Target browser project**: `all` (default), `chromium`, `firefox`, or `webkit`.
   - **Specific test suite**: `all` (default), or choose a specific test spec (e.g. `tests/blog-tabs.spec.js`, `tests/qa-faq.spec.js`).
6. Click the green **Run workflow** button.

#### How to Trigger via GitHub CLI (`gh`):
```bash
# Run all tests on all browsers
gh workflow run playwright.yml

# Run specific suite on Chromium only
gh workflow run playwright.yml -f browser=chromium -f test_suite=tests/qa-faq.spec.js
```

#### Artifacts & Reports in GitHub Actions:
- After execution, the full Playwright HTML report is automatically packaged and retained for 30 days under **Artifacts** (`playwright-report`).

---

## 📚 Agent Guidelines & Knowledge Base

- **Agent Instructions**: See [AGENTS.md](file:///C:/Demo%20Project/AGENTS.md) for architectural rules, POM constraints, and protocols for AI coding agents.
- **Knowledge Base & Findings**: See [docs/KNOWLEDGE_BASE.md](file:///C:/Demo%20Project/docs/KNOWLEDGE_BASE.md) for technical findings, Umbraco forms validation patterns, Windows OS execution workarounds, and troubleshooting guides.
- **Continuous Documentation**: Both files are maintained alongside the codebase during new discoveries and test development.
