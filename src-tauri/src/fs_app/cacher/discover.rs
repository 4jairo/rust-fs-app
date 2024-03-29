use lazy_static::lazy_static;
use rayon::prelude::*;
use std::{path::PathBuf, sync::Mutex};
use std::fs::{self, ReadDir};
use crate::fs_app::dir_content::DirContent;
use crate::fs_app::HashMapTreeType;
use crate::fs_app::error_format::stringify;
use crate::fs_app::get_os_disks::{DISKS, DiskStatus};
use crate::fs_app::timer;

lazy_static! {
    pub static ref DIR_TREE_CACHE: Mutex<HashMapTreeType> = Mutex::new(HashMapTreeType::default());
}

fn walk_from_dir(files: ReadDir) {
    for file in files {
        let file = match file {
            Ok(dir_entry) => dir_entry,
            Err(_) => continue
        };
        
        let file_path = file.path();
        if file.file_type().unwrap().is_dir() {
            // -> is dir && not permissions error
            if let Ok(dir_content) = fs::read_dir(&file_path) {
                walk_from_dir(dir_content)
            }
        }
    
        let file_name = file.file_name().to_string_lossy().to_string();
        let file_dirname = file_path.parent().unwrap().to_path_buf();
        
        let dir_tree = &mut DIR_TREE_CACHE.lock().unwrap();
        dir_tree
            .entry(file_name)
            .or_insert(Vec::new())
            .push(file_dirname);
    }
}

pub struct DirTreeSearcher;
impl DirTreeSearcher {
    pub fn not_case_sensitive_exact_name(lower_value: &str, search_path: &str) -> Vec<DirContent> {
        let dir_tree_cache = &DIR_TREE_CACHE.lock().unwrap();
        dir_tree_cache
            .par_iter()
            .filter(|(key, _)| key.to_lowercase() == lower_value)
            .flat_map(|(name, paths)| to_dir_content(name, paths, search_path))
            .collect()
    }

    pub fn case_sensitive_exact_name(value: &str, search_path: &str) -> Vec<DirContent> {
        let dir_tree_cache = &DIR_TREE_CACHE.lock().unwrap();
        let result = dir_tree_cache.get(value).cloned().unwrap_or_default();

        to_dir_content(&value.to_string(), &result, search_path)
    }

    pub fn not_case_sensitive_not_exact_name(lower_value: &str, search_path: &str) -> Vec<DirContent> {
        let dir_tree_cache = &DIR_TREE_CACHE.lock().unwrap();

        dir_tree_cache
            .par_iter()
            .filter(|(key, _)| key.to_lowercase().contains(lower_value))
            .flat_map(|(name, paths)| to_dir_content(name, paths, search_path))
            .collect()
    }

    pub fn case_sensitive_not_exact_name(value: &str, search_path: &str) -> Vec<DirContent> {
        let dir_tree_cache = &DIR_TREE_CACHE.lock().unwrap();

        dir_tree_cache
            .par_iter()
            .filter(|(key, _)| key.contains(value))
            .flat_map(|(name, paths)| to_dir_content(name, paths, search_path))
            .collect()
    }
}

fn to_dir_content(name: &String, paths: &Vec<PathBuf>, path: &str) -> Vec<DirContent> {
    paths
        .iter()
        .filter_map(|file_folder_path| {
            if !file_folder_path.starts_with(path) {
                return None;
            }

            let file_path = file_folder_path.join(&name);
            let file_path_string = file_path.to_str().unwrap().to_string();

            match fs::metadata(file_path) {
                Ok(metadata) => Some(DirContent::from_metadata(
                    file_path_string,
                    name.clone(),
                    metadata,
                )),
                Err(_) => None,
            }
        })
        .collect()
}

pub fn discover_disk(disk_path: &String) -> Result<u128, String> {
    // add keys
    let dir_content = fs::read_dir(disk_path)
    .map_err(stringify)?;

    let result = Ok(timer::get_timing_ms(|| walk_from_dir( dir_content)));

    let disks = &mut DISKS.lock().unwrap();
    if let Some(disk) = disks.disks.get_mut(disk_path) {
        disk.status = DiskStatus::Loaded;
    }

    result
}

pub fn un_discover_disk(disk_path: String) {
    let dir_tree = &mut DIR_TREE_CACHE.lock().unwrap();

    dir_tree
        .par_iter_mut()
        .for_each(|(_, paths)| {
            paths.retain(|path| {
                !path.starts_with(&disk_path)
            });
        }); 
}
