# Code coverage

"test coverage is a measure used to describe the degree to which the source code of a program is executed when a particular test suite runs." - [src](https://en.wikipedia.org/wiki/Code_coverage)

# Kcov

Kcov is a code coverage tester for compiled programs, Python scripts and shell scripts. It allows collecting code coverage information from executables without special command-line arguments, and continuously produces output from long-running applications. - [website](https://simonkagstrom.github.io/kcov/) / [github](https://github.com/SimonKagstrom/kcov) / [video](https://www.youtube.com/watch?v=1QMHbp5LUKg)

kcov is also available using cargo:
- [cargo-kcov](https://github.com/kennytm/cargo-kcov)
- install: `cargo install cargo-kcov`


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

## Example with wasmer/compile_debug

Copy [compile_debug](wasm-fuzz/debug_tools/compile_debug) inside wasmer repo.
``` sh
$ cp wasm-fuzz/debug_tools/compile_debug .
# compile compile_debug with cargo
$ cd compile_debug
$ cargo build
# create cov output folder
$ mkdir cov
$ kcov --include-path .,.. ./cov ./target/debug/compile_debug ../hfuzz/hfuzz_workspace/compile_with_llvm/input/*
# look the result / open cov/index.html
$ firefox cov/index.html
```

<p align="center">
	<img src="/images/kcov_coverage_example.png" height="400px"/>
</p>

