import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export type Experience = "junior" | "mid" | "senior";

export interface RegistrationInput {
  fullName?: string;
  email?: string;
  role?: string;
  experience?: Experience;
  bio?: string;
  agree?: boolean;
}

export class FormsPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly roleSelect: Locator;
  readonly bioTextarea: Locator;
  readonly agreeCheckbox: Locator;
  readonly submitBtn: Locator;
  readonly resetBtn: Locator;
  readonly resultBox: Locator;

  constructor(page: Page) {
    super(page, "/pages/forms.html");
    this.fullNameInput = page.getByTestId("input-full-name");
    this.emailInput = page.getByTestId("input-email");
    this.roleSelect = page.getByTestId("select-role");
    this.bioTextarea = page.getByTestId("textarea-bio");
    this.agreeCheckbox = page.getByTestId("checkbox-agree");
    this.submitBtn = page.getByTestId("btn-submit");
    this.resetBtn = page.getByTestId("btn-reset");
    this.resultBox = page.getByTestId("form-result");
  }

  radio(experience: Experience): Locator {
    return this.page.getByTestId(`radio-${experience}`);
  }

  /** Fills only the fields provided, leaving the rest untouched. */
  async fill(input: RegistrationInput): Promise<void> {
    if (input.fullName !== undefined) await this.fullNameInput.fill(input.fullName);
    if (input.email !== undefined) await this.emailInput.fill(input.email);
    if (input.role !== undefined) await this.roleSelect.selectOption(input.role);
    if (input.experience !== undefined) await this.radio(input.experience).check();
    if (input.bio !== undefined) await this.bioTextarea.fill(input.bio);
    if (input.agree) await this.agreeCheckbox.check();
  }

  async submit(): Promise<void> {
    await this.submitBtn.click();
  }

  async reset(): Promise<void> {
    await this.resetBtn.click();
  }
}
