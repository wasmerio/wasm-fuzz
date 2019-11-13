#[macro_use]
extern crate honggfuzz;
extern crate wasmer_runtime_core;

use wasmer_runtime_core::{
    backend::{Features},
};

fn main() {
    loop {
        fuzz!(|data: &[u8]| {
            let _ = wasmer_runtime_core::validate_and_report_errors_with_features(
                &data,
                Features {
                    /// Enable support for the SIMD proposal.
                    /// Enable support for the threads proposal.
                    simd: false, threads: false,},
            )
            .map_err(|_err| ());
        });
    }
}