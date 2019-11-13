use std::env;
use std::fs::{File};
use std::io;
use std::io::Read;
use std::path::PathBuf;


extern crate wasmer_llvm_backend;
extern crate wasmer_runtime_core;
extern crate wasmer_runtime;

use wasmer_runtime::{
    compile_with,
};
use wasmer_runtime_core::backend::Compiler;

/// Read the contents of a file
fn read_contents(path: &PathBuf) -> Result<Vec<u8>, io::Error> {
    let mut buffer: Vec<u8> = Vec::new();
    let mut file = File::open(path)?;
    file.read_to_end(&mut buffer)?;
    // We force to close the file
    drop(file);
    Ok(buffer)
}

fn get_llvm_compiler() -> impl Compiler {
    use wasmer_llvm_backend::LLVMCompiler;
    LLVMCompiler::new()
}

fn main() {
    println!("Start compile_debug");
	let args: Vec<String> = env::args().collect();

	// first argument is wasm file path
	let wasm_path = std::path::PathBuf::from(&args[1]);
    println!("File path: {:?}", wasm_path);

	let wasm_binary: Vec<u8> = read_contents(&wasm_path).unwrap();
    //println!("wasm_binary: {:?}", wasm_binary);

    // CALL THE API HERE
    let _res = compile_with(&wasm_binary[..], &get_llvm_compiler());
    // CALL THE API HERE

    println!("OK");
}
