# create-defaults

A simple generator for creating default files in a directory

## Install

This package should be installed globally or linked using [`npm link`](https://docs.npmjs.com/cli/link)

```
npm install create-defaults --global
```

## Usage

### Create/update all files listed in `.defaults`

```sh
$ defaults
```

### Create/update **specified** file(s)

```sh
$ defaults file-name1 file-name2
```

specified files that aren't in `.defaults` will be ignored

## Configuration File

Configuration settings are determined by the closest `.defaults` file to the current directory

```
{
  "writeFiles": [
    {
      "name": "",
      "value": [],
      "update" true | false
    },
    ...
  ]
}
```

example:

```json
{
  "writeFiles": [
    {
      "name": ".gitignore",
      "value": ["node_modules", ".vscode"],
      "update": true
    },
    {
      "name": "src/components/index.js"
    }
  ]
}
```

- `update: true` will update and override `.gitignore` with default values (should be used with caution)

- `src/components/index.js` will recursively create **`src/`** and **`components/`** (if it doesn't already exist) and then create `index.js`
