#[tauri::command]
pub async fn launch_app(app: &str) -> Result<(), ()> {
    println!("{}", app);
    todo!()
}