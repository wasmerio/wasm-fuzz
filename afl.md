# afl.rs

American fuzzy lop (AFL) is a popular, effective, and modern fuzz testing tool. `afl.rs` allows one to run AFL on code written in the Rust programming language.

`afl-rs` can be found [here](https://github.com/rust-fuzz/afl.rs) and some documention are in the [Rust Fuzz Book](https://rust-fuzz.github.io/book/afl.html).

# Installation

```sh
$ cargo install --force afl
```

# afl + wasmer

Before running afl, you need first to compile the targets.
``` sh
$ cd afl-fuzz
$ cargo afl build
```

## compile

Simple fuzzer calling `wasmer_runtime::compile`.
- src: [src/compile.rs](afl-fuzz/src/compile.rs).
- cmd: `cargo afl fuzz -i in -o out target/debug/compile`.

## compile_with_llvm

Fuzzer using `wasmer_runtime::compile_with` API with:
- **backend: llvm**
- src: [src/compile_with_llvm.rs](afl-fuzz/src/compile_with_llvm.rs).
- cmd: `cargo afl fuzz -i in -o out target/debug/compile_with_llvm`.

## validate

Simple fuzzer calling `wasmer_runtime_core::validate_and_report_errors_with_features` with:
- **simd: false**
- **threads: false**
- src: [src/validate.rs](afl-fuzz/src/validate.rs).
- cmd: `cargo afl fuzz -i in -o out target/debug/validate`.

## validate_all_feat

Simple fuzzer calling `wasmer_runtime_core::validate_and_report_errors_with_features` with:
- **simd: true**
- **threads: true**
- src: [src/validate_all_feat.rs](afl-fuzz/src/validate_all_feat.rs).
- cmd: `cargo afl fuzz -i in -o out target/debug/validate_all_feat`.

## simple_instantiate

Simple fuzzer calling `wasmer_runtime::instantiate` API with:
- **imports: None**
- src: [src/simple_instantiate.rs](afl-fuzz/src/simple_instantiate.rs).
- cmd: `cargo afl fuzz -i in -o out target/debug/simple_instantiate`.

## diff_compile_backend

Fuzzer twice `wasmer_runtime::compile_with` API with respectively `llvm` and `singlepass` backends.
Then, results of both compilations are compared to detect differences in compilation.
- **backend: llvm**
- **backend: SinglePassCompiler**
- src: [src/diff_compile_backend.rs](afl-fuzz/src/diff_compile_backend.rs)
- cmd: `cargo afl fuzz -i in -o out target/debug/diff_compile_backend`

## diff_compile [TODO FIX]

TODO FIX: This fuzzer is broken because of runtime issue with [libdiffuzz](https://github.com/Shnatsel/libdiffuzz):

This fuzzer is calling `wasmer_runtime::compile` twice. This fuzzer is doing "differential fuzzing" i.e calling twice `wasmer_runtime::compile` and comparing the results.
result1 != result2 is synonym of non-deterministic like usage of uninitialized memory.
- src: [src/diff_compile.rs](afl-fuzz/src/diff_compile.rs).
- cmd: 
``` sh
$ AFL_PRELOAD=path/to/libdiffuzz.so cargo afl fuzz -i in -o out target/debug/diff_compile
```

# Tips/options for afl-rs

## Are you running afl for the first time ??

You need to execute the following commands to get afl running properly.

``` sh
echo core >/proc/sys/kernel/core_pattern
# sudo su -c "echo core >/proc/sys/kernel/core_pattern"
cd /sys/devices/system/cpu
echo performance | tee cpu*/cpufreq/scaling_governor
# sudo su -c "cd /sys/devices/system/cpu; echo performance | tee cpu*/cpufreq/scaling_governor"
```

## Options for afl

Help: `cargo afl fuzz help`

Interesting options:
```sh
Required parameters:

  -i dir        - input directory with test cases
  -o dir        - output directory for fuzzer findings

Execution control settings:

  -t msec       - timeout for each run (auto-scaled, 50-1000 ms)
  -m megs       - memory limit for child process (50 MB default / none for no limit)

Fuzzing behavior settings:

  -d            - quick & dirty mode (skips deterministic steps)
  -x dir        - optional fuzzer dictionary (see README)

Other stuff:

  -M / -S id    - distributed mode (see parallel_fuzzing.txt)
  -C            - crash exploration mode (the peruvian rabbit thing)
```

## Compilation issues

If you get this issue during compilation:
```
  = note: /usr/bin/ld: __sancov_guards
  [...]
          /usr/bin/ld: final link failed: bad value
          collect2: error: ld returned 1 exit status
```

Try to run cargo build with the `RUSTFLAGS` value:
``` sh
$ RUSTFLAGS='-C codegen-units=1' cargo afl build
```

# Corpus minimization

Checkout [corpus_minimization.md](corpus_minimization.md#afl-rs-cargo-afl-cmin).

# Example

Command: `cargo afl fuzz -t 100+ -m none -i in -o out target/debug/simple_instantiate`

<p align="center">
	<img src="/images/afl_rust_interface.png" height="400px"/>
</p>