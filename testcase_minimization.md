# (Crashing) Testcase minimization

Test case minimizer tools (like afl-tmin) takes an input file and tries to remove as much data as possible while maintaining the same coverage as observed initially.

2 possible goals:
- reduce input file size before fuzzing (fuzzer works better with small files).
- reduce crash file before analysis to only keep crashing wasm sections/instructions.

## cargo-fuzz (cargo fuzz tmin)

More details about cargo-fuzz [here](cargofuzz.md).

Help: `cargo fuzz tmin -h`.

``` sh
cargo-fuzz-tmin 0.5.4
Test case minifier

USAGE:
    cargo-fuzz tmin [FLAGS] [OPTIONS] <TARGET> <CRASH>

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
        --runs <runs>              Number of attempts to minimize we should make [default: 255]

ARGS:
    <TARGET>    Name of the fuzz target
    <CRASH>     Crashing test case to minimize
```

## honggfuzz

Not implemented.

## afl-rs (cargo afl tmin)

More details about cargo-fuzz [here](afl.md).

Help: `cargo afl tmin help`.

``` sh
afl-tmin 2.52b by <lcamtuf@google.com>

/PATH/afl.rs/rustc-1.38.0-625451e/afl.rs-0.5.1/afl/bin/afl-tmin [ options ] -- /path/to/target_app [ ... ]

Required parameters:

  -i file       - input test case to be shrunk by the tool
  -o file       - final output location for the minimized data

Execution control settings:

  -f file       - input file read by the tested program (stdin)
  -t msec       - timeout for each run (1000 ms)
  -m megs       - memory limit for child process (50 MB)
  -Q            - use binary-only instrumentation (QEMU mode)

Minimization settings:

  -e            - solve for edge coverage only, ignore hit counts
  -x            - treat non-zero exit codes as crashes

For additional tips, please consult docs/README.

```

# Other tools

## halfempty

Halfempty is a new testcase minimization tool, designed with parallelization in mind. Halfempty was built to use strategies and techniques that dramatically speed up the minimization process.

More info: [github](https://github.com/googleprojectzero/halfempty).

### Installation:
``` sh
$ git clone https://github.com/googleprojectzero/halfempty
$ make
```

### Interesting options

- `--num-threads=threads`: Halfempty will default to using all available cores, but you can tweak this if you prefer.
- `--zero-char=byte`: Halfempty tries to simplify files by overwriting data with null bytes. **For wasm module, it's better to use 0x01 (i.e. nop instruction)**.
- `--monitor`: If you have the graphviz package installed, halfempty can generate graphs so you watch the progress.

### Script for wasmer

Run the script with: `halfempty testwasmer.sh target.wasm`

``` sh
#!/bin/sh

tempfile=`mktemp` && cat > ${tempfile}
result=1

trap 'rm -f ${tempfile}; exit ${result}' EXIT TERM ALRM

./target/release/wasmer run ${tempfile}

# Check if we crash
if test $? -eq 101; then
    result=0 # We want this input
fi
```

Sometimes your target program might crash with a different crash accidentally found during minimization. One solution might be to use gdb to verify the crash site.

Example [here](https://github.com/googleprojectzero/halfempty#verifying-crashes).

## wasm-opt

`wasm-opt` can be used to remove part of the code and reduce the size of the crashing sample.

### Interesting options

``` sh
$ wasm-opt -h | grep remove
  --dae                                         removes arguments to calls in an
  --dae-optimizing                              removes arguments to calls in an
                                                where we removed 
  --dce                                         removes unreachable code
  --duplicate-function-elimination              removes duplicate functions
  --duplicate-import-elimination                removes duplicate imports
  --no-exit-runtime                             removes calls to atexit(), which
  --remove-imports                              removes imports and replaces
  --remove-memory                               removes memory segments
  --remove-non-js-ops                           removes operations incompatible
  --remove-unused-brs                           removes breaks from locations
  --remove-unused-module-elements               removes unused module elements
  --remove-unused-names                         removes names from locations
  --remove-unused-nonfunction-module-elements   removes unused module elements
  --rse                                         remove redundant local.sets
  --untee                                       removes local.tees, replacing
  --vacuum                                      removes obviously unneeded code
                                                and remove them at runtime as 
[...]
  --remove-imports
  --remove-memory
  --remove-non-js-ops
  --remove-unused-brs
  --remove-unused-module-elements
  --remove-unused-names
  --remove-unused-nonfunction-module-elements
  --reorder-functions
  --simplify-globals
  --simplify-globals-optimizing
  --simplify-locals
  --simplify-locals-nonesting
  --simplify-locals-nostructure
  --simplify-locals-notee
  --simplify-locals-notee-nostructure
  --optimize-added-constants
  --optimize-added-constants-propagate
  --optimize-instructions
  --optimize-stack-ir
  --minify-imports
  --minify-imports-and-exports
[...]
```

## WebAssembly text format

Convert the crashing sample into its text represention.
Then, remove progressively the bigest part of the module, and translate back the module into binary format to check if the crash still occurs.

Example:
``` sh
$ wasm2wat crash.wasm -o crash.wast
# remove some wasm sections and instructions
$ wat2wasm crash.wast -o crash_bis.wasm
```



