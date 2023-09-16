#!/usr/bin/env node

import sade from "sade";
import { Yarn } from "./lib/yarn.js";
import { Pnpm } from "./lib/pnpm.js";
import process from "node:process";

sade("lopkg [pkgman] [version]", true)
  .version("0.0.0")
  .describe("Install a project specific package manager")
  .example("yarn")
  .example("pnpm")
  .example("pnpm 8.6.2")
  .action(async (pkgman, version, opts) => {
    if (pkgman === "yarn") {
      return await setupYarn();
    }
    return await setupPNPM(version);
  })
  .parse(process.argv);

async function setupYarn() {
  console.log("Installing Yarn");
  console.log("Resolving version");
  await Yarn.fetchVersionTar();
  console.log("Resolving version:", "1.22.19");
  await Yarn.extractVersionTar();
  console.log("Extacted");
  await Yarn.createAlias();
  console.log(`Alias created: ./pm.cjs`);
}

async function setupPNPM(installVersion) {
  console.log("Installing PNPM");
  console.log("Resolving version");
  const { version } = await Pnpm.fetchVersionTar(installVersion);
  console.log("Resolved:", version);
  await Pnpm.extractVersionTar(version);
  console.log("Extacted");
  await Pnpm.createAlias(version);
  console.log(`Alias created: ./pm.cjs, ./pmx.cjs`);
}
