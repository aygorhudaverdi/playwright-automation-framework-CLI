import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DynamicLoadingPage extends BasePage {
  readonly start1: Locator;
  readonly loading1: Locator;
  readonly finish1: Locator;
  readonly start2: Locator;
  readonly loading2: Locator;
  readonly finish2: Locator;

  constructor(page: Page) {
    super(page, "/pages/dynamic-loading.html");
    this.start1 = page.getByTestId("dl1-start");
    this.loading1 = page.getByTestId("dl1-loading");
    this.finish1 = page.getByTestId("dl1-finish");
    this.start2 = page.getByTestId("dl2-start");
    this.loading2 = page.getByTestId("dl2-loading");
    this.finish2 = page.getByTestId("dl2-finish");
  }
}
