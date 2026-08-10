import { test, expect } from "../fixtures/pages.fixture";

const VALID_EMAIL = "qa@example.com";
const VALID_PASSWORD = "password123";

test.describe("Login", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("positive: valid credentials log the user in", async ({ loginPage }) => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);

    await expect(loginPage.loggedInView).toBeVisible();
    await expect(loginPage.loggedInEmail).toHaveText(VALID_EMAIL);
  });

  test("negative: wrong password is rejected", async ({ loginPage }) => {
    await loginPage.login(VALID_EMAIL, "wrongpassword");

    await expect(loginPage.resultBox).toHaveText("Invalid email or password.");
    await expect(loginPage.resultBox).toHaveClass(/error/);
    await expect(loginPage.loggedInView).toBeHidden();
  });

  test("negative: wrong email is rejected", async ({ loginPage }) => {
    await loginPage.login("nope@example.com", VALID_PASSWORD);

    await expect(loginPage.resultBox).toHaveText("Invalid email or password.");
  });

  test("negative: both fields wrong are rejected", async ({ loginPage }) => {
    await loginPage.login("nope@example.com", "wrongpassword");

    await expect(loginPage.resultBox).toHaveText("Invalid email or password.");
  });

  test("negative: email comparison is case-sensitive", async ({ loginPage }) => {
    await loginPage.login("QA@EXAMPLE.COM", VALID_PASSWORD);

    await expect(loginPage.resultBox).toHaveText("Invalid email or password.");
  });

  test("negative: HTML5 required attributes block submission of an empty form", async ({ loginPage }) => {
    await loginPage.submitBtn.click();

    // Native browser validation should stop the submit handler from ever running.
    await expect(loginPage.resultBox).toBeHidden();
    await expect(loginPage.emailInput).toHaveJSProperty("validity.valid", false);
  });

  test("negative: a malformed email is blocked by native HTML5 validation, not app logic", async ({
    loginPage,
  }) => {
    await loginPage.login("' OR '1'='1", "irrelevant");

    await expect(loginPage.resultBox).toBeHidden();
    await expect(loginPage.emailInput).toHaveJSProperty("validity.valid", false);
  });

  test("negative: SQL-injection-style password is treated as an ordinary invalid login", async ({ loginPage }) => {
    await loginPage.login(VALID_EMAIL, "' OR '1'='1");

    await expect(loginPage.resultBox).toHaveText("Invalid email or password.");
  });

  test("edge: leading/trailing whitespace in the email is trimmed before comparison", async ({ loginPage }) => {
    await loginPage.login(`  ${VALID_EMAIL}  `, VALID_PASSWORD);

    await expect(loginPage.loggedInView).toBeVisible();
  });

  test("edge: whitespace in the password is NOT trimmed, so it fails", async ({ loginPage }) => {
    await loginPage.login(VALID_EMAIL, `${VALID_PASSWORD} `);

    await expect(loginPage.resultBox).toHaveText("Invalid email or password.");
  });

  test("edge: logging out returns to the form with fields and result cleared", async ({ loginPage }) => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    await expect(loginPage.loggedInView).toBeVisible();

    await loginPage.logout();

    await expect(loginPage.loggedInView).toBeHidden();
    await expect(loginPage.emailInput).toHaveValue("");
    await expect(loginPage.passwordInput).toHaveValue("");
    await expect(loginPage.resultBox).toBeHidden();
  });
});
