#!/bin/sh

port=9999
BODY='{"command":"ls","path":""}'
curl -i -d "$BODY" 127.0.0.1:$port/books

BODY='{"command":"ls","path":"/test"}'
curl -i -d "$BODY" 127.0.0.1:$port/books
