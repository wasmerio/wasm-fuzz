#[macro_use]
extern crate honggfuzz;

use wasmer_runtime::{
    compile_with_config_with,
};

use wasmer_runtime_core::{
        backend::{CompilerConfig, MemoryBoundCheckMode},
    };

use wasmer_singlepass_backend::SinglePassCompiler;

fn main() {
    loop {
        fuzz!(|data: &[u8]| {
            let config = CompilerConfig {
                symbol_map: None,
                memory_bound_check_mode: MemoryBoundCheckMode::Disable,
                enforce_stack_check: true,
                track_state: false,
                features: Default::default(),
            };
            let _ = compile_with_config_with(data, config, &SinglePassCompiler::new(),);
        });
    }
}