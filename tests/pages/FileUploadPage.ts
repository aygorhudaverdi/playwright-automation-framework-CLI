import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class FileUploadPage extends BasePage {
  readonly fileInput: Locator;
  readonly fileList: Locator;
  readonly dropzone: Locator;
  readonly dropzoneInput: Locator;
  readonly dropzoneFileList: Locator;

  constructor(page: Page) {
    super(page, "/pages/file-upload.html");
    this.fileInput = page.getByTestId("file-input");
    this.fileList = page.getByTestId("file-list");
    this.dropzone = page.getByTestId("dropzone");
    this.dropzoneInput = page.getByTestId("dropzone-input");
    this.dropzoneFileList = page.getByTestId("dropzone-file-list");
  }

  uploadedFileEntries(scope: Locator): Locator {
    return scope.getByTestId("uploaded-file");
  }

  async uploadViaStandardInput(files: Parameters<Locator["setInputFiles"]>[0]): Promise<void> {
    await this.fileInput.setInputFiles(files);
  }

  async uploadViaDropzone(files: Parameters<Locator["setInputFiles"]>[0]): Promise<void> {
    await this.dropzoneInput.setInputFiles(files);
  }
}
