import { test, expect } from "../fixtures/pages.fixture";

test.describe("Sortable Table", () => {
  test.beforeEach(async ({ tablesPage }) => {
    await tablesPage.goto();
  });

  test("positive: default row order matches the initial unsorted data", async ({ tablesPage }) => {
    const names = await tablesPage.columnValues("name");

    expect(names).toEqual(["Alice Chen", "Bruno Silva", "Chidi Okafor", "Dana Kowalski", "Ezra Fields"]);
  });

  test("positive: clicking a column header sorts ascending", async ({ tablesPage }) => {
    await tablesPage.sortBy("name");

    const names = await tablesPage.columnValues("name");
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
  });

  test("edge: clicking the same header twice toggles to descending order", async ({ tablesPage }) => {
    await tablesPage.sortBy("name");
    const ascending = await tablesPage.columnValues("name");

    await tablesPage.sortBy("name");
    const descending = await tablesPage.columnValues("name");

    expect(descending).toEqual([...ascending].reverse());
  });

  test("negative/edge: deleting a row removes exactly that row and keeps the rest in order", async ({
    tablesPage,
  }) => {
    await expect(tablesPage.tableBody.locator("tr")).toHaveCount(5);

    await tablesPage.deleteRow(3); // Chidi Okafor

    await expect(tablesPage.tableBody.locator("tr")).toHaveCount(4);
    await expect(tablesPage.row(3)).toHaveCount(0);
    const names = await tablesPage.columnValues("name");
    expect(names).toEqual(["Alice Chen", "Bruno Silva", "Dana Kowalski", "Ezra Fields"]);
  });

  test("edge: deleting every row leaves an empty table body with no errors", async ({ tablesPage }) => {
    for (const id of [1, 2, 3, 4, 5]) {
      await tablesPage.deleteRow(id);
    }

    await expect(tablesPage.tableBody.locator("tr")).toHaveCount(0);
  });

  test("edge: sort order is preserved after a delete, since deleting does not re-sort", async ({ tablesPage }) => {
    await tablesPage.sortBy("name"); // ascending: Alice, Bruno, Chidi, Dana, Ezra
    await tablesPage.deleteRow(2); // remove Bruno Silva

    const names = await tablesPage.columnValues("name");
    expect(names).toEqual(["Alice Chen", "Chidi Okafor", "Dana Kowalski", "Ezra Fields"]);
  });

  test("edge: sorting by status groups equal values together via string comparison", async ({ tablesPage }) => {
    await tablesPage.sortBy("status");

    const statuses = await tablesPage.columnValues("status");
    expect(statuses).toEqual([...statuses].sort((a, b) => a.localeCompare(b)));
    expect(statuses[0]).toBe("active");
  });
});
