var fs = require('fs')
var path = require('path')

var { fileExists, homedir } = require('./utils')

var defaultsFileName = '.defaults'

function joinPath(dirPath) {
  return dirPath.join(path.sep)
}

function findSettingsFile() {
  var dirs = process.cwd().split(path.sep)
  var settings = {}
  var stopLooking = false
  var defaultsPath = path.join(joinPath(dirs), defaultsFileName)

  while (!stopLooking) {
    defaultsPath = path.join(joinPath(dirs), defaultsFileName)

    if (joinPath(dirs) === homedir) {
      stopLooking = true
    }
    if (fileExists(defaultsPath)) {
      console.log(`defaults settings taken from: ${defaultsPath}`)
      settings = JSON.parse(fs.readFileSync(defaultsPath))
      stopLooking = true
    } else {
      dirs.pop()
    }
  }

  return settings
}

function modifySettings() {
  const settings = findSettingsFile()
  const newSettings = settings.writeFiles.map(e => ({
    ...e,
    template: Array.isArray(e.value) ? e.value.join('\n') : (e.value || ''),
    fileName: e.name,
  }))

  console.log(newSettings)
  return newSettings
}
// findSettingsFile()
module.exports = modifySettings()
