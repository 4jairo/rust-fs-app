//use super::cacher::searches::{add_search, get_dir_tree_search};
use super::cacher::discover::DirTreeSearcher;
use super::dir_content::DirContent;
use super::error_format::stringify;
use rayon::prelude::*;
use std::fs;

#[tauri::command]
pub fn get_dir_content(path: &str) -> Result<Vec<DirContent>, String> {
    let dir_content = match fs::read_dir(path) {
        Ok(v) => v,
        Err(err) => return Err(stringify(err))
    };

    Ok(
        dir_content
            .into_iter()
            .filter_map(|item| match item {
                Ok(file) => Some(DirContent::from_metadata(
                    file.path().to_str().unwrap().to_string(),
                    file.file_name().to_string_lossy().to_string(),
                    file.metadata().unwrap(),
                )),
                Err(_) => None,
            })
            .collect::<Vec<DirContent>>()
    )
}


#[tauri::command]
pub async fn search_by_name(path: &str, file_name: &str, only_absolute: bool, case_sensitive: bool) -> Result<Vec<DirContent>, ()> {
    let result = if only_absolute {
        match case_sensitive {
            true => DirTreeSearcher::case_sensitive_exact_name(file_name),
            false => DirTreeSearcher::not_case_sensitive_exact_name(&file_name.to_ascii_lowercase())
        }
    } else {
        match case_sensitive {
            true => DirTreeSearcher::case_sensitive_not_exact_name(file_name),
            false => DirTreeSearcher::not_case_sensitive_not_exact_name(&file_name.to_ascii_lowercase())
        }
    };

    Ok(result
        .into_par_iter()
        .flat_map(|(name, paths)| {
            paths
                .into_iter()
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
                .collect::<Vec<DirContent>>()
        })
        .collect::<Vec<DirContent>>()
    )
}