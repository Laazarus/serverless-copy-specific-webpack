'use strict';
const fs = require('fs');
class CopySpecificWebPackPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    let test =this.serverless.providers.service;
    console.log('Serverless instance: ', test);
    this.options = options;
    serverless.cli.log(`${JSON.stringify(options)} options received`)
    serverless.cli.log(serverless);
    this.hooks = {
      'after:webpack:package:packExternalModules': this.move.bind(this)
    }
  }

  move() {

    if (this.options.include) {
      try {
        this.serverless.cli.log('moving file...');
        this.serverless.cli.log(`${this.options.out} moving with options`)
        if (!this.options.out) {
          this.options.out = ".webpack";
        }
        this.serverless.cli.log(`${this.options.out}/${this.options.include}`)
         fs.createReadStream(`${this.options.include}`).pipe(fs.createWriteStream(`${this.options.out}/${this.options.include}`)).then(res => {
          this.serverless.cli.log('All  good!');
          return Promise.resolve("all good")
        });
      } catch (e) {
        this.serverless.cli.log(e.error);
      }
    }else{
      this.serverless.cli.log('no file to be moved...');
    }
  }

}

module.exports = CopySpecificWebPackPlugin;
