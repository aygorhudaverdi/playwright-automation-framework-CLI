import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckboxesPage extends BasePage {
  readonly selectAll: Locator;
  readonly summary: Locator;

  constructor(page: Page) {
    super(page, "/pages/checkboxes.html");
    this.selectAll = page.getByTestId("checkbox-select-all");
    this.summary = page.getByTestId("checkbox-summary");
  }

  item(n: 1 | 2 | 3 | 4): Locator {
    return this.page.getByTestId(`checkbox-item-${n}`);
  }

  async isSelectAllIndeterminate(): Promise<boolean> {
    return this.selectAll.evaluate((el: HTMLInputElement) => el.indeterminate);
  }
}
