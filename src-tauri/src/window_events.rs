use tauri::{Manager, AppHandle, Window};

use super::fs_app::constants::START_ON_BOOT_CHANGE_REPLY_EVENT;

#[tauri::command]
pub fn start_on_boot_change(app: AppHandle, new_value: bool) {
    app.emit_all(START_ON_BOOT_CHANGE_REPLY_EVENT, new_value).unwrap();
}

#[tauri::command]
pub fn set_window_title(window: Window, title: &str) {
    window.set_title(title).unwrap();
}