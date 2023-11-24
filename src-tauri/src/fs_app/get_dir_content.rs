//use super::cacher::searches::{add_search, get_dir_tree_search};
use super::cacher::discover::{get_dir_tree_absolute_name, get_dir_tree_not_absolute_name};
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
pub async fn search_by_name(path: &str, file_name: &str, only_absolute: bool) -> Result<Vec<DirContent>, ()> {
    let search_content = match only_absolute {
        true => search_by_name_absolute(path, file_name),
        false => search_by_name_not_absolute(path, file_name)
    }; 

    Ok(search_content)
}


fn search_by_name_absolute(path: &str, file_name: &str) -> Vec<DirContent> {
    get_dir_tree_absolute_name(file_name).unwrap_or(Vec::new())
    .par_iter()
    .filter_map(|file_folder_path| {
        if !file_folder_path.starts_with(path) {
            return None;
        }

        let file_path = file_folder_path.join(file_name);
        let file_path_string = file_path.to_str().unwrap().to_string();
        match fs::metadata(file_path) {
            Err(_) => None,
            Ok(metadata) => Some(DirContent::from_metadata(
                file_path_string,
                file_name.to_string(),
                metadata,
            )),
        }
    })
    .collect::<Vec<DirContent>>()
}

fn search_by_name_not_absolute(path: &str, file_name: &str) -> Vec<DirContent> {
    get_dir_tree_not_absolute_name(file_name)
    .par_iter()
    .flat_map(|(name, paths)| {
        paths
            .into_iter()
            .filter_map(|file_folder_path| {
                if !file_folder_path.starts_with(path) {
                    return None;
                }

                let file_path = file_folder_path.join(name);
                let file_path_string = file_path.to_str().unwrap().to_string();
                let name  = name.to_string();
                match fs::metadata(file_path) {
                    Ok(metadata) => Some(DirContent::from_metadata(
                        file_path_string,
                        name,
                        metadata,
                    )),
                    Err(_) => None,
                }
            })
            .collect::<Vec<DirContent>>()
    })
    .collect::<Vec<DirContent>>()
}




/*

use super::cacher::discover::{get_dir_tree_absolute_name, get_dir_tree_not_absolute_name};
use super::dir_content::DirContent;
use rayon::prelude::*;
use std::fs;

#[tauri::command]
pub fn get_dir_content(path: &str) -> Result<Vec<DirContent>, String> {
    let dir_content = fs::read_dir(path);
    let dir_content = match dir_content {
        Ok(v) => v,
        Err(err) => return Err(err.to_string())
    };

    let response = dir_content
    .into_iter()
    .filter_map(|item| match item {
        Ok(file) => {
            let file_path_string = file.path().to_str().unwrap().to_string();
            let file_name = file.file_name().to_string_lossy().to_string();
            let file_metadata = file.metadata().unwrap();
            Some(DirContent::from_metadata(
                file_path_string,
                file_name,
                file_metadata,
            ))
        }
        Err(_) => None,
    })
    .collect::<Vec<DirContent>>();

    Ok(response)
}

#[tauri::command]
pub async fn search_by_name(path: &str, file_name: &str, only_absolute: bool) -> Result<Vec<DirContent>, ()> {
    match only_absolute {
        true => Ok(search_by_name_absolute(path, file_name)),
        false => Ok(search_by_name_not_absolute(path, file_name))
    }
}

fn search_by_name_absolute(path: &str, file_name: &str) -> Vec<DirContent> {
    get_dir_tree_absolute_name(file_name).unwrap_or(Vec::new())
    .par_iter()
    .filter_map(|file_folder_path| {
        if !file_folder_path.starts_with(path) {
            return None;
        }

        let file_path = file_folder_path.join(file_name);
        let file_path_string = file_path.to_str().unwrap().to_string();
        match fs::metadata(file_path) {
            Err(_) => None,
            Ok(metadata) => Some(DirContent::from_metadata(
                file_path_string,
                file_name.to_string(),
                metadata,
            )),
        }
    })
    .collect::<Vec<DirContent>>()
}

fn search_by_name_not_absolute(path: &str, file_name: &str) -> Vec<DirContent> {
    get_dir_tree_not_absolute_name(file_name)
    .par_iter()
    .flat_map(|(name, paths)| {
        paths
            .into_iter()
            .filter_map(|file_folder_path| {
                if !file_folder_path.starts_with(path) {
                    return None;
                }

                let file_path = file_folder_path.join(name);
                let file_path_string = file_path.to_str().unwrap().to_string();
                let name  = name.to_string();
                match fs::metadata(file_path) {
                    Ok(metadata) => Some(DirContent::from_metadata(
                        file_path_string,
                        name,
                        metadata,
                    )),
                    Err(_) => None,
                }
            })
            .collect::<Vec<DirContent>>()
    })
    .collect::<Vec<DirContent>>()
}

*/