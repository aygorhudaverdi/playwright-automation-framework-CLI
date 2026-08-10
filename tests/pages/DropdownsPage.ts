import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export type Environment = "dev" | "staging" | "prod";

export class DropdownsPage extends BasePage {
  readonly nativeSelect: Locator;
  readonly nativeResult: Locator;
  readonly customToggle: Locator;
  readonly customMenu: Locator;
  readonly customResult: Locator;

  constructor(page: Page) {
    super(page, "/pages/dropdowns.html");
    this.nativeSelect = page.getByTestId("native-select");
    this.nativeResult = page.getByTestId("native-select-result");
    this.customToggle = page.getByTestId("custom-dropdown-toggle");
    this.customMenu = page.getByTestId("custom-dropdown-menu");
    this.customResult = page.getByTestId("custom-dropdown-result");
  }

  customOption(env: Environment): Locator {
    return this.page.getByTestId(`custom-dropdown-option-${env}`);
  }

  async openCustomDropdown(): Promise<void> {
    await this.customToggle.click();
  }

  async selectCustomOption(env: Environment): Promise<void> {
    await this.openCustomDropdown();
    await this.customOption(env).click();
  }

  async clickOutside(): Promise<void> {
    await this.page.locator("h1").click();
  }
}
