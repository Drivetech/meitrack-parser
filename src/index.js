'use strict';

import crc from 'crc';
import pad from 'pad';
import moment from 'moment';

const patterns = {
  mvt380: /^\$\$([\x41-\x7A])(\d{1,3}),(\d{15}),([0-9A-F]{3}),(\d{1,3}),([-]?\d+\.\d+),([-]?\d+\.\d+),(\d{12}),([AV]),(\d{1,3}),(\d{1,2}),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+),(\d{3})\|(\d{1,3})\|([0-9A-F]{4})\|([0-9A-F]{4}),([0-9A-F]{4}),([0-9A-F]{1,4})?\|([0-9A-F]{1,4})?\|([0-9A-F]{1,4})?\|([0-9A-F]{1,4})\|([0-9A-F]{1,4}),([0-9A-F]{8})?,?([0-9A-F]+)?,?(\d{1,2})?,?([0-9A-F]{4})?,?([0-9A-F]{6})?\|?([0-9A-F]{6})?\|?([0-9A-F]{6})?\|?\*([0-9A-F]{2})\r\n$/,
  ok: /^\$\$([\x41-\x7A])(\d{1,3}),(\d{15}),([0-9A-F]{3}),OK\*([0-9A-F]{2})\r\n$/
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

const parseCode = (raw) => {
  const match = patterns.ok.exec(raw);
  const code = match[4];
  const codes = {
    C01: 'SETIOSWITCH',
    F09: 'CLEARBUF',
    A12: 'SETGPRSINTERVAL',
    B07: 'SETOVERSPEEDALARM',
    F01: 'RBOOT',
    F02: 'RBOOT'
  };
  const data = {device: 'MEITRACK-COMMAND-OK', type: 'ok', code: code};
  if (Object.keys(codes).indexOf(code) > -1) data.command = codes[code];
  return data;
};

const parse = (raw) => {
  let result = {type: 'UNKNOWN', raw: raw.toString()};
  if (patterns.mvt380.test(raw)) {
    result = getMvt380(raw);
  } else if (patterns.ok.test(raw)) {
    result = parseCode(raw);
  }
  return result;
};

const isMeitrack = (raw) => {
  return patterns.mvt380.test(raw.toString());
};

// Random integer from 65 to 122 (41 to 7a in hex)
const getRandomDataIdentifier = () => {
  const int = Math.floor(Math.random() * (122 - 65 + 1) + 65);
  return String.fromCharCode(int);
};

const getCommand = (imei, command) => {
  const raw1 = `,${imei},${command}*`;
  const raw2 = `@@${getRandomDataIdentifier()}${raw1.length + 4}${raw1}`;
  return `${raw2}${pad(2, crc.crc1(raw2).toString(16).toUpperCase(), '0')}\r\n`;
};

const parseCommand = (data) => {
  let raw, state, port, speed, interval;
  if (/^[1-5]{1}_(on|off|status)$/.test(data.instruction)) {
    [port, state] = data.instruction.split('_');
    let initial = [0, 0, 0, 0, 0];
    const states = {off: 0, on: 1, status: 2};
    initial[port - 1] = states[state];
    speed = data.speed || 0;
    raw = `C01,${speed},${initial.join('')}`;
  } else if (data.instruction === 'clear_mem') {
    raw = 'F09,3';
  } else if (data.instruction === 'set_interval_gprs') {
    interval = data.interval || 6 * 10;
    if (interval < 12) interval = 12;
    let mod = interval % 6;
    if (mod > 0) interval -= mod;
    raw = `A12,${interval}`;
  } else if (/^set_speed_(on|off)(E)?$/.test(data.instruction)) {
    speed = data.speed || 0;
    state = data.instruction.split('_')[2];
    if (state === 'off') speed = 0;
    raw = `B07,${speed}`;
  } else if(data.instruction === 'Custom'){
    raw = data.command;
  } else if (/^reboot_gsm$/.test(data.instruction)) {
    raw = 'F01';
  } else if (/^reboot_gps$/.test(data.instruction)) {
    raw = 'F02';
  }
  return getCommand(data.imei, raw);
};

const getRebootCommand = (imei) => {
  return getCommand(imei, 'F02');
};

module.exports = {
  parse: parse,
  patterns: patterns,
  getMvt380: getMvt380,
  isMeitrack: isMeitrack,
  parseCommand: parseCommand,
  getRebootCommand: getRebootCommand
};
