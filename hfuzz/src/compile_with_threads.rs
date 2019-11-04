#[macro_use]
extern crate honggfuzz;

use wasmer_runtime::{
    compile_with_config,
};
use wasmer_runtime_core::backend::{CompilerConfig, Features};

fn main() {
    loop {
        fuzz!(|data: &[u8]| {
            let config = CompilerConfig {
                features: Features {
                    // SIMD is only supported in the LLVM backend for now
                    // Default backend is Backend::Cranelift
                    simd: false,
                    threads: true,
                },
                ..Default::default()
            };
            let _ = compile_with_config(data, config);
        });
    }
}