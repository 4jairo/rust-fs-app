use std:: path::PathBuf;
use rustc_hash::FxHashMap;

pub type HashMapTreeType = FxHashMap<String, Vec<PathBuf>>;

pub mod constants {
    pub const TREE_CHANGE_REPLY_EVENT: &str = "dir_tree_change";
    pub const GET_OS_DISKS_REPLY_EVENT: &str = "os_disks_listener";
    pub const FINISH_DISCOVER_DISK_REPLY_EVENT: &str = "finish_discover_disk";
    pub const START_ON_BOOT_CHANGE_REPLY_EVENT: &str = "start_on_boot_listener";
    pub const ERROR_REPLY_EVENT: &str = "error_listener";
}

pub mod error_format {
    use tauri::{AppHandle, Manager};
    use super::constants::ERROR_REPLY_EVENT;

    pub fn stringify(err: impl ToString) -> String {
        err.to_string()
    }
    pub fn send_err(err: &String, app_handle: &AppHandle) {
        app_handle
            .emit_all(ERROR_REPLY_EVENT, err)
            .unwrap();
    }
}

// pub mod frequent_files;
pub mod dir_content;
pub mod get_dir_content;
pub mod get_os_disks;
//pub mod get_os_disks2;
pub mod modify_files;
pub mod notify_changes;
pub mod open_application;
pub mod timer;
pub mod cacher;