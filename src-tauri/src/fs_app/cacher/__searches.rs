use lazy_static::lazy_static;
use std::{collections::HashMap, sync::Mutex};
use crate::fs_app::dir_content::DirContent;

const MAX_CAPACITY: usize = 20;
const ITEMS_PER_PAGE: usize = 50;

type DirTreeSearchesType = HashMap<String, Vec<DirContent>>;

lazy_static! {
    pub static ref DIR_TREE_SEARCHES: Mutex<DirTreeSearchesType> = Mutex::new(HashMap::new());
}


// pub fn add_search(
//     path: &str,
//     file_name: &str,
//     only_absolute: bool,
//     search_content: Vec<DirContent>
// ) {
//     let searches = &mut DIR_TREE_SEARCHES.lock().unwrap();
//     let new_search_query = format!("{}{}{}", path, file_name, only_absolute);

//     match searches.get_mut(&new_search_query) {
//         Some(content) => {
//             let first_page = search_content[..ITEMS_PER_PAGE].to_vec();
            
//             content.clear();
//             content.extend(search_content);

//             first_page
//         },
//         None => {        
//             let firt_page = search_content[..ITEMS_PER_PAGE].to_vec();
//             searches.insert(new_search_query, search_content);

//             firt_page
//         }
//     };
// }

// pub fn get_dir_tree_search(index: usize) -> Result<Vec<DirContent>, ()> {
//     let searches = &DIR_TREE_SEARCHES.lock().unwrap();

//     // let a = & searches[index];

//     Ok(vec![])
// }
