import { test, expect } from "../fixtures/pages.fixture";

test.describe("Dynamic Loading", () => {
  test.beforeEach(async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.goto();
  });

  test("positive: example 1 reveals the hidden finish element after loading", async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.start1.click();

    await expect(dynamicLoadingPage.finish1).toBeVisible();
    await expect(dynamicLoadingPage.loading1).toBeHidden();
  });

  test("positive: example 2 inserts the finish element into the DOM after loading", async ({
    dynamicLoadingPage,
  }) => {
    await dynamicLoadingPage.start2.click();

    await expect(dynamicLoadingPage.finish2).toBeVisible();
    await expect(dynamicLoadingPage.finish2).toHaveText("Hello World! Element 2 was just added to the DOM.");
  });

  test("edge: example 1's finish text is hidden and the spinner is visible immediately after clicking start", async ({
    dynamicLoadingPage,
  }) => {
    await dynamicLoadingPage.start1.click();

    await expect(dynamicLoadingPage.loading1).toBeVisible();
    await expect(dynamicLoadingPage.finish1).toBeHidden();
  });

  test("edge: example 2's finish element does not exist in the DOM before loading completes", async ({
    dynamicLoadingPage,
  }) => {
    await expect(dynamicLoadingPage.finish2).toHaveCount(0);

    await dynamicLoadingPage.start2.click();
    await expect(dynamicLoadingPage.loading2).toBeVisible();
    await expect(dynamicLoadingPage.finish2).toHaveCount(0);

    await expect(dynamicLoadingPage.finish2).toHaveCount(1);
  });

  test("edge: clicking start again after completion re-runs the loading cycle", async ({ dynamicLoadingPage }) => {
    await dynamicLoadingPage.start1.click();
    await expect(dynamicLoadingPage.finish1).toBeVisible();

    await dynamicLoadingPage.start1.click();

    await expect(dynamicLoadingPage.finish1).toBeHidden();
    await expect(dynamicLoadingPage.loading1).toBeVisible();
    await expect(dynamicLoadingPage.finish1).toBeVisible();
  });
});
