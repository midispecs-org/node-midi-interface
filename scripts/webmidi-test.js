const fetch = require('node-fetch');
const WebMidi = require('webmidi');

let data_url = 'https://gist.githubusercontent.com/therealjeffg/a26d5db021b3a52e790551be616b4b60/raw/39b80f38c4ef092f024900493b0d4c70fa6917aa/instrument_data.json';
  
let instrument_data;
  
fetch(data_url)
  .then(response => response.json())
  .then((data) => {
  instrument_data = data;
  console.log('fetched data!');
});

function scan(midi) {
  console.log("in scan");
  // find ports
  // attach listeners
  _.each(midi.outputs, (_out) => {
    _out.send(240, [126, 127, 6, 1, 247]);
  });
  // send messages
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.
  // a.sort(); b.sort();

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function match_instrument(sysex, data) {
  
  console.log('sysex>', sysex)
  
  //return _.toArray(arguments)
  // if ()
  let _manuId;
  if (sysex.length == 15) {
    // _id = _.
    _manuId = sysex.slice(5, 6);
  }
  else {
    _manuId = sysex.slice(5, 8);
  }
  
  console.log('sysex>', sysex)
  
  console.log(_manuId);
  // Novation peak
  // F0 7E 7F 06 02 00 20 29 7E 00 00 00 00 03 09 07 10 F7
  
  // let s = 'f0 7e 7f 06 02 00 20 29 7e 00 00 00 00 03 09 07 10 f7';
  
  let vendor = _.filter(data, (m) => {
    // console.log('comparing', m.intId, _manuId);
    return arraysEqual(m.intId, _manuId);
  }).shift();
  // return [ _manuId, result ];
  
  let result = _.filter(vendor.models, (model) => {
    // console.log('comparing', sysex, model.arrId);
    return arraysEqual(sysex, model.arrId);
  })
  
  if (result && result.length > 0) {
      return [ result[0], vendor ];    
  }
  else if (!result && vendor) {
    return [false, vendor]
  } else {
    return false;
  }

}

WebMidi.enable(function (err) {
  if (err) {
    console.log("WebMidi could not be enabled.", err);
  } else {
    
    _.each(WebMidi.inputs, (_in) => {
      _in.addListener("sysex", "all", function (e) {
        // 
        console.log(`Got a message on Port ${_in.name}`)
        let strEv = JSON.stringify([].slice.call(e.data));
        let len = e.data.length;
        console.log(`Length: ${len}`, e.data)
        
        if (len >= 15 && e.data[4] === 2) {
          // console.log('Instrument?', e);
          let result = match_instrument(_.toArray(e.data), instrument_data);
          console.log('result', result)          
          if (result) {
            let synth = result[0], vendor = result[1];
            console.log(`Found a ${synth.brand} ${synth.model} on input "${_in.name}"`)
          } else {
            console.log()
          }

        }
        else {
          // console.log('Not instrument? ', e);
        }
      });
    });
    
    $("#scan-btn").click(function (ev) {
      console.log("in click");
      scan(WebMidi);
    });
  }
}, true);
