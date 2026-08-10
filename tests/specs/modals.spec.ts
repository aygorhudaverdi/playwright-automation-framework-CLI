import { test, expect } from "../fixtures/pages.fixture";

test.describe("Modals", () => {
  test.beforeEach(async ({ modalsPage }) => {
    await modalsPage.goto();
  });

  test("positive: confirming with a note reports the note back", async ({ modalsPage }) => {
    await modalsPage.open();
    await modalsPage.noteInput.fill("please proceed");
    await modalsPage.confirmBtn.click();

    await expect(modalsPage.overlay).toBeHidden();
    await expect(modalsPage.outcome).toHaveText('Confirmed with note: "please proceed"');
  });

  test("negative/edge: confirming with an empty note reports no note", async ({ modalsPage }) => {
    await modalsPage.open();
    await modalsPage.confirmBtn.click();

    await expect(modalsPage.outcome).toHaveText("Confirmed with no note");
  });

  test("edge: confirming with a whitespace-only note is trimmed to no note", async ({ modalsPage }) => {
    await modalsPage.open();
    await modalsPage.noteInput.fill("    ");
    await modalsPage.confirmBtn.click();

    await expect(modalsPage.outcome).toHaveText("Confirmed with no note");
  });

  test("negative: the cancel button closes the modal without saving the note", async ({ modalsPage }) => {
    await modalsPage.open();
    await modalsPage.noteInput.fill("this should be discarded");
    await modalsPage.cancelBtn.click();

    await expect(modalsPage.overlay).toBeHidden();
    await expect(modalsPage.outcome).toHaveText("Cancelled");
  });

  test("negative/edge: clicking the overlay background dismisses the modal", async ({ modalsPage }) => {
    await modalsPage.open();

    await modalsPage.dismissViaOverlay();

    await expect(modalsPage.overlay).toBeHidden();
    await expect(modalsPage.outcome).toHaveText("Dismissed via overlay click");
  });

  test("edge: clicking inside the modal panel does NOT dismiss it (only the overlay itself should)", async ({
    modalsPage,
  }) => {
    await modalsPage.open();

    await modalsPage.modal.click({ position: { x: 5, y: 5 } });

    await expect(modalsPage.overlay).toBeVisible();
    await expect(modalsPage.outcome).toHaveText("No action taken yet");
  });

  test("negative/edge: pressing Escape dismisses the modal", async ({ modalsPage }) => {
    await modalsPage.open();

    await modalsPage.dismissViaEscape();

    await expect(modalsPage.overlay).toBeHidden();
    await expect(modalsPage.outcome).toHaveText("Dismissed via Escape key");
  });

  test("edge: Escape is ignored when the modal is already closed", async ({ modalsPage }) => {
    await modalsPage.dismissViaEscape();

    await expect(modalsPage.outcome).toHaveText("No action taken yet");
  });

  test("edge: reopening the modal after a previous note starts with a blank input", async ({ modalsPage }) => {
    await modalsPage.open();
    await modalsPage.noteInput.fill("leftover text");
    await modalsPage.confirmBtn.click();

    await modalsPage.open();

    await expect(modalsPage.noteInput).toHaveValue("");
  });
});
