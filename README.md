# lopkg

> **lo**cal **p**ac**k**a**g**e installer.

`lopkg` is a solution to a problem with different package managers existing throughout systems. `corepack` is one solution but it's a systemwide solution and has hardly worked properly for me, so this is a simpler version of corepack.

`lopkg` installs the requested package manager to be installed into the project folder. You can then use this aliased version in the project as needed.

## Usage

1. add the following lines to your `package.json`

```json
{
  "scripts": {
    "boot": "npx lopkg", //=> install the latest pnpm by default
    "pm": "node pm.cjs"
  }
}
```

2. Add the following to your `.gitignore`

```sh
/pm.cjs
/pmx.cjs
```

3. Now run the `boot` script to create the `pm.cjs` and `pmx.cjs`(not created for all package managers) files.

```sh
$ npm run boot
```

4. You are all done, you just use `npm run pm` instead of `yarn` or `pnpm`, or you could even use `yarn pm` or `pnpm pm` if that's shorter and more tied to your muscle memory since the executed package manager is always going to be the one that's in the repository.

### CLI Reference

```sh
  Description
    Install a project specific package manager

  Usage
    $ lopkg [pkgman] [version] [options]

  Options
    -v, --version    Displays current version
    -h, --help       Displays this message

  Examples
    $ lopkg yarn
    $ lopkg pnpm
    $ lopkg pnpm 8.6.2
```

# License

[MIT](/LICENSE)
