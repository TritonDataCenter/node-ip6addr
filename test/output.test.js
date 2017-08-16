/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright 2017, Joyent, Inc.
 */

var test = require('tape').test;


///--- Globals

var lib;


///--- Tests

test('load library', function (t) {
  lib = require('../ip6addr.js');
  t.ok(lib);
  t.end();
});

test('output long', function (t) {
  var addr = lib.parse('1.2.3.4');
  t.equal(addr.toLong(), 16909060);
  addr = lib.parse('192.168.0.2');
  t.equal(addr.toLong(),  3232235522);
  addr = lib.parse('255.255.255.255');
  t.equal(addr.toLong(),  4294967295);
  addr = lib.parse('0.0.0.0');
  t.equal(addr.toLong(),  0);
  addr = lib.parse('::1');
  t.throws(addr.toLong.bind(addr), null, 'no long for ipv6');
  t.end();
});

test('output buffer', function (t) {
  var addr = lib.parse('2001:0db8:85a3::8a2e:370:7334');
  var buf = addr.toBuffer();
  t.ok(buf, 'writes new buffer');
  t.ok(addr.toBuffer(buf), 'writes to existing buffer');
  t.throws(addr.toBuffer.bind(addr, {}), null, 'bad buffer input');
  t.end();
});

test('output ipv6', function (t) {
  var addr = lib.parse('::1');
  t.equal(addr.toString(), '::1');
  addr = lib.parse('ff::');
  t.equal(addr.toString(), 'ff::');
  addr = lib.parse('::');
  t.equal(addr.toString(), '::');
  addr = lib.parse('a::b');
  t.equal(addr.toString(), 'a::b');
  t.end();
});

test('output ipv6 (multiple groups of zero)', function (t) {
  var addr = lib.parse('fd00:3:0:0:1:0:0:0');
  t.equal(addr.toString(), 'fd00:3:0:0:1::');
  addr = lib.parse('fd00:3:0:0:1:1:0:0');
  t.equal(addr.toString(), 'fd00:3::1:1:0:0');
  addr = lib.parse('fd00:3:0:0:1:1:1:0');
  t.equal(addr.toString(), 'fd00:3::1:1:1:0');
  t.end();
});

test('output ipv4', function (t) {
  var addr = lib.parse('1.2.3.4');
  t.equal(addr.toString(), '1.2.3.4');
  t.end();
});

test('output ipv4-mapped', function (t) {
  var addr = lib.parse('::ffff:1.2.3.4');
  t.equal(addr.toString(), '::ffff:1.2.3.4');
  t.end();
});

test('output options', function (t) {
  var addr = lib.parse('::ffff:1.2.3.4');
  t.equal(addr.toString({ format: 'v6' }), '::ffff:102:304');
  t.equal(addr.toString({ format: 'v4' }), '1.2.3.4');
  t.equal(addr.toString({ format: 'auto' }), '::ffff:1.2.3.4');
  t.equal(addr.toString({ }), '::ffff:1.2.3.4');
  t.equal(addr.toString({ format: 'v6', zeroElide: false }),
    '0:0:0:0:0:ffff:102:304');
  t.equal(addr.toString({ format: 'v6', zeroElide: true }),
    '::ffff:102:304');
  t.equal(addr.toString({ format: 'v6', zeroPad: true }),
    '::ffff:0102:0304');
  t.equal(addr.toString({ format: 'v6', zeroElide: true, zeroPad: true }),
    '::ffff:0102:0304');
  t.equal(addr.toString({ format: 'v6', zeroElide: false, zeroPad: true }),
    '0000:0000:0000:0000:0000:ffff:0102:0304');
  t.equal(addr.toString({ zeroElide: false, zeroPad: true }),
    '0000:0000:0000:0000:0000:ffff:1.2.3.4');
  t.end();
});
