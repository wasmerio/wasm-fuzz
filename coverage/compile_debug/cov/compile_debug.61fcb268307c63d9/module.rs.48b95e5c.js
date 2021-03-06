var data = {lines:[
{"lineNum":"    1","line":"//! The module module contains the implementation data structures and helper functions used to"},
{"lineNum":"    2","line":"//! manipulate and access wasm modules."},
{"lineNum":"    3","line":"use crate::{"},
{"lineNum":"    4","line":"    backend::{Backend, RunnableModule},"},
{"lineNum":"    5","line":"    cache::{Artifact, Error as CacheError},"},
{"lineNum":"    6","line":"    error,"},
{"lineNum":"    7","line":"    import::ImportObject,"},
{"lineNum":"    8","line":"    structures::{Map, TypedIndex},"},
{"lineNum":"    9","line":"    types::{"},
{"lineNum":"   10","line":"        FuncIndex, FuncSig, GlobalDescriptor, GlobalIndex, GlobalInit, ImportedFuncIndex,"},
{"lineNum":"   11","line":"        ImportedGlobalIndex, ImportedMemoryIndex, ImportedTableIndex, Initializer,"},
{"lineNum":"   12","line":"        LocalGlobalIndex, LocalMemoryIndex, LocalTableIndex, MemoryDescriptor, MemoryIndex,"},
{"lineNum":"   13","line":"        SigIndex, TableDescriptor, TableIndex,"},
{"lineNum":"   14","line":"    },"},
{"lineNum":"   15","line":"    Instance,"},
{"lineNum":"   16","line":"};"},
{"lineNum":"   17","line":""},
{"lineNum":"   18","line":"use crate::backend::CacheGen;"},
{"lineNum":"   19","line":"use indexmap::IndexMap;"},
{"lineNum":"   20","line":"use std::collections::HashMap;"},
{"lineNum":"   21","line":"use std::sync::Arc;"},
{"lineNum":"   22","line":""},
{"lineNum":"   23","line":"/// This is used to instantiate a new WebAssembly module."},
{"lineNum":"   24","line":"#[doc(hidden)]"},
{"lineNum":"   25","line":"pub struct ModuleInner {"},
{"lineNum":"   26","line":"    pub runnable_module: Box<dyn RunnableModule>,"},
{"lineNum":"   27","line":"    pub cache_gen: Box<dyn CacheGen>,"},
{"lineNum":"   28","line":""},
{"lineNum":"   29","line":"    pub info: ModuleInfo,"},
{"lineNum":"   30","line":"}"},
{"lineNum":"   31","line":""},
{"lineNum":"   32","line":"/// Container for module data including memories, globals, tables, imports, and exports."},
{"lineNum":"   33","line":"#[derive(Clone, Debug, Serialize, Deserialize)]","class":"lineNoCov","hits":"0","possible_hits":"20",},
{"lineNum":"   34","line":"pub struct ModuleInfo {"},
{"lineNum":"   35","line":"    /// Map of memory index to memory descriptors."},
{"lineNum":"   36","line":"    // This are strictly local and the typesystem ensures that."},
{"lineNum":"   37","line":"    pub memories: Map<LocalMemoryIndex, MemoryDescriptor>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   38","line":"    /// Map of global index to global descriptors."},
{"lineNum":"   39","line":"    pub globals: Map<LocalGlobalIndex, GlobalInit>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   40","line":"    /// Map of table index to table descriptors."},
{"lineNum":"   41","line":"    pub tables: Map<LocalTableIndex, TableDescriptor>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   42","line":""},
{"lineNum":"   43","line":"    /// Map of imported function index to import name."},
{"lineNum":"   44","line":"    // These are strictly imported and the typesystem ensures that."},
{"lineNum":"   45","line":"    pub imported_functions: Map<ImportedFuncIndex, ImportName>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   46","line":"    /// Map of imported memory index to import name and memory descriptor."},
{"lineNum":"   47","line":"    pub imported_memories: Map<ImportedMemoryIndex, (ImportName, MemoryDescriptor)>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   48","line":"    /// Map of imported table index to import name and table descriptor."},
{"lineNum":"   49","line":"    pub imported_tables: Map<ImportedTableIndex, (ImportName, TableDescriptor)>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   50","line":"    /// Map of imported global index to import name and global descriptor."},
{"lineNum":"   51","line":"    pub imported_globals: Map<ImportedGlobalIndex, (ImportName, GlobalDescriptor)>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   52","line":""},
{"lineNum":"   53","line":"    /// Map of string to export index."},
{"lineNum":"   54","line":"    pub exports: IndexMap<String, ExportIndex>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   55","line":""},
{"lineNum":"   56","line":"    /// Vector of data initializers."},
{"lineNum":"   57","line":"    pub data_initializers: Vec<DataInitializer>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   58","line":"    /// Vector of table initializers."},
{"lineNum":"   59","line":"    pub elem_initializers: Vec<TableInitializer>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   60","line":""},
{"lineNum":"   61","line":"    /// Index of optional start function."},
{"lineNum":"   62","line":"    pub start_func: Option<FuncIndex>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   63","line":""},
{"lineNum":"   64","line":"    /// Map function index to signature index."},
{"lineNum":"   65","line":"    pub func_assoc: Map<FuncIndex, SigIndex>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   66","line":"    /// Map signature index to function signature."},
{"lineNum":"   67","line":"    pub signatures: Map<SigIndex, FuncSig>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   68","line":"    /// Backend."},
{"lineNum":"   69","line":"    pub backend: Backend,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   70","line":""},
{"lineNum":"   71","line":"    /// Table of namespace indexes."},
{"lineNum":"   72","line":"    pub namespace_table: StringTable<NamespaceIndex>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   73","line":"    /// Table of name indexes."},
{"lineNum":"   74","line":"    pub name_table: StringTable<NameIndex>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   75","line":""},
{"lineNum":"   76","line":"    /// Symbol information from emscripten."},
{"lineNum":"   77","line":"    pub em_symbol_map: Option<HashMap<u32, String>>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   78","line":""},
{"lineNum":"   79","line":"    /// Custom sections."},
{"lineNum":"   80","line":"    pub custom_sections: HashMap<String, Vec<u8>>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   81","line":"}"},
{"lineNum":"   82","line":""},
{"lineNum":"   83","line":"impl ModuleInfo {"},
{"lineNum":"   84","line":"    /// Creates custom section info from the given wasm file."},
{"lineNum":"   85","line":"    pub fn import_custom_sections(&mut self, wasm: &[u8]) -> crate::error::ParseResult<()> {","class":"linePartCov","hits":"1","order":"748","possible_hits":"2",},
{"lineNum":"   86","line":"        let mut parser = wasmparser::ModuleReader::new(wasm)?;","class":"linePartCov","hits":"2","order":"749","possible_hits":"3",},
{"lineNum":"   87","line":"        while !parser.eof() {","class":"linePartCov","hits":"1","order":"750","possible_hits":"2",},
{"lineNum":"   88","line":"            let section = parser.read()?;","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   89","line":"            if let wasmparser::SectionCode::Custom { name, kind: _ } = section.code {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   90","line":"                let mut reader = section.get_binary_reader();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   91","line":"                let len = reader.bytes_remaining();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   92","line":"                let bytes = reader.read_bytes(len)?;","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   93","line":"                let data = bytes.to_vec();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   94","line":"                let name = name.to_string();","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   95","line":"                self.custom_sections.insert(name, data);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   96","line":"            }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   97","line":"        }"},
{"lineNum":"   98","line":"        Ok(())","class":"lineCov","hits":"1","order":"751","possible_hits":"1",},
{"lineNum":"   99","line":"    }","class":"lineCov","hits":"2","order":"752","possible_hits":"2",},
{"lineNum":"  100","line":"}"},
{"lineNum":"  101","line":""},
{"lineNum":"  102","line":"/// A compiled WebAssembly module."},
{"lineNum":"  103","line":"///"},
{"lineNum":"  104","line":"/// `Module` is returned by the [`compile`] and"},
{"lineNum":"  105","line":"/// [`compile_with`] functions."},
{"lineNum":"  106","line":"///"},
{"lineNum":"  107","line":"/// [`compile`]: fn.compile.html"},
{"lineNum":"  108","line":"/// [`compile_with`]: fn.compile_with.html"},
{"lineNum":"  109","line":"pub struct Module {"},
{"lineNum":"  110","line":"    inner: Arc<ModuleInner>,"},
{"lineNum":"  111","line":"}"},
{"lineNum":"  112","line":""},
{"lineNum":"  113","line":"impl Module {"},
{"lineNum":"  114","line":"    pub(crate) fn new(inner: Arc<ModuleInner>) -> Self {","class":"lineCov","hits":"1","order":"754","possible_hits":"1",},
{"lineNum":"  115","line":"        Module { inner }","class":"lineCov","hits":"1","order":"755","possible_hits":"1",},
{"lineNum":"  116","line":"    }","class":"linePartCov","hits":"1","order":"756","possible_hits":"2",},
{"lineNum":"  117","line":""},
{"lineNum":"  118","line":"    /// Instantiate a WebAssembly module with the provided [`ImportObject`]."},
{"lineNum":"  119","line":"    ///"},
{"lineNum":"  120","line":"    /// [`ImportObject`]: struct.ImportObject.html"},
{"lineNum":"  121","line":"    ///"},
{"lineNum":"  122","line":"    /// # Note:"},
{"lineNum":"  123","line":"    /// Instantiating a `Module` will also call the function designated as `start`"},
{"lineNum":"  124","line":"    /// in the WebAssembly module, if there is one."},
{"lineNum":"  125","line":"    ///"},
{"lineNum":"  126","line":"    /// # Usage:"},
{"lineNum":"  127","line":"    /// ```"},
{"lineNum":"  128","line":"    /// # use wasmer_runtime_core::error::Result;"},
{"lineNum":"  129","line":"    /// # use wasmer_runtime_core::Module;"},
{"lineNum":"  130","line":"    /// # use wasmer_runtime_core::imports;"},
{"lineNum":"  131","line":"    /// # fn instantiate(module: &Module) -> Result<()> {"},
{"lineNum":"  132","line":"    /// let import_object = imports! {"},
{"lineNum":"  133","line":"    ///     // ..."},
{"lineNum":"  134","line":"    /// };"},
{"lineNum":"  135","line":"    /// let instance = module.instantiate(&import_object)?;"},
{"lineNum":"  136","line":"    /// // ..."},
{"lineNum":"  137","line":"    /// # Ok(())"},
{"lineNum":"  138","line":"    /// # }"},
{"lineNum":"  139","line":"    /// ```"},
{"lineNum":"  140","line":"    pub fn instantiate(&self, import_object: &ImportObject) -> error::Result<Instance> {"},
{"lineNum":"  141","line":"        Instance::new(Arc::clone(&self.inner), import_object)"},
{"lineNum":"  142","line":"    }"},
{"lineNum":"  143","line":""},
{"lineNum":"  144","line":"    /// Create a cache artifact from this module."},
{"lineNum":"  145","line":"    pub fn cache(&self) -> Result<Artifact, CacheError> {"},
{"lineNum":"  146","line":"        let (backend_metadata, code) = self.inner.cache_gen.generate_cache()?;"},
{"lineNum":"  147","line":"        Ok(Artifact::from_parts("},
{"lineNum":"  148","line":"            Box::new(self.inner.info.clone()),"},
{"lineNum":"  149","line":"            backend_metadata,"},
{"lineNum":"  150","line":"            code,"},
{"lineNum":"  151","line":"        ))"},
{"lineNum":"  152","line":"    }"},
{"lineNum":"  153","line":""},
{"lineNum":"  154","line":"    /// Get the module data for this module."},
{"lineNum":"  155","line":"    pub fn info(&self) -> &ModuleInfo {"},
{"lineNum":"  156","line":"        &self.inner.info"},
{"lineNum":"  157","line":"    }"},
{"lineNum":"  158","line":"}"},
{"lineNum":"  159","line":""},
{"lineNum":"  160","line":"impl Clone for Module {"},
{"lineNum":"  161","line":"    fn clone(&self) -> Self {"},
{"lineNum":"  162","line":"        Self {"},
{"lineNum":"  163","line":"            inner: Arc::clone(&self.inner),"},
{"lineNum":"  164","line":"        }"},
{"lineNum":"  165","line":"    }"},
{"lineNum":"  166","line":"}"},
{"lineNum":"  167","line":""},
{"lineNum":"  168","line":"impl ModuleInner {}"},
{"lineNum":"  169","line":""},
{"lineNum":"  170","line":"#[doc(hidden)]"},
{"lineNum":"  171","line":"#[derive(Serialize, Deserialize, Debug, Clone)]","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  172","line":"pub struct ImportName {"},
{"lineNum":"  173","line":"    pub namespace_index: NamespaceIndex,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  174","line":"    pub name_index: NameIndex,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  175","line":"}"},
{"lineNum":"  176","line":""},
{"lineNum":"  177","line":"/// Kinds of export indexes."},
{"lineNum":"  178","line":"#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]","class":"lineNoCov","hits":"0","possible_hits":"10",},
{"lineNum":"  179","line":"pub enum ExportIndex {"},
{"lineNum":"  180","line":"    /// Function export index."},
{"lineNum":"  181","line":"    Func(FuncIndex),","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  182","line":"    /// Memory export index."},
{"lineNum":"  183","line":"    Memory(MemoryIndex),","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  184","line":"    /// Global export index."},
{"lineNum":"  185","line":"    Global(GlobalIndex),","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  186","line":"    /// Table export index."},
{"lineNum":"  187","line":"    Table(TableIndex),","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  188","line":"}"},
{"lineNum":"  189","line":""},
{"lineNum":"  190","line":"/// A data initializer for linear memory."},
{"lineNum":"  191","line":"#[derive(Serialize, Deserialize, Debug, Clone)]","class":"lineNoCov","hits":"0","possible_hits":"5",},
{"lineNum":"  192","line":"pub struct DataInitializer {"},
{"lineNum":"  193","line":"    /// The index of the memory to initialize."},
{"lineNum":"  194","line":"    pub memory_index: MemoryIndex,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  195","line":"    /// Either a constant offset or a `get_global`"},
{"lineNum":"  196","line":"    pub base: Initializer,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  197","line":"    /// The initialization data."},
{"lineNum":"  198","line":"    #[cfg_attr(feature = \"cache\", serde(with = \"serde_bytes\"))]"},
{"lineNum":"  199","line":"    pub data: Vec<u8>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  200","line":"}"},
{"lineNum":"  201","line":""},
{"lineNum":"  202","line":"/// A WebAssembly table initializer."},
{"lineNum":"  203","line":"#[derive(Serialize, Deserialize, Debug, Clone)]","class":"lineNoCov","hits":"0","possible_hits":"5",},
{"lineNum":"  204","line":"pub struct TableInitializer {"},
{"lineNum":"  205","line":"    /// The index of a table to initialize."},
{"lineNum":"  206","line":"    pub table_index: TableIndex,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  207","line":"    /// Either a constant offset or a `get_global`"},
{"lineNum":"  208","line":"    pub base: Initializer,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  209","line":"    /// The values to write into the table elements."},
{"lineNum":"  210","line":"    pub elements: Vec<FuncIndex>,","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  211","line":"}"},
{"lineNum":"  212","line":""},
{"lineNum":"  213","line":"/// String table builder."},
{"lineNum":"  214","line":"pub struct StringTableBuilder<K: TypedIndex> {"},
{"lineNum":"  215","line":"    map: IndexMap<String, (K, u32, u32)>,"},
{"lineNum":"  216","line":"    buffer: String,"},
{"lineNum":"  217","line":"    count: u32,"},
{"lineNum":"  218","line":"}"},
{"lineNum":"  219","line":""},
{"lineNum":"  220","line":"impl<K: TypedIndex> StringTableBuilder<K> {"},
{"lineNum":"  221","line":"    /// Creates a new `StringTableBuilder`."},
{"lineNum":"  222","line":"    pub fn new() -> Self {","class":"linePartCov","hits":"2","order":"436","possible_hits":"4",},
{"lineNum":"  223","line":"        Self {","class":"lineCov","hits":"2","order":"439","possible_hits":"2",},
{"lineNum":"  224","line":"            map: IndexMap::new(),","class":"lineCov","hits":"2","order":"437","possible_hits":"2",},
{"lineNum":"  225","line":"            buffer: String::new(),","class":"lineCov","hits":"2","order":"438","possible_hits":"2",},
{"lineNum":"  226","line":"            count: 0,"},
{"lineNum":"  227","line":"        }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  228","line":"    }","class":"lineCov","hits":"2","order":"440","possible_hits":"2",},
{"lineNum":"  229","line":""},
{"lineNum":"  230","line":"    /// Register a new string into table."},
{"lineNum":"  231","line":"    pub fn register<S>(&mut self, s: S) -> K","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  232","line":"    where"},
{"lineNum":"  233","line":"        S: Into<String> + AsRef<str>,"},
{"lineNum":"  234","line":"    {"},
{"lineNum":"  235","line":"        let s_str = s.as_ref();","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  236","line":""},
{"lineNum":"  237","line":"        if self.map.contains_key(s_str) {","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  238","line":"            self.map[s_str].0","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  239","line":"        } else {"},
{"lineNum":"  240","line":"            let offset = self.buffer.len();","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  241","line":"            let length = s_str.len();","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  242","line":"            let index = TypedIndex::new(self.count as _);","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  243","line":""},
{"lineNum":"  244","line":"            self.buffer.push_str(s_str);","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  245","line":"            self.map","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  246","line":"                .insert(s.into(), (index, offset as u32, length as u32));","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  247","line":"            self.count += 1;","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  248","line":""},
{"lineNum":"  249","line":"            index","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  250","line":"        }"},
{"lineNum":"  251","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  252","line":""},
{"lineNum":"  253","line":"    /// Finish building the `StringTable`."},
{"lineNum":"  254","line":"    pub fn finish(self) -> StringTable<K> {","class":"linePartCov","hits":"2","order":"449","possible_hits":"4",},
{"lineNum":"  255","line":"        let table = self","class":"lineCov","hits":"6","order":"450","possible_hits":"6",},
{"lineNum":"  256","line":"            .map"},
{"lineNum":"  257","line":"            .values()"},
{"lineNum":"  258","line":"            .map(|(_, offset, length)| (*offset, *length))","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  259","line":"            .collect();"},
{"lineNum":"  260","line":""},
{"lineNum":"  261","line":"        StringTable {","class":"lineCov","hits":"2","order":"458","possible_hits":"2",},
{"lineNum":"  262","line":"            table,","class":"lineCov","hits":"2","order":"456","possible_hits":"2",},
{"lineNum":"  263","line":"            buffer: self.buffer,","class":"lineCov","hits":"2","order":"457","possible_hits":"2",},
{"lineNum":"  264","line":"        }"},
{"lineNum":"  265","line":"    }","class":"linePartCov","hits":"2","order":"459","possible_hits":"4",},
{"lineNum":"  266","line":"}"},
{"lineNum":"  267","line":""},
{"lineNum":"  268","line":"/// A map of index to string."},
{"lineNum":"  269","line":"#[derive(Serialize, Deserialize, Debug, Clone)]","class":"lineNoCov","hits":"0","possible_hits":"8",},
{"lineNum":"  270","line":"pub struct StringTable<K: TypedIndex> {"},
{"lineNum":"  271","line":"    table: Map<K, (u32, u32)>,","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  272","line":"    buffer: String,","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"  273","line":"}"},
{"lineNum":"  274","line":""},
{"lineNum":"  275","line":"impl<K: TypedIndex> StringTable<K> {"},
{"lineNum":"  276","line":"    /// Creates a `StringTable`."},
{"lineNum":"  277","line":"    pub fn new() -> Self {","class":"linePartCov","hits":"2","order":"422","possible_hits":"4",},
{"lineNum":"  278","line":"        Self {","class":"lineCov","hits":"2","order":"425","possible_hits":"2",},
{"lineNum":"  279","line":"            table: Map::new(),","class":"lineCov","hits":"2","order":"423","possible_hits":"2",},
{"lineNum":"  280","line":"            buffer: String::new(),","class":"lineCov","hits":"2","order":"424","possible_hits":"2",},
{"lineNum":"  281","line":"        }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  282","line":"    }","class":"lineCov","hits":"2","order":"426","possible_hits":"2",},
{"lineNum":"  283","line":""},
{"lineNum":"  284","line":"    /// Gets a reference to a string at the given index."},
{"lineNum":"  285","line":"    pub fn get(&self, index: K) -> &str {"},
{"lineNum":"  286","line":"        let (offset, length) = self.table[index];"},
{"lineNum":"  287","line":"        let offset = offset as usize;"},
{"lineNum":"  288","line":"        let length = length as usize;"},
{"lineNum":"  289","line":""},
{"lineNum":"  290","line":"        &self.buffer[offset..offset + length]"},
{"lineNum":"  291","line":"    }"},
{"lineNum":"  292","line":"}"},
{"lineNum":"  293","line":""},
{"lineNum":"  294","line":"/// Namespace index."},
{"lineNum":"  295","line":"#[derive(Serialize, Deserialize, Debug, Copy, Clone, PartialEq, Eq, Hash)]","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  296","line":"pub struct NamespaceIndex(u32);","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  297","line":""},
{"lineNum":"  298","line":"impl TypedIndex for NamespaceIndex {"},
{"lineNum":"  299","line":"    #[doc(hidden)]"},
{"lineNum":"  300","line":"    fn new(index: usize) -> Self {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  301","line":"        NamespaceIndex(index as _)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  302","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  303","line":""},
{"lineNum":"  304","line":"    #[doc(hidden)]"},
{"lineNum":"  305","line":"    fn index(&self) -> usize {"},
{"lineNum":"  306","line":"        self.0 as usize"},
{"lineNum":"  307","line":"    }"},
{"lineNum":"  308","line":"}"},
{"lineNum":"  309","line":""},
{"lineNum":"  310","line":"/// Name index."},
{"lineNum":"  311","line":"#[derive(Serialize, Deserialize, Debug, Copy, Clone, PartialEq, Eq, Hash)]","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"  312","line":"pub struct NameIndex(u32);","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  313","line":""},
{"lineNum":"  314","line":"impl TypedIndex for NameIndex {"},
{"lineNum":"  315","line":"    #[doc(hidden)]"},
{"lineNum":"  316","line":"    fn new(index: usize) -> Self {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  317","line":"        NameIndex(index as _)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  318","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  319","line":""},
{"lineNum":"  320","line":"    #[doc(hidden)]"},
{"lineNum":"  321","line":"    fn index(&self) -> usize {"},
{"lineNum":"  322","line":"        self.0 as usize"},
{"lineNum":"  323","line":"    }"},
{"lineNum":"  324","line":"}"},
]};
var percent_low = 25;var percent_high = 75;
var header = { "command" : "compile_debug", "date" : "2019-11-28 11:37:30", "instrumented" : 97, "covered" : 24,};
var merged_data = [];
