use std::fs::Metadata;
use std::time::{Duration, UNIX_EPOCH};

#[derive(serde::Serialize, Debug, Clone)]
pub struct DirContent {
    name: String,
    is_file: bool,
    byte_size: u64,
    last_modified: u64,
    path: String,
}

impl DirContent {
    pub fn from_metadata(file_path: String, file_name: String, metadata: Metadata) -> Self {
        let last_modified_date: u64 = metadata
            .modified()
            .unwrap()
            .duration_since(UNIX_EPOCH)
            .unwrap_or(Duration::from_millis(0))
            .as_millis()
            .try_into()
            .unwrap_or(u64::MAX);

        Self {
            name: file_name,
            path: file_path,
            is_file: metadata.is_file(),
            byte_size: metadata.len(),
            last_modified: last_modified_date,
        }
    }
}
