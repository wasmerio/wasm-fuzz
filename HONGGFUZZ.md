# What's Honggfuzz?

*Honggfuzz is security oriented, feedback-driven, evolutionary, easy-to-use fuzzer with interesting analysis options* - [source](https://github.com/google/honggfuzz)

Honggfuzz for Rust is available here: [honggfuzz-rs](https://github.com/rust-fuzz/honggfuzz-rs) / [Documentation](https://docs.rs/honggfuzz/0.5.45/honggfuzz/)

honggfuzz-rs can be used with:
* Rust: stable, beta, nightly.
* Sanitizer: none, address, thread, leak.

Full compatibility list [here](https://github.com/rust-fuzz/honggfuzz-rs#compatibility)

# Setup fuzzing environment

Install Honggfuzz:
``` sh
# for linux: 
sudo apt install build-essential binutils-dev libunwind-dev libblocksruntime-dev
cargo install honggfuzz
```

Copy the `hfuzz` folder inside `wasmer` repository.

# Honggfuzz + wasmer

Move to honggfuzz folder: `cd hfuzz/`
Input files need to be copied in `hfuzz_workspace/FUZZER_NAME/input`.

## compile

Simple fuzzer calling `wasmer_runtime::compile`

* Source: `src/compile.rs`.
* Running command: `cargo +nightly hfuzz run compile`.

## compile_with_threads

Fuzzer for `wasmer_runtime::compile_with_config` with:
* simd: **false** (simd not supported in cranelift)
* threads: **true**
* backend: **default (Cranelift)**

* Source: `src/compile_with_threads.rs`.
* Running command: `cargo +nightly hfuzz run compile_with_threads`.

## compile_with_config_with_llvm [TODO FIX]

TODO FIX: this fuzzer is broken because of LLVM compilation issue:
``` sh
	[...]
	collect2: error: ld returned 1 exit status
          

error: aborting due to previous error

error: could not compile `hfuzz`.

To learn more, run the command again with --verbose.
```

Fuzzer for `wasmer_runtime::compile_with_config_with` with:
* simd: **true**
* threads: **true**
* backend: **LLVMCompiler**

* Source: `src/compile_with_config_with_llvm.rs`.
* Running command: `cargo +nightly hfuzz run compile_with_config_with_llvm`.

## compile_kwasmd_config

Fuzzer using the same config than inside [bin/kwasmd.rs](https://github.com/wasmerio/wasmer/blob/b9a99492813f2849a751db84faeac28cb8406346/src/bin/kwasmd.rs#L58-L68):
* features: default
* backend: SinglePassCompiler

* Source: `src/compile_kwasmd_config.rs`.
* Running command: `cargo +nightly hfuzz run compile_kwasmd_config`.

## validate_all_feat

Simple fuzzer calling `wasmer_runtime_core::validate_and_report_errors_with_features` with:
* simd: **true**
* threads: **true**

* Source: `src/validate_all_feat.rs`.
* Running command: `cargo +nightly hfuzz run validate_all_feat`.

## simple_instantiate

Simple fuzzer calling `wasmer_runtime::instantiate` with:
* imports: None

* Source: `src/simple_instantiate.rs`.
* Running command: `cargo +nightly hfuzz run simple_instantiate`.

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
More info about this API [here](https://github.com/WebAssembly/binaryen/wiki/Fuzzing#fuzzing)


* Source: `src/instantiate_binaryen.rs`
* Running command:
``` sh
# uncomment line 16 of Cargo.toml => # binaryen = "0.8.1"
cargo +nightly hfuzz run instantiate_binaryen
```

## Tips/options for Honggfuzz

`HFUZZ_RUN_ARGS` is used to provide options to honggfuzz.

Some of the most usefull here are:
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

## Example

Running command:
``` sh
HFUZZ_RUN_ARGS="-t 2 -n 6" cargo +nightly hfuzz run compile
```
Input dataset files inside: `hfuzz_workspace/compile/input`.

<p align="center">
	<img src="/images/honggfuzz_interface_compile.png" height="400px"/>
</p>