#[macro_use]
extern crate honggfuzz;

use wasmer_runtime::{
    instantiate,
    imports,
};

fn main() {
    loop {
        fuzz!(|data: &[u8]| {
            let import_object = imports! {};
            let _ = instantiate(data, &import_object);
        });
    }
}