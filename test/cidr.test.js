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

var CIDR;
var lib;

///--- Helpers

function bc(input) {
  return CIDR.bind(null, input);
}


///--- Tests

test('load library', function (t) {
  lib = require('../ip6addr.js');
  t.ok(lib);
  t.ok(CIDR = lib.createCIDR);
  t.end();
});

test('create - basic', function (t) {
  t.ok(CIDR(lib.parse('dead:beef::'), 64));
  t.ok(CIDR(lib.parse('192.168.0.0'), 24));
  t.end();
});

test('create - parse', function (t) {
  t.ok(CIDR('192.168.0.0/24'));
  t.ok(CIDR('dead:beef::/48'));
  t.throws(bc('bogus'), null, 'bogus string');
  t.throws(bc('192.168.0.0/33'), null, 'long v4 prefix');
  t.throws(bc('dead:beef::/129'), null, 'long v6 prefix');
  t.end();
});

test('contains v4', function (t) {
  var val = CIDR('192.168.0.0/24');
  t.ok(val.contains(lib.parse('192.168.0.0')), 'contains net');
  t.ok(val.contains(lib.parse('192.168.0.1')), 'contains address');
  t.ok(val.contains(lib.parse('192.168.0.255')), 'contains bcast');
  t.ok(val.contains(lib.parse('::ffff:192.168.0.1')), 'contains v4-mapped');
  t.notOk(val.contains(lib.parse('192.168.1.0')));
  t.notOk(val.contains(lib.parse('::c0a8:0001')));
  t.end();
});
