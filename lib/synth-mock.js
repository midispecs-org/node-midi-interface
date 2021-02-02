const _ = require('lodash');
const { EventEmitter } = require('events');

class Synth extends EventEmitter {

  constructor(options) {
    super();
    this.name = _.has(options, 'name') ? options.name : "Blofeld";

    this.on('input', (ts, message) => {
      this.__handleEvent(ts, message);
    })
  }

  __handleEvent(ts, message) {
    console.log();
  }



  

}

module.exports.Synth = Synth;