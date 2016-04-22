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

test('long\'s kind is ipv4', function (t) {
  var addr = lib.parse(16909060);
  t.equal(addr.kind(), 'ipv4');
  t.end();
});

test('kind ipv6', function (t) {
  var addr = lib.parse('::1');
  t.equal(addr.kind(), 'ipv6');
  addr = lib.parse('ff::');
  t.equal(addr.kind(), 'ipv6');
  addr = lib.parse('::');
  t.equal(addr.kind(), 'ipv6');
  addr = lib.parse('a::b');
  t.equal(addr.kind(), 'ipv6');
  t.end();
});

test('kind ipv4', function (t) {
  var addr = lib.parse('1.2.3.4');
  t.equal(addr.kind(), 'ipv4');
  t.end();
});

test('kind ipv4-mapped', function (t) {
  var addr = lib.parse('::ffff:1.2.3.4');
  t.equal(addr.kind(), 'ipv4');
  t.end();
});
