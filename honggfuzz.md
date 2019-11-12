# What's Honggfuzz?

*Honggfuzz is security oriented, feedback-driven, evolutionary, easy-to-use fuzzer with interesting analysis options* - [source](https://github.com/google/honggfuzz)

Honggfuzz for Rust is available here: [honggfuzz-rs](https://github.com/rust-fuzz/honggfuzz-rs) / [Documentation](https://docs.rs/honggfuzz/0.5.45/honggfuzz/) and can be used with:
- Rust: stable, beta, nightly.
- Sanitizer: none, address, thread, leak.

Full compatibility list [here](https://github.com/rust-fuzz/honggfuzz-rs#compatibility)

# Installation

On Linux:
``` sh
$ sudo apt install build-essential binutils-dev libunwind-dev libblocksruntime-dev
```
then:
``` sh
$ cargo install honggfuzz
```

# Honggfuzz + wasmer

Copy the `hfuzz` folder inside `wasmer` repository.

Move to honggfuzz folder: `cd hfuzz/`.

Input files need to be copied in `hfuzz_workspace/FUZZER_NAME/input`.

## compile

Simple fuzzer calling `wasmer_runtime::compile` API.
- src: `src/compile.rs`.
- cmd: `cargo +nightly hfuzz run compile`.

## compile_with_threads

Fuzzer using `wasmer_runtime::compile_with_config` API with:
- **simd: false** (simd not supported in cranelift)
- **threads: true**
- **backend: default (Cranelift)**
- src: `src/compile_with_threads.rs`.
- cmd: `cargo +nightly hfuzz run compile_with_threads`.

## compile_with_llvm

Fuzzer using `wasmer_runtime::compile_with` API with:
- **backend: llvm**
- src: `src/compile_with_llvm.rs`.
- cmd: `cargo +nightly hfuzz run compile_with_llvm`.

## compile_with_config_with_llvm

Fuzzer using `wasmer_runtime::compile_with_config_with` API with:
- **simd: true**
- **threads: true**
- **backend: LLVMCompiler**
- src: `src/compile_with_config_with_llvm.rs`.
- cmd: `cargo +nightly hfuzz run compile_with_config_with_llvm`.

## compile_kwasmd_config

Fuzzer using `wasmer_runtime::compile_with_config_with` API and the same config than [bin/kwasmd.rs](https://github.com/wasmerio/wasmer/blob/b9a99492813f2849a751db84faeac28cb8406346/src/bin/kwasmd.rs#L58-L68):
- **features: default**
- **backend: SinglePassCompiler**
- src: `src/compile_kwasmd_config.rs`.
- cmd: `cargo +nightly hfuzz run compile_kwasmd_config`.

## validate_all_feat

Simple fuzzer calling `wasmer_runtime_core::validate_and_report_errors_with_features` API with:
- **simd: true**
- **threads: true**
- src: `src/validate_all_feat.rs`.
- cmd: `cargo +nightly hfuzz run validate_all_feat`.

## simple_instantiate

Simple fuzzer calling `wasmer_runtime::instantiate` API with:
- **imports: None**
- src: `src/simple_instantiate.rs`.
- cmd: `cargo +nightly hfuzz run simple_instantiate`.

## basic_instantiate_binaryen [TODO FIX]

TODO FIX: this fuzzer is broken because of binaryen-sys compilation issue:
``` sh
error: failed to run custom build command for `binaryen-sys v0.8.1`

Caused by:
  process didn't exit successfully: `/home/scop/Documents/webassembly/wasmer/hfuzz/hfuzz_target/release/build/binaryen-sys-2cfdae2c026a1363/build-script-build` (exit code: 101)
--- stdout
wrapper.h:1:10: fatal error: 'stdbool.h' file not found, err: true

--- stderr
fatal: not a git repository (or any parent up to mount point /home)
Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).
wrapper.h:1:10: fatal error: 'stdbool.h' file not found
thread 'main' panicked at 'Unable to generate bindings: ()', src/libcore/result.rs:1165:5
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace.

warning: build failed, waiting for other jobs to finish...
```

This fuzzer use `binaryen::tools::translate_to_fuzz_mvp` to convert `data` into a valid wasm module somehow.
- src: `src/instantiate_binaryen.rs`.
- cmd:
``` sh
# uncomment line 16 of Cargo.toml => # binaryen = "0.8.1"
$ cargo +nightly hfuzz run instantiate_binaryen
```
More info about this API [here](https://github.com/WebAssembly/binaryen/wiki/Fuzzing#fuzzing).

# Tips/options for Honggfuzz

`HFUZZ_RUN_ARGS` is used to provide options to honggfuzz.
Some of the most usefull are:
``` sh
	[...]
--timeout|-t VALUE
	Timeout in seconds (default: 10)
--threads|-n VALUE
	Number of concurrent fuzzing threads (default: number of CPUs / 2)
--dict|-w VALUE
	Dictionary file. Format:http://llvm.org/docs/LibFuzzer.html#dictionaries
--sanitizers|-S 
	Enable sanitizers settings (default: false)
--monitor_sigabrt VALUE
	Monitor SIGABRT (default: false for Android, true for other platforms)
	[...]
```

# Example

Copy input dataset files inside `hfuzz_workspace/compile/input` then run the fuzzer with:
``` sh
$ HFUZZ_RUN_ARGS="-t 2 -n 6" cargo +nightly hfuzz run compile
```

<p align="center">
	<img src="/images/honggfuzz_interface_compile.png" height="400px"/>
</p>
