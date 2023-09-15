import { createWriteStream } from "fs";
import { mkdir } from "fs/promises";
import { fetch } from "ofetch";
import { dirname, join } from "path";
import tar from "tar";
import { getProjectPath } from "./project.js";
import { withResolve } from "./promises.js";

export const Yarn = {
  fetchVersionTar: fetchVersionTar,
  extractVersionTar: extractVersionTar,
  createAlias: createAlias,
};

async function fetchVersionTar(version = "1.22.19") {
  const { promise, resolve } = withResolve();
  const response = await fetch("http://yarnpkg.com/latest.tar.gz")
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
  const writePath = join(getProjectPath(), version, "yarn.tar.gz");
  await mkdir(dirname(writePath), { recursive: true });
  const write$ = createWriteStream(writePath, "binary");
  write$.write(Buffer.from(arrayBuff));

  write$.on("close", () => {
    resolve();
  });

  write$.end();

  return promise;
}

async function extractVersionTar(version = "1.22.19") {
  const filePath = join(getProjectPath(), version, "yarn.tar.gz");
  const extractTo = join(dirname(filePath), "yarn");
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

async function createAlias(version = "1.22.19") {
  const { resolve, promise } = withResolve();

  const filePath = join(getProjectPath(), version, "yarn/bin/yarn.js");

  const write$ = createWriteStream("./pm.cjs");
  write$.write(`#!/usr/bin/env node\n`);
  write$.write(`require("${filePath}")`);
  write$.on("end", () => {
    resolve();
  });
  write$.end();
  return promise;
}
