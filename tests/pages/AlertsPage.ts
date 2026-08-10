import { Dialog, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AlertsPage extends BasePage {
  readonly alertBtn: Locator;
  readonly confirmBtn: Locator;
  readonly promptBtn: Locator;
  readonly confirmResult: Locator;
  readonly promptResult: Locator;

  constructor(page: Page) {
    super(page, "/pages/alerts.html");
    this.alertBtn = page.getByTestId("btn-js-alert");
    this.confirmBtn = page.getByTestId("btn-js-confirm");
    this.promptBtn = page.getByTestId("btn-js-prompt");
    this.confirmResult = page.getByTestId("confirm-result");
    this.promptResult = page.getByTestId("prompt-result");
  }

  /** Registers a one-shot dialog handler, then clicks the trigger button. */
  private async triggerWithDialog(trigger: Locator, handle: (dialog: Dialog) => Promise<void>): Promise<void> {
    this.page.once("dialog", (dialog) => {
      void handle(dialog);
    });
    await trigger.click();
  }

  async triggerAlert(): Promise<string> {
    let message = "";
    await this.triggerWithDialog(this.alertBtn, async (dialog) => {
      message = dialog.message();
      await dialog.accept();
    });
    return message;
  }

  async triggerConfirm(accept: boolean): Promise<void> {
    await this.triggerWithDialog(this.confirmBtn, async (dialog) => {
      if (accept) await dialog.accept();
      else await dialog.dismiss();
    });
  }

  async triggerPrompt(accept: boolean, text?: string): Promise<void> {
    await this.triggerWithDialog(this.promptBtn, async (dialog) => {
      if (accept) await dialog.accept(text ?? "");
      else await dialog.dismiss();
    });
  }
}
