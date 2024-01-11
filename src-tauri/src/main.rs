// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod background;
mod fs_app;
mod remove_app;
mod window_events;

use fs_app::{
    get_dir_content::{get_dir_content, search_by_name}, 
    get_os_disks::{get_os_disks, os_disks_listener}, 
    modify_files::{create_file, existent_file, rename_file, open_file, get_path_parent, get_autocomplete, move_to_trash, restore_file,move_file,copy_file,get_file_content,get_img_blob},
    open_application::{open_terminal, open_windows_fs}, 
};

use remove_app::get_reg_content::{get_all_apps, search_app_reg};
use remove_app::launch_app::launch_app;

use window_events::{start_on_boot_change, set_window_title};
use background::{system_tray_menu, system_tray_event_handler, handle_cli_commands, window_event_handler, handle_cli_from_argv};

use tauri_plugin_autostart::{init as init_on_boot, MacosLauncher};
use tauri_plugin_single_instance::init as single_instance;
use tauri::Manager;

fn main() -> tauri::Result<()> {
    tauri::Builder::default()

        //system tray (taskbar apps menu)
        .system_tray(system_tray_menu())
        .on_system_tray_event(system_tray_event_handler)

        // handle cli commands (--headless command)
        .setup(|app| {
            os_disks_listener(app.app_handle());
            handle_cli_commands(app)
        })

        // keep the backend running (close window event handler)
        .on_window_event(window_event_handler)

        // init on booot plugin (--headless | -h only runs the backend)
        .plugin(init_on_boot(MacosLauncher::LaunchAgent, Some(vec!["-h"])))
        
        // single backend instance plugin
        .plugin(single_instance(|app, argv, _cwd| {
            handle_cli_from_argv(app, argv)
        }))

        // handlers, ...
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
            start_on_boot_change,
            set_window_title,
            
            //? apps
            search_app_reg,
            get_all_apps,
            launch_app
        ])
        .run(tauri::generate_context!())?;
    Ok(())
}
