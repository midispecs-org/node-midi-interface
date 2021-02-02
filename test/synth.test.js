const midi = require('midi');
const _ = require('lodash');
const { MIDIPort } = require('../lib/port-mock');

var port;

beforeEach(() => {
  port = new MIDIPort(midi);
  // console.log(`Before Synth: ${typeof port}`);
});

afterEach((done) => {
  // console.log(`After Synth: ${typeof port}`);
  port.teardown(done);
});

test('anything at all', (done) => {
  expect(parseInt("1")).toBe(1);
  // console.log(`test Synth: ${typeof port}`);
  done();
});