import { test, expect } from "../fixtures/pages.fixture";

test.describe("Dropdowns", () => {
  test.beforeEach(async ({ dropdownsPage }) => {
    await dropdownsPage.goto();
  });

  test("positive: selecting a native option updates the result text", async ({ dropdownsPage }) => {
    await dropdownsPage.nativeSelect.selectOption("firefox");

    await expect(dropdownsPage.nativeResult).toHaveText("Selected: Firefox");
  });

  test("positive: selecting a custom dropdown option updates the toggle and result", async ({ dropdownsPage }) => {
    await dropdownsPage.selectCustomOption("staging");

    await expect(dropdownsPage.customToggle).toHaveText("Staging");
    await expect(dropdownsPage.customResult).toHaveText("Selected: Staging (value=staging)");
    await expect(dropdownsPage.customMenu).toBeHidden();
  });

  test("edge: re-selecting the native placeholder resets the result text", async ({ dropdownsPage }) => {
    await dropdownsPage.nativeSelect.selectOption("chrome");
    await expect(dropdownsPage.nativeResult).toHaveText("Selected: Chrome");

    await dropdownsPage.nativeSelect.selectOption("");

    await expect(dropdownsPage.nativeResult).toHaveText("No selection yet");
  });

  test("negative/edge: Escape does not close the custom dropdown (no keydown handler wired up)", async ({
    dropdownsPage,
    page,
  }) => {
    await dropdownsPage.openCustomDropdown();
    await expect(dropdownsPage.customMenu).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(dropdownsPage.customMenu).toBeVisible();
  });

  test("edge: clicking outside the custom dropdown closes it without changing the selection", async ({
    dropdownsPage,
  }) => {
    await dropdownsPage.openCustomDropdown();
    await expect(dropdownsPage.customMenu).toBeVisible();

    await dropdownsPage.clickOutside();

    await expect(dropdownsPage.customMenu).toBeHidden();
    await expect(dropdownsPage.customToggle).toHaveAttribute("aria-expanded", "false");
    await expect(dropdownsPage.customResult).toHaveText("No selection yet");
  });

  test("edge: a previous custom selection can be overwritten by picking a different option", async ({
    dropdownsPage,
  }) => {
    await dropdownsPage.selectCustomOption("dev");
    await expect(dropdownsPage.customResult).toHaveText("Selected: Development (value=dev)");

    await dropdownsPage.selectCustomOption("prod");

    await expect(dropdownsPage.customResult).toHaveText("Selected: Production (value=prod)");
    await expect(dropdownsPage.customToggle).toHaveText("Production");
  });

  test("edge: toggling the custom dropdown open then closed leaves aria-expanded false with no selection", async ({
    dropdownsPage,
  }) => {
    await dropdownsPage.openCustomDropdown();
    await dropdownsPage.customToggle.click();

    await expect(dropdownsPage.customMenu).toBeHidden();
    await expect(dropdownsPage.customToggle).toHaveAttribute("aria-expanded", "false");
    await expect(dropdownsPage.customResult).toHaveText("No selection yet");
  });
});
