#!/bin/sh

build() {
    cat src/liero.js | minify --js > dist/liero.js.min
}


ensure() {
    if ! "$1" -v minify &> /dev/null
    then
        echo "Command $1 could not be found."
        exit 1
    fi
}

ensure minify
build
