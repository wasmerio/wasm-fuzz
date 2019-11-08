#!/bin/sh

tempfile=`mktemp` && cat > ${tempfile}
result=1

trap 'rm -f ${tempfile}; exit ${result}' EXIT TERM ALRM

./target/release/wasmer run ${tempfile}

# Check if we were killed with SIGSEGV
if test $? -eq 101; then
    result=0 # We want this input
fi
