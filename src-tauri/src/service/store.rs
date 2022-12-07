use std::{fs, path::PathBuf, sync::Arc};
use tauri::{api::path::app_data_dir, Config};
use tracing::debug;

/// Get app directory absolite path.
/// <ul>
///   <li>Linux:   /home/alice/.config/${bundle_identifier}</li>
///   <li>Windows: C:\Users\Alice\AppData\Roaming\${bundle_identifier}</li>
///   <li>macOS:   /Users/Alice/Library/Application Support\${bundle_identifier}</li>
/// </ul>
#[tracing::instrument]
pub fn get_app_path(config: &Arc<Config>) -> PathBuf {
    debug!("get_app_path.");
    let path = app_data_dir(config).expect("Failed to get application data path.");
    if !path.exists() {
        fs::create_dir_all(&path).unwrap();
    }

    return path;
}
