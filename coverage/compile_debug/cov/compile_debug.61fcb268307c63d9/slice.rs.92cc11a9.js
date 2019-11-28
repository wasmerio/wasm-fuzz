var data = {lines:[
{"lineNum":"    1","line":"use super::{Iter, IterMut, TypedIndex};"},
{"lineNum":"    2","line":"use std::{"},
{"lineNum":"    3","line":"    marker::PhantomData,"},
{"lineNum":"    4","line":"    ops::{Index, IndexMut},"},
{"lineNum":"    5","line":"};"},
{"lineNum":"    6","line":""},
{"lineNum":"    7","line":"/// This is a dynamically-sized slice"},
{"lineNum":"    8","line":"/// that can only be indexed by the"},
{"lineNum":"    9","line":"/// correct index type."},
{"lineNum":"   10","line":"#[derive(Debug)]"},
{"lineNum":"   11","line":"pub struct SliceMap<K, V>"},
{"lineNum":"   12","line":"where"},
{"lineNum":"   13","line":"    K: TypedIndex,"},
{"lineNum":"   14","line":"{"},
{"lineNum":"   15","line":"    _marker: PhantomData<K>,"},
{"lineNum":"   16","line":"    slice: [V],"},
{"lineNum":"   17","line":"}"},
{"lineNum":"   18","line":""},
{"lineNum":"   19","line":"impl<K, V> SliceMap<K, V>"},
{"lineNum":"   20","line":"where"},
{"lineNum":"   21","line":"    K: TypedIndex,"},
{"lineNum":"   22","line":"{"},
{"lineNum":"   23","line":"    /// Gets a reference to the value at the given index."},
{"lineNum":"   24","line":"    pub fn get(&self, index: K) -> Option<&V> {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   25","line":"        self.slice.get(index.index())","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   26","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"4",},
{"lineNum":"   27","line":""},
{"lineNum":"   28","line":"    /// Gets a mutable reference to the value at the given index."},
{"lineNum":"   29","line":"    pub fn get_mut(&mut self, index: K) -> Option<&mut V> {"},
{"lineNum":"   30","line":"        self.slice.get_mut(index.index())"},
{"lineNum":"   31","line":"    }"},
{"lineNum":"   32","line":""},
{"lineNum":"   33","line":"    /// Gets the length of this slice map."},
{"lineNum":"   34","line":"    pub fn len(&self) -> usize {"},
{"lineNum":"   35","line":"        self.slice.len()"},
{"lineNum":"   36","line":"    }"},
{"lineNum":"   37","line":""},
{"lineNum":"   38","line":"    /// Returns an iterator for this slice map."},
{"lineNum":"   39","line":"    pub fn iter(&self) -> Iter<K, V> {","class":"lineCov","hits":"1","order":"477","possible_hits":"1",},
{"lineNum":"   40","line":"        Iter::new(self.slice.iter())","class":"lineCov","hits":"1","order":"478","possible_hits":"1",},
{"lineNum":"   41","line":"    }","class":"linePartCov","hits":"1","order":"483","possible_hits":"2",},
{"lineNum":"   42","line":""},
{"lineNum":"   43","line":"    /// Returns a mutable iterator for this slice map."},
{"lineNum":"   44","line":"    pub fn iter_mut(&mut self) -> IterMut<K, V> {"},
{"lineNum":"   45","line":"        IterMut::new(self.slice.iter_mut())"},
{"lineNum":"   46","line":"    }"},
{"lineNum":"   47","line":""},
{"lineNum":"   48","line":"    /// Gets a pointer to the `SliceMap`."},
{"lineNum":"   49","line":"    pub fn as_ptr(&self) -> *const V {"},
{"lineNum":"   50","line":"        self as *const SliceMap<K, V> as *const V"},
{"lineNum":"   51","line":"    }"},
{"lineNum":"   52","line":""},
{"lineNum":"   53","line":"    /// Gets a mutable pointer to the `SliceMap`."},
{"lineNum":"   54","line":"    pub fn as_mut_ptr(&mut self) -> *mut V {"},
{"lineNum":"   55","line":"        self as *mut SliceMap<K, V> as *mut V"},
{"lineNum":"   56","line":"    }"},
{"lineNum":"   57","line":"}"},
{"lineNum":"   58","line":""},
{"lineNum":"   59","line":"impl<K, V> Index<K> for SliceMap<K, V>"},
{"lineNum":"   60","line":"where"},
{"lineNum":"   61","line":"    K: TypedIndex,"},
{"lineNum":"   62","line":"{"},
{"lineNum":"   63","line":"    type Output = V;"},
{"lineNum":"   64","line":"    fn index(&self, index: K) -> &V {","class":"lineNoCov","hits":"0","possible_hits":"7",},
{"lineNum":"   65","line":"        &self.slice[index.index()]","class":"lineNoCov","hits":"0","possible_hits":"21",},
{"lineNum":"   66","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"7",},
{"lineNum":"   67","line":"}"},
{"lineNum":"   68","line":""},
{"lineNum":"   69","line":"impl<K, V> IndexMut<K> for SliceMap<K, V>"},
{"lineNum":"   70","line":"where"},
{"lineNum":"   71","line":"    K: TypedIndex,"},
{"lineNum":"   72","line":"{"},
{"lineNum":"   73","line":"    fn index_mut(&mut self, index: K) -> &mut V {"},
{"lineNum":"   74","line":"        &mut self.slice[index.index()]"},
{"lineNum":"   75","line":"    }"},
{"lineNum":"   76","line":"}"},
]};
var percent_low = 25;var percent_high = 75;
var header = { "command" : "compile_debug", "date" : "2019-11-28 11:37:30", "instrumented" : 9, "covered" : 3,};
var merged_data = [];