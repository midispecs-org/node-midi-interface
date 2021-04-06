const midi = require('midi');
const _ = require('lodash');
const { MIDIPort } = require('../lib/port-mock');

let portName = 'TestPort', manu = 'Intellijel';

test('MIDIPort', (done) => {
  let port = new MIDIPort({
    logLevel: 1,
    name: portName,
    manufacturer: manu
  });
  
  expect(port.constructor.name).toBe('MIDIPort');
  expect(port.name).toBe(portName);
  expect(port.manufacturer).toBe(manu);
  done();
});

test('Listening', (done) => {
  let port = new MIDIPort(midi, {
    logLevel: 1,
    name: portName+`-${Date.now()}`
  });

  port.listen(() => {
    port.on('log', (...args) => {
      console.log('LOG>', args);
    });

    setTimeout(() => { // 
      // console.log('timeout');
      port.teardown(() => {
        console.log('teardown');
        done();
      })
    }, 500)
  })
});
