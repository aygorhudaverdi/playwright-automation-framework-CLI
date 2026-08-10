import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ModalsPage extends BasePage {
  readonly openBtn: Locator;
  readonly outcome: Locator;
  readonly overlay: Locator;
  readonly modal: Locator;
  readonly noteInput: Locator;
  readonly cancelBtn: Locator;
  readonly confirmBtn: Locator;

  constructor(page: Page) {
    super(page, "/pages/modals.html");
    this.openBtn = page.getByTestId("open-modal-btn");
    this.outcome = page.getByTestId("modal-outcome");
    this.overlay = page.getByTestId("modal-overlay");
    this.modal = page.getByTestId("modal");
    this.noteInput = page.getByTestId("modal-note-input");
    this.cancelBtn = page.getByTestId("modal-cancel-btn");
    this.confirmBtn = page.getByTestId("modal-confirm-btn");
  }

  async open(): Promise<void> {
    await this.openBtn.click();
  }

  async dismissViaOverlay(): Promise<void> {
    // Click the overlay itself, well outside the modal panel, so the click
    // target is the overlay and not a descendant.
    await this.overlay.click({ position: { x: 5, y: 5 } });
  }

  async dismissViaEscape(): Promise<void> {
    await this.page.keyboard.press("Escape");
  }
}
