'use strict'

const meitrack = require('../src')
const { expect } = require('chai')
const { describe, it } = require('mocha')

describe('meitrack-parser', () => {
  it('should return the raw data parsed', () => {
    const raw = Buffer.from(
      '$$e155,867965021508656,AAA,35,-33.361133,-70.514245,160412155005,A,8,27,0,289,1.3,867,318379,2338885,730|1|32D3|A03F,0008,0000|0000|0000|02DA|0106,00000001,*3A\r\n'
    )
    const data = meitrack.parse(raw)
    expect(data.raw).to.eql(raw.toString())
    expect(data.manufacturer).to.eql('meitrack')
    expect(data.device).to.eql('MVT380')
    expect(data.type).to.eql('data')
    expect(data.imei).to.eql(867965021508656)
    expect(data.command).to.eql('AAA')
    expect(data.alarm.type).to.eql('Gps')
    expect(data.loc.type).to.eql('Point')
    expect(data.loc.coordinates).to.eql([-70.514245, -33.361133])
    expect(data.datetime).to.eql(new Date('2016-04-12T15:50:05.000Z'))
    expect(data.gpsStatus).to.eql(true)
    expect(data.satellites).to.eql(8)
    expect(data.gsmSignal).to.eql(27)
    expect(data.speed).to.eql(0)
    expect(data.direction).to.eql(289)
    expect(data.hdop).to.eql(1.3)
    expect(data.altitude).to.eql(867)
    expect(data.odometer).to.eql(318379)
    expect(data.runtime).to.eql(2338885)
    expect(data.mcc).to.eql('730')
    expect(data.mnc).to.eql('1')
    expect(data.lac).to.eql(13011)
    expect(data.cid).to.eql(41023)
    expect(data.status.input['1']).to.eql(false)
    expect(data.status.input['2']).to.eql(false)
    expect(data.status.input['3']).to.eql(false)
    expect(data.status.input['4']).to.eql(false)
    expect(data.status.input['5']).to.eql(false)
    expect(data.status.input['6']).to.eql(false)
    expect(data.status.input['7']).to.eql(false)
    expect(data.status.input['8']).to.eql(false)
    expect(data.status.output['1']).to.eql(false)
    expect(data.status.output['2']).to.eql(false)
    expect(data.status.output['3']).to.eql(false)
    expect(data.status.output['4']).to.eql(true)
    expect(data.status.output['5']).to.eql(false)
    expect(data.status.output['6']).to.eql(false)
    expect(data.status.output['7']).to.eql(false)
    expect(data.status.output['8']).to.eql(false)
  })

  it('should return the true in data', () => {
    const raw = Buffer.from(
      '$$A138,862170013556541,AAA,35,7.092076,79.960473,140412132808,A,10,9,57,275,1,14,5783799,7403612,413|1|F6E0|3933,0000,000B|0009||02D8|0122,*EE\r\n'
    )
    const data = meitrack.isMeitrack(raw)
    expect(data).to.eql(true)
  })

  it('should return the true in response', () => {
    const raw = Buffer.from('$$y28,867965021508656,C01,OK*31\r\n')
    const data = meitrack.isMeitrack(raw)
    expect(data).to.eql(true)
  })

  it('should return ok data', () => {
    const raw = Buffer.from('$$j28,353358017784062,F01,OK*19\r\n')
    const data = meitrack.parse(raw)
    expect(data.manufacturer).to.eql('meitrack')
    expect(data.device).to.eql('MEITRACK-COMMAND-OK')
    expect(data.type).to.eql('ok')
    expect(data.code).to.eql('F01')
  })

  it('should return command data', () => {
    const command = {
      instruction: '1_on',
      imei: 353358017784062
    }
    const data = meitrack.parseCommand(command)
    expect(data).to.match(
      /^@@([\x41-\x7A])(\d{1,3}),353358017784062,C01,0,12222\*([0-9A-F]{2})\r\n$/
    )
  })

  it('should return command reboot', () => {
    const data = meitrack.getRebootCommand(353358017784062)
    expect(data).to.match(
      /^@@([\x41-\x7A])(\d{1,3}),353358017784062,F02\*([0-9A-F]{2})\r\n$/
    )
  })

  it('should return null imei', () => {
    const raw = Buffer.from('askdhaskjdhakjdhaksjdhaksjdh')
    const imei = meitrack.getImei(raw)
    expect(imei).to.eql(null)
  })

  it('should return MVT380 imei', () => {
    const raw = Buffer.from(
      '$$e155,867965021508656,AAA,35,-33.361133,-70.514245,160412155005,A,8,27,0,289,1.3,867,318379,2338885,730|1|32D3|A03F,0008,0000|0000|0000|02DA|0106,00000001,*3A\r\n'
    )
    const imei = meitrack.getImei(raw)
    expect(imei).to.eql('867965021508656')
  })
})
