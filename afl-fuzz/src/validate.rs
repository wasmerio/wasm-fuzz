#[macro_use]
extern crate afl;
extern crate wasmer_runtime_core;

use wasmer_runtime_core::backend::Features;

fn main() {
    fuzz!(|data: &[u8]| {
        let _ = wasmer_runtime_core::validate_and_report_errors_with_features(
            &data,
            Features {
                // Modify these values to explore additional parts of wasmer.
                simd: false,
                threads: false,
            },
        );
    });
}