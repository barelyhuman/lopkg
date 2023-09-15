import { join } from "node:path";

import { homedir } from "node:os";

export function getProjectPath() {
  const projectPath = join(homedir(), ".local-pm");
  return projectPath;
}
