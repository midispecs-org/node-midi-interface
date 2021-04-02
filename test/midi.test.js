const { output } = require('midi');
const midi = require('midi');
const { MIDIPort } = require('../lib/port-mock');

let port;

beforeAll(() => {
  port = new MIDIPort({
    logLevel: 1,
    name: "portName"
  });

  port.listen(() => {
    console.log('listening?');
  });
});

test('listening...', (done) => {
  expect(port.constructor.name).toBe('MIDIPort');
  done();
});

afterAll(() => {
  port.teardown(() => {
    console.log('done?');
  });
})
