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
  var ipv4comp = [
    ['1.2.3.4', '1.2.3.4', 0],
    ['1.2.3.3', '1.2.3.4', -1],
    ['1.2.3.5', '1.2.3.4', 1],
    ['1.2.3.1', '1.2.3.10', -1],
    ['1.2.3.3', '2.1.1.1', -1],
    ['1.2.3.5', '0.9.9.9', 1],
    ['1.2.3.0', '1.2.2.255', 1],
    ['1.2.255.255', '1.3.0.0', -1],
    ['2.0.0.0', '1.255.255.255', 1]
  ];

  for (var i in ipv4comp) {
    t.equal(compare(parse(ipv4comp[i][0]), parse(ipv4comp[i][1])),
        ipv4comp[i][2], 'compare: ' + ipv4comp[i][0] + ' - ' + ipv4comp[i][1]);
  }

  t.end();
});

test('compare ipv6', function (t) {
  var ipv6comp = [
    ['2001:db8::1', '2001:db8::1', 0],
    ['2001:db8::', '2001:db8::1', -1],
    ['2001:db8::1', '2001:db8::', 1],
    ['::ffff:1.2.3.0', '::ffff:1.2.2.255', 1],
    ['::ffff:8.8.8.8', '::ffff:8.8.7.7', 1],
    ['0:0:0:0:0:ffff:808:808', '0:0:0:0:0:ffff:808:807', 1],
    [' 2001:db8:1:0:0:0:0:0', '2001:db8:0:ffff:ffff:ffff:ffff:ffff', 1]
  ];

  for (var i in ipv6comp) {
    t.equal(compare(parse(ipv6comp[i][0]), parse(ipv6comp[i][1])),
        ipv6comp[i][2], 'compare: ' + ipv6comp[i][0] + ' - ' + ipv6comp[i][1]);
  }

  t.end();
});
