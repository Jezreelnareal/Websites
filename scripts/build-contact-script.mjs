import fs from "node:fs";
import ts from "typescript";

// Apps Script does not support ES module imports. Bundle the existing email
// templates into one pasteable file, keeping their TypeScript source reusable.
const receiver = fs.readFileSync(new URL("../apps-script/receiver.gs", import.meta.url), "utf8").replaceAll("\r\n", "\n");
const templateSource = fs.readFileSync(new URL("../lib/contact/email.ts", import.meta.url), "utf8");
const templates = ts.transpileModule(templateSource, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText.replace(/^export /gm, "");
const output = "// GENERATED: npm run build:contact-script. Edit receiver.gs or lib/contact/email.ts.\n"
  + "// Replace Code.gs in your EXISTING Google Apps Script project with this entire file.\n\n"
  + receiver + "\n// Owner email templates (shared with website regression tests).\n" + templates;
const target = new URL("../apps-script/Code.gs", import.meta.url);
if (process.argv.includes("--check")) {
  if (!fs.existsSync(target) || fs.readFileSync(target, "utf8").replaceAll("\r\n", "\n") !== output) {
    throw new Error("Apps Script bundle is stale. Run npm run build:contact-script.");
  }
} else {
  fs.writeFileSync(target, output);
}
