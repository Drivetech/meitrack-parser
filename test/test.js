'use strict';

import meitrack from '../lib';
import {expect} from 'chai';

describe('meitrack-parzer', () => {
  describe('parse', () => {
    it('should return the raw data parsed', () => {
      const raw = new Buffer('$$A138,862170013556541,AAA,35,7.092076,79.960473,140412132808,A,10,9,57,275,1,14,5783799,7403612,413|1|F6E0|3933,0000,000B|0009||02D8|0122,*EE\r\n');
      const data = meitrack.parse(raw);
      expect(data.raw).to.eql(raw.toString());
      expect(data.device).to.eql('MVT380');
      expect(data.type).to.eql('data');
      expect(data.imei).to.eql(862170013556541);
      expect(data.command).to.eql('AAA');
      expect(data.event).to.eql('timeIntervalTracking');
      expect(data.loc.type).to.eql('Point');
      expect(data.loc.coordinates).to.eql([79.960473, 7.092076]);
      expect(data.datetime).to.eql(new Date('2014-04-12T13:28:08.000Z'));
      expect(data.gpsSignal).to.eql('A');
      expect(data.satellites).to.eql(10);
      expect(data.gsmSignal).to.eql(9);
      expect(data.speed).to.eql(57);
      expect(data.direction).to.eql(275);
      expect(data.hdop).to.eql(1);
      expect(data.altitude).to.eql(14);
      expect(data.odometer).to.eql(5783799);
      expect(data.runtime).to.eql(7403612);
      expect(data.mcc).to.eql('413');
      expect(data.mnc).to.eql('1');
      expect(data.lac).to.eql(63200);
      expect(data.ci).to.eql(14643);
      expect(data.status.input['1']).to.be.false;
      expect(data.status.input['2']).to.be.false;
      expect(data.status.input['3']).to.be.false;
      expect(data.status.input['4']).to.be.false;
      expect(data.status.input['5']).to.be.false;
      expect(data.status.input['6']).to.be.false;
      expect(data.status.input['7']).to.be.false;
      expect(data.status.input['8']).to.be.false;
      expect(data.status.output['1']).to.be.false;
      expect(data.status.output['2']).to.be.false;
      expect(data.status.output['3']).to.be.false;
      expect(data.status.output['4']).to.be.false;
      expect(data.status.output['5']).to.be.false;
      expect(data.status.output['6']).to.be.false;
      expect(data.status.output['7']).to.be.false;
      expect(data.status.output['8']).to.be.false;
    });
  });
});
