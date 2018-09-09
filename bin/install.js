#!/usr/bin/env node
const rl = require('readline2').createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('Copy gui files in your resources folder? (Y/n)', (answer) => {
  if(answer !== 'n') {
    const projectDir = process.env.INIT_CWD || require('path').resolve("../../", __dirname)

    const fs  = require('fs')

    if (!fs.existsSync(projectDir + '/resources/')){
      fs.mkdirSync(projectDir + '/resources/')
    }
    
    fs.createReadStream(__dirname + '/../fitfont.gui').pipe(fs.createWriteStream(projectDir + '/resources/fitfont.gui'))
    
    console.log("Files copied!")
  }

  rl.close()
})
