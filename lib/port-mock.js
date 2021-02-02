const _ = require('lodash');

class MIDIPort {
  constructor(midi, options) {
    // set up IO
    this.midi = midi;

    // options / defaults
    this.name = ( options && _.has(options, 'name') ) ? options.name : "Mock MIDI Port";
    this.logLevel = ( options && _.has(options, 'logLevel') ) ? options.logLevel : 0;
    
    // create the virtual port
    this.input = new this.midi.Input();
    this.input.openVirtualPort(this.name);
    this.output = new this.midi.Output();
    this.output.openVirtualPort(this.name);

    // handlers?
    this.input.on('message', (ts, msg) => {
      console.log(`${this.name}\t<==\t${ts}\t${msg}`);
    });

    this.__log('LOG', `Created MIDI Port ${this.name}`);
  }

  attachDevice(device, channel) {
    this.devices[channel] = device;
    this.__log('LOG', `Attached Mock Device ${device.name} om port ${channel}`);
    return true;
  }

  __log(type, ...args) {
    if (this.logLevel > 0) {
      console.log(`${type}: ${args.join(' -\t')}`);
    }
  }

  teardown(cb) {
    try {
      this.output.closePort();
      this.input.closePort();
      cb(null);
    } catch(err) {
      throw `Error shutting down MIDIPort: ${err}`;
    }
  }
}

module.exports.MIDIPort = MIDIPort;