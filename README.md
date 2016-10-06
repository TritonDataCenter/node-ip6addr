# ip6addr

ip6addr is a small library for manipulating IP addresses in Javascript.
Inspired by [ipaddr.js](https://github.com/whitequark/ipaddr.js), ip6addr
focuses on better IPv6 support, particularly in cases where IPv4 and IPv6
addresses are used together.

# Installation

    npm install ip6addr

# API

The ip6addr API is designed around three object types: `Addr`, `CIDR` and
`AddrRange`.  These are designed to be immutable once created.  The module
provides public functions for instantiating these objects:

 - parse: Parse an IPv4 or IPv6 address
 - createCIDR: Create a CIDR object
 - createAddrRange: Create an AddrRange object

# License

This Source Code Form is subject to the terms of the Mozilla Public License, v.
2.0.  For the full license text see LICENSE, or http://mozilla.org/MPL/2.0/.

Copyright (c) 2015, Joyent, Inc.
