'use strict';

import parser from '../lib';
import {expect} from 'chai';

describe('tz-parzer', () => {
  describe('parse', () => {
    it('should return the raw data parsed', (done) => {
      const raw = new Buffer('$$A138,862170013556541,AAA,35,7.092076,79.960473,140412132808,A,10,9,57,275,1,14,5783799,7403612,413|1|F6E0|3933,0000,000B|0009||02D8|0122,*EE\r\n');
      parser.parse(raw).then(data => {
        expect(data.raw).to.eql(raw.toString());
        expect(data.type).to.eql('MVT380');
        expect(data.imei).to.eql(862170013556541);
        expect(data.command).to.eql('AAA');
        expect(data.event).to.eql('timeIntervalTracking');
        expect(data.loc.type).to.eql('Point');
        expect(data.loc.coordinates).to.eql([79.960473, 7.092076]);
        expect(data.datetime).to.be.a.date;
        expect(gpsSignal).to.eql('A');
        expect(satellites).to.eql(10);
        expect(gsmSignal).to.eql(9);
        expect(speed).to.eql(57);
        expect(direction).to.eql(275);
        expect(hdop).to.eql(1);
        expect(altitude).to.eql(14);
        expect(odometer).to.eql(5783799);
        expect(runtime).to.eql(7403612);
        expect(mcc).to.eql('413');
        expect(mnc).to.eql('1');
        expect(lac).to.eql(63200);
        expect(ci).to.eql(14643);
        expect(status.input['1'].to.be.false;
        expect(status.input['2'].to.be.false;
        expect(status.input['3'].to.be.false;
        expect(status.input['4'].to.be.false;
        expect(status.input['5'].to.be.false;
        expect(status.input['6'].to.be.false;
        expect(status.input['7'].to.be.false;
        expect(status.input['8'].to.be.false;
        expect(status.output['1'].to.be.false;
        expect(status.output['2'].to.be.false;
        expect(status.output['3'].to.be.false;
        expect(status.output['4'].to.be.false;
        expect(status.output['5'].to.be.false;
        expect(status.output['6'].to.be.false;
        expect(status.output['7'].to.be.false;
        expect(status.output['8'].to.be.false;
        done();
      }).catch(err => {
        expect(err).to.be.undefined;
        done();
      });
    });
  });
});
