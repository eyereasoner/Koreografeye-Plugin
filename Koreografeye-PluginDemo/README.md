# KoreografeyePluginDemo

A demonstration project how to create a Koreografeye plugin.

## Install dependencies

```
npm install 
```

## Mark your project as a Components.js module

File `package.json`:

```
{
  "name": "koreografeye-plugindemo",
  "version": "1.0.0",
  "lsd:module": true,
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": [
    "components",
    "dist/**/*.d.ts",
    "dist/**/*.js",
    "dist/**/*.js.map"
  ],
  "scripts": {
    "build": "npm run build:ts && npm run build:components",
    "build:ts": "tsc",
    "build:components": "componentsjs-generator -s dist -r kgd1234",
    "prepare": "npm run build",
  },
  ...
}
```

- Make sure that the `-r` option of `build:components` has a unique id for your project (invent some code)

## Create a plugin

In `src` create a class as extension of `PolicyPlugin` from 
the Koreografeye package. The file `src/MyDemoPlugin.ts` is an example of a such a plugin.

## Create an index with all exported plugin modules

In `src/index.ts` export all the plugins you created.

## Compile

```
npm run build
```

## Create a configuration file for your class

File `config.jsonld`

```
{
  "@context": [
    "https://linkedsoftwaredependencies.org/bundles/npm/componentsjs/^5.0.0/components/context.jsonld",
    "https://linkedsoftwaredependencies.org/bundles/npm/koreografeye-plugindemo/^1.0.0/components/context.jsonld"
  ],
  "@id": "http://example.org/myDemo",
  "@type": "MyDemoPlugin",
  "name": "Test Name"
}
```

- this file is required for testing
- use the package name in the `@context` and round the version number to the lowest main version (e.g. not `1.2.3` but `1.0.0`)
- `@id` must contain the URI of the `fno:executes` policy that is used in RDF policies

## Run the demo

```
npm run demo
```
