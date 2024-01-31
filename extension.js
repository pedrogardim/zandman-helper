const vscode = require("vscode");
const {
  uriToThemeName,
  uriToPattern,
  openFilePromptFromPattern,
  provideDocumentLinks,
} = require("./utils");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Zandman Jumper is now active");

  let jumpDisposable = vscode.commands.registerCommand(
    "zandman-jumper.jump",
    async (args) => {
      try {
        const currentEditor = vscode.window.activeTextEditor;
        if (!currentEditor) throw "No workspace folder opened.";

        const filePath = args?.path || currentEditor.document.uri.path;

        const isValid =
          filePath.includes("/htdocs/react-storefront/themes/") ||
          filePath.includes("@");
        if (!isValid) throw "Should be inside a Zandman React theme";

        await openFilePromptFromPattern(uriToPattern(filePath));
        return;
      } catch (error) {
        return vscode.window.showErrorMessage(error);
      }
    }
  );

  let linkProviderDisposable = vscode.languages.registerDocumentLinkProvider(
    [
      { scheme: "file", language: "javascript" },
      { scheme: "file", language: "javascriptreact" },
      { scheme: "file", language: "scss" },
    ],
    { provideDocumentLinks }
  );

  context.subscriptions.push(jumpDisposable, linkProviderDisposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
