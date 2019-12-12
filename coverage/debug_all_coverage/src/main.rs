use std::env;
use std::fs::File;
use std::io;
use std::io::Read;
use std::path::PathBuf;

extern crate wasmer_runtime;
extern crate wasmer_runtime_core;
extern crate wasmer_llvm_backend;
extern crate wasmer_singlepass_backend;

use wasmer_runtime::{
    compile,
    compile_with,
    compile_with_config,
    compile_with_config_with,
    instantiate,
	imports,
};

use wasmer_runtime_core::{
        backend::{Compiler, CompilerConfig, Features, MemoryBoundCheckMode},
    };

use wasmer_singlepass_backend::SinglePassCompiler;
use wasmer_llvm_backend::LLVMCompiler;
// compilation cmd:
// cargo +nightly build



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
    LLVMCompiler::new()
}

fn get_singlepass_compiler() -> impl Compiler {
    SinglePassCompiler::new()
}

fn main() {
    let args: Vec<String> = env::args().collect();
    let wasm_path = std::path::PathBuf::from(&args[1]);
    //println!("File path: {:?}", wasm_path);
    let wasm_binary: Vec<u8> = read_contents(&wasm_path).unwrap();

    // CALL ALL APIs HERE
    let data = &wasm_binary[..];

    // is_wasm_binary
	let _ = wasmer::utils::is_wasm_binary(data);

    // compile
    let _ = compile(data);

    // compile_kwasmd_config
    let config = CompilerConfig {
        symbol_map: None,
        memory_bound_check_mode: MemoryBoundCheckMode::Disable,
        enforce_stack_check: true,
        track_state: false,
        features: Default::default(),
        backend_specific_config: None,
        ..Default::default()
    };
    let _ = compile_with_config_with(data, config, &SinglePassCompiler::new());

    // compile_with_config_with_llvm
    let config = CompilerConfig {
        symbol_map: None,
        track_state: false,
        features: Features {
            simd: true,
            threads: true,
        },
        ..Default::default()
    };
    let _ = compile_with_config_with(data, config, &get_llvm_compiler());

	// compile_with_threads
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

    // compile_with_singlepass
    let _ = compile_with(data, &get_singlepass_compiler());
    // compile_with_llvm
    let _ = compile_with(data, &get_llvm_compiler());

    // simple_instantiate
	let import_object = imports! {};
	let _ = instantiate(data, &import_object);

	// validate
	let _ = wasmer_runtime_core::validate_and_report_errors_with_features(
	    &data,
	    Features {
	        /// Enable support for the SIMD proposal.
	        /// Enable support for the threads proposal.
	        simd: false, threads: false,},
	);

	// validate_all_feat
	let _ = wasmer_runtime_core::validate_and_report_errors_with_features(
	    &data,
	    Features {
	        simd: true, threads: true,},
	);
}
