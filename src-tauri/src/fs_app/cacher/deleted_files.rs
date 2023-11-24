use std::sync::Mutex;
use lazy_static::lazy_static;
use trash::TrashItem;
use crate::fs_app::error_format::stringify;

lazy_static! {
    pub static ref REMOVED_FILES: Mutex<Vec<Vec<TrashItem>>> = Mutex::new(Vec::new());
}

pub fn get_deleted_files_item(deleted_paths: Vec<&str>) -> Vec<TrashItem> { 
    let list = trash::os_limited::list().unwrap_or(vec![]);

    list
        .into_iter()
        .filter(|item| {
            let original_path = item.original_path();
            let path_string = original_path.to_str().unwrap_or_default();

            deleted_paths.contains(&path_string) 
        })
        .collect()
}


pub fn add_deleted_entry(files: Vec<TrashItem>) {
    let removed = &mut REMOVED_FILES.lock().unwrap();
    if removed.len() +1 > 20 {
        removed.remove(0);
    }

    removed.push(files);
}


pub fn restore_deleted_entry() -> Result<(), String> {
    let removed = &mut REMOVED_FILES.lock().unwrap();
    if removed.is_empty() { 
        return Ok(()) 
    }
 
    let last_item_index = removed.len() -1;
    let last_item = removed.remove(last_item_index);

    trash::os_limited::restore_all(last_item)
        .map_err(stringify)
}