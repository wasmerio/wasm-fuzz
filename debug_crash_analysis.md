# Debugging / Crashes analysis

This file contains some tips/technics to debug `wasmer` when a crash occurs.

# Compiling wasmer for debugging

`wasmer` can be compiled in debug mode using: `make debug`.

Nevertheless, the command line inside the `Makefile` do not compiled `wasmer` with the same features than in `release` mode.


Prefered way is to compiled `wasmer` with:
``` sh
$ RUSTFLAGS=-g cargo build --release --features backend-singlepass,backend-llvm,loader-kernel,debug,trace
```

# Calling wasmer using APIs

Check [debug_tools](debug_tools/) and [debug_all_coverage](coverage/debug_all_coverage/).

Copy them into `wasmer` folder and build them with:
``` sh
$ cd debug_all_coverage
$ RUSTFLAGS=-g cargo build
$ ./target/debug/all_coverage <wasm_file_to_test>
```

# Backtracing 

## RUST_BACKTRACE=1

`RUST_BACKTRACE=1` flag will print the stack trace in default configuration.

Example:
``` rust
  14: wasmer_runtime_core::compile_with_config
             at lib/runtime-core/src/lib.rs:136
  15: wasmer_runtime::compile_with_config_with
             at lib/runtime/src/lib.rs:166
  16: wasmer::execute_wasm::{{closure}}
             at src/bin/wasmer.rs:499
  17: wasmer::execute_wasm
             at src/bin/wasmer.rs:521
  18: wasmer::run
             at src/bin/wasmer.rs:771
  19: wasmer::main
             at src/bin/wasmer.rs:839
```

## RUST_BACKTRACE=full

`RUST_BACKTRACE=full` will generate a more verbose backtrace.

Example:
``` rust
14:     0x55f333002d90 - wasmer_runtime_core::compile_with_config::hcdd376dfdc67e519
                           at lib/runtime-core/src/lib.rs:136
15:     0x55f33210c1dc - wasmer_runtime::compile_with_config_with::h4156185fba90a126
                           at lib/runtime/src/lib.rs:166
16:     0x55f331f95f8b - wasmer::execute_wasm::{{closure}}::hfa583575fc99f722
                           at src/bin/wasmer.rs:499
17:     0x55f331f95f8b - wasmer::execute_wasm::h52c404e8f976f72b
                           at src/bin/wasmer.rs:521
18:     0x55f331f9b75c - wasmer::run::h906b1ab63d6f61be
                           at src/bin/wasmer.rs:771
19:     0x55f331f9b75c - wasmer::main::hc1c29fab9a506321
                           at src/bin/wasmer.rs:839
```

If you want more details, you can use the [backtrace-rs](https://github.com/rust-lang/backtrace-rs) library - [documentation](https://docs.rs/backtrace/0.3.40/backtrace/)

# Debugger (gdb, lldb)

More informations here:
- https://bitshifter.github.io/rr+rust/index.html#1
- http://smallcultfollowing.com/babysteps/blog/2018/09/21/office-hours-0-debugging-with-gdb/
- https://os.phil-opp.com/set-up-gdb/
- https://sourceware.org/gdb/current/onlinedocs/gdb/Rust.html

# Crash minimization

See [testcase_minimization.md](testcase_minimization.md) for more details about crash minimization.