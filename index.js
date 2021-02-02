const _ = require('lodash');
const midi = require('midi');
const { MIDIPort } = require('./lib/port-mock');

let port = new MIDIPort(midi, {
  name: 'NewName',
  logLevel: 1
});


function listPorts(cb) {
  let inputs = new midi.Input();
  console.log(inputs);
  let count = inputs.getPortCount();
  console.log('count', count);
  let names = _.map(_.range(count), (i) => {
    return inputs.getPortName(i);
  });
  console.log(`Names: ${names}`);
  cb();
}

// Using a single function to handle multiple signals
function handle(signal) {
  console.log(`Exit code ${signal}, closing midi ports.`);
  port.teardown(() => {
    console.log(`Teardown Complete.`);
  });
}

process.once('SIGINT', handle);
process.once('SIGTERM', handle);
process.once('SIGHUP', handle);
process.once('SIGUSR2', handle);
