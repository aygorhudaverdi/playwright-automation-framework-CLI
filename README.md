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

## License

MIT — do whatever you want with it.
