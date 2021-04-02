const _ = require('lodash');
const midi = require('midi');

let _map;

function getPortByName(name) {
  let _map = getPortMap();

  return _map;
}

function getInputs() {
  let _input = new midi.Input();
  let ins = _input.getPortCount();
  let _ins = {};
  
  _.each(_.range(ins), (_in, i) => {
    let name = _input.getPortName(_in);
    _ins[name] = {in: i, name: name};
  });
  return _ins;
}

function getOutputs() {
  let _output = new midi.Output();
  let _count = _output.getPortCount();
  let _outs = {};
  
  _.each(_.range(_count), (_out, i) => {
    let name = _output.getPortName(_out);
    _outs[name] = {out: i, name: name};
  });
  return _outs;
}

function getPortMap() {
  let _ins = getInputs();
  let _outs = getOutputs();
  return _.merge(_ins, _outs);
}

module.exports.getPortByName = getPortByName;
module.exports.getPortMap = getPortMap;
module.exports.getInputs = getInputs;
module.exports.getOutputs = getOutputs;