const midi = require('midi');
const _ = require('lodash');
const { MIDIPort } = require('../lib/port-mock');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { Synth } = require('../lib/synth-mock');

const sendId = require('../scripts/jzz-test').__main;


function sendIdRequest(callback) {
  let scriptPath = path.resolve(__dirname, '../scripts/jzz-test.js');
  let handle = spawn('node', [ scriptPath ]);
  let _output = {
    out: '',
    err: '',
    exit: null
  };
  handle.stdout.on('data', (data) => {
    // console.log(`stdout: ${data}`);
    _output.out += data;
  });
  
  handle.stderr.on('data', (data) => {
    // console.error(`stderr: ${data}`);
    _output.err += data;
  });
  
  handle.on('close', (code) => {
    // console.log(`child process exited with code ${code}`);

    _output.exit = code;
    if (code > 0) {
      throw `Error running child process script: ${code} ${_output.err}}`;
    } 
    callback(_output.err, _output);
  });
}

var port;

// beforeAll(() => {
//   return new Promise((resolve, reject) => {
//     resolve(true);
//   });
// });

let mopho = {
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

beforeEach(() => {
  port = new MIDIPort();
});

afterEach(() => {
  // console.log(`After Synth: ${typeof port}`);
  port.teardown(() => {
    // console.log('afterEach teardown?');
  });
});

test('the synth object', (done) => {
  let _synth = new Synth({device: mopho});
  expect(_.has(_synth, 'model')).toBe(true);
  expect(_.has(_synth, 'brand')).toBe(true);
  expect(_.has(_synth, 'arrId')).toBe(true);
  expect(_.has(_synth, 'rawId')).toBe(true);
  expect(_.has(_synth, 'strId')).toBe(true);
  expect(_.has(_synth, 'type')).toBe(true);  
  // console.log(`test Synth: ${typeof port}`);
  done();
});

test('attaching the synth to the port', (done) => {
  let _synth = new Synth({device: mopho});
  port.attachDevice(_synth, 1);
  expect(_.has(port, 'devices')).toBe(true);
  expect(_.has(port.devices, '1')).toBe(true);
  done();
});

test('events', (done) => {
  let _synth = new Synth({device: mopho});
  _synth.on('identity', (result) => {
    // console.log('result>', result);

    expect(result.length).toEqual(14);
    expect(port.arraysEqual(result, mopho.arrId));

    done();
  })

  _synth.emit('identify');
});

test('identify loop', (done) => {
  let _synth = new Synth({device: mopho});

  port.attachDevice(_synth, 2);

  port.listen(() => {
    setTimeout(() => {
      sendIdRequest((err, result) => {
        // console.log('sendIdRequest callback', err, result);
        if (err) throw err;
        // console.log(result);
        expect(result.out.trim()).toEqual('Mock MIDI Port true f0 7e 00 06 02 01 25 01 00 00 21 00 00 f7')
        expect(result.exit).toEqual(0);
        expect(result.err.length).toEqual(0);
        done();
      })
    }, 2000)
  });
});