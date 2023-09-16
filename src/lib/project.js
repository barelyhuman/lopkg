import { join } from "node:path";

import { homedir } from "node:os";

export function getProjectPath(pkgMan = "pnpm") {
  const projectPath = join(homedir(), ".lopkg", pkgMan);
  return projectPath;
}
