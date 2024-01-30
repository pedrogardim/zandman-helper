const vscode = require("vscode");
const { provideDocumentLinks } = require("./links");

const uriToThemeName = (uri) => {
  const splitedPath = uri.split("/");
  const themeNameIndex = splitedPath.findIndex((p) => p === "themes") + 1;
  const name = splitedPath[themeNameIndex];
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const uriToPattern = (uri) => {
  if (uri.includes("@")) {
    return `**/${uri
      .replaceAll("@", "")
      .replaceAll("~", "")
      .replaceAll("'", "")
      .replaceAll('"', "")}/${!uri.includes(".") ? "*.*" : ""}`;
  }
  const splitedPath = uri.split("/");
  const themeNameIndex = splitedPath.findIndex((p) => p === "themes") + 1;
  return `**/themes/**/${splitedPath.slice(themeNameIndex + 1).join("/")}`;
};

const trimBaseUri = (uri) => {
  const splitedPath = uri.split("/");
  const themeNameIndex = splitedPath.findIndex((p) => p === "themes") + 1;
  return splitedPath.slice(themeNameIndex + 1).join("/");
};

const openFilePromptFromPattern = async (pattern) => {
  const files = await vscode.workspace.findFiles(pattern);

  if (files.length === 0) throw "No files found.";

  const filtered = files
    .filter((f) => !f.path.includes(".generated"))
    .map((f) => ({
      ...f,
      label: uriToThemeName(f.fsPath),
      description: trimBaseUri(f.fsPath),
    }));

  if(filtered.length === 1){
    const document = await vscode.workspace.openTextDocument(filtered[0].path);
    await vscode.window.showTextDocument(document);
    return
  }

  const selectedFile = await vscode.window.showQuickPick(filtered, {
    placeHolder: "We found:",
  });

  if (!selectedFile) return;

  const document = await vscode.workspace.openTextDocument(selectedFile.path);
  await vscode.window.showTextDocument(document);
  return
};

module.exports = {
  uriToThemeName,
  uriToPattern,
  openFilePromptFromPattern,
  provideDocumentLinks,
};
