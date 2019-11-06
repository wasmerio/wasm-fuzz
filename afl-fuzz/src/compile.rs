#[macro_use]
extern crate afl;
extern crate wasmer_runtime;

use wasmer_runtime::{
    compile,
};

fn main() {
    fuzz!(|data: &[u8]| {
        let _ = compile(data);
    });
}