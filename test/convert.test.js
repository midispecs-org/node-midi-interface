/**
 * tests for the functions used to create the data formats and conventions 
 * in midispecs manufacturere anbd device metadata files.
*/

let { parse, strId, intId, formatName, getStrId, parseModelId, convert } = require('../data/raw/raw2csv');
const _ = require('lodash');

 test('if we can convert some sample data into the rigfht formats', (done) => {
   
  let vendorStr = `5c	Seekers
5f	SD Card Association
7d	(educational)
00 00 01	Time/Warner
00 00 0e	Alesis Studio Electronics`;

  

let modelStr = `f0 7e 7f 06 02 43 00 4c 73 07 00 00 00 00 f7	Yamaha	DTXTREME	Drum Module
f0 7e 00 06 02 47 15 00 19 00 01 01 06 00 f7	Akai	Push	MIDI Controllert
f0 7e 7f 06 02 00 01 0c 03 00 03 00 00 01 01 00 f7	Line 6	Flextone III	Guitar Effects Processor
f0 7e 7f 06 02 00 01 0c 24 00 02 00 63 00 1e 01 f7	Yamaha	THR30II	Guitar Amp
f0 7e 00 06 02 00 01 61 01 00 02 00 00 00 00 00 f7	Livid	Ohm64	MIDI Controller`;

  let vendors = parse(vendorStr, {delimiter: '\t'});
  let models = parse(modelStr, {delimiter: '\t'});

  let _models = _.map(models, (item, i) => {
    return parseModelId(item[0]);
  });

  console.log(convert(vendors, _models));
  done();
 });