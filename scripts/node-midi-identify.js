const midi = require('midi');

idRequest = [ 240, 126, 127, 6, 1, 247 ];

let _out = new midi.Output();
let _in = new midi.input();

_in.openVirtualPort('my port');
_out.openVirtualPort('my port');

_in.on('message', (ts, msg) => {
  console.log('message', msg);
})

function sendId(callback) {
  console.log('timeout');
  _out.sendMessage(idRequest);

  callback(null);
}

if (require.main === module) {
  console.log('sending');
  sendId(() => {
    console.log('in callback');
    // _out.closePort();
    // _in.closePort();
  });
}


