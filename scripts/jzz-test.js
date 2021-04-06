var JZZ = require('jzz');
require('jzz-midi-gear')(JZZ);

function __main(cb) {
  let _out = [];
  JZZ({ sysex:true })
    .or(function(){ console.warn('Cannot start MIDI engine!'); })
    .and(function() {
      var info = this.info();

      // console.log('inputs', info.inputs, 'outputs', info.outputs);

      for ( var i in info.inputs) {
        let _i = i;
        this.openMidiIn(i).connect(function (msg) {
          console.log(`${info.inputs[_i].name} ${msg.isIdResponse()}`, msg.toString());
          _out.push(i, msg)
        });
      }

      for (var i in info.outputs) {
        this.openMidiOut(i).sxIdRequest();
      }
    });

    setTimeout(() => {
      cb(null, _out);
    }, 2000)
}

if (require.main === module) {
  __main((out) => {
    console.log('In callback', out);
  });
  setTimeout(() => {
    // console.log('timeout');
    process.exit();
  }, 1000);
}
module.exports.__main = __main;
