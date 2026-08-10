import { test, expect } from "../fixtures/pages.fixture";

test.describe("Checkboxes", () => {
  test.beforeEach(async ({ checkboxesPage }) => {
    await checkboxesPage.goto();
  });

  test("positive: checking an item updates the summary count", async ({ checkboxesPage }) => {
    // Item 2 is checked by default, so start from a clean, all-unchecked baseline.
    await checkboxesPage.item(2).uncheck();
    await checkboxesPage.item(1).check();

    await expect(checkboxesPage.summary).toHaveText("1 of 3 selectable items checked");
  });

  test("positive: the summary reflects the checked-by-default item on initial load", async ({ checkboxesPage }) => {
    await expect(checkboxesPage.item(2)).toBeChecked();
    await expect(checkboxesPage.summary).toHaveText("1 of 3 selectable items checked");
    expect(await checkboxesPage.isSelectAllIndeterminate()).toBe(true);
  });

  test("negative: the disabled item cannot be checked", async ({ checkboxesPage }) => {
    await expect(checkboxesPage.item(4)).toBeDisabled();
    await expect(checkboxesPage.item(4)).not.toBeChecked();
  });

  test("negative: disabled item is excluded from the selectable count in the summary", async ({ checkboxesPage }) => {
    await checkboxesPage.selectAll.check();

    await expect(checkboxesPage.summary).toHaveText("3 of 3 selectable items checked");
    await expect(checkboxesPage.item(4)).not.toBeChecked();
  });

  test("edge: select-all checks every enabled item", async ({ checkboxesPage }) => {
    await checkboxesPage.selectAll.check();

    await expect(checkboxesPage.item(1)).toBeChecked();
    await expect(checkboxesPage.item(2)).toBeChecked();
    await expect(checkboxesPage.item(3)).toBeChecked();
  });

  test("edge: unchecking one item after select-all puts select-all into an indeterminate state", async ({
    checkboxesPage,
  }) => {
    await checkboxesPage.selectAll.check();
    await checkboxesPage.item(1).uncheck();

    await expect(checkboxesPage.selectAll).not.toBeChecked();
    expect(await checkboxesPage.isSelectAllIndeterminate()).toBe(true);
    await expect(checkboxesPage.summary).toHaveText("2 of 3 selectable items checked");
  });

  test("edge: manually checking all items individually also checks select-all", async ({ checkboxesPage }) => {
    await checkboxesPage.item(1).check();
    await checkboxesPage.item(2).check();
    await checkboxesPage.item(3).check();

    await expect(checkboxesPage.selectAll).toBeChecked();
    expect(await checkboxesPage.isSelectAllIndeterminate()).toBe(false);
  });

  test("edge: unchecking everything resets select-all to unchecked, not indeterminate", async ({
    checkboxesPage,
  }) => {
    await checkboxesPage.item(2).uncheck(); // item 2 starts checked by default

    await expect(checkboxesPage.selectAll).not.toBeChecked();
    expect(await checkboxesPage.isSelectAllIndeterminate()).toBe(false);
    await expect(checkboxesPage.summary).toHaveText("0 of 3 selectable items checked");
  });

  test("edge: toggling select-all off after full selection unchecks every enabled item", async ({
    checkboxesPage,
  }) => {
    await checkboxesPage.selectAll.check();
    await checkboxesPage.selectAll.uncheck();

    await expect(checkboxesPage.item(1)).not.toBeChecked();
    await expect(checkboxesPage.item(2)).not.toBeChecked();
    await expect(checkboxesPage.item(3)).not.toBeChecked();
    await expect(checkboxesPage.summary).toHaveText("0 of 3 selectable items checked");
  });
});
