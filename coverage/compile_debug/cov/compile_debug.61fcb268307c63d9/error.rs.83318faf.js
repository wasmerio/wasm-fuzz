var data = {lines:[
{"lineNum":"    1","line":"//! The error module contains the data structures and helper functions used to implement errors that"},
{"lineNum":"    2","line":"//! are produced and returned from the wasmer runtime core."},
{"lineNum":"    3","line":"use crate::types::{FuncSig, GlobalDescriptor, MemoryDescriptor, TableDescriptor, Type};"},
{"lineNum":"    4","line":"use core::borrow::Borrow;"},
{"lineNum":"    5","line":"use std::any::Any;"},
{"lineNum":"    6","line":""},
{"lineNum":"    7","line":"/// Aliases the standard `Result` type as `Result` within this module."},
{"lineNum":"    8","line":"pub type Result<T> = std::result::Result<T, Error>;"},
{"lineNum":"    9","line":"/// Result of an attempt to compile the provided WebAssembly module into a `Module`."},
{"lineNum":"   10","line":"/// Aliases the standard `Result` with `CompileError` as the default error type."},
{"lineNum":"   11","line":"pub type CompileResult<T> = std::result::Result<T, CompileError>;"},
{"lineNum":"   12","line":"/// Result of an attempt to link the provided WebAssembly instance."},
{"lineNum":"   13","line":"/// Aliases the standard `Result` with `Vec<LinkError>` as the default error type."},
{"lineNum":"   14","line":"pub type LinkResult<T> = std::result::Result<T, Vec<LinkError>>;"},
{"lineNum":"   15","line":"/// Result of an attempt to run the provided WebAssembly instance."},
{"lineNum":"   16","line":"/// Aliases the standard `Result` with `RuntimeError` as the default error type."},
{"lineNum":"   17","line":"pub type RuntimeResult<T> = std::result::Result<T, RuntimeError>;"},
{"lineNum":"   18","line":"/// Result of an attempt to call the provided WebAssembly instance."},
{"lineNum":"   19","line":"/// Aliases the standard `Result` with `CallError` as the default error type."},
{"lineNum":"   20","line":"pub type CallResult<T> = std::result::Result<T, CallError>;"},
{"lineNum":"   21","line":"/// Result of an attempt to resolve a WebAssembly function by name."},
{"lineNum":"   22","line":"/// Aliases the standard `Result` with `ResolveError` as the default error type."},
{"lineNum":"   23","line":"pub type ResolveResult<T> = std::result::Result<T, ResolveError>;"},
{"lineNum":"   24","line":"/// Result of an attempt to parse bytes into a WebAssembly module."},
{"lineNum":"   25","line":"/// Aliases the standard `Result` with `ParseError` as the default error type."},
{"lineNum":"   26","line":"pub type ParseResult<T> = std::result::Result<T, ParseError>;"},
{"lineNum":"   27","line":""},
{"lineNum":"   28","line":"/// This is returned when the chosen compiler is unable to"},
{"lineNum":"   29","line":"/// successfully compile the provided WebAssembly module into"},
{"lineNum":"   30","line":"/// a `Module`."},
{"lineNum":"   31","line":"///"},
{"lineNum":"   32","line":"/// Comparing two `CompileError`s always evaluates to false."},
{"lineNum":"   33","line":"#[derive(Debug, Clone)]"},
{"lineNum":"   34","line":"pub enum CompileError {"},
{"lineNum":"   35","line":"    /// A validation error containing an error message."},
{"lineNum":"   36","line":"    ValidationError {"},
{"lineNum":"   37","line":"        /// An error message."},
{"lineNum":"   38","line":"        msg: String,"},
{"lineNum":"   39","line":"    },"},
{"lineNum":"   40","line":"    /// A internal error containing an error message."},
{"lineNum":"   41","line":"    InternalError {"},
{"lineNum":"   42","line":"        /// An error message."},
{"lineNum":"   43","line":"        msg: String,"},
{"lineNum":"   44","line":"    },"},
{"lineNum":"   45","line":"}"},
{"lineNum":"   46","line":""},
{"lineNum":"   47","line":"impl PartialEq for CompileError {"},
{"lineNum":"   48","line":"    fn eq(&self, _other: &CompileError) -> bool {"},
{"lineNum":"   49","line":"        false"},
{"lineNum":"   50","line":"    }"},
{"lineNum":"   51","line":"}"},
{"lineNum":"   52","line":""},
{"lineNum":"   53","line":"impl std::fmt::Display for CompileError {"},
{"lineNum":"   54","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"   55","line":"        match self {"},
{"lineNum":"   56","line":"            CompileError::InternalError { msg } => {"},
{"lineNum":"   57","line":"                write!(f, \"Internal compiler error: \\\"{}\\\"\", msg)"},
{"lineNum":"   58","line":"            }"},
{"lineNum":"   59","line":"            CompileError::ValidationError { msg } => write!(f, \"Validation error \\\"{}\\\"\", msg),"},
{"lineNum":"   60","line":"        }"},
{"lineNum":"   61","line":"    }"},
{"lineNum":"   62","line":"}"},
{"lineNum":"   63","line":""},
{"lineNum":"   64","line":"impl std::error::Error for CompileError {}"},
{"lineNum":"   65","line":""},
{"lineNum":"   66","line":"/// This is returned when the runtime is unable to"},
{"lineNum":"   67","line":"/// correctly link the module with the provided imports."},
{"lineNum":"   68","line":"///"},
{"lineNum":"   69","line":"/// Comparing two `LinkError`s always evaluates to false."},
{"lineNum":"   70","line":"#[derive(Debug, Clone)]"},
{"lineNum":"   71","line":"pub enum LinkError {"},
{"lineNum":"   72","line":"    /// The type of the provided import does not match the expected type."},
{"lineNum":"   73","line":"    IncorrectImportType {"},
{"lineNum":"   74","line":"        /// Namespace."},
{"lineNum":"   75","line":"        namespace: String,"},
{"lineNum":"   76","line":"        /// Name."},
{"lineNum":"   77","line":"        name: String,"},
{"lineNum":"   78","line":"        /// Expected."},
{"lineNum":"   79","line":"        expected: String,"},
{"lineNum":"   80","line":"        /// Found."},
{"lineNum":"   81","line":"        found: String,"},
{"lineNum":"   82","line":"    },"},
{"lineNum":"   83","line":"    /// The signature of the provided import does not match the expected signature."},
{"lineNum":"   84","line":"    IncorrectImportSignature {"},
{"lineNum":"   85","line":"        /// Namespace."},
{"lineNum":"   86","line":"        namespace: String,"},
{"lineNum":"   87","line":"        /// Name."},
{"lineNum":"   88","line":"        name: String,"},
{"lineNum":"   89","line":"        /// Expected."},
{"lineNum":"   90","line":"        expected: FuncSig,"},
{"lineNum":"   91","line":"        /// Found."},
{"lineNum":"   92","line":"        found: FuncSig,"},
{"lineNum":"   93","line":"    },"},
{"lineNum":"   94","line":"    /// An expected import was not provided."},
{"lineNum":"   95","line":"    ImportNotFound {"},
{"lineNum":"   96","line":"        /// Namespace."},
{"lineNum":"   97","line":"        namespace: String,"},
{"lineNum":"   98","line":"        /// Name."},
{"lineNum":"   99","line":"        name: String,"},
{"lineNum":"  100","line":"    },"},
{"lineNum":"  101","line":"    /// The memory descriptor provided does not match the expected descriptor."},
{"lineNum":"  102","line":"    IncorrectMemoryDescriptor {"},
{"lineNum":"  103","line":"        /// Namespace."},
{"lineNum":"  104","line":"        namespace: String,"},
{"lineNum":"  105","line":"        /// Name."},
{"lineNum":"  106","line":"        name: String,"},
{"lineNum":"  107","line":"        /// Expected."},
{"lineNum":"  108","line":"        expected: MemoryDescriptor,"},
{"lineNum":"  109","line":"        /// Found."},
{"lineNum":"  110","line":"        found: MemoryDescriptor,"},
{"lineNum":"  111","line":"    },"},
{"lineNum":"  112","line":"    /// The table descriptor provided does not match the expected descriptor."},
{"lineNum":"  113","line":"    IncorrectTableDescriptor {"},
{"lineNum":"  114","line":"        /// Namespace."},
{"lineNum":"  115","line":"        namespace: String,"},
{"lineNum":"  116","line":"        /// Name."},
{"lineNum":"  117","line":"        name: String,"},
{"lineNum":"  118","line":"        /// Expected."},
{"lineNum":"  119","line":"        expected: TableDescriptor,"},
{"lineNum":"  120","line":"        /// Found."},
{"lineNum":"  121","line":"        found: TableDescriptor,"},
{"lineNum":"  122","line":"    },"},
{"lineNum":"  123","line":"    /// The global descriptor provided does not match the expected descriptor."},
{"lineNum":"  124","line":"    IncorrectGlobalDescriptor {"},
{"lineNum":"  125","line":"        /// Namespace."},
{"lineNum":"  126","line":"        namespace: String,"},
{"lineNum":"  127","line":"        /// Name."},
{"lineNum":"  128","line":"        name: String,"},
{"lineNum":"  129","line":"        /// Expected."},
{"lineNum":"  130","line":"        expected: GlobalDescriptor,"},
{"lineNum":"  131","line":"        /// Found."},
{"lineNum":"  132","line":"        found: GlobalDescriptor,"},
{"lineNum":"  133","line":"    },"},
{"lineNum":"  134","line":"    /// A generic error with a message."},
{"lineNum":"  135","line":"    Generic {"},
{"lineNum":"  136","line":"        /// Error message."},
{"lineNum":"  137","line":"        message: String,"},
{"lineNum":"  138","line":"    },"},
{"lineNum":"  139","line":"}"},
{"lineNum":"  140","line":""},
{"lineNum":"  141","line":"impl PartialEq for LinkError {"},
{"lineNum":"  142","line":"    fn eq(&self, _other: &LinkError) -> bool {"},
{"lineNum":"  143","line":"        false"},
{"lineNum":"  144","line":"    }"},
{"lineNum":"  145","line":"}"},
{"lineNum":"  146","line":""},
{"lineNum":"  147","line":"impl std::fmt::Display for LinkError {"},
{"lineNum":"  148","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  149","line":"        match self {"},
{"lineNum":"  150","line":"            LinkError::ImportNotFound {namespace, name} => write!(f, \"Import not found, namespace: {}, name: {}\", namespace, name),"},
{"lineNum":"  151","line":"            LinkError::IncorrectGlobalDescriptor {namespace, name,expected,found} => {"},
{"lineNum":"  152","line":"                write!(f, \"Incorrect global descriptor, namespace: {}, name: {}, expected global descriptor: {:?}, found global descriptor: {:?}\", namespace, name, expected, found)"},
{"lineNum":"  153","line":"            },"},
{"lineNum":"  154","line":"            LinkError::IncorrectImportSignature{namespace, name,expected,found} => {"},
{"lineNum":"  155","line":"                write!(f, \"Incorrect import signature, namespace: {}, name: {}, expected signature: {}, found signature: {}\", namespace, name, expected, found)"},
{"lineNum":"  156","line":"            }"},
{"lineNum":"  157","line":"            LinkError::IncorrectImportType{namespace, name,expected,found} => {"},
{"lineNum":"  158","line":"                write!(f, \"Incorrect import type, namespace: {}, name: {}, expected type: {}, found type: {}\", namespace, name, expected, found)"},
{"lineNum":"  159","line":"            }"},
{"lineNum":"  160","line":"            LinkError::IncorrectMemoryDescriptor{namespace, name,expected,found} => {"},
{"lineNum":"  161","line":"                write!(f, \"Incorrect memory descriptor, namespace: {}, name: {}, expected memory descriptor: {:?}, found memory descriptor: {:?}\", namespace, name, expected, found)"},
{"lineNum":"  162","line":"            },"},
{"lineNum":"  163","line":"            LinkError::IncorrectTableDescriptor{namespace, name,expected,found} => {"},
{"lineNum":"  164","line":"                write!(f, \"Incorrect table descriptor, namespace: {}, name: {}, expected table descriptor: {:?}, found table descriptor: {:?}\", namespace, name, expected, found)"},
{"lineNum":"  165","line":"            },"},
{"lineNum":"  166","line":"            LinkError::Generic { message } => {"},
{"lineNum":"  167","line":"                write!(f, \"{}\", message)"},
{"lineNum":"  168","line":"            },"},
{"lineNum":"  169","line":"        }"},
{"lineNum":"  170","line":"    }"},
{"lineNum":"  171","line":"}"},
{"lineNum":"  172","line":""},
{"lineNum":"  173","line":"impl std::error::Error for LinkError {}"},
{"lineNum":"  174","line":""},
{"lineNum":"  175","line":"/// This is the error type returned when calling"},
{"lineNum":"  176","line":"/// a WebAssembly function."},
{"lineNum":"  177","line":"///"},
{"lineNum":"  178","line":"/// The main way to do this is `Instance.call`."},
{"lineNum":"  179","line":"///"},
{"lineNum":"  180","line":"/// Comparing two `RuntimeError`s always evaluates to false."},
{"lineNum":"  181","line":"pub enum RuntimeError {"},
{"lineNum":"  182","line":"    /// Trap."},
{"lineNum":"  183","line":"    Trap {"},
{"lineNum":"  184","line":"        /// Trap message."},
{"lineNum":"  185","line":"        msg: Box<str>,"},
{"lineNum":"  186","line":"    },"},
{"lineNum":"  187","line":"    /// Error."},
{"lineNum":"  188","line":"    Error {"},
{"lineNum":"  189","line":"        /// Error data."},
{"lineNum":"  190","line":"        data: Box<dyn Any>,"},
{"lineNum":"  191","line":"    },"},
{"lineNum":"  192","line":"}"},
{"lineNum":"  193","line":""},
{"lineNum":"  194","line":"impl PartialEq for RuntimeError {"},
{"lineNum":"  195","line":"    fn eq(&self, _other: &RuntimeError) -> bool {"},
{"lineNum":"  196","line":"        false"},
{"lineNum":"  197","line":"    }"},
{"lineNum":"  198","line":"}"},
{"lineNum":"  199","line":""},
{"lineNum":"  200","line":"impl std::fmt::Display for RuntimeError {"},
{"lineNum":"  201","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  202","line":"        match self {"},
{"lineNum":"  203","line":"            RuntimeError::Trap { ref msg } => {"},
{"lineNum":"  204","line":"                write!(f, \"WebAssembly trap occurred during runtime: {}\", msg)"},
{"lineNum":"  205","line":"            }"},
{"lineNum":"  206","line":"            RuntimeError::Error { data } => {"},
{"lineNum":"  207","line":"                if let Some(s) = data.downcast_ref::<String>() {"},
{"lineNum":"  208","line":"                    write!(f, \"\\\"{}\\\"\", s)"},
{"lineNum":"  209","line":"                } else if let Some(s) = data.downcast_ref::<&str>() {"},
{"lineNum":"  210","line":"                    write!(f, \"\\\"{}\\\"\", s)"},
{"lineNum":"  211","line":"                } else {"},
{"lineNum":"  212","line":"                    write!(f, \"unknown error\")"},
{"lineNum":"  213","line":"                }"},
{"lineNum":"  214","line":"            }"},
{"lineNum":"  215","line":"        }"},
{"lineNum":"  216","line":"    }"},
{"lineNum":"  217","line":"}"},
{"lineNum":"  218","line":""},
{"lineNum":"  219","line":"impl std::fmt::Debug for RuntimeError {"},
{"lineNum":"  220","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  221","line":"        write!(f, \"{}\", self)"},
{"lineNum":"  222","line":"    }"},
{"lineNum":"  223","line":"}"},
{"lineNum":"  224","line":""},
{"lineNum":"  225","line":"impl std::error::Error for RuntimeError {}"},
{"lineNum":"  226","line":""},
{"lineNum":"  227","line":"/// This error type is produced by resolving a wasm function"},
{"lineNum":"  228","line":"/// given its name."},
{"lineNum":"  229","line":"///"},
{"lineNum":"  230","line":"/// Comparing two `ResolveError`s always evaluates to false."},
{"lineNum":"  231","line":"#[derive(Debug, Clone)]"},
{"lineNum":"  232","line":"pub enum ResolveError {"},
{"lineNum":"  233","line":"    /// Found signature did not match expected signature."},
{"lineNum":"  234","line":"    Signature {"},
{"lineNum":"  235","line":"        /// Expected `FuncSig`."},
{"lineNum":"  236","line":"        expected: FuncSig,"},
{"lineNum":"  237","line":"        /// Found type."},
{"lineNum":"  238","line":"        found: Vec<Type>,"},
{"lineNum":"  239","line":"    },"},
{"lineNum":"  240","line":"    /// Export not found."},
{"lineNum":"  241","line":"    ExportNotFound {"},
{"lineNum":"  242","line":"        /// Name."},
{"lineNum":"  243","line":"        name: String,"},
{"lineNum":"  244","line":"    },"},
{"lineNum":"  245","line":"    /// Export found with the wrong type."},
{"lineNum":"  246","line":"    ExportWrongType {"},
{"lineNum":"  247","line":"        /// Name."},
{"lineNum":"  248","line":"        name: String,"},
{"lineNum":"  249","line":"    },"},
{"lineNum":"  250","line":"}"},
{"lineNum":"  251","line":""},
{"lineNum":"  252","line":"impl PartialEq for ResolveError {"},
{"lineNum":"  253","line":"    fn eq(&self, _other: &ResolveError) -> bool {"},
{"lineNum":"  254","line":"        false"},
{"lineNum":"  255","line":"    }"},
{"lineNum":"  256","line":"}"},
{"lineNum":"  257","line":""},
{"lineNum":"  258","line":"impl std::fmt::Display for ResolveError {"},
{"lineNum":"  259","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  260","line":"        match self {"},
{"lineNum":"  261","line":"            ResolveError::ExportNotFound { name } => write!(f, \"Export not found: {}\", name),"},
{"lineNum":"  262","line":"            ResolveError::ExportWrongType { name } => write!(f, \"Export wrong type: {}\", name),"},
{"lineNum":"  263","line":"            ResolveError::Signature { expected, found } => {"},
{"lineNum":"  264","line":"                let found = found"},
{"lineNum":"  265","line":"                    .as_slice()"},
{"lineNum":"  266","line":"                    .iter()"},
{"lineNum":"  267","line":"                    .map(|p| p.to_string())"},
{"lineNum":"  268","line":"                    .collect::<Vec<_>>()"},
{"lineNum":"  269","line":"                    .join(\", \");"},
{"lineNum":"  270","line":"                let expected: &FuncSig = expected.borrow();"},
{"lineNum":"  271","line":"                write!("},
{"lineNum":"  272","line":"                    f,"},
{"lineNum":"  273","line":"                    \"Parameters of type [{}] did not match signature {}\","},
{"lineNum":"  274","line":"                    found, expected"},
{"lineNum":"  275","line":"                )"},
{"lineNum":"  276","line":"            }"},
{"lineNum":"  277","line":"        }"},
{"lineNum":"  278","line":"    }"},
{"lineNum":"  279","line":"}"},
{"lineNum":"  280","line":""},
{"lineNum":"  281","line":"impl std::error::Error for ResolveError {}"},
{"lineNum":"  282","line":""},
{"lineNum":"  283","line":"/// This error type is produced by calling a wasm function"},
{"lineNum":"  284","line":"/// exported from a module."},
{"lineNum":"  285","line":"///"},
{"lineNum":"  286","line":"/// If the module traps in some way while running, this will"},
{"lineNum":"  287","line":"/// be the `CallError::Runtime(RuntimeError)` variant."},
{"lineNum":"  288","line":"///"},
{"lineNum":"  289","line":"/// Comparing two `CallError`s always evaluates to false."},
{"lineNum":"  290","line":"pub enum CallError {"},
{"lineNum":"  291","line":"    /// An error occured resolving the functions name or types."},
{"lineNum":"  292","line":"    Resolve(ResolveError),"},
{"lineNum":"  293","line":"    /// A runtime error occurred during the function call."},
{"lineNum":"  294","line":"    Runtime(RuntimeError),"},
{"lineNum":"  295","line":"}"},
{"lineNum":"  296","line":""},
{"lineNum":"  297","line":"impl PartialEq for CallError {"},
{"lineNum":"  298","line":"    fn eq(&self, _other: &CallError) -> bool {"},
{"lineNum":"  299","line":"        false"},
{"lineNum":"  300","line":"    }"},
{"lineNum":"  301","line":"}"},
{"lineNum":"  302","line":""},
{"lineNum":"  303","line":"impl std::fmt::Display for CallError {"},
{"lineNum":"  304","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  305","line":"        match self {"},
{"lineNum":"  306","line":"            CallError::Resolve(resolve_error) => write!(f, \"Call error: {}\", resolve_error),"},
{"lineNum":"  307","line":"            CallError::Runtime(runtime_error) => write!(f, \"Call error: {}\", runtime_error),"},
{"lineNum":"  308","line":"        }"},
{"lineNum":"  309","line":"    }"},
{"lineNum":"  310","line":"}"},
{"lineNum":"  311","line":""},
{"lineNum":"  312","line":"impl std::fmt::Debug for CallError {"},
{"lineNum":"  313","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  314","line":"        match self {"},
{"lineNum":"  315","line":"            CallError::Resolve(resolve_err) => write!(f, \"ResolveError: {:?}\", resolve_err),"},
{"lineNum":"  316","line":"            CallError::Runtime(runtime_err) => write!(f, \"RuntimeError: {:?}\", runtime_err),"},
{"lineNum":"  317","line":"        }"},
{"lineNum":"  318","line":"    }"},
{"lineNum":"  319","line":"}"},
{"lineNum":"  320","line":""},
{"lineNum":"  321","line":"impl std::error::Error for CallError {}"},
{"lineNum":"  322","line":""},
{"lineNum":"  323","line":"/// This error type is produced when creating something,"},
{"lineNum":"  324","line":"/// like a `Memory` or a `Table`."},
{"lineNum":"  325","line":"#[derive(Debug, Clone)]"},
{"lineNum":"  326","line":"pub enum CreationError {"},
{"lineNum":"  327","line":"    /// Unable to create memory error."},
{"lineNum":"  328","line":"    UnableToCreateMemory,"},
{"lineNum":"  329","line":"    /// Unable to create table error."},
{"lineNum":"  330","line":"    UnableToCreateTable,"},
{"lineNum":"  331","line":"    /// Invalid descriptor error with message."},
{"lineNum":"  332","line":"    InvalidDescriptor(String),"},
{"lineNum":"  333","line":"}"},
{"lineNum":"  334","line":""},
{"lineNum":"  335","line":"impl PartialEq for CreationError {"},
{"lineNum":"  336","line":"    fn eq(&self, _other: &CreationError) -> bool {"},
{"lineNum":"  337","line":"        false"},
{"lineNum":"  338","line":"    }"},
{"lineNum":"  339","line":"}"},
{"lineNum":"  340","line":""},
{"lineNum":"  341","line":"impl std::fmt::Display for CreationError {"},
{"lineNum":"  342","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  343","line":"        match self {"},
{"lineNum":"  344","line":"            CreationError::UnableToCreateMemory => write!(f, \"Unable to Create Memory\"),"},
{"lineNum":"  345","line":"            CreationError::UnableToCreateTable => write!(f, \"Unable to Create Table\"),"},
{"lineNum":"  346","line":"            CreationError::InvalidDescriptor(msg) => write!("},
{"lineNum":"  347","line":"                f,"},
{"lineNum":"  348","line":"                \"Unable to create because the supplied descriptor is invalid: \\\"{}\\\"\","},
{"lineNum":"  349","line":"                msg"},
{"lineNum":"  350","line":"            ),"},
{"lineNum":"  351","line":"        }"},
{"lineNum":"  352","line":"    }"},
{"lineNum":"  353","line":"}"},
{"lineNum":"  354","line":""},
{"lineNum":"  355","line":"impl std::error::Error for CreationError {}"},
{"lineNum":"  356","line":""},
{"lineNum":"  357","line":"/// The amalgamation of all errors that can occur"},
{"lineNum":"  358","line":"/// during the compilation, instantiation, or execution"},
{"lineNum":"  359","line":"/// of a WebAssembly module."},
{"lineNum":"  360","line":"///"},
{"lineNum":"  361","line":"/// Comparing two `Error`s always evaluates to false."},
{"lineNum":"  362","line":"#[derive(Debug)]"},
{"lineNum":"  363","line":"pub enum Error {"},
{"lineNum":"  364","line":"    /// Compile error."},
{"lineNum":"  365","line":"    CompileError(CompileError),"},
{"lineNum":"  366","line":"    /// Link errors."},
{"lineNum":"  367","line":"    LinkError(Vec<LinkError>),"},
{"lineNum":"  368","line":"    /// Runtime error."},
{"lineNum":"  369","line":"    RuntimeError(RuntimeError),"},
{"lineNum":"  370","line":"    /// Resolve error."},
{"lineNum":"  371","line":"    ResolveError(ResolveError),"},
{"lineNum":"  372","line":"    /// Call error."},
{"lineNum":"  373","line":"    CallError(CallError),"},
{"lineNum":"  374","line":"    /// Creation error."},
{"lineNum":"  375","line":"    CreationError(CreationError),"},
{"lineNum":"  376","line":"}"},
{"lineNum":"  377","line":""},
{"lineNum":"  378","line":"impl PartialEq for Error {"},
{"lineNum":"  379","line":"    fn eq(&self, _other: &Error) -> bool {"},
{"lineNum":"  380","line":"        false"},
{"lineNum":"  381","line":"    }"},
{"lineNum":"  382","line":"}"},
{"lineNum":"  383","line":""},
{"lineNum":"  384","line":"impl From<CompileError> for Error {"},
{"lineNum":"  385","line":"    fn from(compile_err: CompileError) -> Self {"},
{"lineNum":"  386","line":"        Error::CompileError(compile_err)"},
{"lineNum":"  387","line":"    }"},
{"lineNum":"  388","line":"}"},
{"lineNum":"  389","line":""},
{"lineNum":"  390","line":"impl From<RuntimeError> for Error {"},
{"lineNum":"  391","line":"    fn from(runtime_err: RuntimeError) -> Self {"},
{"lineNum":"  392","line":"        Error::RuntimeError(runtime_err)"},
{"lineNum":"  393","line":"    }"},
{"lineNum":"  394","line":"}"},
{"lineNum":"  395","line":""},
{"lineNum":"  396","line":"impl From<ResolveError> for Error {"},
{"lineNum":"  397","line":"    fn from(resolve_err: ResolveError) -> Self {"},
{"lineNum":"  398","line":"        Error::ResolveError(resolve_err)"},
{"lineNum":"  399","line":"    }"},
{"lineNum":"  400","line":"}"},
{"lineNum":"  401","line":""},
{"lineNum":"  402","line":"impl From<CallError> for Error {"},
{"lineNum":"  403","line":"    fn from(call_err: CallError) -> Self {"},
{"lineNum":"  404","line":"        Error::CallError(call_err)"},
{"lineNum":"  405","line":"    }"},
{"lineNum":"  406","line":"}"},
{"lineNum":"  407","line":""},
{"lineNum":"  408","line":"impl From<CreationError> for Error {"},
{"lineNum":"  409","line":"    fn from(creation_err: CreationError) -> Self {"},
{"lineNum":"  410","line":"        Error::CreationError(creation_err)"},
{"lineNum":"  411","line":"    }"},
{"lineNum":"  412","line":"}"},
{"lineNum":"  413","line":""},
{"lineNum":"  414","line":"impl From<Vec<LinkError>> for Error {"},
{"lineNum":"  415","line":"    fn from(link_errs: Vec<LinkError>) -> Self {"},
{"lineNum":"  416","line":"        Error::LinkError(link_errs)"},
{"lineNum":"  417","line":"    }"},
{"lineNum":"  418","line":"}"},
{"lineNum":"  419","line":""},
{"lineNum":"  420","line":"impl From<RuntimeError> for CallError {"},
{"lineNum":"  421","line":"    fn from(runtime_err: RuntimeError) -> Self {"},
{"lineNum":"  422","line":"        CallError::Runtime(runtime_err)"},
{"lineNum":"  423","line":"    }"},
{"lineNum":"  424","line":"}"},
{"lineNum":"  425","line":""},
{"lineNum":"  426","line":"impl From<ResolveError> for CallError {"},
{"lineNum":"  427","line":"    fn from(resolve_err: ResolveError) -> Self {"},
{"lineNum":"  428","line":"        CallError::Resolve(resolve_err)"},
{"lineNum":"  429","line":"    }"},
{"lineNum":"  430","line":"}"},
{"lineNum":"  431","line":""},
{"lineNum":"  432","line":"impl std::fmt::Display for Error {"},
{"lineNum":"  433","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  434","line":"        match self {"},
{"lineNum":"  435","line":"            Error::CompileError(err) => write!(f, \"compile error: {}\", err),"},
{"lineNum":"  436","line":"            Error::LinkError(errs) => {"},
{"lineNum":"  437","line":"                if errs.len() == 1 {"},
{"lineNum":"  438","line":"                    write!(f, \"link error: {}\", errs[0])"},
{"lineNum":"  439","line":"                } else {"},
{"lineNum":"  440","line":"                    write!(f, \"{} link errors:\", errs.len())?;"},
{"lineNum":"  441","line":"                    for (i, err) in errs.iter().enumerate() {"},
{"lineNum":"  442","line":"                        write!(f, \" ({} of {}) {}\", i + 1, errs.len(), err)?;"},
{"lineNum":"  443","line":"                    }"},
{"lineNum":"  444","line":"                    Ok(())"},
{"lineNum":"  445","line":"                }"},
{"lineNum":"  446","line":"            }"},
{"lineNum":"  447","line":"            Error::RuntimeError(err) => write!(f, \"runtime error: {}\", err),"},
{"lineNum":"  448","line":"            Error::ResolveError(err) => write!(f, \"resolve error: {}\", err),"},
{"lineNum":"  449","line":"            Error::CallError(err) => write!(f, \"call error: {}\", err),"},
{"lineNum":"  450","line":"            Error::CreationError(err) => write!(f, \"creation error: {}\", err),"},
{"lineNum":"  451","line":"        }"},
{"lineNum":"  452","line":"    }"},
{"lineNum":"  453","line":"}"},
{"lineNum":"  454","line":""},
{"lineNum":"  455","line":"impl std::error::Error for Error {}"},
{"lineNum":"  456","line":""},
{"lineNum":"  457","line":"/// An error occurred while growing a memory or table."},
{"lineNum":"  458","line":"#[derive(Debug)]"},
{"lineNum":"  459","line":"pub enum GrowError {"},
{"lineNum":"  460","line":"    /// Error growing memory."},
{"lineNum":"  461","line":"    MemoryGrowError,"},
{"lineNum":"  462","line":"    /// Error growing table."},
{"lineNum":"  463","line":"    TableGrowError,"},
{"lineNum":"  464","line":"    /// Max pages were exceeded."},
{"lineNum":"  465","line":"    ExceededMaxPages(PageError),"},
{"lineNum":"  466","line":"    /// Max pages for memory were exceeded."},
{"lineNum":"  467","line":"    ExceededMaxPagesForMemory(usize, usize),"},
{"lineNum":"  468","line":"    /// Error protecting memory."},
{"lineNum":"  469","line":"    CouldNotProtectMemory(MemoryProtectionError),"},
{"lineNum":"  470","line":"    /// Error creating memory."},
{"lineNum":"  471","line":"    CouldNotCreateMemory(MemoryCreationError),"},
{"lineNum":"  472","line":"}"},
{"lineNum":"  473","line":""},
{"lineNum":"  474","line":"impl std::fmt::Display for GrowError {"},
{"lineNum":"  475","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  476","line":"        match self {"},
{"lineNum":"  477","line":"            GrowError::MemoryGrowError => write!(f, \"Unable to grow memory\"),"},
{"lineNum":"  478","line":"            GrowError::TableGrowError => write!(f, \"Unable to grow table\"),"},
{"lineNum":"  479","line":"            GrowError::ExceededMaxPages(e) => write!(f, \"Grow Error: {}\", e),"},
{"lineNum":"  480","line":"            GrowError::ExceededMaxPagesForMemory(left, added) => write!(f, \"Failed to add pages because would exceed maximum number of pages for the memory. Left: {}, Added: {}\", left, added),"},
{"lineNum":"  481","line":"            GrowError::CouldNotCreateMemory(e) => write!(f, \"Grow Error: {}\", e),"},
{"lineNum":"  482","line":"            GrowError::CouldNotProtectMemory(e) => write!(f, \"Grow Error: {}\", e),"},
{"lineNum":"  483","line":"        }"},
{"lineNum":"  484","line":"    }"},
{"lineNum":"  485","line":"}"},
{"lineNum":"  486","line":""},
{"lineNum":"  487","line":"impl std::error::Error for GrowError {}"},
{"lineNum":"  488","line":""},
{"lineNum":"  489","line":"/// A kind of page error."},
{"lineNum":"  490","line":"#[derive(Debug)]"},
{"lineNum":"  491","line":"pub enum PageError {"},
{"lineNum":"  492","line":"    // left, right, added"},
{"lineNum":"  493","line":"    /// Max pages were exceeded error."},
{"lineNum":"  494","line":"    ExceededMaxPages(usize, usize, usize),"},
{"lineNum":"  495","line":"}"},
{"lineNum":"  496","line":""},
{"lineNum":"  497","line":"impl std::fmt::Display for PageError {"},
{"lineNum":"  498","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  499","line":"        match self {"},
{"lineNum":"  500","line":"            PageError::ExceededMaxPages(left, right, added) => write!(f, \"Failed to add pages because would exceed maximum number of pages. Left: {}, Right: {}, Pages added: {}\", left, right, added),"},
{"lineNum":"  501","line":"        }"},
{"lineNum":"  502","line":"    }"},
{"lineNum":"  503","line":"}"},
{"lineNum":"  504","line":"impl std::error::Error for PageError {}"},
{"lineNum":"  505","line":""},
{"lineNum":"  506","line":"impl Into<GrowError> for PageError {"},
{"lineNum":"  507","line":"    fn into(self) -> GrowError {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  508","line":"        GrowError::ExceededMaxPages(self)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  509","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  510","line":"}"},
{"lineNum":"  511","line":""},
{"lineNum":"  512","line":"/// Error occured while creating memory."},
{"lineNum":"  513","line":"#[derive(Debug)]"},
{"lineNum":"  514","line":"pub enum MemoryCreationError {"},
{"lineNum":"  515","line":"    /// Allocation of virtual memory failed error."},
{"lineNum":"  516","line":"    VirtualMemoryAllocationFailed(usize, String),"},
{"lineNum":"  517","line":"    /// Error creating memory from file."},
{"lineNum":"  518","line":"    CouldNotCreateMemoryFromFile(std::io::Error),"},
{"lineNum":"  519","line":"}"},
{"lineNum":"  520","line":""},
{"lineNum":"  521","line":"impl std::fmt::Display for MemoryCreationError {"},
{"lineNum":"  522","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  523","line":"        match self {"},
{"lineNum":"  524","line":"            MemoryCreationError::VirtualMemoryAllocationFailed(size, msg) => write!("},
{"lineNum":"  525","line":"                f,"},
{"lineNum":"  526","line":"                \"Allocation virtual memory with size {} failed. \\nErrno message: {}\","},
{"lineNum":"  527","line":"                size, msg"},
{"lineNum":"  528","line":"            ),"},
{"lineNum":"  529","line":"            MemoryCreationError::CouldNotCreateMemoryFromFile(e) => write!(f, \"IO Error: {}\", e),"},
{"lineNum":"  530","line":"        }"},
{"lineNum":"  531","line":"    }"},
{"lineNum":"  532","line":"}"},
{"lineNum":"  533","line":"impl std::error::Error for MemoryCreationError {}"},
{"lineNum":"  534","line":""},
{"lineNum":"  535","line":"impl Into<GrowError> for MemoryCreationError {"},
{"lineNum":"  536","line":"    fn into(self) -> GrowError {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  537","line":"        GrowError::CouldNotCreateMemory(self)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  538","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  539","line":"}"},
{"lineNum":"  540","line":""},
{"lineNum":"  541","line":"impl From<std::io::Error> for MemoryCreationError {"},
{"lineNum":"  542","line":"    fn from(io_error: std::io::Error) -> Self {"},
{"lineNum":"  543","line":"        MemoryCreationError::CouldNotCreateMemoryFromFile(io_error)"},
{"lineNum":"  544","line":"    }"},
{"lineNum":"  545","line":"}"},
{"lineNum":"  546","line":""},
{"lineNum":"  547","line":"/// Error protecting memory."},
{"lineNum":"  548","line":"#[derive(Debug)]"},
{"lineNum":"  549","line":"pub enum MemoryProtectionError {"},
{"lineNum":"  550","line":"    /// Protection failed error."},
{"lineNum":"  551","line":"    ProtectionFailed(usize, usize, String),"},
{"lineNum":"  552","line":"}"},
{"lineNum":"  553","line":""},
{"lineNum":"  554","line":"impl std::fmt::Display for MemoryProtectionError {"},
{"lineNum":"  555","line":"    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {"},
{"lineNum":"  556","line":"        match self {"},
{"lineNum":"  557","line":"            MemoryProtectionError::ProtectionFailed(start, size, msg) => write!("},
{"lineNum":"  558","line":"                f,"},
{"lineNum":"  559","line":"                \"Allocation virtual memory starting at {} with size {} failed. \\nErrno message: {}\","},
{"lineNum":"  560","line":"                start, size, msg"},
{"lineNum":"  561","line":"            ),"},
{"lineNum":"  562","line":"        }"},
{"lineNum":"  563","line":"    }"},
{"lineNum":"  564","line":"}"},
{"lineNum":"  565","line":"impl std::error::Error for MemoryProtectionError {}"},
{"lineNum":"  566","line":""},
{"lineNum":"  567","line":"impl Into<GrowError> for MemoryProtectionError {"},
{"lineNum":"  568","line":"    fn into(self) -> GrowError {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  569","line":"        GrowError::CouldNotProtectMemory(self)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  570","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  571","line":"}"},
{"lineNum":"  572","line":""},
{"lineNum":"  573","line":"/// Parse Error."},
{"lineNum":"  574","line":"#[derive(Debug)]","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  575","line":"pub enum ParseError {"},
{"lineNum":"  576","line":"    /// Error reading binary."},
{"lineNum":"  577","line":"    BinaryReadError,"},
{"lineNum":"  578","line":"}"},
{"lineNum":"  579","line":""},
{"lineNum":"  580","line":"impl From<wasmparser::BinaryReaderError> for ParseError {"},
{"lineNum":"  581","line":"    fn from(_: wasmparser::BinaryReaderError) -> Self {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"  582","line":"        ParseError::BinaryReadError"},
{"lineNum":"  583","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"  584","line":"}"},
]};
var percent_low = 25;var percent_high = 75;
var header = { "command" : "compile_debug", "date" : "2019-11-28 11:37:30", "instrumented" : 12, "covered" : 0,};
var merged_data = [];
