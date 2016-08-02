# meitrack-parser

[![npm version](https://img.shields.io/npm/v/meitrack-parser.svg?style=flat-square)](https://www.npmjs.com/package/meitrack-parser)
[![npm downloads](https://img.shields.io/npm/dm/meitrack-parser.svg?style=flat-square)](https://www.npmjs.com/package/meitrack-parser)
[![Build Status](https://img.shields.io/travis/lgaticaq/meitrack-parser.svg?style=flat-square)](https://travis-ci.org/lgaticaq/meitrack-parser)
[![Coverage Status](https://img.shields.io/coveralls/lgaticaq/meitrack-parser/master.svg?style=flat-square)](https://coveralls.io/github/lgaticaq/meitrack-parser?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/lgaticaq/meitrack-parser.svg?style=flat-square)](https://codeclimate.com/github/lgaticaq/meitrack-parser)
[![dependency Status](https://img.shields.io/david/lgaticaq/meitrack-parser.svg?style=flat-square)](https://david-dm.org/lgaticaq/meitrack-parser#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/meitrack-parser.svg?style=flat-square)](https://david-dm.org/lgaticaq/meitrack-parser#info=devDependencies)

> Parse raw data from Meitrack devices

## Installation

```bash
npm i -S meitrack-parser
```

## Use

[Try on Tonic](https://tonicdev.com/npm/meitrack-parser)
```js
import meitrack from 'meitrack-parser'

const raw = new Buffer('$$A138,862170013556541,AAA,35,7.092076,79.960473,140412132808,A,10,9,57,275,1,14,5783799,7403612,413|1|F6E0|3933,0000,000B|0009||02D8|0122,*EE\r\n');
const data = meitrack.parse(raw);
/*
{ 
  raw: '$$A138,862170013556541,AAA,35,7.092076,79.960473,140412132808,A,10,9,57,275,1,14,5783799,7403612,413|1|F6E0|3933,0000,000B|0009||02D8|0122,*EE\r\n',
  type: 'data',
  device: 'MVT380',
  imei: 862170013556541,
  command: 'AAA',
  alarm: { type: 'Gps' },
  loc: { type: 'Point', coordinates: [ 79.960473, 7.092076 ] },
  datetime: Sat Apr 12 2014 11:28:08 GMT-0200 (CLST),
  gpsSignal: 'A',
  satellites: 10,
  gsmSignal: 9,
  speed: 57,
  direction: 275,
  hdop: 1,
  altitude: 14,
  odometer: 5783799,
  runtime: 7403612,
  mcc: '413',
  mnc: '1',
  lac: 63200,
  ci: 14643,
  status: { 
    input: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false,
      '6': false,
      '7': false,
      '8': false
    },
    output: {
      '1': false,
      '2': false,
      '3': false,
      '4': false,
      '5': false,
      '6': false,
      '7': false,
      '8': false
    }
  },
  voltage: {
    ad1: 0.064453125,
    ad2: 0.052734375,
    ad3: null,
    battery: 4.265625,
    inputCharge: 13.59375
  }
}
*/
```

## License

[MIT](https://tldrlegal.com/license/mit-license)
