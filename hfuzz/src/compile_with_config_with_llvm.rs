#[macro_use]
extern crate honggfuzz;

use wasmer_runtime::{
    compile_with_config_with,
};

use wasmer_runtime_core::{
        backend::{CompilerConfig, Compiler, Features},
    };

fn get_llvm_compiler() -> impl Compiler {
    use wasmer_llvm_backend::LLVMCompiler;
    LLVMCompiler::new()
}
// TODO fix compilation 
// RUNNING CMD:
// cargo +nightly hfuzz run compile_with_config_with_llvm

fn main() {
    loop {
        fuzz!(|data: &[u8]| {
            let config = CompilerConfig {
                symbol_map: None,
                track_state: false,
                features: Features {
                    simd: true,
                    threads: true,
                },
                ..Default::default()
            };

            //let compiler: Box<dyn Compiler> = Box::new(LLVMCompiler::new());
            let _ = compile_with_config_with(data, config, &get_llvm_compiler());
        });
    }
}