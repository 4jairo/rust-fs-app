use lazy_static::lazy_static;
use rayon::prelude::*;
use std::{path::PathBuf, sync::Mutex};
use std::fs::{self, ReadDir};
use crate::fs_app::HashMapTreeType;
use crate::fs_app::error_format::stringify;
use crate::fs_app::timer;

lazy_static! {
    pub static ref DIR_TREE_CACHE: Mutex<HashMapTreeType> = Mutex::new(HashMapTreeType::default());
}

fn walk_from_dir(files: ReadDir) {
    for file in files.map(|f| f.unwrap()) {
        
        let file_path = file.path();
        let file_dirname = file_path.parent().unwrap().to_path_buf();
        let file_name = file.file_name().to_string_lossy().to_string();

        if file.file_type().unwrap().is_dir() {
            // -> is dir && not permissions error
            if let Ok(dir_content) = fs::read_dir(file_path) {
                walk_from_dir(dir_content)
            }
        }
    
        let dir_tree = &mut DIR_TREE_CACHE.lock().unwrap();

        dir_tree
            .entry(file_name)
            .or_insert(Vec::new())
            .push(file_dirname);
    }
}

pub fn get_dir_tree_absolute_name(value: &str) -> Option<Vec<PathBuf>> {
    let dir_tree_cache = &DIR_TREE_CACHE.lock()
    .expect("unable to lock mutex");

    dir_tree_cache.get(value).cloned()
}

pub fn get_dir_tree_not_absolute_name(value: &str) -> Vec<(String, Vec<PathBuf>)> {
    let dir_tree_cache = &DIR_TREE_CACHE.lock()
    .expect("unable to lock mutex");

    dir_tree_cache
        .par_iter()
        .filter(|(key, _)| key.contains(value))
        .map(|(key, paths)| (key.clone(), paths.to_owned()))
        .collect::<Vec<(String, Vec<PathBuf>)>>()
}

pub fn discover_disk(disk_path: &String) -> Result<u128, String> {
    // add keys
    let dir_content = fs::read_dir(&disk_path)
    .map_err(stringify)?;

    Ok(
        timer::get_timing_ms(|| walk_from_dir( dir_content))
    )
}

pub fn un_discover_disk(disk_path: String) {
    let dir_tree = &mut DIR_TREE_CACHE.lock().unwrap();

    dir_tree
        .par_iter_mut()
        .for_each(|(_, paths)| {
            paths.retain(|path| {
                path.starts_with(&disk_path)
            });
        });
}
