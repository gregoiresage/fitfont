#!/usr/bin/env node
let [,, ...args] = process.argv

const fs  = require('fs')

// Automatically generate files in 'resources' if no output has been defined
if(args.length === 3) {
    var currentPath = process.cwd();
    if (fs.existsSync(currentPath + '/resources/')){
        args.push("-d")
        args.push("resources")
    }
}

require('python-shell').PythonShell.run(__dirname + '/../generate.py', {args}, function (err, results) {
    if (err) {
        console.log(err.message)
    }
    else if (results) {
        results.forEach(message => console.log(message));
    }
    
});