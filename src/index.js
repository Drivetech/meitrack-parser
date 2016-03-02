'use strict';

import pad from 'pad';
import moment from 'moment';

const patterns = {
  mvt380: /^\$\$([\x41-\x7A])(\d{1,3}),(\d{15}),([0-9A-F]{3}),(\d{1,3}),([-]?\d+\.\d+),([-]?\d+\.\d+),(\d{12}),([AV]),(\d{1,3}),(\d{1,2}),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+),(\d{3})\|(\d{1,3})\|([0-9A-F]{4})\|([0-9A-F]{4}),([0-9A-F]{4}),([0-9A-F]{1,4})?\|([0-9A-F]{1,4})?\|([0-9A-F]{1,4})?\|([0-9A-F]{1,4})\|([0-9A-F]{1,4}),([0-9A-F]{8})?,?([0-9A-F]+)?,?(\d{1,2})?,?([0-9A-F]{4})?,?([0-9A-F]{6})?\|?([0-9A-F]{6})?\|?([0-9A-F]{6})?\|?\*([0-9A-F]{2})\r\n$/
};

const getEvent = (event) => {
  const events = {
    '1': 'sos',
    '2': 'input2Active',
    '3': 'input3Active',
    '4': 'input4Active',
    '5': 'input5Active',
    '9': 'input1Inactive',
    '10': 'input2Inactive',
    '11': 'input3Inactive',
    '12': 'input4Inactive',
    '13': 'input5Inactive',
    '17': 'lowBattery',
    '18': 'lowExternalBattery',
    '19': 'speeding',
    '20': 'enterGeofence',
    '21': 'exitGeofence',
    '22': 'externalBatteryOn',
    '23': 'externalBatteryCut',
    '24': 'loseGpsSignal',
    '25': 'gpsSignalRecovery',
    '26': 'enterSleep',
    '27': 'exitSleep',
    '28': 'gpsAntennaCut',
    '29': 'deviceReboot',
    '31': 'heartbeat',
    '32': 'headingChange',
    '33': 'distanceIntervalTracking',
    '34': 'replyCurrent',
    '35': 'timeIntervalTracking',
    '36': 'tow',
    '37': 'rfid',
    '39': 'picture',
    '40': 'powerOff',
    '41': 'stopMoving',
    '42': 'startMoving',
    '44': 'gsmJammed',
    '50': 'temperatureHigh',
    '51': 'temperatureLow',
    '52': 'fuelFulled',
    '53': 'fuelEmpty',
    '54': 'fuelStolen',
    '56': 'armed',
    '57': 'disarmed',
    '58': 'stealing',
    '63': 'gsMNoJamming',
    '65': 'pressInput1ToCall',
    '66': 'pressInput2ToCall',
    '67': 'pressInput3ToCall',
    '68': 'pressInput4ToCall',
    '69': 'pressInput5ToCall',
    '70': 'rejectIncomingCall',
    '71': 'getLocationByCall',
    '72': 'autoAnswerIncomingCall',
    '73': 'listenIn',
    '79': 'fall',
    '80': 'install',
    '81': 'dropOff',
    '139': 'maintenance'
  };
  return events[event];
};

const getMvt380 = (raw) => {
  const match = patterns.mvt380.exec(raw.toString());
  const status = match[27].split('').map(x => pad(4, parseInt(x, 10).toString(2), '0')).join('');
  const data = {
    raw: match[0],
    type: 'data',
    device: 'MVT380',
    imei: parseInt(match[3], 10),
    command: match[4],
    event: getEvent(match[5]),
    loc: {
      type: 'Point',
      coordinates: [parseFloat(match[7]), parseFloat(match[6])]
    },
    datetime: moment(`${match[8]}+00:00`, 'YYMMDDHHmmssZ').toDate(),
    gpsSignal: match[9],
    satellites: parseInt(match[10], 10),
    gsmSignal: parseInt(match[11], 10),
    speed: parseFloat(match[12]),
    direction: parseFloat(match[14]),
    hdop: parseFloat(match[16]),
    altitude: parseFloat(match[18]),
    odometer: parseFloat(match[20]),
    runtime: parseInt(match[22], 10),
    mcc: match[23],
    mnc: match[24],
    lac: parseInt(match[25], 16),
    ci: parseInt(match[26], 16),
    status: {
      input: {
        '1': status[8] === '1',
        '2': status[9] === '1',
        '3': status[10] === '1',
        '4': status[11] === '1',
        '5': status[12] === '1',
        '6': status[13] === '1',
        '7': status[14] === '1',
        '8': status[15] === '1'
      },
      output: {
        '1': status[0] === '1',
        '2': status[1] === '1',
        '3': status[2] === '1',
        '4': status[3] === '1',
        '5': status[4] === '1',
        '6': status[5] === '1',
        '7': status[6] === '1',
        '8': status[7] === '1'
      }
    },
    voltage: {
      ad1: match[28] ? (parseInt(match[28], 16) * 6) / 1024 : null,
      ad2: match[29] ? (parseInt(match[29], 16) * 6) / 1024 : null,
      ad3: match[30] ? (parseInt(match[30], 16) * 6) / 1024 : null,
      battery: match[31] ? (parseInt(match[31], 16) * 3 * 2) / 1024 : null,
      inputCharge: match[32] ? (parseInt(match[32], 16) * 3 * 16) / 1024 : null
    }
  };
  return data;
};

const parse = (raw) => {
  let result = {type: 'UNKNOWN', raw: raw.toString()};
  if (patterns.mvt380.test(raw.toString())) {
    result = getMvt380(raw);
  }
  return result;
};

module.exports = {
  parse: parse,
  patterns: patterns,
  getMvt380: getMvt380
};
