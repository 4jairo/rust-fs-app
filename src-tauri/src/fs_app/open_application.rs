use std::process::Command;

use super::error_format::stringify;

// struct OpenTerminal<'a> {
//     exe: &'a str,
//     args: Vec<String>,
// }

// #[tauri::command]
// pub async fn open_terminal(path: &str) -> Result<(), String> {
//     let program = match !Command::new("cmd")
//         .args(["/c", "where wt"])
//         .output()
//         .map_err(stringify)?
//         .status
//         .success()
//     {
//         true => OpenTerminal{ 
//             exe: "wt", 
//             args: vec!["-d".to_string(), path.to_string()] 
//         },
//         false => OpenTerminal{ 
//             exe: "powershell", 
//             args: vec!["-noexit".to_string(), "-command".to_string(), format!(r#"{{cd "{}"}}"#, path)] 
//         }
//     };

//     let output = Command::new(program.exe)
//         .args(program.args)
//         .output()
//         .map_err(stringify)?;

//     match output.status.success() {
//         true => Ok(()),
//         false => Err(String::from_utf8_lossy(&output.stderr).to_string())
//     }
// }

#[tauri::command]
pub async fn open_terminal(path: &str) -> Result<(), String> {

    let output = Command::new("wt")
    .arg("-d")
    .arg(path)
    .output()
    .map_err(stringify)?;

    match output.status.success() {
        true => Ok(()),
        false => Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

#[tauri::command]
pub async fn open_windows_fs(is_file: bool, file_path: &str) -> Result<(), String> {
    let explorer_args = match is_file {
        false => vec![file_path],
        true => vec!["/select,", file_path]
    };

    let output = Command::new("explorer")
    .args(explorer_args)
    .output()
    .map_err(stringify)?;

    match output.status.success() {
        true => Ok(()),
        false => Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}

// #[tauri::command]
// pub async fn get_file_blob(path: &str) -> Result<(), ()> {
//     let file_content = ;


//     Ok(())
// }