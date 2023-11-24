use std::collections::HashMap;
use winreg::enums::*;
use winreg::RegKey;
use super::aplication_data::{ApplicationData, ApplicationLocation};

//const APPS_REG_PATH: &str = r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall";
const HKLM_WOW6432NODE: &str = r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall";
const HKCU_HKLM_UNINSTALL: &str = r"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall";
const APPS_COLLECTIONS: [&'static str; 8] = ["windows", "microsoft", "vs", "icecap", "winrt", "wpt", "nvidia", "universal"];
// const HKUSR_MICROSOFT_APPS: &str = r"\S-1-5-21-1502416246-3122866326-674358930-1001\SOFTWARE\Classes\Local Settings\Software\Microsoft\Windows\CurrentVersion\AppModel\SystemAppData";
// fn get_microsoft_apps(apps: &mut Vec<ApplicationData>) {
//     let hkey_content = RegKey::predef(HKEY_USERS);
//     let apps_key = hkey_content.open_subkey_with_flags(HKUSR_MICROSOFT_APPS, KEY_READ).unwrap();

//     for key in apps_key.enum_keys() {
//         let key = key.unwrap();
        

//     }
// }


type HashMapAppsType = HashMap<String, Vec<ApplicationData>>;

#[tauri::command]
pub async fn get_all_apps() -> Result<HashMapAppsType, String> { // async
    let mut apps = HashMapAppsType::new();
    
    get_apps(HKEY_LOCAL_MACHINE, HKLM_WOW6432NODE, &mut apps, ApplicationLocation::LocalMachine)?;
    get_apps(HKEY_LOCAL_MACHINE, HKCU_HKLM_UNINSTALL, &mut apps, ApplicationLocation::LocalMachine)?;
    get_apps(HKEY_CURRENT_USER, HKCU_HKLM_UNINSTALL, &mut apps, ApplicationLocation::CurrentUser)?;
    
    Ok(apps)
}

fn get_apps(hkey: isize, subkey_path: &str, apps: &mut HashMapAppsType , location: ApplicationLocation) -> Result<(), String>{
    let hkey_content = RegKey::predef(hkey);
    let apps_key = hkey_content
    .open_subkey_with_flags(subkey_path, KEY_READ)
    .map_err(|e| e.to_string())?;

    for key in apps_key.enum_keys() {
        let key = key.map_err(|e| e.to_string())?;

        if let Ok(key_values) = apps_key.open_subkey_with_flags(&key, KEY_READ) {
            if let Ok(publisher) = key_values.get_value("Publisher") {
                let app_name = key_values.get_value("DisplayName").unwrap_or(key);
                let app_collection = app_name
                .split(|n| n == ' ' || n == '_')
                .next().unwrap();

                let app_entry_name =  match APPS_COLLECTIONS.contains(&app_collection.to_lowercase().as_str()) {
                    true => app_collection.to_owned(),
                    false => app_name.clone()
                };

                let new_app = ApplicationData::new(
                    app_name,
                    publisher,
                    location,
                    key_values.get_value("DisplayVersion").unwrap_or_default(),
                    key_values.get_value("UninstallString").unwrap_or_default(),
                    key_values.get_value("DisplayIcon").unwrap_or_default(),
                    key_values.get_value::<String, _>("InstallSource").unwrap_or_default()
                );

                apps
                    .entry(app_entry_name)
                    .or_insert_with(|| Vec::new())
                    .push(new_app);
            }
        }
    }
    Ok(())
}


#[tauri::command]
pub fn search_app_reg() -> Result<(), ()> {

    Ok(())
}
