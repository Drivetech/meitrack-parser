# meitrack-parser

[![npm version](https://img.shields.io/npm/v/meitrack-parser.svg?style=flat-square)](https://www.npmjs.com/package/meitrack-parser)
[![npm downloads](https://img.shields.io/npm/dm/meitrack-parser.svg?style=flat-square)](https://www.npmjs.com/package/meitrack-parser)
[![dependency Status](https://img.shields.io/david/lgaticaq/meitrack-parser.svg?style=flat-square)](https://david-dm.org/lgaticaq/meitrack-parser#info=dependencies)
[![Build Status](https://img.shields.io/travis/lgaticaq/meitrack-parser.svg?style=flat-square)](https://travis-ci.org/lgaticaq/meitrack-parser)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/meitrack-parser.svg?style=flat-square)](https://david-dm.org/lgaticaq/meitrack-parser#info=devDependencies)
[![Join the chat at https://gitter.im/lgaticaq/meitrack-parser](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square)](https://gitter.im/lgaticaq/meitrack-parser?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Parse raw data from Meitrack devices

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
```
