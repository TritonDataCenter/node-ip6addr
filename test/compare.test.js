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

var parse;
var compare;



///--- Tests

test('load library', function (t) {
  var lib = require('../ip6addr.js');
  t.ok(parse = lib.parse);
  t.ok(compare = lib.compare);
  t.end();
});

test('compare ipv4', function (t) {
  t.equal(compare(parse('1.2.3.4'), parse('1.2.3.4')), 0);
  t.equal(compare(parse('1.2.3.3'), parse('1.2.3.4')), -1);
  t.equal(compare(parse('1.2.3.5'), parse('1.2.3.4')), 1);

  t.equal(compare(parse('1.2.3.3'), parse('2.1.1.1')), -1);
  t.equal(compare(parse('1.2.3.5'), parse('0.9.9.9')), 1);
  t.end();
});

test('compare ipv6', function (t) {
  t.equal(compare(parse('2001:db8::1'), parse('2001:db8::1')), 0);
  t.equal(compare(parse('2001:db8::'), parse('2001:db8::1')), -1);
  t.equal(compare(parse('2001:db8::1'), parse('2001:db8::')), 1);
  t.end();
});
