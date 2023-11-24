#[derive(Debug, serde::Serialize, Clone, Copy)]
pub enum ApplicationLocation {
    // Microsoft,
    CurrentUser,
    LocalMachine
}
#[derive(Debug, serde::Serialize)]

pub struct ApplicationData {
    name: String,
    publisher: String,
    location: ApplicationLocation,
    version: String,
    uninstall_string: String,
    icon: String,
    install_source: String
}

impl ApplicationData {
    pub fn new(
        name: String, 
        publisher: String, 
        location: ApplicationLocation, 
        version: String, 
        uninstall_string: String,
        icon: String,
        install_source: String
    ) -> Self {
        Self { name, publisher, location, version, uninstall_string, icon, install_source }
    }
}


