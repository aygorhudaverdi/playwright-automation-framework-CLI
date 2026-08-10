# QA Playground

A static, no-backend UI automation practice target — built to write and run
Selenium / Playwright / Cypress tests against realistic scenarios: forms,
dynamic content, alerts, drag-and-drop, iframes, shadow DOM, and more.

No server, no build step, no dependencies. Every interactive element has a
stable `id` and `data-testid` attribute so locators stay reliable.

## Run it

Just open [index.html](index.html) in a browser, or serve the folder with
any static file server, e.g.:

```bash
npx serve .
# or
python -m http.server 8080
```

## Pages

| Page | Scenario |
| --- | --- |
| [forms.html](pages/forms.html) | Text/select/radio/checkbox inputs with client-side validation |
| [login.html](pages/login.html) | Fake login flow with success/error states |
| [checkboxes.html](pages/checkboxes.html) | Select-all pattern, disabled & indeterminate states |
| [dropdowns.html](pages/dropdowns.html) | Native `<select>` and a custom JS dropdown |
| [dynamic-loading.html](pages/dynamic-loading.html) | Elements revealed or inserted after a delay (explicit waits) |
| [dynamic-content.html](pages/dynamic-content.html) | Values that change on every reload/click |
| [alerts.html](pages/alerts.html) | `alert()`, `confirm()`, `prompt()` |
| [modals.html](pages/modals.html) | In-page modal dialog, dismiss via button/overlay/Escape |
| [tables.html](pages/tables.html) | Click-to-sort table with row-scoped delete actions |
| [drag-and-drop.html](pages/drag-and-drop.html) | HTML5 native drag-and-drop |
| [hover.html](pages/hover.html) | Captions/actions that only render on hover |
| [file-upload.html](pages/file-upload.html) | File input + drag-and-drop upload zone |
| [iframes.html](pages/iframes.html) | Editable content and events inside an iframe |
| [shadow-dom.html](pages/shadow-dom.html) | A native web component with an open shadow root |
| [infinite-scroll.html](pages/infinite-scroll.html) | Items appended as you scroll |
| [key-presses.html](pages/key-presses.html) | Reports the last key pressed + modifiers |
| [context-menu.html](pages/context-menu.html) | Custom right-click menu |
| [broken-images.html](pages/broken-images.html) | Mix of valid and broken `<img>` sources |
| [slow-elements.html](pages/slow-elements.html) | Artificial latency + a real progress bar |

## Structure

```
qa-playground/
├── index.html        # landing page, links to every scenario
├── css/style.css      # shared styling
├── js/main.js          # shared nav-highlight script
└── pages/               # one HTML file per scenario, fully self-contained
```

## Test suite

A Playwright test suite (TypeScript) covers 10 of the scenarios above —
login, forms, checkboxes, dropdowns, alerts, file upload, dynamic loading,
key presses, tables, and modals — with 81 test cases across Chromium,
Firefox, and WebKit.

### Architecture — Page Object Model

```
tests/
├── pages/       # Page Object Model classes — one per scenario, wraps locators + actions
├── fixtures/    # custom Playwright `test` that auto-injects each page object
└── specs/       # test files, grouped by scenario, assert-only — no raw selectors
```

Every scenario has a dedicated page object class (e.g. `LoginPage`,
`TablesPage`, `ModalsPage`) that owns two things:

- **Locators** — every interactive element on the page, defined once as a
  typed property, resolved via `data-testid` (falling back to a stable
  `id` on the couple of elements that don't carry one).
- **Actions** — small, intention-revealing methods (`login()`, `sortBy()`,
  `dismissViaOverlay()`) that wrap the actual clicks/fills into a single
  call describing *what* is happening, not *how*.

Spec files never touch a raw CSS or XPath selector — they call
`loginPage.login(email, password)` and assert on the result. That
indirection is the whole point: when a page's markup changes, only its one
page object needs updating, and every spec exercising that page keeps
working unchanged. A shared `tests/fixtures/pages.fixture.ts` extends
Playwright's `test` so each spec receives fully-instantiated page objects
for free, with zero `new LoginPage(page)` boilerplate.

### Test case design — positive, negative, edge

Every scenario is tested along three axes, deliberately weighted toward
negative and edge cases — that's where real bugs hide, and what manual
testing tends to skip:

- **Positive** — the happy path: valid input, expected user flow, confirms
  the feature works as designed.
- **Negative** — invalid input, wrong credentials, cancelled/dismissed
  dialogs, disallowed actions — verifying the app fails *gracefully* with
  the right message, rather than silently succeeding or breaking.
- **Edge** — boundary conditions: minimum-length input, whitespace-only
  strings, empty-vs-cancelled ambiguity, elements that don't exist yet
  vs. elements that are merely hidden, repeated/retriggered actions,
  disabled controls.

A few examples of edge cases the suite caught that weren't obvious from
reading the markup alone: the login form trims whitespace from the email
field but *not* the password field (so `"password123 "` silently fails);
the malformed-email negative test never reaches the app's JS at all
because the browser's native HTML5 validation blocks the submit first;
and the custom dropdown's menu doesn't close on <kbd>Escape</kbd> because
no `keydown` handler is wired up for it, unlike the modal.

### Run the tests

```bash
npm install
npx playwright install --with-deps   # first time only
npm test              # headless, all browsers
npm run test:headed   # watch it run in a browser
npm run test:ui       # Playwright's interactive UI mode
npm run test:report   # open the last HTML report
```

Tests run against Chromium, Firefox, and WebKit via `playwright.config.ts`,
which spins up a local static server (`serve`) automatically — no manual
setup needed.

### CI/CD

[`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) runs
the full suite on every push/PR to `main` via GitHub Actions, and uploads
the HTML report as a build artifact.

### Why the Playwright CLI/test-runner, not MCP Playwright

This suite was written using the standard `@playwright/test` runner and
CLI — not an MCP Playwright server that drives the browser turn-by-turn
inside an LLM conversation. An MCP-driven flow round-trips every click,
DOM snapshot, and screenshot back through the model's context, which is
great for one-off exploratory poking but gets expensive fast when writing
dozens of test cases across ten pages. Reading each page's markup once,
generating real `.spec.ts` files, and letting `npx playwright test` do the
actual browser driving keeps that back-and-forth out of the loop entirely
— cheaper in tokens, faster to run, and the result is ordinary,
version-controlled test code instead of a transcript.

## License

MIT — do whatever you want with it.
