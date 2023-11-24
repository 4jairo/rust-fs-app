use super::cacher::discover::DIR_TREE_CACHE;
use super::constants::TREE_CHANGE_REPLY_EVENT;
use notify::event::{ModifyKind, RenameMode};
use notify::{Config, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::{Path, PathBuf};
use std::sync::{mpsc, Arc};
use tauri::Manager;

pub struct DirChangesEvent;
impl DirChangesEvent {
    pub fn create_file(file_path: PathBuf) {
        let file_name = file_path.file_name().unwrap().to_string_lossy().to_string();
        let file_folder = file_path.parent().unwrap().to_path_buf();

        let dir_tree_cache = &mut DIR_TREE_CACHE.lock()
            .expect("error locking mutex");
        dir_tree_cache
            .entry(file_name)
            .or_insert(Vec::new())
            .push(file_folder);
    }

    pub fn delete_file(file_path: PathBuf) {
        let file_name = file_path.file_name().unwrap().to_string_lossy().to_string();
        let file_folder = file_path.parent().unwrap().to_path_buf();

        let dir_tree_cache = &mut DIR_TREE_CACHE.lock()
            .expect("error locking mutex");
        if let Some(files) = dir_tree_cache.get_mut(&file_name) {
            if let Some(index) = files.iter().position(|f| *f == file_folder) {
                files.remove(index);
            }
        }
    }
}

pub fn start_disk_notify(disk_path: &Path, app: Arc<tauri::AppHandle>) -> Result<(), notify::Error> {
    let (tx, rx) = mpsc::channel();

    // Automatically select the best implementation for your platform.
    // You can also access each implementation directly e.g. INotifyWatcher.
    let mut watcher = 
        RecommendedWatcher::new(tx, Config::default())?;

    // Add a path to be watched. All files and directories at that path and
    // below will be monitored for changes.
    // println!("started watching path {:?}", disk_path);
    watcher.watch(disk_path, RecursiveMode::Recursive)?;

    for res in rx {
        if res.is_err() {
            continue;
        }

        let event = res.unwrap();
        let influenced_file = event.paths[0].clone();
        let influenced_file_parent = influenced_file.parent()
            .unwrap_or(Path::new(""))
            .to_path_buf();

        match event.kind {
            EventKind::Create(_) => {
                DirChangesEvent::create_file(influenced_file);

                app.emit_all(TREE_CHANGE_REPLY_EVENT, influenced_file_parent)
                    .unwrap();
            }
            EventKind::Remove(_) => {
                DirChangesEvent::delete_file(influenced_file);

                app.emit_all(TREE_CHANGE_REPLY_EVENT, influenced_file_parent)
                    .unwrap();
            }
            EventKind::Modify(modify_kind) => {
                // modifyKind::Name(From) == old name -> delete from cache tree
                // modifyKind::Name(To) == new name -> add to cache tree

                match modify_kind {
                    ModifyKind::Name(RenameMode::From) => {
                        DirChangesEvent::delete_file(influenced_file);
                    },
                    ModifyKind::Name(RenameMode::To) => {
                        DirChangesEvent::create_file(influenced_file);
                    },
                    _ => ()
                }

                app.emit_all(TREE_CHANGE_REPLY_EVENT, influenced_file_parent)
                    .unwrap();
            }
            _ => (),
        }     
    }

    Ok(())
}