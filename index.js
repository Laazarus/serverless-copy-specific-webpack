'use strict';
const fs = require('fs');
class CopySpecificWebPackPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    let test = this.serverless.service;
    console.log('Serverless instance: ', test);
    this.options = options;
    serverless.cli.log(`${JSON.stringify(options)} options received`)
    serverless.cli.log(serverless);
    this.hooks = {
      'after:webpack:package:packExternalModules': this.lookExternalFiles.bind(this)
    }
  }
  // move() {
  //   if (!this.options.not_include) {
  //     try {
  //       this.serverless.cli.log('moving file...');
  //       this.serverless.cli.log(`${this.options.out} moving with options`)
  //       if (!this.options.out) {
  //         this.options.out = ".webpack";
  //       }
  //       this.serverless.cli.log(`${this.options.out}/${this.options.include}`)
  //       fs.createReadStream(`${this.options.include}`).pipe(fs.createWriteStream(`${this.options.out}/${this.options.lambda_folder}/${this.options.include}`)).then(res => {
  //         this.serverless.cli.log('All  good!');
  //         return Promise.resolve("all good")
  //       });
  //     } catch (e) {
  //       this.serverless.cli.log(e.error);
  //     }
  //   } else {
  //     this.serverless.cli.log('no file to be moved...');
  //   }
  // }
  lookExternalFiles() {
    if (!this.options.not_include) {
      if (!this.options.out) {
        this.options.out = ".webpack";
      }
      for (var key in this.serverless.service.functions) {
        if (this.serverless.service.functions.hasOwnProperty(key)) {
          let func = this.serverless.service.functions[key]
          if (func.include) {
            let promises = [];
            let funcPath = func.handler.substring(0, func.handler.lastIndexOf("/"));
            console.log("funcpath", funcPath);
            func.include.forEach(element => {
              let filename = element.substring(element.lastIndexOf("/") + 1);
              console.log(filename);
              promises.push(fs.createReadStream(`${element}`).pipe(fs.createWriteStream(`${this.options.out}/${key}/${funcPath}/${filename}`)))
            });
            return promises;
          }
        }
      }
    } else {
      return new Promise("no extra content to be added to package")
    }
  }
}

module.exports = CopySpecificWebPackPlugin;
