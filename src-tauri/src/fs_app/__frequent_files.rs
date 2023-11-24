use std::{path::PathBuf, sync::Mutex, fs};
use lazy_static::lazy_static;
use super::dir_content_struct::DirContent;
type FrequentFilesType = Vec<(PathBuf, i128)>;

// not in use
lazy_static! {
    pub static ref FREQUENT_FILES: Mutex<FrequentFilesType> = Mutex::new()
}



#[tauri::command]
pub async fn get_frequent_files() -> Result<Vec<DirContent>, ()> {
    if let Some(app_data_dir) = std::env::var_os("LOCALAPPDATA") {
        let frequent_files_path = PathBuf::from(app_data_dir).join("fs-app").join("frequent.json");
        
    }

    Err(())
}

fn init_frequent_files() -> FrequentFilesType {
    if let Some(app_data_dir) = std::env::var_os("LOCALAPPDATA") {
        let frequent_files_path = PathBuf::from(app_data_dir).join("fs-app").join("frequent.json");
        
        match fs::read_to_string(frequent_files_path) {
            Err(_) => Vec::new(),
            Some(content) => {
                let a = serde_json::Deserializer::from_str(&content).try_into().unwrap();
            }
        }
    }   
}