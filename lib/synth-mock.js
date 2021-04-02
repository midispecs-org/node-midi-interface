const _ = require('lodash');
const { EventEmitter } = require('events');

class Synth extends EventEmitter {
  constructor(options) {
    super();

    if (!_.has(options, 'device')) {
      throw `No device data supplied in options: ${options}`;
    }
    
    this.model = options.device.model;
    this.brand = options.device.brand;
    this.arrId = options.device.arrId;
    this.rawId = options.device.rawId;
    this.strId = options.device.strId;
    this.type = options.device.type;

    this.on('identify', () => {
      this.emit('identity', this.arrId);
    })
  }
}

module.exports.Synth = Synth;
