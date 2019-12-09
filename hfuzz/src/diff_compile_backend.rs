#[macro_use]
extern crate honggfuzz;
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
    loop {
        fuzz!(|data: &[u8]| {

            let res_llvm = compile_with(data, &get_llvm_compiler());
            let res_singlepass = compile_with(data, &get_singlepass_compiler());
            // let _ = compile(data);

            match (res_llvm, res_singlepass) {
                (Ok(a), Ok(b)) => {
                    let ai = a.info();
                    let bi = b.info();
                    if format!("{:?}", ai.memories) != format!("{:?}", bi.memories) {
                        println!("[-] memories");
                        println!("{:?}", format!("{:?}", ai.memories));
                        println!("{:?}", format!("{:?}", bi.memories));
                        panic!("backends memories are different")
                    }
                    if format!("{:?}", ai.globals) != format!("{:?}", bi.globals) {
                        println!("[-] globals");
                        println!("{:?}", format!("{:?}", ai.globals));
                        println!("{:?}", format!("{:?}", bi.globals));
                        panic!("backends globals are different")
                    }
                    if format!("{:?}", ai.tables) != format!("{:?}", bi.tables) {
                        println!("[-] tables");
                        println!("{:?}", format!("{:?}", ai.tables));
                        println!("{:?}", format!("{:?}", bi.tables));
                        panic!("backends tables are different")
                    }
                    if format!("{:?}", ai.imported_functions) != format!("{:?}", bi.imported_functions) {
                        println!("[-] imported_functions");
                        println!("{:?}", format!("{:?}", ai.imported_functions));
                        println!("{:?}", format!("{:?}", bi.imported_functions));
                        panic!("backends imported_functions are different")
                    }
                    if format!("{:?}", ai.imported_memories) != format!("{:?}", bi.imported_memories) {
                        println!("[-] imported_memories");
                        println!("{:?}", format!("{:?}", ai.imported_memories));
                        println!("{:?}", format!("{:?}", bi.imported_memories));
                        panic!("backends imported_memories are different")
                    }
                    if format!("{:?}", ai.imported_tables) != format!("{:?}", bi.imported_tables) {
                        println!("[-] imported_tables");
                        println!("{:?}", format!("{:?}", ai.imported_tables));
                        println!("{:?}", format!("{:?}", bi.imported_tables));
                        panic!("backends imported_tables are different")
                    }
                    if format!("{:?}", ai.imported_globals) != format!("{:?}", bi.imported_globals) {
                        println!("[-] imported_globals");
                        println!("{:?}", format!("{:?}", ai.imported_globals));
                        println!("{:?}", format!("{:?}", bi.imported_globals));
                        panic!("backend imported_globals are different")
                    }
                    if format!("{:?}", ai.exports) != format!("{:?}", bi.exports) {
                        println!("[-] exports");
                        println!("{:?}", format!("{:?}", ai.exports));
                        println!("{:?}", format!("{:?}", bi.exports));
                        panic!("backend exports are different")
                    }
                    if format!("{:?}", ai.data_initializers) != format!("{:?}", bi.data_initializers) {
                        println!("[-] data_initializers");
                        println!("{:?}", format!("{:?}", ai.data_initializers));
                        println!("{:?}", format!("{:?}", bi.data_initializers));
                        panic!("backend data_initializers are different")
                    }
                    if format!("{:?}", ai.elem_initializers) != format!("{:?}", bi.elem_initializers) {
                        println!("[-] elem_initializers");
                        println!("{:?}", format!("{:?}", ai.elem_initializers));
                        println!("{:?}", format!("{:?}", bi.elem_initializers));
                        panic!("backend elem_initializers are different")
                    }
                    if format!("{:?}", ai.start_func) != format!("{:?}", bi.start_func) {
                        println!("[-] start_func");
                        println!("{:?}", format!("{:?}", ai.start_func));
                        println!("{:?}", format!("{:?}", bi.start_func));
                        panic!("backend start_func are different")
                    }
                    if format!("{:?}", ai.func_assoc) != format!("{:?}", bi.func_assoc) {
                        println!("[-] func_assoc");
                        println!("{:?}", format!("{:?}", ai.func_assoc));
                        println!("{:?}", format!("{:?}", bi.func_assoc));
                        panic!("backend func_assoc are different")
                    }
                    if format!("{:?}", ai.signatures) != format!("{:?}", bi.signatures) {
                        println!("[-] signatures");
                        println!("{:?}", format!("{:?}", ai.signatures));
                        println!("{:?}", format!("{:?}", bi.signatures));
                        panic!("backend signatures are different")
                    }
                    // No need to check since backends are different
                    // if ai.backend != bi.backend {
                    //     println!("[-] backend");
                    //     println!("{:?}", ai.backend);
                    //     println!("{:?}", bi.backend);
                    // }
                    if format!("{:?}", ai.namespace_table) != format!("{:?}", bi.namespace_table) {
                        println!("[-] namespace_table");
                        println!("{:?}", format!("{:?}", ai.namespace_table));
                        println!("{:?}", format!("{:?}", bi.namespace_table));
                        panic!("backend namespace_table are different")
                    }
                    if format!("{:?}", ai.name_table) != format!("{:?}", bi.name_table) {
                        println!("[-] name_table");
                        println!("{:?}", format!("{:?}", ai.name_table));
                        println!("{:?}", format!("{:?}", bi.name_table));
                        panic!("backend name_table are different")
                    }
                    if ai.em_symbol_map != bi.em_symbol_map {
                        println!("[-] em_symbol_map");
                        println!("{:?}", ai.em_symbol_map);
                        println!("{:?}", bi.em_symbol_map);
                        panic!("backend em_symbol_map are different")
                    }
                    if ai.custom_sections != bi.custom_sections {
                        println!("[-] custom_sections");
                        println!("{:?}", ai.custom_sections);
                        println!("{:?}", bi.custom_sections);
                        panic!("backend custom_sections are different")
                    }

                    println!("[+] OK for both");
                    // assert_eq!(format!("{:?}", ai.memories), format!("{:?}", bi.memories));
                    // assert_eq!(format!("{:?}", ai.globals), format!("{:?}", bi.globals));
                    // assert_eq!(format!("{:?}", ai.tables), format!("{:?}", bi.tables));
                    // assert_eq!(format!("{:?}", ai.imported_functions), format!("{:?}", bi.imported_functions));
                    // assert_eq!(format!("{:?}", ai.imported_memories), format!("{:?}", bi.imported_memories));
                    // assert_eq!(format!("{:?}", ai.imported_tables), format!("{:?}", bi.imported_tables));
                    // assert_eq!(format!("{:?}", ai.imported_globals), format!("{:?}", bi.imported_globals));
                    // assert_eq!(format!("{:?}", ai.exports), format!("{:?}", bi.exports));
                    // assert_eq!(format!("{:?}", ai.data_initializers), format!("{:?}", bi.data_initializers));
                    // assert_eq!(format!("{:?}", ai.elem_initializers), format!("{:?}", bi.elem_initializers));
                    // assert_eq!(format!("{:?}", ai.start_func), format!("{:?}", bi.start_func));
                    // assert_eq!(format!("{:?}", ai.func_assoc), format!("{:?}", bi.func_assoc));
                    // assert_eq!(format!("{:?}", ai.signatures), format!("{:?}", bi.signatures));
                    // assert_eq!(ai.backend, bi.backend);
                    // assert_eq!(format!("{:?}", ai.namespace_table), format!("{:?}", bi.namespace_table));
                    // assert_eq!(format!("{:?}", ai.name_table), format!("{:?}", bi.name_table));
                    // assert_eq!(ai.em_symbol_map, bi.em_symbol_map);
                    // assert_eq!(ai.custom_sections, bi.custom_sections);
                },
                (Err(err_a), Ok(_err_b)) => {
                    println!("[-] Error LLVM");
                    println!("{:?}", err_a);
                    panic!("Only backend LLVM return an Error")
                },
                (Ok(_err_a), Err(err_b)) => {
                    println!("[-] Error Singlepass");
                    println!("{:?}", err_b);
                    panic!("Only backend Singlepass return an Error")
                },
                (Err(_err_a), Err(_err_b)) => {
                    println!("[+] Error for both");
                },
            }
        });
    }
}
