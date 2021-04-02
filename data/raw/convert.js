const _ = require('lodash');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');
const path = require('path');

// console.log();
function strId(Id) {
  if (_.isString(Id)) { 
    Id = Id.trim();
  } else {
    throw `Lodash claims ${Id} ( ${typeof Id} isn't a string, wtf)`;
  }

  if (Id.length === 2)  {
    // vendor Id is a hex string
    return String(intId(Id).shift());
  }
  else {
    return intId(Id).join('-');
  }
}

function hexId(int) {
  return int.toString(16).padStart(2, '0');
}

/**
 * convert a string of hex values to an array of integers
 */
function intId(hexStr) {
  // console.log(typeof hexStr, hexStr);
  if (String(hexStr).length === 2) {
    return [ parseInt(hexStr, 16) ];
  }
  else {
    return _.map(hexStr.split(' '), (byte) => {
      // 
      return parseInt(byte, 16);
    });
  }
}

function formatName(name) {
  return name.replace(/[\W]/g, ' ').trim().replace(/\ /g, '-').toLowerCase();
}

function getStrId(data) {
  let _hex = hexId(data[0]).split(' ').join('-');
  return `${_hex}::${formatName(data[1])}`;
}

/**
 * get manufacturer id from eg arrId: [
    240, 126, 127,  6,  2, 67,
      0,  68,  43, 25, 16,  0,
      0, 127, 247
  ]
 * @param {Array} arrId 
 */
function getVendorIdFromSysex(arrId) {
   // single byte vendors
   //  DSI Mopho is 14 length for some reason
   // others?
   // Waldorf MWXT is missing byte 4
  // console.log(arrId, arrId.length);
  if (arrId.length <= 15) {
    return [arrId[5]];
  } else if (arrId.length == 17) {
    return arrId.slice(5,8);
  }
}

/**
 * 
 * @param {Array} arr an array of ints that is the result of processing a string of hex values
 */
function sysexToObject(arr) {
  let _ret = {
    status: arr[0]
  }
}

function convert(arrVendors, arrModels) {
  // let _x = _.slice(arrVendors, 81, 91);
  let _models = _.map(arrModels, (item, i) => {
    let _obj = {
      rawId: item[0].trim(),
      brand: item[1], 
      model: item[2],
      type: item[3]
    }
    _obj.arrId = intId(_obj.rawId);
    // console.log(_obj.arrId);
    _obj.strId = item[0].split(' ').join('-').toLowerCase();
    if (_obj.strId === 'f0-7e-06-02-3e-0e-00-0b-00-32-2e-33-33-f7') {
       // XXX Bug: Waldorf Microwave XT is missing the third byte
       _obj.vendorId = [ _obj.arrId[4] ] // 3e | 62
       _obj.strVendorId = _obj.arrId[4].toString();
    }
    else {
      _obj.vendorId = getVendorIdFromSysex(_obj.arrId);
      _obj.strVendorId = _obj.vendorId.join('-');
    }
    return _obj;
  });

  // console.log(_models);
  let _vendors = _.map(arrVendors, (row, i) => {
    let _intId = intId(row[0]);
    let _strId = _intId.join('-');
    let _vModels = _.filter(_.map(_models, (model, i) => {
      // console.log(typeof model.vendorId, typeof _intId);
      if (_.eq(model.strVendorId, _strId)) {
        // console.log(`HIT: ${model.vendorId} :: ${_intId}`);
        return model;
      }
      else {
        // console.log(`MISS: ${model.vendorId} :: ${_intId}`);
        return false;
      }
    }));

    return {
      id: getStrId(row),
      rawId: row[0],
      name: row[1],
      intId: _intId,
      models: _vModels
    }
  });

  // sxIdRequest: function() { return [0xF0, 0x7E, this._sxid, 0x06, 0x01, 0xF7]; },
  // 00  F0 7E 7F 06 01 F7
  // console.log(_models);

  // console.log(_vendors);
  return _vendors;
}

if (require.main === module) {

  let vendors = fs.readFileSync(path.resolve(__dirname, 'manufacturers.txt'));
  let models = fs.readFileSync(path.resolve(__dirname, 'models.txt'));

  // console.log(input.length);

  let arrVendors = parse(vendors, {
    delimiter: "\t"
  })

  let arrModels = parse(models, {
    delimiter: "\t"
  })

  let lengths = _.groupBy(_.map(arrModels, (item, i) => {
    let id = intId(item[0]);
    return { len: id.length, id: id };
  }), 'len');

  // console.log(arrVendors);
  result = convert(arrVendors, arrModels);

  // emit a human-readable JSON doc.
  console.log(JSON.stringify(result, null, '  '));
}

module.exports = {
  convert: convert,
  parse: parse,
  intId: intId,
  strId: strId,
  formatName: formatName,
  getStrId: getStrId,
  getVendorIdFromSysex: getVendorIdFromSysex
}
