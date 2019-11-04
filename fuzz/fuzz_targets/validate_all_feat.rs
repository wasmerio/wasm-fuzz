#![no_main]
#[macro_use]
extern crate libfuzzer_sys;
extern crate wasmer_runtime_core;

use wasmer_runtime_core::backend::Features;

fuzz_target!(|data: &[u8]| {
    let _ = wasmer_runtime_core::validate_and_report_errors_with_features(
        &data,
        Features {
            simd: true,
            threads: true,
        },
    );
});
