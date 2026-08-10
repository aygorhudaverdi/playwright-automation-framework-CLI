import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class KeyPressesPage extends BasePage {
  readonly input: Locator;
  readonly display: Locator;
  readonly log: Locator;

  constructor(page: Page) {
    super(page, "/pages/key-presses.html");
    this.input = page.getByTestId("key-input");
    this.display = page.getByTestId("key-display");
    this.log = page.getByTestId("key-log");
  }

  async press(key: string): Promise<void> {
    await this.input.press(key);
  }
}
