/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2015, Joyent, Inc.
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
