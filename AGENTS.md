# Project Agent Guidelines (`AGENTS.md`)

Welcome to the **Giriraj Digital Regression Test Automation Framework** project. This file defines the instructions, architectural standards, constraints, and maintenance workflows for AI agents (and human contributors) interacting with this codebase.

---

## 1. Project Overview & Context

- **Domain**: Automated UI & Regression testing for [GIRIRAJ DIGITAL](https://www.girirajdigital.com/).
- **Language / Runtime**: JavaScript (Node.js ES Modules: `"type": "module"` in `package.json`). Strictly JavaScript — do **not** convert to TypeScript unless explicitly requested.
- **Core Framework**: `@playwright/test` (v1.63+).
- **Design Pattern**: Page Object Model (POM) combined with custom Playwright fixtures and centralized JSON test data.

---

## 2. Directory Structure & Responsibilities

```text
Demo Project/
├── .github/                   # GitHub Actions workflows (manual workflow_dispatch)
│   └── workflows/
│       └── playwright.yml     # Playwright regression CI workflow with manual trigger
├── docs/                       # Project documentation & knowledge base
│   └── KNOWLEDGE_BASE.md       # Knowledge base, findings, and troubleshooting
├── fixtures/                   # Custom Playwright fixtures
│   └── test-fixtures.js        # Injects GD page object instances into tests
├── pages/                      # Page Object Model classes
│   ├── GDHeaderNav.js          # Header navigation, search, and mega-menu locators
│   ├── GDHomePage.js           # Home hero section, FAQ accordion, and branding locators
│   ├── GDContactPage.js        # Contact Us / Get in touch form locators & safe actions
│   └── GDFooter.js             # Global footer, office locations, certifications, and social links
├── test-data/                  # Static test datasets
│   └── giriraj-data.json       # Routes, validation rules, FAQs, and office locations
├── tests/                      # Test specifications & assertions
│   ├── navigation.spec.js      # Header navigation, mega menus, and routing
│   ├── validations.spec.js     # Form field validations, attributes, limits, and safe constraints
│   ├── ui-content.spec.js      # Hero UI, FAQ accordion, office locations, certifications, and footer
│   └── smoke-pages.spec.js     # HTTP 200 checks, titles, and layout across key routes
├── utils/                      # Helper utilities
│   └── test-data.js            # Type-safe data accessor with createRequire
├── playwright.config.js        # Global Playwright configuration (baseURL: girirajdigital.com)
├── package.json                # Project dependencies and npm scripts
├── README.md                   # User-facing project documentation
├── AGENTS.md                   # Agent guidelines and knowledge sync protocol
└── GEMINI.md                   # Gemini / Antigravity rule pointer
```

---

## 3. Strict Development Rules

### Rule 1: Page Object Model (POM) Discipline
- **`pages/`**: Must contain ONLY element locators and user actions (e.g. `fillForm()`, `clickSubmit()`, `clickLogo()`).
  - **Never** put test assertions (`expect(...)`) inside Page Object classes (except state checks returning booleans like `isLoaded()`).
- **`tests/`**: Must contain test scenarios, workflows, and assertions (`expect(...)`).
  - **Never** hardcode CSS/XPath selectors or raw locator declarations inside `tests/` files. Use the POM instance.

### Rule 2: Recommended Playwright Locators
- Always prioritize accessible, user-facing locators:
  - `page.getByRole(...)`
  - `page.getByPlaceholder(...)`
  - `page.getByLabel(...)`
  - `page.getByText(...)`
  - `page.getByTestId(...)`
- Avoid brittle CSS class hierarchies or raw XPath unless no accessible alternative exists.

### Rule 3: ES Modules & Imports
- The project runs in native Node.js ESM mode (`"type": "module"`).
- Always include file extensions in relative imports (e.g., `import { GDHomePage } from '../pages/GDHomePage.js';`).
- To load JSON files in ES modules, use Node's `createRequire` as demonstrated in [utils/test-data.js](file:///C:/Demo%20Project/utils/test-data.js).

### Rule 4: Data-Driven Testing & Strict Production Safety
- Do not hardcode URLs, route names, or expected validation error strings directly in specs or page objects.
- Store them in [test-data/giriraj-data.json](file:///C:/Demo%20Project/test-data/giriraj-data.json) and query via `getGirirajData()` from [utils/test-data.js](file:///C:/Demo%20Project/utils/test-data.js).
- **Strict Production Safety Rule**: **DO NOT submit the live contact inquiry form (`/contact-us/`)**. Because this is the live production environment:
  - Never call `clickSubmit()` on the contact form in test scenarios.
  - Test form element visibility, input filling/clearing, and mandatory HTML/Umbraco validation attributes (`data-val-required`, `aria-required`).
  - Keep a fail-safe route interceptor (`page.route('**/contact-us/**', ... route.abort())`) to abort any accidental POST requests before they leave the browser.

### Rule 5: Safety & File Integrity
- Do **not** delete or blindly overwrite existing working code or configuration files without verifying the impact or obtaining confirmation.

---

## 4. Execution Commands (Windows Environment)

> [!IMPORTANT]
> **Windows PowerShell Execution Policy**:
> On Windows systems, executing `npm` or `npx` directly in PowerShell may trigger a `PSSecurityException` due to script execution policies blocking `npm.ps1`.
> **Always use `.cmd` wrappers when running commands:**
> - `npm.cmd test` instead of `npm test`
> - `npm.cmd run test:headed`
> - `npm.cmd run test:debug`
> - `npm.cmd run report`
> - `npx.cmd playwright test ...`

| Task | Command |
|---|---|
| Run all tests (headless) | `npm.cmd test` |
| Run all tests (headed) | `npm.cmd run test:headed` |
| Debug tests with Inspector | `npm.cmd run test:debug` |
| View HTML execution report | `npm.cmd run report` |
| Run specific spec | `npx.cmd playwright test tests/navigation.spec.js` |
| Run on specific browser | `npx.cmd playwright test --project=chromium` |

---

## 5. Living Documentation & Knowledge Base Protocol

Whenever the agent or developer works on this repository:
1. **Log New Findings**:
   - Any quirks encountered (e.g. browser compatibility, timing issues, CMS locator changes, or OS environment issues) must be documented in [docs/KNOWLEDGE_BASE.md](file:///C:/Demo%20Project/docs/KNOWLEDGE_BASE.md).
2. **Synchronize Changes**:
   - When adding new pages or test specs, update:
     - `pages/` (new Page Object)
     - `fixtures/test-fixtures.js` (inject new fixture)
     - `tests/` (new test suite)
     - [README.md](file:///C:/Demo%20Project/README.md) (update project structure & test catalog)
     - [docs/KNOWLEDGE_BASE.md](file:///C:/Demo%20Project/docs/KNOWLEDGE_BASE.md) (record new patterns or test coverage)
3. **Preserve Rules**:
   - Ensure subsequent agent sessions consult this `AGENTS.md` and adhere to these guidelines.
