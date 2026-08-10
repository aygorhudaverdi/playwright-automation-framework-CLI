import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;
  readonly resultBox: Locator;
  readonly loggedInView: Locator;
  readonly loggedInEmail: Locator;
  readonly logoutBtn: Locator;

  constructor(page: Page) {
    super(page, "/pages/login.html");
    this.emailInput = page.getByTestId("login-email");
    this.passwordInput = page.getByTestId("login-password");
    this.submitBtn = page.getByTestId("login-submit");
    this.resultBox = page.getByTestId("login-result");
    this.loggedInView = page.getByTestId("logged-in-view");
    // The <strong> tag only carries an id, not a data-testid.
    this.loggedInEmail = page.locator("#logged-in-email");
    this.logoutBtn = page.getByTestId("logout-btn");
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }

  async logout(): Promise<void> {
    await this.logoutBtn.click();
  }
}
