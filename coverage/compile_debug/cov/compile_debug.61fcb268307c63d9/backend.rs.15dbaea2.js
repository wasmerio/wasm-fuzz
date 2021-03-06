var data = {lines:[
{"lineNum":"    1","line":"use super::stackmap::StackmapRegistry;"},
{"lineNum":"    2","line":"use crate::{"},
{"lineNum":"    3","line":"    intrinsics::Intrinsics,"},
{"lineNum":"    4","line":"    structs::{Callbacks, LLVMModule, LLVMResult, MemProtect},"},
{"lineNum":"    5","line":"};"},
{"lineNum":"    6","line":"use inkwell::{"},
{"lineNum":"    7","line":"    memory_buffer::MemoryBuffer,"},
{"lineNum":"    8","line":"    module::Module,"},
{"lineNum":"    9","line":"    targets::{FileType, TargetMachine},"},
{"lineNum":"   10","line":"};"},
{"lineNum":"   11","line":"use libc::c_char;"},
{"lineNum":"   12","line":"use std::{"},
{"lineNum":"   13","line":"    any::Any,"},
{"lineNum":"   14","line":"    cell::RefCell,"},
{"lineNum":"   15","line":"    ffi::{c_void, CString},"},
{"lineNum":"   16","line":"    fs::File,"},
{"lineNum":"   17","line":"    io::Write,"},
{"lineNum":"   18","line":"    mem,"},
{"lineNum":"   19","line":"    ops::Deref,"},
{"lineNum":"   20","line":"    ptr::{self, NonNull},"},
{"lineNum":"   21","line":"    rc::Rc,"},
{"lineNum":"   22","line":"    slice, str,"},
{"lineNum":"   23","line":"    sync::{Arc, Once},"},
{"lineNum":"   24","line":"};"},
{"lineNum":"   25","line":"use wasmer_runtime_core::{"},
{"lineNum":"   26","line":"    backend::{"},
{"lineNum":"   27","line":"        sys::{Memory, Protect},"},
{"lineNum":"   28","line":"        CacheGen, RunnableModule,"},
{"lineNum":"   29","line":"    },"},
{"lineNum":"   30","line":"    cache::Error as CacheError,"},
{"lineNum":"   31","line":"    module::ModuleInfo,"},
{"lineNum":"   32","line":"    state::ModuleStateMap,"},
{"lineNum":"   33","line":"    structures::TypedIndex,"},
{"lineNum":"   34","line":"    typed_func::{Trampoline, Wasm, WasmTrapInfo},"},
{"lineNum":"   35","line":"    types::{LocalFuncIndex, SigIndex},"},
{"lineNum":"   36","line":"    vm, vmcalls,"},
{"lineNum":"   37","line":"};"},
{"lineNum":"   38","line":""},
{"lineNum":"   39","line":"extern \"C\" {"},
{"lineNum":"   40","line":"    fn module_load("},
{"lineNum":"   41","line":"        mem_ptr: *const u8,"},
{"lineNum":"   42","line":"        mem_size: usize,"},
{"lineNum":"   43","line":"        callbacks: Callbacks,"},
{"lineNum":"   44","line":"        module_out: &mut *mut LLVMModule,"},
{"lineNum":"   45","line":"    ) -> LLVMResult;"},
{"lineNum":"   46","line":"    fn module_delete(module: *mut LLVMModule);"},
{"lineNum":"   47","line":"    fn get_func_symbol(module: *mut LLVMModule, name: *const c_char) -> *const vm::Func;"},
{"lineNum":"   48","line":"    fn llvm_backend_get_stack_map_ptr(module: *const LLVMModule) -> *const u8;"},
{"lineNum":"   49","line":"    fn llvm_backend_get_stack_map_size(module: *const LLVMModule) -> usize;"},
{"lineNum":"   50","line":"    fn llvm_backend_get_code_ptr(module: *const LLVMModule) -> *const u8;"},
{"lineNum":"   51","line":"    fn llvm_backend_get_code_size(module: *const LLVMModule) -> usize;"},
{"lineNum":"   52","line":""},
{"lineNum":"   53","line":"    fn throw_trap(ty: i32) -> !;"},
{"lineNum":"   54","line":"    fn throw_breakpoint(ty: i64) -> !;"},
{"lineNum":"   55","line":""},
{"lineNum":"   56","line":"    /// This should be the same as spliting up the fat pointer into two arguments,"},
{"lineNum":"   57","line":"    /// but this is cleaner, I think?"},
{"lineNum":"   58","line":"    #[cfg_attr(nightly, unwind(allowed))]"},
{"lineNum":"   59","line":"    #[allow(improper_ctypes)]"},
{"lineNum":"   60","line":"    fn throw_any(data: *mut dyn Any) -> !;"},
{"lineNum":"   61","line":""},
{"lineNum":"   62","line":"    #[allow(improper_ctypes)]"},
{"lineNum":"   63","line":"    fn invoke_trampoline("},
{"lineNum":"   64","line":"        trampoline: Trampoline,"},
{"lineNum":"   65","line":"        vmctx_ptr: *mut vm::Ctx,"},
{"lineNum":"   66","line":"        func_ptr: NonNull<vm::Func>,"},
{"lineNum":"   67","line":"        params: *const u64,"},
{"lineNum":"   68","line":"        results: *mut u64,"},
{"lineNum":"   69","line":"        trap_out: *mut WasmTrapInfo,"},
{"lineNum":"   70","line":"        user_error: *mut Option<Box<dyn Any>>,"},
{"lineNum":"   71","line":"        invoke_env: Option<NonNull<c_void>>,"},
{"lineNum":"   72","line":"    ) -> bool;"},
{"lineNum":"   73","line":"}"},
{"lineNum":"   74","line":""},
{"lineNum":"   75","line":"static SIGNAL_HANDLER_INSTALLED: Once = Once::new();"},
{"lineNum":"   76","line":""},
{"lineNum":"   77","line":"fn get_callbacks() -> Callbacks {","class":"lineCov","hits":"1","order":"583","possible_hits":"1",},
{"lineNum":"   78","line":"    extern \"C\" fn alloc_memory(","class":"linePartCov","hits":"1","order":"616","possible_hits":"2",},
{"lineNum":"   79","line":"        size: usize,"},
{"lineNum":"   80","line":"        protect: MemProtect,"},
{"lineNum":"   81","line":"        ptr_out: &mut *mut u8,"},
{"lineNum":"   82","line":"        size_out: &mut usize,"},
{"lineNum":"   83","line":"    ) -> LLVMResult {"},
{"lineNum":"   84","line":"        unsafe { crate::platform::alloc_memory(size, protect, ptr_out, size_out) }","class":"lineCov","hits":"1","order":"617","possible_hits":"1",},
{"lineNum":"   85","line":"    }","class":"lineCov","hits":"1","order":"633","possible_hits":"1",},
{"lineNum":"   86","line":""},
{"lineNum":"   87","line":"    extern \"C\" fn protect_memory(ptr: *mut u8, size: usize, protect: MemProtect) -> LLVMResult {","class":"linePartCov","hits":"1","order":"661","possible_hits":"2",},
{"lineNum":"   88","line":"        unsafe { crate::platform::protect_memory(ptr, size, protect) }","class":"lineCov","hits":"1","order":"662","possible_hits":"1",},
{"lineNum":"   89","line":"    }","class":"lineCov","hits":"1","order":"673","possible_hits":"1",},
{"lineNum":"   90","line":""},
{"lineNum":"   91","line":"    extern \"C\" fn dealloc_memory(ptr: *mut u8, size: usize) -> LLVMResult {","class":"linePartCov","hits":"1","order":"772","possible_hits":"2",},
{"lineNum":"   92","line":"        unsafe { crate::platform::dealloc_memory(ptr, size) }","class":"lineCov","hits":"1","order":"773","possible_hits":"1",},
{"lineNum":"   93","line":"    }","class":"lineCov","hits":"1","order":"779","possible_hits":"1",},
{"lineNum":"   94","line":""},
{"lineNum":"   95","line":"    extern \"C\" fn lookup_vm_symbol(name_ptr: *const c_char, length: usize) -> *const vm::Func {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   96","line":"        #[cfg(target_os = \"macos\")]"},
{"lineNum":"   97","line":"        macro_rules! fn_name {"},
{"lineNum":"   98","line":"            ($s:literal) => {"},
{"lineNum":"   99","line":"                concat!(\"_\", $s)"},
{"lineNum":"  100","line":"            };"},
{"lineNum":"  101","line":"        }"},
{"lineNum":"  102","line":""},
{"lineNum":"  103","line":"        #[cfg(not(target_os = \"macos\"))]"},
{"lineNum":"  104","line":"        macro_rules! fn_name {"},
{"lineNum":"  105","line":"            ($s:literal) => {"},
{"lineNum":"  106","line":"                $s"},
{"lineNum":"  107","line":"            };"},
{"lineNum":"  108","line":"        }"},
{"lineNum":"  109","line":""},
{"lineNum":"  110","line":"        let name_slice = unsafe { slice::from_raw_parts(name_ptr as *const u8, length) };","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  111","line":"        let name = str::from_utf8(name_slice).unwrap();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  112","line":""},
{"lineNum":"  113","line":"        match name {","class":"lineNoCov","hits":"0","possible_hits":"10",},
{"lineNum":"  114","line":"            fn_name!(\"vm.memory.grow.dynamic.local\") => vmcalls::local_dynamic_memory_grow as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  115","line":"            fn_name!(\"vm.memory.size.dynamic.local\") => vmcalls::local_dynamic_memory_size as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  116","line":"            fn_name!(\"vm.memory.grow.static.local\") => vmcalls::local_static_memory_grow as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  117","line":"            fn_name!(\"vm.memory.size.static.local\") => vmcalls::local_static_memory_size as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  118","line":""},
{"lineNum":"  119","line":"            fn_name!(\"vm.memory.grow.dynamic.import\") => vmcalls::imported_dynamic_memory_grow as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  120","line":"            fn_name!(\"vm.memory.size.dynamic.import\") => vmcalls::imported_dynamic_memory_size as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  121","line":"            fn_name!(\"vm.memory.grow.static.import\") => vmcalls::imported_static_memory_grow as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  122","line":"            fn_name!(\"vm.memory.size.static.import\") => vmcalls::imported_static_memory_size as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  123","line":""},
{"lineNum":"  124","line":"            fn_name!(\"vm.exception.trap\") => throw_trap as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  125","line":"            fn_name!(\"vm.breakpoint\") => throw_breakpoint as _,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  126","line":""},
{"lineNum":"  127","line":"            _ => ptr::null(),","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  128","line":"        }"},
{"lineNum":"  129","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  130","line":""},
{"lineNum":"  131","line":"    extern \"C\" fn visit_fde(fde: *mut u8, size: usize, visitor: extern \"C\" fn(*mut u8)) {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  132","line":"        unsafe {"},
{"lineNum":"  133","line":"            crate::platform::visit_fde(fde, size, visitor);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  134","line":"        }"},
{"lineNum":"  135","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  136","line":""},
{"lineNum":"  137","line":"    Callbacks {","class":"lineCov","hits":"1","order":"584","possible_hits":"1",},
{"lineNum":"  138","line":"        alloc_memory,"},
{"lineNum":"  139","line":"        protect_memory,"},
{"lineNum":"  140","line":"        dealloc_memory,"},
{"lineNum":"  141","line":"        lookup_vm_symbol,"},
{"lineNum":"  142","line":"        visit_fde,"},
{"lineNum":"  143","line":"    }"},
{"lineNum":"  144","line":"}","class":"linePartCov","hits":"1","order":"585","possible_hits":"2",},
{"lineNum":"  145","line":""},
{"lineNum":"  146","line":"pub enum Buffer {"},
{"lineNum":"  147","line":"    LlvmMemory(MemoryBuffer),"},
{"lineNum":"  148","line":"    Memory(Memory),"},
{"lineNum":"  149","line":"}"},
{"lineNum":"  150","line":""},
{"lineNum":"  151","line":"impl Deref for Buffer {"},
{"lineNum":"  152","line":"    type Target = [u8];"},
{"lineNum":"  153","line":"    fn deref(&self) -> &[u8] {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  154","line":"        match self {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  155","line":"            Buffer::LlvmMemory(mem_buffer) => mem_buffer.as_slice(),","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  156","line":"            Buffer::Memory(memory) => unsafe { memory.as_slice() },","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  157","line":"        }"},
{"lineNum":"  158","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  159","line":"}"},
{"lineNum":"  160","line":""},
{"lineNum":"  161","line":"unsafe impl Send for LLVMBackend {}"},
{"lineNum":"  162","line":"unsafe impl Sync for LLVMBackend {}"},
{"lineNum":"  163","line":""},
{"lineNum":"  164","line":"pub struct LLVMBackend {"},
{"lineNum":"  165","line":"    module: *mut LLVMModule,"},
{"lineNum":"  166","line":"    #[allow(dead_code)]"},
{"lineNum":"  167","line":"    buffer: Arc<Buffer>,"},
{"lineNum":"  168","line":"    msm: Option<ModuleStateMap>,"},
{"lineNum":"  169","line":"    local_func_id_to_offset: Vec<usize>,"},
{"lineNum":"  170","line":"}"},
{"lineNum":"  171","line":""},
{"lineNum":"  172","line":"impl LLVMBackend {"},
{"lineNum":"  173","line":"    pub fn new(","class":"linePartCov","hits":"1","order":"576","possible_hits":"2",},
{"lineNum":"  174","line":"        module: Rc<RefCell<Module>>,"},
{"lineNum":"  175","line":"        _intrinsics: Intrinsics,"},
{"lineNum":"  176","line":"        _stackmaps: &StackmapRegistry,"},
{"lineNum":"  177","line":"        _module_info: &ModuleInfo,"},
{"lineNum":"  178","line":"        target_machine: &TargetMachine,"},
{"lineNum":"  179","line":"    ) -> (Self, LLVMCache) {"},
{"lineNum":"  180","line":"        let memory_buffer = target_machine","class":"lineCov","hits":"3","order":"577","possible_hits":"3",},
{"lineNum":"  181","line":"            .write_to_memory_buffer(&module.borrow_mut(), FileType::Object)","class":"lineCov","hits":"2","order":"578","possible_hits":"2",},
{"lineNum":"  182","line":"            .unwrap();","class":"linePartCov","hits":"1","order":"579","possible_hits":"2",},
{"lineNum":"  183","line":"        let mem_buf_slice = memory_buffer.as_slice();","class":"lineCov","hits":"1","order":"580","possible_hits":"1",},
{"lineNum":"  184","line":""},
{"lineNum":"  185","line":"        if let Some(path) = unsafe { &crate::GLOBAL_OPTIONS.obj_file } {","class":"linePartCov","hits":"1","order":"581","possible_hits":"2",},
{"lineNum":"  186","line":"            let mut file = File::create(path).unwrap();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  187","line":"            let mut pos = 0;","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  188","line":"            while pos < mem_buf_slice.len() {","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  189","line":"                pos += file.write(&mem_buf_slice[pos..]).unwrap();","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  190","line":"            }"},
{"lineNum":"  191","line":"        }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  192","line":""},
{"lineNum":"  193","line":"        let callbacks = get_callbacks();","class":"lineCov","hits":"1","order":"582","possible_hits":"1",},
{"lineNum":"  194","line":"        let mut module: *mut LLVMModule = ptr::null_mut();","class":"lineCov","hits":"1","order":"586","possible_hits":"1",},
{"lineNum":"  195","line":""},
{"lineNum":"  196","line":"        let res = unsafe {"},
{"lineNum":"  197","line":"            module_load(","class":"lineCov","hits":"1","order":"590","possible_hits":"1",},
{"lineNum":"  198","line":"                mem_buf_slice.as_ptr(),","class":"lineCov","hits":"1","order":"587","possible_hits":"1",},
{"lineNum":"  199","line":"                mem_buf_slice.len(),","class":"lineCov","hits":"1","order":"588","possible_hits":"1",},
{"lineNum":"  200","line":"                callbacks,","class":"lineCov","hits":"1","order":"589","possible_hits":"1",},
{"lineNum":"  201","line":"                &mut module,"},
{"lineNum":"  202","line":"            )"},
{"lineNum":"  203","line":"        };"},
{"lineNum":"  204","line":""},
{"lineNum":"  205","line":"        if res != LLVMResult::OK {","class":"lineCov","hits":"1","order":"686","possible_hits":"1",},
{"lineNum":"  206","line":"            panic!(\"failed to load object\")","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  207","line":"        }"},
{"lineNum":"  208","line":""},
{"lineNum":"  209","line":"        let buffer = Arc::new(Buffer::LlvmMemory(memory_buffer));","class":"lineCov","hits":"2","order":"688","possible_hits":"2",},
{"lineNum":"  210","line":""},
{"lineNum":"  211","line":"        #[cfg(all(any(target_os = \"linux\", target_os = \"macos\"), target_arch = \"x86_64\"))]"},
{"lineNum":"  212","line":"        {"},
{"lineNum":"  213","line":"            use super::stackmap::{self, StkMapRecord, StkSizeRecord};"},
{"lineNum":"  214","line":"            use std::collections::BTreeMap;"},
{"lineNum":"  215","line":""},
{"lineNum":"  216","line":"            let stackmaps = _stackmaps;","class":"lineCov","hits":"1","order":"689","possible_hits":"1",},
{"lineNum":"  217","line":"            let module_info = _module_info;","class":"lineCov","hits":"1","order":"690","possible_hits":"1",},
{"lineNum":"  218","line":""},
{"lineNum":"  219","line":"            let raw_stackmap = unsafe {"},
{"lineNum":"  220","line":"                std::slice::from_raw_parts(","class":"lineCov","hits":"1","order":"707","possible_hits":"1",},
{"lineNum":"  221","line":"                    llvm_backend_get_stack_map_ptr(module),","class":"lineCov","hits":"1","order":"691","possible_hits":"1",},
{"lineNum":"  222","line":"                    llvm_backend_get_stack_map_size(module),","class":"lineCov","hits":"1","order":"699","possible_hits":"1",},
{"lineNum":"  223","line":"                )"},
{"lineNum":"  224","line":"            };"},
{"lineNum":"  225","line":"            if raw_stackmap.len() > 0 {","class":"lineCov","hits":"1","order":"708","possible_hits":"1",},
{"lineNum":"  226","line":"                let map = stackmap::StackMap::parse(raw_stackmap).unwrap();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  227","line":""},
{"lineNum":"  228","line":"                let (code_ptr, code_size) = unsafe {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  229","line":"                    (","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  230","line":"                        llvm_backend_get_code_ptr(module),","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  231","line":"                        llvm_backend_get_code_size(module),","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  232","line":"                    )"},
{"lineNum":"  233","line":"                };"},
{"lineNum":"  234","line":"                let mut msm = ModuleStateMap {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  235","line":"                    local_functions: Default::default(),","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  236","line":"                    total_size: code_size,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  237","line":"                };"},
{"lineNum":"  238","line":""},
{"lineNum":"  239","line":"                let num_local_functions ="},
{"lineNum":"  240","line":"                    module_info.func_assoc.len() - module_info.imported_functions.len();","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  241","line":"                let mut local_func_id_to_addr: Vec<usize> = Vec::with_capacity(num_local_functions);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  242","line":""},
{"lineNum":"  243","line":"                // All local functions."},
{"lineNum":"  244","line":"                for index in module_info.imported_functions.len()..module_info.func_assoc.len() {","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  245","line":"                    let name = if cfg!(target_os = \"macos\") {","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  246","line":"                        format!(\"_fn{}\", index)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  247","line":"                    } else {"},
{"lineNum":"  248","line":"                        format!(\"fn{}\", index)","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  249","line":"                    };"},
{"lineNum":"  250","line":""},
{"lineNum":"  251","line":"                    let c_str = CString::new(name).unwrap();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  252","line":"                    let ptr = unsafe { get_func_symbol(module, c_str.as_ptr()) };","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  253","line":""},
{"lineNum":"  254","line":"                    assert!(!ptr.is_null());","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  255","line":"                    local_func_id_to_addr.push(ptr as usize);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  256","line":"                }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  257","line":""},
{"lineNum":"  258","line":"                let mut addr_to_size_record: BTreeMap<usize, &StkSizeRecord> = BTreeMap::new();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  259","line":""},
{"lineNum":"  260","line":"                for record in &map.stk_size_records {","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  261","line":"                    addr_to_size_record.insert(record.function_address as usize, record);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  262","line":"                }"},
{"lineNum":"  263","line":""},
{"lineNum":"  264","line":"                let mut map_records: BTreeMap<usize, &StkMapRecord> = BTreeMap::new();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  265","line":""},
{"lineNum":"  266","line":"                for record in &map.stk_map_records {","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  267","line":"                    map_records.insert(record.patchpoint_id as usize, record);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  268","line":"                }"},
{"lineNum":"  269","line":""},
{"lineNum":"  270","line":"                for ((start_id, start_entry), (end_id, end_entry)) in stackmaps","class":"lineNoCov","hits":"0","possible_hits":"5",},
{"lineNum":"  271","line":"                    .entries"},
{"lineNum":"  272","line":"                    .iter()"},
{"lineNum":"  273","line":"                    .enumerate()"},
{"lineNum":"  274","line":"                    .step_by(2)"},
{"lineNum":"  275","line":"                    .zip(stackmaps.entries.iter().enumerate().skip(1).step_by(2))","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  276","line":"                {"},
{"lineNum":"  277","line":"                    if let Some(map_record) = map_records.get(&start_id) {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  278","line":"                        assert_eq!(start_id, map_record.patchpoint_id as usize);","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  279","line":"                        assert!(start_entry.is_start);","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  280","line":"                        assert!(!end_entry.is_start);","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  281","line":""},
{"lineNum":"  282","line":"                        let end_record = map_records.get(&end_id);","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  283","line":""},
{"lineNum":"  284","line":"                        let addr = local_func_id_to_addr[start_entry.local_function_id];","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  285","line":"                        let size_record = *addr_to_size_record","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  286","line":"                            .get(&addr)"},
{"lineNum":"  287","line":"                            .expect(\"size_record not found\");"},
{"lineNum":"  288","line":""},
{"lineNum":"  289","line":"                        start_entry.populate_msm(","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  290","line":"                            module_info,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  291","line":"                            code_ptr as usize,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  292","line":"                            &map,"},
{"lineNum":"  293","line":"                            size_record,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  294","line":"                            map_record,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  295","line":"                            end_record.map(|x| (end_entry, *x)),","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  296","line":"                            &mut msm,"},
{"lineNum":"  297","line":"                        );"},
{"lineNum":"  298","line":"                    } else {"},
{"lineNum":"  299","line":"                        // The record is optimized out."},
{"lineNum":"  300","line":"                    }"},
{"lineNum":"  301","line":"                }"},
{"lineNum":"  302","line":""},
{"lineNum":"  303","line":"                let code_ptr = unsafe { llvm_backend_get_code_ptr(module) } as usize;","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  304","line":"                let code_len = unsafe { llvm_backend_get_code_size(module) } as usize;","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  305","line":""},
{"lineNum":"  306","line":"                let local_func_id_to_offset: Vec<usize> = local_func_id_to_addr","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  307","line":"                    .iter()"},
{"lineNum":"  308","line":"                    .map(|&x| {","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  309","line":"                        assert!(x >= code_ptr && x < code_ptr + code_len);","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  310","line":"                        x - code_ptr","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  311","line":"                    })","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  312","line":"                    .collect();"},
{"lineNum":"  313","line":""},
{"lineNum":"  314","line":"                return (","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  315","line":"                    Self {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  316","line":"                        module,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  317","line":"                        buffer: Arc::clone(&buffer),","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  318","line":"                        msm: Some(msm),","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  319","line":"                        local_func_id_to_offset,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  320","line":"                    },"},
{"lineNum":"  321","line":"                    LLVMCache { buffer },","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  322","line":"                );"},
{"lineNum":"  323","line":"            }","class":"lineNoCov","hits":"0","possible_hits":"6",},
{"lineNum":"  324","line":"        }"},
{"lineNum":"  325","line":""},
{"lineNum":"  326","line":"        // Stackmap is not supported on this platform, or this module contains no functions so no stackmaps."},
{"lineNum":"  327","line":"        (","class":"lineCov","hits":"1","order":"715","possible_hits":"1",},
{"lineNum":"  328","line":"            Self {","class":"lineCov","hits":"1","order":"713","possible_hits":"1",},
{"lineNum":"  329","line":"                module,","class":"lineCov","hits":"1","order":"709","possible_hits":"1",},
{"lineNum":"  330","line":"                buffer: Arc::clone(&buffer),","class":"lineCov","hits":"2","order":"710","possible_hits":"2",},
{"lineNum":"  331","line":"                msm: None,","class":"lineCov","hits":"1","order":"711","possible_hits":"1",},
{"lineNum":"  332","line":"                local_func_id_to_offset: vec![],","class":"lineCov","hits":"1","order":"712","possible_hits":"1",},
{"lineNum":"  333","line":"            },","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  334","line":"            LLVMCache { buffer },","class":"lineCov","hits":"1","order":"714","possible_hits":"1",},
{"lineNum":"  335","line":"        )"},
{"lineNum":"  336","line":"    }","class":"linePartCov","hits":"2","order":"716","possible_hits":"5",},
{"lineNum":"  337","line":""},
{"lineNum":"  338","line":"    pub unsafe fn from_buffer(memory: Memory) -> Result<(Self, LLVMCache), String> {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  339","line":"        let callbacks = get_callbacks();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  340","line":"        let mut module: *mut LLVMModule = ptr::null_mut();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  341","line":""},
{"lineNum":"  342","line":"        let slice = memory.as_slice();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  343","line":""},
{"lineNum":"  344","line":"        let res = module_load(slice.as_ptr(), slice.len(), callbacks, &mut module);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  345","line":""},
{"lineNum":"  346","line":"        if res != LLVMResult::OK {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  347","line":"            return Err(\"failed to load object\".to_string());","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  348","line":"        }"},
{"lineNum":"  349","line":""},
{"lineNum":"  350","line":"        SIGNAL_HANDLER_INSTALLED.call_once(|| {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  351","line":"            crate::platform::install_signal_handler();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  352","line":"        });","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  353","line":""},
{"lineNum":"  354","line":"        let buffer = Arc::new(Buffer::Memory(memory));","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  355","line":""},
{"lineNum":"  356","line":"        Ok((","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  357","line":"            Self {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  358","line":"                module,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  359","line":"                buffer: Arc::clone(&buffer),","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  360","line":"                msm: None,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  361","line":"                local_func_id_to_offset: vec![],","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  362","line":"            },","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  363","line":"            LLVMCache { buffer },","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  364","line":"        ))"},
{"lineNum":"  365","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  366","line":"}"},
{"lineNum":"  367","line":""},
{"lineNum":"  368","line":"impl Drop for LLVMBackend {"},
{"lineNum":"  369","line":"    fn drop(&mut self) {","class":"lineCov","hits":"1","order":"761","possible_hits":"1",},
{"lineNum":"  370","line":"        unsafe { module_delete(self.module) }","class":"lineCov","hits":"1","order":"762","possible_hits":"1",},
{"lineNum":"  371","line":"    }","class":"linePartCov","hits":"1","order":"782","possible_hits":"2",},
{"lineNum":"  372","line":"}"},
{"lineNum":"  373","line":""},
{"lineNum":"  374","line":"impl RunnableModule for LLVMBackend {"},
{"lineNum":"  375","line":"    fn get_func(","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  376","line":"        &self,"},
{"lineNum":"  377","line":"        info: &ModuleInfo,"},
{"lineNum":"  378","line":"        local_func_index: LocalFuncIndex,"},
{"lineNum":"  379","line":"    ) -> Option<NonNull<vm::Func>> {"},
{"lineNum":"  380","line":"        let index = info.imported_functions.len() + local_func_index.index();","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  381","line":"        let name = if cfg!(target_os = \"macos\") {","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  382","line":"            format!(\"_fn{}\", index)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  383","line":"        } else {"},
{"lineNum":"  384","line":"            format!(\"fn{}\", index)","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  385","line":"        };"},
{"lineNum":"  386","line":""},
{"lineNum":"  387","line":"        let c_str = CString::new(name).ok()?;","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  388","line":"        let ptr = unsafe { get_func_symbol(self.module, c_str.as_ptr()) };","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  389","line":""},
{"lineNum":"  390","line":"        NonNull::new(ptr as _)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  391","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  392","line":""},
{"lineNum":"  393","line":"    fn get_trampoline(&self, _: &ModuleInfo, sig_index: SigIndex) -> Option<Wasm> {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  394","line":"        let trampoline: Trampoline = unsafe {"},
{"lineNum":"  395","line":"            let name = if cfg!(target_os = \"macos\") {","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  396","line":"                format!(\"_trmp{}\", sig_index.index())","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  397","line":"            } else {"},
{"lineNum":"  398","line":"                format!(\"trmp{}\", sig_index.index())","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  399","line":"            };"},
{"lineNum":"  400","line":""},
{"lineNum":"  401","line":"            let c_str = CString::new(name).unwrap();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  402","line":"            let symbol = get_func_symbol(self.module, c_str.as_ptr());","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  403","line":"            assert!(!symbol.is_null());","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  404","line":""},
{"lineNum":"  405","line":"            mem::transmute(symbol)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  406","line":"        };","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  407","line":""},
{"lineNum":"  408","line":"        SIGNAL_HANDLER_INSTALLED.call_once(|| unsafe {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  409","line":"            crate::platform::install_signal_handler();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  410","line":"        });","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  411","line":""},
{"lineNum":"  412","line":"        Some(unsafe { Wasm::from_raw_parts(trampoline, invoke_trampoline, None) })","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  413","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  414","line":""},
{"lineNum":"  415","line":"    fn get_code(&self) -> Option<&[u8]> {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  416","line":"        Some(unsafe {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  417","line":"            std::slice::from_raw_parts(","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  418","line":"                llvm_backend_get_code_ptr(self.module),","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  419","line":"                llvm_backend_get_code_size(self.module),","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  420","line":"            )"},
{"lineNum":"  421","line":"        })"},
{"lineNum":"  422","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  423","line":""},
{"lineNum":"  424","line":"    fn get_local_function_offsets(&self) -> Option<Vec<usize>> {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  425","line":"        Some(self.local_func_id_to_offset.clone())","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  426","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  427","line":""},
{"lineNum":"  428","line":"    fn get_module_state_map(&self) -> Option<ModuleStateMap> {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  429","line":"        self.msm.clone()","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  430","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  431","line":""},
{"lineNum":"  432","line":"    unsafe fn do_early_trap(&self, data: Box<dyn Any>) -> ! {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  433","line":"        throw_any(Box::leak(data))","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  434","line":"    }"},
{"lineNum":"  435","line":"}"},
{"lineNum":"  436","line":""},
{"lineNum":"  437","line":"unsafe impl Send for LLVMCache {}"},
{"lineNum":"  438","line":"unsafe impl Sync for LLVMCache {}"},
{"lineNum":"  439","line":""},
{"lineNum":"  440","line":"pub struct LLVMCache {"},
{"lineNum":"  441","line":"    buffer: Arc<Buffer>,"},
{"lineNum":"  442","line":"}"},
{"lineNum":"  443","line":""},
{"lineNum":"  444","line":"impl CacheGen for LLVMCache {"},
{"lineNum":"  445","line":"    fn generate_cache(&self) -> Result<(Box<[u8]>, Memory), CacheError> {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  446","line":"        let mut memory = Memory::with_size_protect(self.buffer.len(), Protect::ReadWrite)","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  447","line":"            .map_err(CacheError::SerializeError)?;","class":"lineNoCov","hits":"0","possible_hits":"6",},
{"lineNum":"  448","line":""},
{"lineNum":"  449","line":"        let buffer = self.buffer.deref();","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  450","line":""},
{"lineNum":"  451","line":"        unsafe {"},
{"lineNum":"  452","line":"            memory.as_slice_mut()[..buffer.len()].copy_from_slice(buffer);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  453","line":"        }"},
{"lineNum":"  454","line":""},
{"lineNum":"  455","line":"        Ok(([].as_ref().into(), memory))","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  456","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  457","line":"}"},
]};
var percent_low = 25;var percent_high = 75;
var header = { "command" : "compile_debug", "date" : "2019-11-28 11:37:30", "instrumented" : 193, "covered" : 43,};
var merged_data = [];
