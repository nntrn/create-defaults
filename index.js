#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const { fileExists, createDirectories } = require('./lib/utils')

const settings = require('./lib/settings')

function doSomethingWithFiles(userDefinedFiles = []) {
  if (!settings) return

  var files = settings
  var didUserDefineFiles = false
  var summary = {
    created: [], updated: [], ignored: [], noaction: [],
  }

  if (userDefinedFiles.length > 0) {
    const fileNames = userDefinedFiles.map(e => e.name)
    files = files
      .filter(e => fileNames.indexOf(e.name) > -1)
      .map((f, index) => ({
        ...f, fileName: userDefinedFiles[index].new,
      }))
    didUserDefineFiles = true
  }

  files.forEach(file => {
    if (file.name.slice(-1) === '/') {
      const dirPaths = '.' + path.sep + path.normalize(file.name)
      createDirectories(dirPaths)
      return
    }

    var writeFileName = path.normalize(file.fileName)
    var filePath = path.join(path.resolve(), file.fileName)

    if (file.fileName.indexOf(path.sep)) {
      createDirectories('.' + path.sep + path.dirname(writeFileName))
    }

    summary[
      fileExists(filePath)
        ? file.update || didUserDefineFiles
          ? 'updated'
          : 'ignored'
        : 'created'
    ].push(file.name)

    if (file.update || didUserDefineFiles || !fileExists(filePath)) {
      fs.writeFileSync(filePath, file.template)
    }
  })

  console.log(JSON.stringify(summary, null, 2))
}

function init() {
  const [, , ...args] = process.argv
  const cliForCustomName = '--as'
  const re = new RegExp(`(\\S+\\s${cliForCustomName}\\s\\S+)\\s?`)

  const fileNames = args
    .join(' ')
    .split(re)
    .filter(Boolean)
    .map(f => {
      var names = f.split(' ')
      return {
        name: names[0],
        new: names.slice(-1).toString(),
      }
    })

  doSomethingWithFiles(fileNames)
}

init()
