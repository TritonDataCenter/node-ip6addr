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

var parse;
var compare;
var parseCIDR;
var compareCIDR;



///--- Tests

test('load library', function (t) {
  var lib = require('../ip6addr.js');
  t.ok(parse = lib.parse);
  t.ok(compare = lib.compare);
  t.ok(parseCIDR = lib.createCIDR);
  t.ok(compareCIDR = lib.compareCIDR);
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
    ['2001:db8:1:0:0:0:0:0', '2001:db8:0:ffff:ffff:ffff:ffff:ffff', 1]
  ];

  for (var i in ipv6comp) {
    t.equal(compare(parse(ipv6comp[i][0]), parse(ipv6comp[i][1])),
        ipv6comp[i][2], 'compare: ' + ipv6comp[i][0] + ' - ' + ipv6comp[i][1]);
  }

  t.end();
});

test('compare ipv4 cidr', function (t) {
  var ipv4comp = [
    ['10.0.0.0/24', '180.10.2.0/24', -1],
    ['180.10.2.0/24', '10.0.0.0/24', 1],
    ['10.0.0.0/24', '10.0.0.0/24', 0],
    ['10.0.0.0/25', '10.0.0.0/24', -1],
    ['10.0.0.0/26', '10.0.0.0/24', -2],
    ['10.0.0.0/23', '10.0.0.0/24', 1],
    ['10.0.0.0/23', '10.0.0.0/25', 2],
    ['10.10.0.0/25', '10.0.0.0/24', 1],
    ['10.20.0.0/25', '10.0.0.0/24', 1],
    ['10.0.0.0/25', '10.10.0.0/24', -1],
    ['10.0.0.0/25', '10.20.0.0/24', -1],
    ['10.0.0.0/25', '10.10.0.0/32', -1],
    ['10.0.0.0/25', '10.20.0.0/32', -1]
  ];

  for (var i in ipv4comp) {
    t.equal(compareCIDR(parseCIDR(ipv4comp[i][0]), parseCIDR(ipv4comp[i][1])),
        ipv4comp[i][2], 'cmp cidr: ' + ipv4comp[i][0] + ' - ' + ipv4comp[i][1]);
  }

  t.end();
});

test('compare ipv6 cidr', function (t) {
  var ipv6comp = [
    ['2001:db8::/64', 'fe80:cf1::0/64', -1],
    ['fe80:cf1::0/64', '2001:db8::/64', 1],
    ['2001:db8::/64', '2001:db8::0/64', 0],
    ['2001:db8::/65', '2001:db8::0/64', -1],
    ['2001:db8::/66', '2001:db8::0/64', -2],
    ['2001:db8::/64', '2001:db8::0/65', 1],
    ['2001:db8::/64', '2001:db8::0/66', 2],
    ['2001:eb8::/64', '2001:db8::0/66', 1],
    ['2001:fb8::/64', '2001:db8::0/66', 1],
    ['2001:db8::/64', '2001:eb8::0/66', -1],
    ['2001:db8::/64', '2001:fb8::0/66', -1],
    ['2001:cb8::/64', '2001:db8::0/65', -1]
  ];

  for (var i in ipv6comp) {
    t.equal(compareCIDR(parseCIDR(ipv6comp[i][0]), parseCIDR(ipv6comp[i][1])),
        ipv6comp[i][2], 'cmp cidr: ' + ipv6comp[i][0] + ' - ' + ipv6comp[i][1]);
  }

  t.end();
});

test('bad cidr comparisons', function (t) {
  var cidr = parseCIDR('fd00::/64');
  t.throws(cidr.compare.bind(cidr, {}), null, 'Compared to empty object');
  t.throws(cidr.compare.bind(cidr, 'asdfasdf'), null,
      'Compared to garbage string');
  t.throws(cidr.compare.bind(cidr, true), null,
      'Compared to boolean');
  t.end();
});
