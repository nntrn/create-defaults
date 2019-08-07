#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const os = require('os')
const home = os.homedir()

const defaultsFileName = '.defaults'
const cwd = path.parse(process.cwd())

/* helpers ********************************************/

function fileExists(filepath) {
  try {
    fs.lstatSync(filepath)
    return true
  } catch (e) {
    return false
  }
}

function createDirectories(createPath) {
  fs.mkdirSync(createPath, { recursive: true }, err => {
    if (err) throw err
  })
}

/* main functions ********************************************/

function findDefaultsFile() {
  const dirs = cwd.dir.split(path.sep)

  var newCwd = process.cwd()
  var settings = {}

  // iteratively find .defaults file starting in the current working directory
  for (let e in dirs) {
    var defaultsPath = path.join(newCwd, defaultsFileName)
    if (fileExists(defaultsPath)) {
      settings = JSON.parse(fs.readFileSync(defaultsPath))
      console.log(`\n### defaults taken from ###\n${newCwd}\n`)
      break
    }
    // go up one directory
    newCwd = path.dirname(newCwd)

    if (newCwd === path.dirname(home)) {
      console.log(`\ndid not find ${defaultsFileName} file`)
      break
    }
  }
  return settings
}

// if userDefinedFiles is not empty, then only these files are created/updated
function doSomethingWithFiles(settings, userDefinedFiles = []) {
  if (!settings.writeFiles) return

  var files = [...settings.writeFiles]
  var didUserDefineFiles = false
  var summary = { created: [], updated: [], ignored: [], noaction: [] }

  if (userDefinedFiles.length > 0) {
    files = files.filter(e => userDefinedFiles.indexOf(e.name) > -1)
    didUserDefineFiles = true
  }

  files.forEach(file => {
    if (file.name && file.name.slice(-1) !== '/') {
      var fileValue = file.value || []
      var writeFileName = path.normalize(file.name)
      var filePath = path.join(path.resolve(), writeFileName)

      if (file.name.indexOf(path.sep))
        createDirectories('.' + path.sep + path.dirname(writeFileName))

      summary[
        fileExists(filePath)
          ? file.update || didUserDefineFiles
            ? 'updated'
            : 'ignored'
          : 'created'
      ].push(file.name)

      if (file.update || didUserDefineFiles || !fileExists(filePath))
        fs.writeFileSync(filePath, fileValue.join('\n'))
    }
  })

  console.log(`\n### summary ###\n${JSON.stringify(summary, null, 2)}`)
}

/* run ********************************************/

function init() {
  const [, , ...args] = process.argv
  doSomethingWithFiles(findDefaultsFile(), args)
}

init()
