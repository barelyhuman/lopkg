import { Yarn } from "./lib/yarn.js";

await Yarn.fetchVersionTar();
await Yarn.extractVersionTar();
await Yarn.createAlias();
