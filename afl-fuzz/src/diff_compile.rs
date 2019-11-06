#[macro_use]
extern crate afl;
extern crate wasmer_runtime;


// Use system allocator so we can substitute it with a custom one via LD_PRELOAD
use std::alloc::System;
#[global_allocator]
static GLOBAL: System = System;


use wasmer_runtime::{
    compile,
};

// TODO - fix issues with libdiffuzz

fn main() {
    fuzz!(|data: &[u8]| {
        let first_run_result = compile(data);
        let second_run_result = compile(data);
        match (first_run_result, second_run_result) {
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
        		assert_eq!(ai.backend, bi.backend);
        		assert_eq!(format!("{:?}", ai.namespace_table), format!("{:?}", bi.namespace_table));
        		assert_eq!(format!("{:?}", ai.name_table), format!("{:?}", bi.name_table));
        		assert_eq!(ai.em_symbol_map, bi.em_symbol_map);
            	assert_eq!(ai.custom_sections, bi.custom_sections);
            },
            (Err(err_a), Err(err_b)) => assert_eq!(err_a, err_b),
            _ => panic!("One decoding run succeeded while the other failed!"),
        }
    });
}