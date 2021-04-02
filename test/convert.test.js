/**
 * tests for the functions used to create the data formats and conventions 
 * in midispecs manufacturere anbd device metadata files.
*/

let { parse, strId, intId, formatName, getStrId, convert } = require('../data/raw/convert.js');
const _ = require('lodash');

let fixture_dtxtreme, fixture_seekers, fixture_yamaha, vendorStr, modelStr, arrVendors, arrModels;

let _result;

beforeAll(() => {

  fixture_yamaha = {
    id: '43::yamaha',
    rawId: '43',
    name: 'Yamaha',
    intId: [ 67 ],
    // models: [ [Object] ]
  };

  fixture_seekers = {
    id: '5c::seekers',
    rawId: '5c',
    name: 'Seekers',
    intId: [ 92 ],
    models: []
  };

  fixture_alesis = {
    id: '00-00-0e::alesis-studio-electronics',
    rawId: '00 00 0e',
    name: 'Alesis Studio Electronics',
    intId: [ 0, 0, 14 ],
    models: []
  };

  fixture_dtxtreme = {
    rawId: 'f0 7e 7f 06 02 43 00 4c 73 07 00 00 00 00 f7',
    brand: 'Yamaha',
    model: 'DTXTREME',
    type: 'Drum Module',
    arrId: [
      240, 126, 127, 6, 2, 67,
        0,  76, 115, 7, 0,  0,
        0,   0, 247
    ],
    vendorId: [ 67 ],
    strVendorId: '67'
  };

  vendorStr = `43	Yamaha
5c	Seekers
5f	SD Card Association
7d	(educational)
00 00 01	Time/Warner
00 00 0e	Alesis Studio Electronics`;

  

  modelStr = `f0 7e 7f 06 02 43 00 4c 73 07 00 00 00 00 f7	Yamaha	DTXTREME	Drum Module
f0 7e 00 06 02 47 15 00 19 00 01 01 06 00 f7	Akai	Push	MIDI Controllert
f0 7e 7f 06 02 00 01 0c 03 00 03 00 00 01 01 00 f7	Line 6	Flextone III	Guitar Effects Processor
f0 7e 7f 06 02 00 01 0c 24 00 02 00 63 00 1e 01 f7	Yamaha	THR30II	Guitar Amp
f0 7e 00 06 02 00 01 61 01 00 02 00 00 00 00 00 f7	Livid	Ohm64	MIDI Controller`;

  arrVendors = parse(vendorStr, {
    delimiter: "\t"
  });

  arrModels = parse(modelStr, {
    delimiter: "\t"
  });

  _result = convert(arrVendors, arrModels);
});

test('if the yamaha data is correct', (done) => {
  expect(_result[0].id).toEqual(fixture_yamaha.id)
  expect(_result[0].rawId).toEqual(fixture_yamaha.rawId)
  expect(_result[0].intId[0]).toEqual(fixture_yamaha.intId[0])
  expect(_result[0].id).toEqual(fixture_yamaha.id)
  done();
 });

test('the dtxtreme yamaha model', (done) => {
  // console.log(_result[0].models);
  let _model_result = _result[0].models[0]; // should be Yamaha	DTXTREME Drum Module
  expect(_model_result.strVendorId).toEqual(fixture_dtxtreme.strVendorId)
  expect(_model_result.rawId).toEqual(fixture_dtxtreme.rawId)
  expect(_model_result.brand).toEqual(fixture_dtxtreme.brand)
  expect(_model_result.model).toEqual(fixture_dtxtreme.model)
  expect(_model_result.type).toEqual(fixture_dtxtreme.type)
  done();
});

test('if seekers works', (done) => {
  let seekersResult = _result[1];
  expect(seekersResult.id).toEqual(fixture_seekers.id)
  expect(seekersResult.rawId).toEqual(fixture_seekers.rawId)
  expect(seekersResult.intId[0]).toEqual(fixture_seekers.intId[0])
  expect(seekersResult.id).toEqual(fixture_seekers.id)
  done();
 });

 test('if alesis works', (done) => {
  let alesisResult = _result[5];
  expect(alesisResult.id).toEqual(fixture_alesis.id)
  expect(alesisResult.rawId).toEqual(fixture_alesis.rawId)
  expect(alesisResult.intId[0]).toEqual(fixture_alesis.intId[0])
  expect(alesisResult.id).toEqual(fixture_alesis.id)
  done();
});