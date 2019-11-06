#[macro_use]
extern crate afl;
extern crate wasmer_runtime;

use wasmer_runtime::{
    instantiate,
    imports,
};

fn main() {
    fuzz!(|data: &[u8]| {
        let import_object = imports! {};
        let _ = instantiate(data, &import_object);
    });
}