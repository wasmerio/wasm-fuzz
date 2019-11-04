#[macro_use]
extern crate honggfuzz;

use wasmer_runtime::{
    compile,
};

fn main() {
    loop {
        fuzz!(|data: &[u8]| {
            let _ = compile(data);
        });
    }
}