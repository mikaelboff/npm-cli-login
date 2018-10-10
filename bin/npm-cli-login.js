#!/usr/bin/env node

let getArg = function(marker, isBoolean) {
  let pos = process.argv.indexOf(marker)
  return pos === -1 ? -1 : isBoolean ? pos : pos + 1
}

let login = function() {
  let found = getArg('-u', false)
  let user = found === -1 ? process.env.NPM_USER : process.argv[found]

  found = getArg('-p', false)
  let pass = found === -1 ? process.env.NPM_PASS : process.argv[found]

  found = getArg('-e', false)
  let email = found === -1 ? process.env.NPM_EMAIL : process.argv[found]

  found = getArg('-r', false)
  let registry = found === -1 ? process.env.NPM_REGISTRY : process.argv[found]

  found = getArg('-s', false)
  let scope = found === -1 ? process.env.NPM_SCOPE : process.argv[found]

  found = getArg('--config-path', false)
  let configPath = found === -1 ? process.env.NPM_RC_PATH : process.argv[found]

  found = getArg('--quotes', true)
  let quotes = found === -1 ? false : true

  found = getArg('--strict', true)
  let isStrict = found === -1 ? true : false

  require('../')(user, pass, email, registry, scope, quotes, configPath, isStrict)
}

login()
