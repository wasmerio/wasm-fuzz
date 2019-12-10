#[macro_use]
extern crate afl;
extern crate wasmer_runtime;
extern crate wasmer_runtime_core;
extern crate wasmer_llvm_backend;
extern crate wasmer_singlepass_backend;

use wasmer_runtime::{compile, compile_with};
use wasmer_runtime_core::backend::Compiler;

fn get_llvm_compiler() -> impl Compiler {
    use wasmer_llvm_backend::LLVMCompiler;
    LLVMCompiler::new()
}
fn get_singlepass_compiler() -> impl Compiler {
    use wasmer_singlepass_backend::SinglePassCompiler;
    SinglePassCompiler::new()
}

fn main() {
    fuzz!(|data: &[u8]| {

        let res_llvm = compile_with(data, &get_llvm_compiler());
        let res_singlepass = compile_with(data, &get_singlepass_compiler());
        // let _ = compile(data);

        match (res_llvm, res_singlepass) {
            (Ok(a), Ok(b)) => {
                let ai = a.info();
                let bi = b.info();
                assert_eq!(format!("{:?}", ai.memories), format!("{:?}", bi.memories));
                assert_eq!(format!("{:?}", ai.globals), format!("{:?}", bi.globals));
                assert_eq!(format!("{:?}", ai.tables), format!("{:?}", bi.tables));
                assert_eq!(format!("{:?}", ai.imported_functions), format!("{:?}", bi.imported_functions));
                assert_eq!(format!("{:?}", ai.imported_memories), format!("{:?}", bi.imported_memories));
                assert_eq!(format!("{:?}", ai.imported_tables), format!("{:?}", bi.imported_tables));
                assert_eq!(format!("{:?}", ai.imported_globals), format!("{:?}", bi.imported_globals));
                assert_eq!(format!("{:?}", ai.exports), format!("{:?}", bi.exports));
                assert_eq!(format!("{:?}", ai.data_initializers), format!("{:?}", bi.data_initializers));
                assert_eq!(format!("{:?}", ai.elem_initializers), format!("{:?}", bi.elem_initializers));
                assert_eq!(format!("{:?}", ai.start_func), format!("{:?}", bi.start_func));
                assert_eq!(format!("{:?}", ai.func_assoc), format!("{:?}", bi.func_assoc));
                assert_eq!(format!("{:?}", ai.signatures), format!("{:?}", bi.signatures));
                // assert_eq!(ai.backend, bi.backend);
                assert_eq!(format!("{:?}", ai.namespace_table), format!("{:?}", bi.namespace_table));
                assert_eq!(format!("{:?}", ai.name_table), format!("{:?}", bi.name_table));
                assert_eq!(ai.em_symbol_map, bi.em_symbol_map);
                assert_eq!(ai.custom_sections, bi.custom_sections);

                println!("[+] OK for both");
            },
            (Err(err_a), Ok(_err_b)) => {
                //println!("[-] Error LLVM");
                //println!("{:?}", err_a);
                panic!("Only backend LLVM return an Error")
            },
            (Ok(_err_a), Err(err_b)) => {
                //println!("[-] Error Singlepass");
                //println!("{:?}", err_b);
                panic!("Only backend Singlepass return an Error")
            },
            (Err(_err_a), Err(_err_b)) => {
                println!("[+] Error for both");
            },
        }
    });
}