// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod fs_app;
use fs_app::{
    get_dir_content::{get_dir_content, search_by_name}, 
    get_os_disks::get_os_disks, 
    modify_files::{
        create_file, 
        existent_file, 
        rename_file, 
        open_file, 
        get_path_parent, 
        get_autocomplete, 
        move_to_trash, 
        restore_file,
        move_file,
        copy_file,
        get_file_content,
        get_img_blob
    },
    open_application::{open_terminal, open_windows_fs}, 
};

mod remove_app;
use remove_app::get_reg_content::{get_all_apps, search_app_reg};
use remove_app::launch_app::launch_app;


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            //? fs
            // disks & dirTree 
            get_os_disks,

            // get files/dirs
            get_dir_content,
            search_by_name,
            
            // modify files/dir
            open_file,
            copy_file,
            rename_file,
            move_file,
            create_file,
            move_to_trash,
            restore_file,
            get_file_content,
            get_img_blob,
            
            // utils
            open_terminal,
            open_windows_fs,
            get_autocomplete,
            existent_file,
            get_path_parent,
            
            //? apps
            search_app_reg,
            get_all_apps,
            launch_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
