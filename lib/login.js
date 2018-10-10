let RegClient = require('npm-registry-client')
let fs = require('fs')
let path = require('path')

// jshint freeze:false
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    if (this === null) {
      throw new TypeError('Array.prototype.findIndex called on null or undefined')
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function')
    }
    let list = Object(this)
    let length = list.length >>> 0
    let thisArg = arguments[1]
    let value

    for (let i = 0; i < length; i++) {
      value = list[i]
      if (predicate.call(thisArg, value, i, list)) {
        return i
      }
    }
    return -1
  }
}
// jshint freeze:true

module.exports = {
  processArguments: function(npmUser, npmPass, npmEmail, npmRegistry, npmScope, quotes, configPath, isStrict) {
    let registry = npmRegistry || 'https://registry.npmjs.org'
    let homePath = process.env.HOME ? process.env.HOME : process.env.USERPROFILE
    let finalPath = configPath ? configPath : path.join(homePath, '.npmrc')
    let hasQuotes = quotes ? quotes : false
    let args = {
      user: npmUser,
      pass: npmPass,
      email: npmEmail,
      registry: registry,
      scope: npmScope,
      quotes: hasQuotes,
      configPath: finalPath,
      isStrict: isStrict,
    }

    return args
  },

  login: function(args, callback) {
    let client = new RegClient({ssl: {strict: args.isStrict}})
    client.adduser(
      args.registry,
      {
        auth: {
          username: args.user,
          password: args.pass,
          email: args.email,
        },
      },
      function(err, data) {
        if (err) {
          return callback(err)
        }
        return callback(null, data)
      }
    )
  },

  readFile: function(args, callback) {
    fs.readFile(args.configPath, 'utf-8', function(err, contents) {
      if (err) {
        contents = ''
      }
      return callback(null, contents)
    })
  },

  generateFileContents: function(args, contents, response) {
    // `contents` holds the initial content of the NPMRC file
    // Convert the file contents into an array
    let lines = contents ? contents.split('\n') : []

    if (args.scope !== undefined) {
      let scopeWrite = lines.findIndex(function(element) {
        if (element.indexOf(args.scope + ':registry=' + args.registry) !== -1) {
          // If an entry for the scope is found, replace it
          element = args.scope + ':registry=' + args.registry
          return true
        }
      })

      // If no entry for the scope is found, add one
      if (scopeWrite === -1) {
        lines.push(args.scope + ':registry=' + args.registry)
      }
    }

    let authWrite = lines.findIndex(function(element, index, array) {
      if (element.indexOf(args.registry.slice(args.registry.search(/\:\/\//, '') + 1) + '/:_authToken=') !== -1) {
        // If an entry for the auth token is found, replace it
        array[index] = element.replace(/authToken\=.*/, 'authToken=' + (args.quotes ? '"' : '') + response.token + (args.quotes ? '"' : ''))
        return true
      }
    })

    // If no entry for the auth token is found, add one
    if (authWrite === -1) {
      lines.push(args.registry.slice(args.registry.search(/\:\/\//, '') + 1) + '/:_authToken=' + (args.quotes ? '"' : '') + response.token + (args.quotes ? '"' : ''))
    }

    let toWrite = lines.filter(function(element) {
      if (element === '') {
        return false
      }
      return true
    })

    return toWrite
  },

  writeFile: function(args, lines) {
    fs.writeFile(args.configPath, lines.join('\n') + '\n')
  },
}
