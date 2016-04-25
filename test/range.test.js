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

test('range - create', function (t) {
  t.ok(lib.createAddrRange('fd00::40e', 'fd00::5000'));
  t.ok(lib.createAddrRange('1.2.3.50', '1.2.3.100'));
  t.throws(lib.createAddrRange.bind(null, 'fd00::5000', 'fd00::40e'), null,
    'v6 start comes after end');
  t.throws(lib.createAddrRange.bind(null, '1.2.3.100', '1.2.3.50'), null,
    'v4 start comes after end');
  t.end();
});

test('v6 range', function (t) {
  var range = lib.createAddrRange('fd00::40e', 'fd00::5000');
  t.equal(range.first().toString(), 'fd00::40e');
  t.equal(range.last().toString(), 'fd00::5000');
  t.equal(range.contains(range.first()), true, 'range contains start address');
  t.equal(range.contains(range.last()), true, 'range contains last address');
  var addr = lib.parse('fd00::400f');
  t.equal(range.contains(addr), true, 'range contains ' + addr.toString());
  t.equal(range.contains(addr.toString()), true, 'contains converted string');
  addr = lib.parse('2001:4860:4860::8888');
  t.equal(range.contains(addr), false,
    'range doesn\'t contain ' + addr.toString());
  t.equal(range.contains(addr.toString()), false,
    'doesn\'t contain converted string');
  addr = lib.parse('1.2.3.75');
  t.equal(range.contains(addr), false,
    'range doesn\'t contain ' + addr.toString());
  t.end();
});

test('v4 range', function (t) {
  var range = lib.createAddrRange('1.2.3.50', '1.2.3.100');
  t.equal(range.first().toString(), '1.2.3.50');
  t.equal(range.last().toString(), '1.2.3.100');
  t.equal(range.contains(range.first()), true, 'range contains start address');
  t.equal(range.contains(range.last()), true, 'range contains last address');
  var addr = lib.parse('1.2.3.75');
  t.equal(range.contains(addr), true, 'range contains ' + addr.toString());
  t.equal(range.contains(addr.toString()), true, 'contains converted string');
  addr = lib.parse('10.20.30.40');
  t.equal(range.contains(addr), false,
    'range doesn\'t contain ' + addr.toString());
  t.equal(range.contains(addr.toString()), false,
    'doesn\'t contain converted string');
  addr = lib.parse('2001:4860:4860::8888');
  t.equal(range.contains(addr), false,
    'range doesn\'t contain ' + addr.toString());
  t.end();
});
