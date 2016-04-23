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

var CIDR;
var lib;

///--- Helpers

function bc(input, plen) {
  return CIDR.bind(null, input, plen);
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
  t.throws(bc('192.168.0.0/16abcd'), null, 'bad v4 prefix');
  t.throws(bc('dead:beef::/64abcd'), null, 'bad v6 prefix');
  t.throws(bc('q192.168.0.0/16'), null, 'bad v4 string');
  t.throws(bc('qdead:beef::/64'), null, 'bad v6 string');
  t.throws(bc(true, 64), null, 'boolean argument');
  t.throws(bc(undefined, 24), null, 'undefined argument');
  t.end();
});

test('create - toString', function (t) {
  var cidr = CIDR('fd00:0045::/64');
  t.equal(cidr.toString(), 'fd00:45::/64');
  t.equal(cidr.toString({ format: 'v6', zeroPad: true }),
    'fd00:0045::/64');
  t.equal(CIDR('fd00:0045::abcd/128').toString(), 'fd00:45::abcd/128');
  cidr = CIDR('192.168.0.0/24');
  t.equal(cidr.toString(), '192.168.0.0/24');
  t.equal(cidr.toString({ format: 'v4' }), '192.168.0.0/24');
  t.equal(cidr.toString({ format: 'auto' }), '192.168.0.0/24');
  t.equal(cidr.toString({ format: 'v4-mapped' }), '::ffff:192.168.0.0/120');
  t.equal(cidr.toString({ format: 'v6' }), '::ffff:c0a8:0/120');
  t.equal(CIDR('192.168.0.5/32').toString(), '192.168.0.5/32');
  t.end();
});

test('create - prefixLength', function (t) {
  var cidr = CIDR('fd00:0045::/64');
  t.equal(cidr.prefixLength(), 64);
  t.equal(cidr.prefixLength('v6'), 64);
  t.equal(cidr.prefixLength('auto'), 64);
  t.throws(cidr.prefixLength.bind(cidr, 'foo'), null,
      'bad format option');
  t.throws(cidr.prefixLength.bind(cidr, 'v4'), null,
      'can\'t format prefix length as v4 length');
  cidr = CIDR('192.168.0.0/24');
  t.equal(cidr.prefixLength(), 24);
  t.equal(cidr.prefixLength('v4'), 24);
  t.equal(cidr.prefixLength('auto'), 24);
  t.equal(cidr.prefixLength('v6'), 120);
  t.throws(cidr.prefixLength.bind(cidr, 'bar'), null,
      'bad format option');
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

test('first/last v4', function (t) {
  var val = CIDR('192.168.0.0/24');
  t.equal(val.first().toString(), '192.168.0.1', 'skip network');
  t.equal(val.last().toString(), '192.168.0.254', 'skip bcast');
  val = CIDR('192.168.0.0/31');
  t.equal(val.first().toString(), '192.168.0.0', 'p2p first');
  t.equal(val.last().toString(), '192.168.0.1', 'p2p last');
  val = CIDR('192.168.0.0/32');
  t.equal(val.first().toString(), '192.168.0.0', 'host first');
  t.equal(val.last().toString(), '192.168.0.0', 'host last');
  t.end();
});

test('first/last v6', function (t) {
  var val = CIDR('2001:db8::/64');
  t.equal(val.first().toString(), '2001:db8::1', 'skip network');
  t.equal(val.last().toString(), '2001:db8::ffff:ffff:ffff:ffff', 'last addr');
  val = CIDR('2001:db8::/127');
  t.equal(val.first().toString(), '2001:db8::', 'p2p first');
  t.equal(val.last().toString(), '2001:db8::1', 'p2p last');
  val = CIDR('2001:db8::/128');
  t.equal(val.first().toString(), '2001:db8::', 'host first');
  t.equal(val.last().toString(), '2001:db8::', 'host last');
  t.end();
});
