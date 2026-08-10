import { test, expect } from "../fixtures/pages.fixture";

test.describe("JS Alerts", () => {
  test.beforeEach(async ({ alertsPage }) => {
    await alertsPage.goto();
  });

  test("positive: accepting confirm() reports OK", async ({ alertsPage }) => {
    await alertsPage.triggerConfirm(true);

    await expect(alertsPage.confirmResult).toHaveText("You clicked OK.");
    await expect(alertsPage.confirmResult).toHaveClass(/success/);
  });

  test("negative: dismissing confirm() reports Cancel", async ({ alertsPage }) => {
    await alertsPage.triggerConfirm(false);

    await expect(alertsPage.confirmResult).toHaveText("You clicked Cancel.");
    await expect(alertsPage.confirmResult).toHaveClass(/error/);
  });

  test("negative: dismissing prompt() reports Cancel, not an empty string", async ({ alertsPage }) => {
    await alertsPage.triggerPrompt(false);

    await expect(alertsPage.promptResult).toHaveText("You clicked Cancel.");
    await expect(alertsPage.promptResult).toHaveClass(/error/);
  });

  test("edge: accepting prompt() with an empty string is distinguished from cancelling", async ({ alertsPage }) => {
    await alertsPage.triggerPrompt(true, "");

    await expect(alertsPage.promptResult).toHaveText('You typed: ""');
    await expect(alertsPage.promptResult).toHaveClass(/success/);
  });

  test("edge: prompt() reflects special characters and whitespace exactly as typed", async ({ alertsPage }) => {
    const tricky = '  <script>"tricky" & weird\t input</script>  ';
    await alertsPage.triggerPrompt(true, tricky);

    await expect(alertsPage.promptResult).toHaveText(`You typed: "${tricky}"`);
  });

  test("edge: alert() carries the expected message and can be accepted", async ({ alertsPage }) => {
    const message = await alertsPage.triggerAlert();

    expect(message).toBe("Hello from QA Playground!");
  });

  test("edge: triggering confirm() repeatedly updates the result each time, not just once", async ({
    alertsPage,
  }) => {
    await alertsPage.triggerConfirm(true);
    await expect(alertsPage.confirmResult).toHaveText("You clicked OK.");

    await alertsPage.triggerConfirm(false);
    await expect(alertsPage.confirmResult).toHaveText("You clicked Cancel.");

    await alertsPage.triggerConfirm(true);
    await expect(alertsPage.confirmResult).toHaveText("You clicked OK.");
  });
});
