use std::ffi::OsString;
use std::fs::{self, File};
use std::path::PathBuf;
use std::{path::Path, process::Command};
use std::io;
use super::cacher::deleted_files;
use super::error_format::stringify;

// used in copy_file && move_file if when `new_dir` contains `copy_path` path
fn rename_existent_file(new_dir: &PathBuf, copy_path: &mut PathBuf) -> Result<(), io::Error> {
    let path_names = fs::read_dir(new_dir)?
        .map(|entr| entr.unwrap().file_name())
        .collect::<Vec<_>>();
    let mut i = 0;

    let original_name = copy_path.file_name().unwrap();
    loop {
        let mut new_name = OsString::from(format!("({}) ", i));
        new_name.push(original_name);

        let mut found = false;
        for entr in path_names.iter() {
            if *entr == new_name {
                found = true;
                break;
            }
        }

        if !found {
            copy_path.pop();
            copy_path.push(new_name);

            break Ok(())
        }

        // if name alredy exists
        i += 1;
    }
}

#[derive(Default, Debug, PartialEq)]
enum CopyMoveRules {
    #[default]
    CreateNewName,
    OverWrite,
    Skip
}
impl CopyMoveRules {
    fn from_str(value: &str) -> Option<Self> {
        match value {
            "OverWrite" => Some(Self::OverWrite),
            "Skip" => Some(Self::Skip),
            "CreateNewName" => Some(Self::CreateNewName),
            _ => None
        }
    }
}


#[tauri::command]
pub fn copy_file(file_paths: Vec<PathBuf>, new_dir: PathBuf, copy_rules: &str) -> Result<(), String> {
    let config = CopyMoveRules::from_str(copy_rules).unwrap_or_default();
    Ok(
        copy_file_inner(file_paths, new_dir, &config).map_err(stringify)?
    )
}
fn copy_file_inner(file_paths: Vec<PathBuf>, new_dir: PathBuf, config: &CopyMoveRules) -> Result<(), io::Error> {
    for path in file_paths {
        if path.is_dir() {
            // getting permissions
            let permissions = path.metadata()?.permissions();
            let dir_name = path.file_name().unwrap();

            //create file path with its old permissions
            let mut new_path = new_dir.join(dir_name);

            if fs::create_dir(&new_path).is_err() {
                match config {
                    CopyMoveRules::CreateNewName => rename_existent_file(&new_dir, &mut new_path)?,
                    CopyMoveRules::Skip => continue,
                    CopyMoveRules::OverWrite => fs::remove_dir_all(&new_path)?
                }
                fs::create_dir(&new_path)?;
            }
            fs::set_permissions(&new_path, permissions)?;

            // copy dir files (inside new folder)
            if let Ok(path_contents) = fs::read_dir(&path) {
                let content = path_contents.map(|entry| {
                    entry.unwrap().path()
                })
                .collect();

                copy_file_inner(content, new_path, config)?;
            }
        } else {
            // copy files
            let file_name = path.file_name().unwrap();
            let mut new_path = new_dir.join(file_name);
            
            if CopyMoveRules::CreateNewName == *config && fs::metadata(&new_path).is_ok() {
                rename_existent_file(&new_dir, &mut new_path)?;
            } else if CopyMoveRules::Skip == *config {
                continue;
            }

            // fs::rename && fs::copy default behavior is over-write the destination path if exists
            // also, these move all the recursive paths inside a dir, but fs::copy gives permission errors (on folders)
           fs::copy(&path, &new_path)?;
        }
    }

    Ok(())
}


#[tauri::command]
pub async fn move_file(file_paths: Vec<PathBuf>, new_dir: PathBuf, copy_rules: &str) -> Result<(), String> {
    let config = CopyMoveRules::from_str(copy_rules).unwrap_or_default();

    for path in file_paths {
        let file_name = path.file_name().unwrap();
        let mut new_path = new_dir.join(file_name);

        if CopyMoveRules::CreateNewName == config && fs::metadata(&new_path).is_ok() {
            rename_existent_file(&new_dir, &mut new_path).map_err(stringify)?;
        } else if CopyMoveRules::Skip == config {
            continue;
        }

        fs::rename(&path, &new_path).map_err(stringify)?;
    }

    Ok(())
}

#[tauri::command]
pub fn move_to_trash(paths: Vec<&str>) -> Result<(), String> {
    // move to trash
    for path in paths.iter() {
        trash::delete(path).map_err(stringify)?;
    }

    // add to deleted history
    let recylcle_deleted_paths = deleted_files::get_deleted_files_item(paths);
    deleted_files::add_deleted_entry(recylcle_deleted_paths);

    Ok(())
}

#[tauri::command]
pub async fn restore_file() -> Result<(), String> {
    deleted_files::restore_deleted_entry()
}

#[tauri::command]
pub async fn create_file(path: &str, is_file: bool) -> Result<(), String> {
    match is_file {
        true => {
            File::create(path).map_err(stringify)?;
        },
        false => fs::create_dir_all(path).map_err(stringify)?
    }

    Ok(())
}

#[derive(serde::Serialize, Default)]
pub struct FileType {
    is_file: bool,
    is_dir: bool
}

#[tauri::command]
pub fn existent_file(path: &str) -> Result<FileType, ()> {
    match fs::metadata(path) {
        Ok(metadata) => Ok(FileType {
            is_dir: metadata.is_dir(),
            is_file: metadata.is_file()
        }),
        Err(_) => Ok(FileType::default())
    }
}

#[tauri::command]
pub async fn get_autocomplete(path: &str) -> Result<Vec<String>, ()> {
    match fs::read_dir(path) {
        Ok(files) => Ok(
            files
                .map(|f| {
                    let name = f.unwrap().file_name();
                    name.to_str().unwrap().to_string()
                })
                .collect::<Vec<String>>()
        ),
        Err(_) => Ok(vec![])
    }
}

#[tauri::command]
pub async fn get_path_parent(path: &Path) -> Result<String, ()> {
    //let path = Path::new(path);
    match path.parent() {
        Some(parent) => Ok(parent.to_str().unwrap().to_owned()),
        None => Err(())
    }
}

#[tauri::command]
pub async fn open_file(file_path: &str, administrator: bool) -> Result<(), String> {
    let output = match administrator {
        false => open::commands(file_path)[0].output(),
        true => Command::new("powershell")
            .arg("-command")
            .arg(format!("Start-Process -FilePath \"{}\" -Verb RunAs", file_path))
            .output()
    }
    .map_err(stringify)?;

    match output.status.success() {
        true => Ok(()),
        false => Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
pub async fn rename_file(from: &str, new_name: &str) -> Result<(), String> {
    let from_parent = Path::new(from).parent();
    let to = match from_parent {
        None => return Err("error getting from's folder".to_string()),
        Some(value) => value,
    }
    .join(new_name);

    fs::rename(from, to).map_err(stringify)?;
    Ok(())
}

#[tauri::command]
pub fn get_file_content(file_path: &str) -> Result<String, String> {
    Ok(
        fs::read_to_string(file_path).map_err(stringify)?
    )
}

#[tauri::command]
pub fn get_img_blob(img_path: &str) -> Result<Vec<u8>, String> {
    Ok(
        fs::read(img_path).map_err(stringify)?
    )
}