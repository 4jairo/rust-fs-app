use std::{sync::{Mutex, Arc}, thread, path::Path, time::Duration};
use rustc_hash::FxHashMap;
use serde::Serialize;
use lazy_static::lazy_static;
use tauri::{AppHandle, Manager};
use super::{
   notify_changes::start_disk_notify,
   cacher::discover::{discover_disk, un_discover_disk},
   constants::{FINISH_DISCOVER_DISK_REPLY_EVENT, GET_OS_DISKS_REPLY_EVENT},
   error_format::send_err
};


#[derive(Serialize, Clone, Debug)]
pub enum DiskStatus {
    Loading,
    Loaded,
    Ejected
}


#[derive(Serialize, Clone, Debug)]
pub struct Disk {
    name: String,
    format: String,
    free_space: String,
    max_capacity: String,
    pub status: DiskStatus
}
impl Disk {
    /// returns Self + disk_path
    pub fn from_disk_list(mut disk: Vec<String>) -> (Self, String) {
        let max_capacity = disk.pop().unwrap();
        let free_space = disk.pop().unwrap();
        let disk_path = disk.pop().unwrap();
        let format = disk.pop().unwrap();
        let name = disk.pop().unwrap();

        let disk = Disk {
            max_capacity, free_space, format, name, 
            status: DiskStatus::Loading
        };

        (disk, disk_path)
    }
}


#[derive(Default)]
pub struct DisksState {
    pub disks: FxHashMap<String, Disk>,  
}
impl DisksState {
    pub fn update_from_disk_list(&mut self, app_handle: Arc<AppHandle>) {
        let newest_list = disk_list::get_disk_list();

        // new disks
        for disk in newest_list.iter() {
            if self.disks.contains_key(&disk[2]) {
                continue;
            }
            
            // add if not contains && noitify
            let (formatted, path) = Disk::from_disk_list(disk.clone());
            app_handle
                .emit_all(GET_OS_DISKS_REPLY_EVENT, (&path, &formatted))
                .unwrap();

            self.disks.insert(path, formatted);


            // start disk change listener
            let app_handle_cp = Arc::clone(&app_handle);
            let disk_path = disk[2].clone();

            thread::spawn(move || {
                let path_disk = Path::new(&disk_path);
                start_disk_notify(path_disk, app_handle_cp).unwrap();
            });

            // discover disk
            let disk_path = disk[2].clone();
            let app_handle_cp = Arc::clone(&app_handle);

            thread::spawn(move || {
                match discover_disk(&disk_path) {
                    Ok(time_ellapsed) => app_handle_cp
                        .emit_all(FINISH_DISCOVER_DISK_REPLY_EVENT, (disk_path, time_ellapsed))
                        .unwrap(),
                    Err(err) => send_err(&err, &app_handle_cp)
                }
            });
        }
        //ejected

        self.disks.retain(|path, disk| {
            if newest_list.iter().any(|d| d[2] == *path) {
                return true
            }

            // un-discover if not in newest list            
            let disk_path = path.clone();
            thread::spawn(move || un_discover_disk(disk_path));

            disk.status = DiskStatus::Ejected;
            app_handle
                .emit_all(GET_OS_DISKS_REPLY_EVENT, (path, &disk))
                .unwrap();

            return false
        });
    }
}


lazy_static! {
    pub static ref DISKS: Mutex<DisksState> = Mutex::new(DisksState::default());
}

pub fn os_disks_listener(app: AppHandle) {
    thread::spawn(move || {
        let app_handle = Arc::new(app);

        loop {
            {
                let disks = &mut DISKS.lock().unwrap();
                disks.update_from_disk_list(Arc::clone(&app_handle));
            }
            thread::sleep(Duration::from_secs(1));
        }
    });
}

#[tauri::command]
pub fn get_os_disks() -> Vec<(String, Disk)> {
    let disks = &DISKS.lock().unwrap();
    
    disks.disks.iter()
        .map(|(a,b)| (a.clone(), b.clone()))
        .collect()
}

