import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { FormsPage } from "../pages/FormsPage";
import { CheckboxesPage } from "../pages/CheckboxesPage";
import { DropdownsPage } from "../pages/DropdownsPage";
import { AlertsPage } from "../pages/AlertsPage";
import { FileUploadPage } from "../pages/FileUploadPage";
import { DynamicLoadingPage } from "../pages/DynamicLoadingPage";
import { KeyPressesPage } from "../pages/KeyPressesPage";
import { TablesPage } from "../pages/TablesPage";
import { ModalsPage } from "../pages/ModalsPage";

interface PageFixtures {
  loginPage: LoginPage;
  formsPage: FormsPage;
  checkboxesPage: CheckboxesPage;
  dropdownsPage: DropdownsPage;
  alertsPage: AlertsPage;
  fileUploadPage: FileUploadPage;
  dynamicLoadingPage: DynamicLoadingPage;
  keyPressesPage: KeyPressesPage;
  tablesPage: TablesPage;
  modalsPage: ModalsPage;
}

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  formsPage: async ({ page }, use) => use(new FormsPage(page)),
  checkboxesPage: async ({ page }, use) => use(new CheckboxesPage(page)),
  dropdownsPage: async ({ page }, use) => use(new DropdownsPage(page)),
  alertsPage: async ({ page }, use) => use(new AlertsPage(page)),
  fileUploadPage: async ({ page }, use) => use(new FileUploadPage(page)),
  dynamicLoadingPage: async ({ page }, use) => use(new DynamicLoadingPage(page)),
  keyPressesPage: async ({ page }, use) => use(new KeyPressesPage(page)),
  tablesPage: async ({ page }, use) => use(new TablesPage(page)),
  modalsPage: async ({ page }, use) => use(new ModalsPage(page)),
});

export { expect } from "@playwright/test";
