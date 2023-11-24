use std::time::Instant;

pub fn get_timing_ms<T: FnOnce() -> ()>(func: T) -> u128 {
    let start_time = Instant::now();
    func();
    (Instant::now() - start_time).as_millis()
}

// pub fn get_timing_ms_and_value<T, R>(func: T) -> (u128, R) 
// where
//     T: FnOnce() -> R
// {
//     let start_time = Instant::now();
//     let result = func();
//     let end_time = (Instant::now() - start_time).as_millis();

//     (end_time, result)
// }
