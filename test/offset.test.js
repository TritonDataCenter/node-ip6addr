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

var lib;


///--- Tests

test('load library', function (t) {
  lib = require('../ip6addr.js');
  t.ok(lib);
  t.end();
});

function v4offset(t, ip, offset) {
  var addr = lib.parse(ip);
  var addrResult = addr.offset(offset).toString();
  var longResult = lib.parse(addr.toLong() + offset).toString();
  t.equal(addrResult, longResult, addr.toString() + ' + (' + offset + ') = '
    + longResult);
}

test('positive offsets', function (t) {
  var addr = lib.parse('1.2.3.4');
  t.equal(addr.offset(20).toString(), '1.2.3.24');
  addr = lib.parse('2234::101');
  t.equal(addr.offset(0x2134).toString(), '2234::2235');
  v4offset(t, '0.0.0.0', 0xffffffff);
  t.end();
});

test('negative offsets', function (t) {
  var addr = lib.parse('ebcd:789::203:6825');
  t.equal(addr.offset(-0x6724).toString(), 'ebcd:789::203:101');
  v4offset(t, '1.2.3.205', -28);
  addr = lib.parse('255.255.255.255');
  v4offset(t, addr, -0xffff);
  t.end();
});

test('offset group overflows', function (t) {
  var addr = lib.parse('1.2.3.205');
  v4offset(t, addr, 100);
  v4offset(t, addr, 0xffff);
  v4offset(t, '254.255.255.254', 2);
  v4offset(t, '0.255.255.255', 4278190080);
  addr = lib.parse('255.255.255.255');
  t.equal(addr.offset(1), null);
  t.throws(addr.offset.bind(addr, 4294967296), null,
    'too large positive offset');
  addr = lib.parse('ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff');
  t.equal(addr.offset(1), null);
  t.end();
});

test('offset group underflows', function (t) {
  var addr = lib.parse('1.3.3.204');
  v4offset(t, addr, -0xffff);
  addr = lib.parse('ebcd:789::203:6825');
  t.equal(addr.offset(-0x6724).toString(), 'ebcd:789::203:101');
  addr = lib.parse('255.255.255.255');
  v4offset(t, addr, -4278190080);
  v4offset(t, addr, -0x1fffe);
  v4offset(t, addr, -0x1ffff);
  v4offset(t, addr, -0x1ffff);
  v4offset(t, addr, -0xffffffff);
  t.throws(addr.offset.bind(addr, -4294967296), null,
    'too large negative offset');
  addr = lib.parse('::');
  t.equal(addr.offset(-1), null);
  addr = lib.parse('0.0.0.0');
  t.equal(addr.offset(-1), null);
  t.end();
});
