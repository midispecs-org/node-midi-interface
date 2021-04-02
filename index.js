const _ = require('lodash');
const midi = require('midi');
const { MIDIPort } = require('./lib/port-mock');
const { Synth } = require('./lib/synth-mock');
const instrument_data = require('./data/instrument_data.json');

const { getPortByName, getInputs, getOutputs, getPortMap } = require('./lib/functions');

// let mopho_data = instrument_data[0];

const sendId = require('./scripts/jzz-test').__main;

let port, mopho_data = {
  rawId: 'f0 7e 00 06 02 01 25 01 00 00 21 00 00 f7',
  strId: 'f0-7e-00-06-02-01-25-01-00-00-21-00-00-f7',
  brand: 'Dave Smith',
  model: 'Mopho',
  type: 'Synth Module',
  arrId: [
    240, 126, 0, 6,  2, 1,
     37,   1, 0, 0, 33, 0,
      0, 247
  ],
  vendorId: [ 1 ],
  strVendorId: '1'
};

// Using a single function to handle multiple signals
function handle(signal) {
  console.log(`Exit code ${signal}, closing midi ports.`);
  port.teardown(() => {
    console.log(`Teardown Complete.`);
  process.exit();
  });
}

if (require.main === module) {

  process.once('SIGINT', handle);
  process.once('SIGTERM', handle);
  process.once('SIGHUP', handle);
  process.once('SIGUSR2', handle);
  
  let fakeMopho = new Synth({device: mopho_data});

  port = new MIDIPort({
    name: 'NewName',
    logLevel: 1
  });

  port.attachDevice(fakeMopho, 1);

  port.listen(() => {
    console.log(getPortMap());
    setTimeout(() => {
      console.log('sending identity request...');
      sendId();
    }, 100);
    
  });  
}
