# cargo-fuzz (libfuzzer)

Command-line wrapper for using libFuzzer. Easy to use, no need to recompile LLVM!

Cargo-fuzz repository: [cargo-fuzz](https://github.com/rust-fuzz/cargo-fuzz).

`cargo-fuzz` is documented in the [Rust Fuzz Book](https://rust-fuzz.github.io/book/cargo-fuzz.html).

# Installation

``` sh
cargo install --force cargo-fuzz
```

# cargo-fuzz + wasmer

Copy the `fuzz` folder inside `wasmer` repository and copy your input dataset corpus inside `corpus/FUZZER_NAME`.

## compile

Simple fuzzer calling `wasmer_runtime::compile`.
- src: `fuzz_targets/compile.rs`.
- cmd: `cargo +nightly fuzz run compile`.

## validate

Simple fuzzer calling `wasmer_runtime_core::validate_and_report_errors_with_features` with:
- **simd: false**
- **threads: false**
- src: `fuzz_targets/validate.rs`.
- cmd: `cargo +nightly fuzz run validate`.

## validate_all_feat

Simple fuzzer calling `wasmer_runtime_core::validate_and_report_errors_with_features` with:
- **simd: true**
- **threads: true**
- src: `fuzz_targets/validate_all_feat.rs`.
- cmd: `cargo +nightly fuzz run validate_all_feat`.

## simple_instantiate [USELESS/DEPRECATED]

TODO - verify if still the case with cargo-fuzz 0.5.4

Not really interesting to use this fuzzer because every valid errors through by wasmer will be considered as crash by libfuzzer. In practice, that mean the fuzzer will crash almost immediately.

- src: `fuzz_targets/simple_instantiate.rs`.
- cmd: `cargo +nightly fuzz run simple_instantiate`.

## Tips/options for cargo-fuzz

Help: `cargo fuzz run --help`

Interesting options
``` sh
	[...]
    -O, --release                Build artifacts in release mode, with optimizations
    -a, --debug-assertions       Build artifacts with debug assertions enabled (default if not -O)

OPTIONS:
	--features <features>
		Build artifacts with given Cargo feature enabled
	-s, --sanitizer <sanitizer>
		Use different sanitizer [default: address] [possible values: address, leak, memory,thread]
    -j, --jobs <JOBS>
    	Number of concurrent jobs to run [default: 1]

Some useful options (to be used as `cargo fuzz run fuzz_target -- <options>`) include:
 - `-max_len=<len>`: Will limit the length of the input string to `<len>`
 - `-runs=<number>`: Will limit the number of tries (runs) before it gives up
 - `-max_total_time=<time>`: Will limit the amount of time to fuzz before it gives up
 - `-timeout=<time>`: Will limit the amount of time for a single run before it considers that run a failure
 - `-only_ascii`: Only provide ASCII input
 - `-dict=<file>`: Use a keyword dictionary from specified file. See http://llvm.org/docs/LibFuzzer.html#dictionaries
```

# Corpus minimization

TODO - write specific section in README.md or here?

```
    cmin    Corpus minifier
    tmin    Test case minifier
```

## Example

<p align="center">
	<img src="/images/cargofuzz_interface.png" height="400px"/>
</p>