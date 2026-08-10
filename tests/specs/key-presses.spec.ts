import { test, expect } from "../fixtures/pages.fixture";

test.describe("Key Presses", () => {
  test.beforeEach(async ({ keyPressesPage }) => {
    await keyPressesPage.goto();
  });

  test("positive: pressing a plain letter key is reported and logged", async ({ keyPressesPage }) => {
    await keyPressesPage.press("a");

    await expect(keyPressesPage.display).toHaveText("Last key: a");
    await expect(keyPressesPage.log).toHaveText("a");
  });

  test("edge: baseline text is shown before any key has been pressed", async ({ keyPressesPage }) => {
    await expect(keyPressesPage.display).toHaveText("No key pressed yet");
  });

  test("negative/edge: a modifier combination is reported with the modifier name prefixed", async ({
    keyPressesPage,
  }) => {
    await keyPressesPage.press("Control+a");

    await expect(keyPressesPage.display).toHaveText("Last key: Ctrl+a");
  });

  test("edge: Shift plus a letter is reported with Shift prefixed", async ({ keyPressesPage }) => {
    await keyPressesPage.press("Shift+A");

    await expect(keyPressesPage.display).toContainText("Shift+");
  });

  test("edge: non-printable keys like Enter are reported by name without crashing", async ({ keyPressesPage }) => {
    await keyPressesPage.press("Enter");

    await expect(keyPressesPage.display).toHaveText("Last key: Enter");
  });

  test("edge: the log keeps only the most recent 10 entries, newest first", async ({ keyPressesPage }) => {
    const keys = "abcdefghijkl".split(""); // 12 presses
    for (const key of keys) {
      await keyPressesPage.press(key);
    }

    const logText = await keyPressesPage.log.textContent();
    const lines = (logText ?? "").split("\n");

    expect(lines).toHaveLength(10);
    // Newest entry (last pressed key, "l") is unshifted to the front of the log.
    expect(lines[0]).toBe("l");
    expect(lines[9]).toBe("c");
    expect(lines).not.toContain("a");
    expect(lines).not.toContain("b");
  });
});
