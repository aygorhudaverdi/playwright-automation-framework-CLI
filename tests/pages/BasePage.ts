import { Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page, private readonly path: string) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path);
  }
}
