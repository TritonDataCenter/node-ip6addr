/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright 2016, Joyent, Inc.
 */

var test = require('tape').test;


///--- Globals

var parse;


///--- Helpers

function pb(input) {
  return parse.bind(null, input);
}

///--- Tests

test('load library', function (t) {
  parse = require('../ip6addr.js').parse;
  t.ok(parse);
  t.end();
});

test('parse ipv4', function (t) {
  t.ok(parse('2.3.4.5'));
  t.end();
});

test('parse ipv4-mapped', function (t) {
  t.ok(parse('::ffff:10.2.3.4'));
  t.end();
});

test('parse ipv6', function (t) {
  t.ok(parse('::1'));
  t.ok(parse('2001:0db8:85a3::8a2e:370:7334'));
  t.ok(parse('2001:db8:8a2e:370:7334::'));
  t.ok(parse('2001:0db8:85a3:d83f:8a2e:1010:3700:7334'));
  t.ok(parse('de:ad::beef'));
  t.end();
});

test('parse bad', function (t) {
  t.throws(pb({}), null, 'string required');
  t.throws(pb('fd00::40e/64'), null, 'Invalid field value: 40e/64');
  t.throws(pb('fd00::0xc'), null, 'Invalid field value: 0xc');
  t.throws(pb('fd00::0x0'), null, 'Invalid field value: 0x0');
  t.throws(pb('fd00::-0'), null, 'Invalid field value: -0');
  t.throws(pb('1.2.3.4/24'), null, 'Invalid field value: 4/24');
  t.throws(pb('1.2.3.4q'), null, 'Invalid field value: 4q');
  t.throws(pb('1.2.3.0xb'), null, 'Invalid field value: 0xb');
  t.throws(pb('1.2.3.0x0'), null, 'Invalid field value: 0x0');
  t.throws(pb('1.2.3.-0'), null, 'Invalid field value: -0');
  t.throws(pb('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff'), null,
    'input too long');
  t.throws(pb('ff::ff::ff'), null,
    'too many :: delimiters');
  t.throws(pb('ff:::ff'), null, 'bad delimiter');
  t.throws(pb('ff:.'), null, 'bad delimiter');
  t.throws(pb('f:f:f:f:f:f:f:f:f'), null, 'too many fields');
  t.throws(pb('f:f:f:f:f:f:f'), null, 'too few fields');
  t.throws(pb('1.2.3'), null, 'dotted quad (too few)');
  t.throws(pb('1.2.3.4.5'), null, 'dotted quad (too many)');
  t.throws(pb('1:2:3:4:5:6:7:8.9.10.11'), null, 'dotted quad (too much ipv6)');
  t.throws(pb('1:2:3:4:5:8.9.10.11'), null, 'dotted quad (too little ipv6)');
  t.throws(pb('10000::'), null, 'ipv6 field too large');
  t.throws(pb('1.2.3.256'), null, 'ipv4 field too large');
  t.throws(pb('::fffe:1.2.3.4'), null, 'invalid ipv4 mapping');
  t.end();
});

test('parse passthrough', function (t) {
  var val = parse('2.3.4.5');
  t.ok(val);
  t.ok(parse(val));
  t.throws(function () {
    parse({});
  }, null, 'will not parse non-Addr object');
  t.end();
});

test('parse long', function (t) {
  t.ok(parse(0));
  t.equal(parse(2130706433).toString(), '127.0.0.1');
  t.equal(parse(4294967295).toString(), '255.255.255.255');
  t.equal(parse(0).toString(), '0.0.0.0');
  t.equal(parse(3232235522).toString(), '192.168.0.2');

  var strAddr = parse('1.2.3.4');
  var longAddr = parse(16909060);
  t.equal(0, strAddr.compare(longAddr),
      'parsing as string or long should be equivalent');

  t.throws(pb(-1), null, 'negative throws');
  t.throws(pb(4294967296), 'too large throws');
  t.throws(pb(1.5), null, 'float throws');
  t.end();
});

test('parse buffer', function (t) {
  t.ok(parse(0));
  t.equal(parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 0, 0, 1 ])).toString(), '127.0.0.1');
  t.equal(parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255 ])).toString(), '255.255.255.255');
  t.equal(parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ])).toString(), '0.0.0.0');
  t.equal(parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 168, 0, 2 ])).toString(), '192.168.0.2');

  t.equal(parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 127, 0, 0, 1 ])).toString(), '127.0.0.1');
  t.equal(parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255, 255, 255 ])).toString(), '255.255.255.255');
  t.equal(parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 0, 0, 0, 0 ])).toString(), '0.0.0.0');
  t.equal(parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 192, 168, 0, 2 ])).toString(), '192.168.0.2');

  t.equal(parse(Buffer.from([ 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8])).toString(), '1:2:3:4:5:6:7:8');

  t.equal(parse(Buffer.from([ 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toString(), 'ff00::');
  t.equal(parse(Buffer.from([ 0, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toString(), 'ff::');
  t.equal(parse(Buffer.from([ 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toString(), 'ff80::');
  t.equal(parse(Buffer.from([ 255, 128, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toString(), 'ff80:4000::');
  t.equal(parse(Buffer.from([ 255, 128, 64, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])).toString(), 'ff80:4020::');

  var strAddr = parse('1.2.3.4');
  var bufferAddr = parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4 ]));
  t.equal(0, strAddr.compare(bufferAddr), 'parsing as buffer or long should be equivalent');

  var ipv41 = parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 192, 168, 0, 2 ]));
  var ipv42 = parse(Buffer.from([ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 192, 168, 0, 2 ]));
  t.equal(0, ipv41.compare(ipv42), 'parsing a ipv4 representation of a buffer with bytes 11 and 12 equally 0x00 or 0xff should be equivalent');

  var a = parse('32.54.121.2');
  var b = parse(a.toBuffer());
  t.equal(0, a.compare(b), 'should be able to go back and forth between buffer and Addr for ipv4');

  var d = parse('f402:87ab:4::32:393a');
  var e = parse(d.toBuffer());
  t.equal(0, d.compare(e), 'should be able to go back and forth between buffer and Addr for ipv6');

  t.end();
});

