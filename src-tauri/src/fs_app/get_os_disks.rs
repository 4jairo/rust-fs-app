use serde::Serialize;
use tauri::Manager;
use std::sync::Arc;
use std::{thread, path::Path};
use std::time::Duration;
use super::constants::{FINISH_DISCOVER_DISK_REPLY_EVENT, GET_OS_DISKS_REPLY_EVENT};
use super::cacher::discover::{discover_disk, un_discover_disk}; 
use super::notify_changes::start_disk_notify;

type DiskListType = Vec<Vec<String>>;

#[derive(Serialize, Clone, Debug)]
pub struct Disk {
    name: String,
    format: String,
    disk_path: String,
    free_space: String,
    max_capacity: String,
}
impl Disk {
    fn from_disk_list(disks: DiskListType) -> Vec<Disk> {
        disks
            .iter()
            .map(|disk| Disk {
                name: disk[0].clone(),
                format: disk[1].clone(),
                disk_path: disk[2].clone(),
                free_space: disk[3].clone(),
                max_capacity: disk[4].clone(),
            })
            .collect()
    }
}



#[derive(Serialize, Clone, Debug)]
pub struct CompareDisk {
    new: Vec<Disk>,
    deleted: Vec<Disk>
}
impl CompareDisk {
    pub fn compare_disk_list(new_list: &DiskListType, old_list: &DiskListType, app: Arc<tauri::AppHandle>) -> Self {
        let mut new = DiskListType::new();
        let mut deleted = DiskListType::new();

        // new disks 
        for disk in new_list {
            if old_list.iter().any(|x| x[2] == disk[2]) {
                continue;
            }

            // add new disk
            new.push(disk.clone());
            
            // start notify listener
            let notify_app = Arc::clone(&app);
            let disk_path2 = disk[2].clone();

            thread::spawn(move || {
                let path_disk = Path::new(&disk_path2);
                start_disk_notify(path_disk, notify_app).unwrap();
            });

            // discover disk
            let disk_path = disk[2].clone();
            let thread_app = Arc::clone(&app);

            thread::spawn(move || {
                let time_ellapsed = discover_disk(&disk_path).unwrap();

                thread_app
                    .emit_all(FINISH_DISCOVER_DISK_REPLY_EVENT, (disk_path, time_ellapsed))
                    .unwrap();
            });
        }

        // deleted disks
        for disk in old_list {
            if new_list.iter().any(|x| x[2] == disk[2]) {
                continue;
            }
    
            // delete removed disk
            deleted.push(disk.clone());

            // undiscover disk
            let disk_path = disk[2].clone();
            thread::spawn(move || un_discover_disk(disk_path));
        }

        CompareDisk {
            new: Disk::from_disk_list(new),
            deleted: Disk::from_disk_list(deleted)  
        }
    }

    pub fn len(&self) -> usize {
        self.new.len() + self.deleted.len()
    }
}


#[tauri::command]
pub async fn get_os_disks(app: tauri::AppHandle) -> Result<(), ()> {
    thread::spawn(move || {
        let mut current_disks = DiskListType::new();
        let app = Arc::new(app);

        loop {
            let new_list = disk_list::get_disk_list();
            let diff = CompareDisk::compare_disk_list(
                &new_list, 
                &current_disks,
                Arc::clone(&app)
            );
            if diff.len() > 0 {
                app.emit_all(GET_OS_DISKS_REPLY_EVENT, diff)
                .unwrap();

                current_disks = new_list;
            }
            thread::sleep(Duration::from_secs(1));
        }
    });

    Ok(())
}
