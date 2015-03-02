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


///--- Tests

test('load library', function (t) {
  lib = require('../ip6addr.js');
  t.ok(lib);
  t.ok(CIDR = lib.createCIDR);
  t.end();
});

test('create - basic', function (t) {
  var addr = lib.parse('::1');
  var out = CIDR(addr, 128);
  t.ok(out);
  t.end();
});
