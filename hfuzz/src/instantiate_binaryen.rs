#[macro_use]
extern crate honggfuzz;
extern crate binaryen;

use wasmer_runtime::{
    instantiate,
    imports,
};

fn main() {
    loop {
        fuzz!(|data: &[u8]| {
            let binaryen_module = binaryen::tools::translate_to_fuzz_mvp(data);
            let wasm = binaryen_module.write();
            let import_object = imports! {};
            let _ = instantiate(&wasm, &import_object);
        });
    }
}