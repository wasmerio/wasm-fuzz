# Code coverage

"test coverage is a measure used to describe the degree to which the source code of a program is executed when a particular test suite runs." - [src](https://en.wikipedia.org/wiki/Code_coverage)

# Kcov

Kcov is a code coverage tester for compiled programs, Python scripts and shell scripts. It allows collecting code coverage information from executables without special command-line arguments, and continuously produces output from long-running applications. - [website](https://simonkagstrom.github.io/kcov/) / [github](https://github.com/SimonKagstrom/kcov) / [video](https://www.youtube.com/watch?v=1QMHbp5LUKg)

## Installation

Check the official [INSTALL.md](https://github.com/SimonKagstrom/kcov/blob/master/INSTALL.md#ubuntu)

## How that's works?

Here is the global command:
``` sh
# First, go inside your fuzzing folder
# like fuzz or hfuzz ou afl-fuzz
cd fuzz
# Create a folder for the coverage results
mkdir cov
# Run kcov on your FUZZ_TARGET
kcov ./cov ./target/debug/FUZZ_TARGET corpus/FUZZ_TARGET/*
```

## Example with wasmer

TODO

