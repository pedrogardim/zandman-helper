const vscode = require("vscode");
const ALLOWED_LANGUAGES = ["javascriptreact", "javascript", "scss"];

const provideDocumentLinks = (document) => {
  if (!ALLOWED_LANGUAGES.includes(document.languageId)) {
    return [];
  }

  const links = [];
  const text = document.getText();

  // Regular expression to match imports starting with '@' or '~@' and ending with single or double quotes
  const importRegex = /['"](?:@|~@)[^'"]+['"]/g;

  let match;
  while ((match = importRegex.exec(text))) {
    const importPath = match[0]; // Extract the path without quotes
    const startPos = document.positionAt(match.index);
    const endPos = document.positionAt(match.index + match[0].length);

    const linkRange = new vscode.Range(startPos, endPos);
    const linkTarget = vscode.Uri.parse(`command:zandman-jumper.jump?${encodeURIComponent(JSON.stringify({ path: importPath }))}`);

    links.push(new vscode.DocumentLink(linkRange, linkTarget));
  }

  return links;
};

module.exports = { provideDocumentLinks };
