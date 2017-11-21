'use strict';

const crc = require('crc');
const pad = require('pad');

const patterns = {
  mvt380: /^\$\$([\x41-\x7A])(\d{1,3}),(\d{15}),([0-9A-F]{3}),(\d{1,3}),([-]?\d+\.\d+),([-]?\d+\.\d+),(\d{12}),([AV]),(\d{1,3}),(\d{1,2}),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+(\.\d+)?),(\d+),(\d{3})\|(\d{1,3})\|([0-9A-F]{4})\|([0-9A-F]{4}),([0-9A-F]{4}),([0-9A-F]{1,4})?\|([0-9A-F]{1,4})?\|([0-9A-F]{1,4})?\|([0-9A-F]{1,4})\|([0-9A-F]{1,4}),([0-9A-F]{8})?,?([0-9A-F]+)?,?(\d{1,2})?,?([0-9A-F]{4})?,?([0-9A-F]{6})?\|?([0-9A-F]{6})?\|?([0-9A-F]{6})?\|?\*([0-9A-F]{2})\r\n$/,
  ok: /^\$\$([\x41-\x7A])(\d{1,3}),(\d{15}),([0-9A-F]{3}),OK\*([0-9A-F]{2})\r\n$/
};

const parseAlrm = event => {
  const alarms = {
    '1': {type: 'SOS_Button'},
    '2': {type: 'DI', number: 2, status: true},
    '3': {type: 'DI', number: 3, status: true},
    '4': {type: 'DI', number: 4, status: true},
    '5': {type: 'DI', number: 5, status: true},
    '9': {type: 'DI', number: 1, status: false},
    '10': {type: 'DI', number: 2, status: false},
    '11': {type: 'DI', number: 3, status: false},
    '12': {type: 'DI', number: 4, status: false},
    '13': {type: 'DI', number: 5, status: false},
    '17': {type: 'DI', number: 2, status: false},
    '18': {type: 'lowExternalBattery'},
    '19': {type: 'Over_Speed', status: true},
    '20': {type: 'Geo_Fence', status: true},
    '21': {type: 'Geo_Fence', status: false},
    '22': {type: 'Charge', status: true},
    '23': {type: 'Charge', status: false},
    '24': {type: 'gpsSignal', status: false},
    '25': {type: 'gpsSignal', status: true},
    '26': {type: 'Sleep', status: true},
    '27': {type: 'Sleep', status: false},
    '28': {type: 'gpsAntennaCut'},
    '29': {type: 'deviceReboot'},
    '31': {type: 'Heartbeat'},
    '32': {type: 'Angle'},
    '33': {type: 'distanceIntervalTracking'},
    '34': {type: 'replyCurrent'},
    '35': {type: 'Gps'},
    '36': {type: 'tow'},
    '37': {type: 'Rfid'},
    '39': {type: 'picture'},
    '40': {type: 'powerOff'},
    '41': {type: 'Moving', status: false},
    '42': {type: 'Moving', status: true},
    '44': {type: 'jamming', status: true},
    '50': {type: 'temperature', status: true},
    '51': {type: 'temperature', status: false},
    '52': {type: 'fuelFulled'},
    '53': {type: 'fuelEmpty'},
    '54': {type: 'fuelStolen'},
    '56': {type: 'armed'},
    '57': {type: 'disarmed'},
    '58': {type: 'stealing'},
    '63': {type: 'jamming', status: false},
    '65': {type: 'pressInput1ToCall'},
    '66': {type: 'pressInput2ToCall'},
    '67': {type: 'pressInput3ToCall'},
    '68': {type: 'pressInput4ToCall'},
    '69': {type: 'pressInput5ToCall'},
    '70': {type: 'rejectIncomingCall'},
    '71': {type: 'getLocationByCall'},
    '72': {type: 'autoAnswerIncomingCall'},
    '73': {type: 'listenIn'},
    '79': {type: 'fall'},
    '80': {type: 'install'},
    '81': {type: 'dropOff'},
    '139': {type: 'maintenance'}
  };
  return event in alarms ? alarms[event] : null;
};

const getMvt380 = raw => {
  const match = patterns.mvt380.exec(raw);
  const status = match[27].split('').map(x => pad(4, parseInt(x, 10).toString(2), '0')).join('');
  const data = {
    raw: match[0],
    type: 'data',
    manufacturer: 'meitrack',
    device: 'MVT380',
    imei: parseInt(match[3], 10),
    command: match[4],
    alarm: parseAlrm(match[5]),
    loc: {
      type: 'Point',
      coordinates: [parseFloat(match[7]), parseFloat(match[6])]
    },
    datetime: new Date(match[8].replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '20$1-$2-$3T$4:$5:$6.000Z')),
    gpsStatus: match[9] === 'A',
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
    cid: parseInt(match[26], 16),
    status: {
      output: {
        '1': status[15] === '1',
        '2': status[14] === '1',
        '3': status[13] === '1',
        '4': status[12] === '1',
        '5': status[11] === '1',
        '6': status[10] === '1',
        '7': status[9] === '1',
        '8': status[8] === '1'
      },
      input: {
        '1': status[7] === '1',
        '2': status[6] === '1',
        '3': status[5] === '1',
        '4': status[4] === '1',
        '5': status[3] === '1',
        '6': status[2] === '1',
        '7': status[1] === '1',
        '8': status[0] === '1'
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

const parseCode = raw => {
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
  const data = {
    manufacturer: 'meitrack',
    device: 'MEITRACK-COMMAND-OK',
    type: 'ok',
    code: code
  };
  if (Object.keys(codes).indexOf(code) > -1) data.command = codes[code];
  return data;
};

const parse = raw => {
  let result = {type: 'UNKNOWN', raw: raw.toString()};
  if (patterns.mvt380.test(raw)) {
    result = getMvt380(raw);
  } else if (patterns.ok.test(raw)) {
    result = parseCode(raw);
  }
  return result;
};

const isMeitrack = raw => {
  let result = false;
  if (patterns.mvt380.test(raw)) {
    result = true;
  } else if (patterns.ok.test(raw)) {
    result = true;
  }
  return result;
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

const parseCommand = data => {
  let raw, state, port, speed, interval;
  if (/^[1-5]{1}_(on|off|status)$/.test(data.instruction)) {
    let _data = data.instruction.split('_');
    port = _data[0];
    state = _data[1];
    let initial = [2, 2, 2, 2, 2];
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

const getRebootCommand = imei => {
  return getCommand(imei, 'F02');
};

const getImei = raw => {
  let imei = null;
  const data = raw.toString();
  if (patterns.mvt380.test(data)) {
    imei = patterns.mvt380.exec(data)[3];
  }
  return imei;
};

module.exports = {
  parse: parse,
  patterns: patterns,
  getMvt380: getMvt380,
  isMeitrack: isMeitrack,
  parseCommand: parseCommand,
  getRebootCommand: getRebootCommand,
  getImei: getImei
};
