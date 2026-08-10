import { test, expect } from "../fixtures/pages.fixture";

test.describe("Form Inputs", () => {
  test.beforeEach(async ({ formsPage }) => {
    await formsPage.goto();
  });

  test("positive: a fully valid submission succeeds", async ({ formsPage }) => {
    await formsPage.fill({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      role: "qa",
      experience: "senior",
      bio: "Loves testing.",
      agree: true,
    });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText("Submitted:");
    await expect(formsPage.resultBox).toContainText('"fullName": "Ada Lovelace"');
    await expect(formsPage.resultBox).toContainText('"experience": "senior"');
    await expect(formsPage.resultBox).toHaveClass(/success/);
  });

  test("negative: full name below the 2-character minimum is rejected", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "A", email: "a@example.com", role: "qa", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText("Full name must be at least 2 characters.");
    await expect(formsPage.resultBox).toHaveClass(/error/);
  });

  test("negative: malformed email is rejected", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "Ada Lovelace", email: "not-an-email", role: "qa", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText("Email is invalid.");
  });

  test("negative: missing role is rejected", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "Ada Lovelace", email: "ada@example.com", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText("Role is required.");
  });

  test("negative: unchecked agreement is rejected", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "Ada Lovelace", email: "ada@example.com", role: "qa" });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText("You must agree to the terms.");
  });

  test("negative: a completely empty submission reports every validation error at once", async ({ formsPage }) => {
    await formsPage.submit();

    const text = await formsPage.resultBox.textContent();
    expect(text).toContain("Full name must be at least 2 characters.");
    expect(text).toContain("Email is invalid.");
    expect(text).toContain("Role is required.");
    expect(text).toContain("You must agree to the terms.");
  });

  test("edge: full name of exactly 2 characters passes the minimum-length check", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "Al", email: "al@example.com", role: "dev", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toHaveClass(/success/);
  });

  test("edge: full name that is only whitespace is trimmed down below the minimum", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "   ", email: "a@example.com", role: "dev", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText("Full name must be at least 2 characters.");
  });

  test("edge: a name padded with whitespace is trimmed before validation and submission", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "  Al  ", email: "al@example.com", role: "dev", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText('"fullName": "Al"');
  });

  test("edge: bio is optional and can be left blank", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "Ada Lovelace", email: "ada@example.com", role: "pm", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText('"bio": ""');
  });

  test("edge: experience radio is optional and defaults to null when unselected", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "Ada Lovelace", email: "ada@example.com", role: "other", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toContainText('"experience": null');
  });

  test("edge: an unusually long full name is still accepted", async ({ formsPage }) => {
    const longName = "A".repeat(500);
    await formsPage.fill({ fullName: longName, email: "a@example.com", role: "qa", agree: true });
    await formsPage.submit();

    await expect(formsPage.resultBox).toHaveClass(/success/);
  });

  test("edge: reset clears all fields and hides a previously shown result", async ({ formsPage }) => {
    await formsPage.fill({ fullName: "A", email: "bad", agree: false });
    await formsPage.submit();
    await expect(formsPage.resultBox).toBeVisible();

    await formsPage.reset();

    await expect(formsPage.resultBox).toBeHidden();
    await expect(formsPage.fullNameInput).toHaveValue("");
    await expect(formsPage.agreeCheckbox).not.toBeChecked();
  });
});
