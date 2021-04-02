const midi = require('midi');
const _ = require('lodash');
const { MIDIPort } = require('../lib/port-mock');

let portName = 'TestPort';

test('MIDIPort', (done) => {
  let port = new MIDIPort({
    logLevel: 1,
    name: portName+`-${Date.now()}`
  });
  
  expect(port.constructor.name).toBe('MIDIPort');
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
