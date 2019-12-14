const fs = require('fs')
const { homedir } = require('os')

exports.fileExists = function (filepath) {
  try {
    fs.lstatSync(filepath)
    return true
  } catch (e) {
    return false
  }
}

exports.createDirectories = function (createPath) {
  fs.mkdirSync(createPath, { recursive: true }, err => {
    if (err) throw err
  })
}

exports.homedir = homedir
