#![no_main]
#[macro_use]
extern crate libfuzzer_sys;
extern crate wasmer_llvm_backend;
extern crate wasmer_runtime_core;
extern crate wasmer_runtime;

use wasmer_runtime::{
    compile_with,
};
use wasmer_runtime_core::backend::Compiler;

fn get_llvm_compiler() -> impl Compiler {
    use wasmer_llvm_backend::LLVMCompiler;
    LLVMCompiler::new()
}

fuzz_target!(|data: &[u8]| {
    let _ = compile_with(data, &get_llvm_compiler());
});