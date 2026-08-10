import path from "node:path";
import { test, expect } from "../fixtures/pages.fixture";

const FIXTURES_DIR = path.join(__dirname, "..", "fixtures", "files");

test.describe("File Upload", () => {
  test.beforeEach(async ({ fileUploadPage }) => {
    await fileUploadPage.goto();
  });

  test("positive: uploading a single file lists its name, size, and type", async ({ fileUploadPage }) => {
    await fileUploadPage.uploadViaStandardInput(path.join(FIXTURES_DIR, "sample.txt"));

    const entries = fileUploadPage.uploadedFileEntries(fileUploadPage.fileList);
    await expect(entries).toHaveCount(1);
    await expect(entries.first()).toContainText("sample.txt");
    await expect(entries.first()).toContainText("text/plain");
  });

  test("positive: uploading multiple files lists all of them", async ({ fileUploadPage }) => {
    await fileUploadPage.uploadViaStandardInput([
      { name: "a.txt", mimeType: "text/plain", buffer: Buffer.from("a") },
      { name: "b.txt", mimeType: "text/plain", buffer: Buffer.from("bb") },
    ]);

    const entries = fileUploadPage.uploadedFileEntries(fileUploadPage.fileList);
    await expect(entries).toHaveCount(2);
    await expect(entries.nth(0)).toContainText("a.txt (1 bytes");
    await expect(entries.nth(1)).toContainText("b.txt (2 bytes");
  });

  test("edge: a zero-byte file is still listed, reporting 0 bytes", async ({ fileUploadPage }) => {
    await fileUploadPage.uploadViaStandardInput({
      name: "empty.txt",
      mimeType: "text/plain",
      buffer: Buffer.alloc(0),
    });

    const entries = fileUploadPage.uploadedFileEntries(fileUploadPage.fileList);
    await expect(entries.first()).toContainText("empty.txt (0 bytes");
  });

  test("edge: a file with no extension still uploads, with the browser's default mime type", async ({
    fileUploadPage,
  }) => {
    await fileUploadPage.uploadViaStandardInput({
      name: "README",
      mimeType: "",
      buffer: Buffer.from("no extension here"),
    });

    // Chromium/Firefox fall back to application/octet-stream when the type can't be
    // sniffed from the filename; the app's own "unknown type" fallback only kicks in
    // for the rarer case where file.type is genuinely an empty string.
    const entries = fileUploadPage.uploadedFileEntries(fileUploadPage.fileList);
    await expect(entries.first()).toContainText("README");
    await expect(entries.first()).toContainText("application/octet-stream");
  });

  test("edge: selecting a new file replaces the previous list rather than appending", async ({
    fileUploadPage,
  }) => {
    await fileUploadPage.uploadViaStandardInput({
      name: "first.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("first"),
    });
    await expect(fileUploadPage.uploadedFileEntries(fileUploadPage.fileList)).toHaveCount(1);

    await fileUploadPage.uploadViaStandardInput({
      name: "second.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("second"),
    });

    const entries = fileUploadPage.uploadedFileEntries(fileUploadPage.fileList);
    await expect(entries).toHaveCount(1);
    await expect(entries.first()).toContainText("second.txt");
  });

  test("edge: a filename with spaces and unicode characters renders correctly", async ({ fileUploadPage }) => {
    await fileUploadPage.uploadViaStandardInput({
      name: "my résumé (final) 简历.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4"),
    });

    const entries = fileUploadPage.uploadedFileEntries(fileUploadPage.fileList);
    await expect(entries.first()).toContainText("my résumé (final) 简历.pdf");
  });

  test("edge: the drag-and-drop zone's hidden input tracks files independently of the standard input", async ({
    fileUploadPage,
  }) => {
    await fileUploadPage.uploadViaStandardInput({
      name: "standard.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("standard"),
    });
    await fileUploadPage.uploadViaDropzone({
      name: "dropped.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("dropped"),
    });

    await expect(fileUploadPage.uploadedFileEntries(fileUploadPage.fileList)).toHaveCount(1);
    await expect(fileUploadPage.uploadedFileEntries(fileUploadPage.fileList).first()).toContainText("standard.txt");
    await expect(fileUploadPage.uploadedFileEntries(fileUploadPage.dropzoneFileList)).toHaveCount(1);
    await expect(fileUploadPage.uploadedFileEntries(fileUploadPage.dropzoneFileList).first()).toContainText(
      "dropped.txt",
    );
  });
});
