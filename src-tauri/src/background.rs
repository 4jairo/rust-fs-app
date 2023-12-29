use std::time::{UNIX_EPOCH, SystemTime};

use tauri::{
    SystemTrayMenu, SystemTray, SystemTrayMenuItem, SystemTrayEvent, CustomMenuItem,
    App, AppHandle, Manager, 
    WindowBuilder, 
    Window, 
    GlobalWindowEvent,
    WindowEvent, WindowUrl, Runtime,
};
use tauri::api::cli::ArgData;
use serde_json::Value;

pub fn new_window<R: Runtime>(visible: bool, manager: &impl Manager<R>) -> Window<R> {
    let label = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_nanos()
        .to_string();

    WindowBuilder::new(manager, label, WindowUrl::App("index.html".into()))
        .visible(visible)
        .fullscreen(false)
        .resizable(true)
        .title("fs-app")
        .inner_size(800.0, 600.0)
        .min_inner_size(860.0, 0.0)
        .center()
        .focused(true)
        .build()
        .unwrap()
}

pub fn show_hidden_or_new_window<R: Runtime>(manager: &impl Manager<R>) {
    let mut create_new_window = true;
    for win in manager.windows().values() {
        if !win.is_visible().unwrap() {
            win.show().unwrap();
            create_new_window = false;
        }
    }

    if create_new_window {
        new_window(true, manager);
    }
}

pub fn system_tray_menu() -> SystemTray {
    let quit = CustomMenuItem::new("quit", "Quit");
    let new_win = CustomMenuItem::new("new", "New");

    let tray_menu = SystemTrayMenu::new()
        .add_item(new_win)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(quit);
    
    SystemTray::new().with_menu(tray_menu)
}

pub fn system_tray_event_handler(app: &AppHandle, event: SystemTrayEvent) {
    if let SystemTrayEvent::MenuItemClick { id, .. } = event {
        match id.as_str() {
            "new" => show_hidden_or_new_window(app),
            "quit" => app.exit(0),
            _ => ()
        }
    }
}

pub fn window_event_handler(event: GlobalWindowEvent) {
    match event.event() {
        WindowEvent::CloseRequested { .. } => {
            let window = event.window();
            let app_handle = window.app_handle(); 

            if window.windows().len() == 1 {
                new_window(false, &app_handle);
            }
             
            window.close().unwrap();
        }
        _ => {}
    }
}


pub fn handle_cli_commands<T>(app: &mut App) -> Result<(), T> { 
    if let Ok(matches) = app.get_cli_matches() {
        // headless (on boot)
        let headless_app = match matches.args.get("headless") {
            Some(ArgData { value , ..}) => 
                match value {
                    Value::Bool(bool) => *bool,
                    _ => false
                },
            None => false
        };

        if !headless_app {
            new_window(true, app);
        }
    }

    Ok(())
}