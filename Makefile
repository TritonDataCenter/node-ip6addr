#
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#

#
# Copyright (c) 2015, Joyent, Inc.
#

NAME:=ip6addr.js

DOC_FILES	 =

TAPE	:= ./node_modules/.bin/tape

JS_FILES	:= $(shell find ip6addr.js test -name '*.js' | grep -v '/tmp/')
JSL_CONF_NODE	 = tools/jsl.node.conf
JSL_FILES_NODE	 = $(JS_FILES)
JSSTYLE_FILES	 = $(JS_FILES)
JSSTYLE_FLAGS	 = -f tools/jsstyle.conf
CLEAN_FILES	 += ./node_modules ./coverage

include ./tools/mk/Makefile.defs
NPM := $(shell which npm)
NPM_EXEC=$(NPM)


VERSION=$(shell json -f $(TOP)/package.json version)
COMMIT=$(shell git describe --all --long  | awk -F'-g' '{print $$NF}')

#
# Targets
#
.PHONY: all
all:
	$(NPM) install

$(TAPE): | $(NPM_EXEC)
	$(NPM) install

.PHONY: test
test: $(TAPE)
	$(NPM) test

include ./tools/mk/Makefile.deps
include ./tools/mk/Makefile.targ
