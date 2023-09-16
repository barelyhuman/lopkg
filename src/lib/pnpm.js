import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { fetch } from "ofetch";
import { dirname, join } from "path";
import tar from "tar";
import { getProjectPath } from "./project.js";
import { withResolve } from "./promises.js";

export const Pnpm = {
  fetchVersionTar: fetchVersionTar,
  extractVersionTar: extractVersionTar,
  createAlias: createAlias,
};

async function fetchVersionTar(version = "latest") {
  const { promise, resolve } = withResolve();
  const getVersions = await fetch("https://registry.npmjs.org/pnpm").then((x) =>
    x.json()
  );

  let resolvedVersion = version;

  if (!getVersions.versions[resolvedVersion]) {
    resolvedVersion = getVersions["dist-tags"][resolvedVersion];
  }

  if (!resolvedVersion) {
    throw new Error("Invalid version provided for pnpm");
  }

  const tarURL = getVersions.versions[resolvedVersion].dist.tarball;

  const response = await fetch(tarURL)
    .then((x) => {
      if (!x.ok) {
        throw x;
      }
      return x;
    })
    .catch((err) => {
      // console.error(err)
    });

  const arrayBuff = await response.arrayBuffer();
  const writePath = join(getProjectPath(), resolvedVersion, "pnpm.tar.gz");
  await mkdir(dirname(writePath), { recursive: true });
  const write$ = createWriteStream(writePath, "binary");
  write$.write(Buffer.from(arrayBuff));

  write$.on("close", () => {
    resolve({
      version: resolvedVersion,
    });
  });

  write$.end();

  return promise;
}

async function extractVersionTar(version = "") {
  const filePath = join(getProjectPath(), version, "pnpm.tar.gz");
  const extractTo = join(dirname(filePath), "pnpm");
  await mkdir(extractTo, { recursive: true });
  await tar.x(
    {
      file: filePath,
      strip: 1,
      C: extractTo,
    },
    []
  );
}

async function createAlias(version) {
  await _createAliasPM(version);
  await _createAliasPMX(version);
}

function _createAliasPM(version) {
  const { resolve, reject, promise } = withResolve();
  const filePath = join(getProjectPath(), version, "pnpm/bin/pnpm.cjs");

  const write$ = createWriteStream("./pm.cjs");
  write$.write(`#!/usr/bin/env node\n`);
  write$.write(`require("${filePath}")`);
  write$.on("close", () => {
    resolve();
  });
  write$.on("error", (err) => {
    reject(err);
  });
  write$.end();
  return promise;
}

function _createAliasPMX(version) {
  const { resolve, promise, reject } = withResolve();
  const filePath = join(getProjectPath(), version, "pnpm/bin/pnpx.cjs");
  const write$ = createWriteStream("./pmx.cjs");
  write$.write(`#!/usr/bin/env node\n`);
  write$.write(`require("${filePath}")`);
  write$.on("close", () => {
    resolve();
  });
  write$.on("error", (err) => {
    reject(err);
  });
  write$.end();
  return promise;
}
