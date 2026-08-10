import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export type SortColumn = "name" | "role" | "status";

export class TablesPage extends BasePage {
  readonly table: Locator;
  readonly tableBody: Locator;

  constructor(page: Page) {
    super(page, "/pages/tables.html");
    this.table = page.getByTestId("data-table");
    this.tableBody = page.getByTestId("table-body");
  }

  header(column: SortColumn): Locator {
    return this.page.getByTestId(`th-${column}`);
  }

  row(id: number): Locator {
    return this.page.getByTestId(`row-${id}`);
  }

  nameCell(id: number): Locator {
    return this.page.getByTestId(`cell-name-${id}`);
  }

  deleteButton(id: number): Locator {
    return this.page.getByTestId(`delete-btn-${id}`);
  }

  async sortBy(column: SortColumn): Promise<void> {
    await this.header(column).click();
  }

  async deleteRow(id: number): Promise<void> {
    await this.deleteButton(id).click();
  }

  async columnValues(column: SortColumn): Promise<string[]> {
    const values = await this.tableBody.locator(`td[data-testid^="cell-${column}-"]`).allTextContents();
    return values.map((v) => v.trim());
  }

  rowCount(): Promise<number> {
    return this.tableBody.locator("tr").count();
  }
}
