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

test('clone() produces an equivalent address', function (t) {
  var addr1 = lib.parse('1.2.3.4');
  var addr2 = addr1.clone();

  t.deepEqual(addr1, addr2, 'IPv4: addr1 == addr2');
  t.deepEqual(addr1.toString(), addr2.toString(),
    'IPv4: addr1.toString() == addr2.toString()');

  addr1 = lib.parse('::ffff:1.2.3.4');
  addr2 = addr1.clone();

  t.deepEqual(addr1, addr2, 'IPv4 Mapped: addr1 == addr2');
  t.deepEqual(addr1.toString(), addr2.toString(),
    'IPv4 Mapped: addr1.toString() == addr2.toString()');

  addr1 = lib.parse('fd00::40e');
  addr2 = addr1.clone();

  t.deepEqual(addr1, addr2, 'IPv6: addr1 == addr2');
  t.deepEqual(addr1.toString(), addr2.toString(),
    'IPv6: addr1.toString() == addr2.toString()');

  t.end();
});
