# Corpus minimization

Corpus minimization tools (like afl-cmin)  tries  to  find  the smallest subset of files in the input directory that still trigger the full range of instrumentation data points seen in the starting corpus.

The main goal here is to **minimize your corpus BEFORE running your fuzzer**.

CAUTION: Corpus minimization doesn't mean modifying/reducing your corpus individual files. If you are looking for that, take a look to [testcase_minimization](testcase_minimization.md).

## cargo-fuzz (cargo fuzz cmin)

Help: `cargo fuzz cmin -h`

``` sh
cargo-fuzz-cmin 0.5.4
Corpus minifier

USAGE:
    cargo-fuzz cmin [FLAGS] [OPTIONS] <TARGET> [CORPUS]

FLAGS:
    -O, --release                Build artifacts in release mode, with optimizations
    -a, --debug-assertions       Build artifacts with debug assertions enabled (default if not -O)
        --no-default-features    Build artifacts with default Cargo features disabled
        --all-features           Build artifacts with all Cargo features enabled
    -h, --help                   Prints help information
    -V, --version                Prints version information

OPTIONS:
        --features <features>      Build artifacts with given Cargo feature enabled
    -s, --sanitizer <sanitizer>    Use different sanitizer [default: address]  [possible values: address, leak, memory,
                                   thread]
        --target <TRIPLE>          Target triple of the fuzz target [default: x86_64-unknown-linux-gnu]

ARGS:
    <TARGET>    Name of the fuzz target
    <CORPUS>    directory with corpus to minify

```

## honggfuzz

Not yet available, i've asked [here](https://github.com/rust-fuzz/honggfuzz-rs/issues/26)

Alternativaly, you can use the following `afl-rs cmin` command and provide the input folder of your hfuzz target.


## afl-rs (cargo afl cmin)

Help: `cargo afl cmin help`

``` sh
corpus minimization tool for afl-fuzz by <lcamtuf@google.com>

Usage: /PATH/afl.rs-0.5.1/afl/bin/afl-cmin [ options ] -- /path/to/target_app [ ... ]

Required parameters:

  -i dir        - input directory with the starting corpus
  -o dir        - output directory for minimized files

Execution control settings:

  -f file       - location read by the fuzzed program (stdin)
  -m megs       - memory limit for child process (100 MB)
  -t msec       - run time limit for child process (none)
  -Q            - use binary-only instrumentation (QEMU mode)

Minimization settings:

  -C            - keep crashing inputs, reject everything else
  -e            - solve for edge coverage only, ignore hit counts

For additional tips, please consult docs/README.
```

Example:
``` sh
$ cargo afl cmin -i in -o out_min target/debug/compile_with_llvm -C

corpus minimization tool for afl-fuzz by <lcamtuf@google.com>

[*] Testing the target binary...
[+] OK, 3289 tuples recorded.
[*] Obtaining traces for input files in 'in'...
    Processing file 40/40... 
[*] Sorting trace sets (this may take a while)...
[+] Found 12560 unique tuples across 40 files.
[*] Finding best candidates for each tuple...
    Processing file 40/40... 
[*] Sorting candidate list (be patient)...
[*] Processing candidates and writing output files...
    Processing tuple 12560/12560... 
[+] Narrowed down to 29 files, saved in 'out_min'.
```

