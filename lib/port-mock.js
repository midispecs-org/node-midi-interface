const _ = require('lodash');
const { EventEmitter } = require('events');
const midi = require('midi');

class MIDIPort extends EventEmitter {

  // midi request for identity
  idRequest = [ 240, 126, 127, 6, 1, 247 ];

  // states for the object
  states = {
    ERR: 0,
    INIT: 1,
    LISTENING: 2,
    DONE: 3
  };
  

  constructor(options) {
    super();
    // set up IO
    let defaults = {
      logLevel: 0
    }

    this.options = _.mixin(options, defaults);
    this.midi = midi;
    this.devices = {};
    this.idRequest = [ 240, 126, 127, 6, 1, 247 ];

    // options / defaults
    // console.log('options', options);
    this.name = ( options && _.has(options, 'name') ) ? options.name : "Mock MIDI Port";
    this.manufacturer = ( options && _.has(options, 'manufacturer') ) ? options.manufacturer : "Boohringer";
    this.logLevel = ( options && _.has(options, 'logLevel') ) ? options.logLevel : 0;
    
    // create the virtual port
    this.input = new this.midi.Input();
    this.input.ignoreTypes(false, false, true);
    this.output = new this.midi.Output();

    // // handlers?
    this.on('identify', this.identify);

    this.input.on('message', (ts, msg) => {
      this.emit('log', this.name, ts, msg);
      if (this.arraysEqual(this.idRequest, msg)) {
        this.emit('identify', msg);
      }
    });

    this.state = this.states.INIT;
    this.emit('log', `Created MIDI Port called ${this.name}`);
  }

  listen(callback) {
    try {
      this.input.openVirtualPort(this.name);
      this.output.openVirtualPort(this.name);
      this.state = this.states.LISTENING;
      callback(null, true);
    }
    catch(err) {
      throw err;
    }
  }

  identify(msg) {
    if (_.keys(this.devices).length > 0) {
      _.each(this.devices, (device, i) => {
        device.emit('identify', i); // i === channel
      });
    }
  }

  attachDevice(device, channel = 1) {
    if (!parseInt(channel) === channel) { throw `channel arg needs to parse to an int: ${parseInt(channel)} != ${channel}`; }
    let _intChannel = parseInt(channel);
    if (_intChannel < 1 || _intChannel > 16) { `channel arg must be from 1 to 16: ${_intChannel}`; }
    device.on('identity', (id) => {
      this.output.send(id);
    });
    this.devices[_intChannel] = device;
    this.emit('log', `Attached Mock Device ${device.brand} '${device.model}' on port '${this.name}' channel ${channel}`);
    return true;
  }

  arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  __log(...args) {
    if (this.options.logLevel > 0) {
      console.log(`${__log.caller.name}>`, args);
    }
  }

  teardown(cb) {
    this.state = this.states.DONE;
    this.input.closePort();
    this.output.closePort();
    cb(null);
  }
}

module.exports.MIDIPort = MIDIPort;
