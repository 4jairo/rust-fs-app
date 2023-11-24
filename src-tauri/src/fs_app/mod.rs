use std:: path::PathBuf;
use rustc_hash::FxHashMap;

pub type HashMapTreeType = FxHashMap<String, Vec<PathBuf>>;

pub mod constants {
    pub const TREE_CHANGE_REPLY_EVENT: &str = "dir_tree_change";
    pub const GET_OS_DISKS_REPLY_EVENT: &str = "get_os_disks";
    pub const FINISH_DISCOVER_DISK_REPLY_EVENT: &str = "finish_discover_disk";
    //pub const COPY_ISSUE_REPLY_EVENT: &str = "copy_issue";
}

pub mod error_format {
    pub fn stringify(err: impl ToString) -> String {
        err.to_string()
    }
}

// pub mod frequent_files;
pub mod dir_content;
pub mod get_dir_content;
pub mod get_os_disks;
pub mod modify_files;
pub mod notify_changes;
pub mod open_application;
pub mod timer;
pub mod cacher;