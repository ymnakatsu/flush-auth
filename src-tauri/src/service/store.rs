use directories::BaseDirs;
use std::{
    env, fmt, fs,
    fs::File,
    io::{Read, Write},
    path::PathBuf,
};
use tracing::{debug, info};
use tracing_unwrap::{OptionExt, ResultExt};
use uuid::Uuid;

// ---------------------------------------------
// Propert
// ---------------------------------------------

/// Save file name.
static FILE_NAME: &'static str = "data";

// ---------------------------------------------
// Struct
// ---------------------------------------------

#[derive(Clone, serde::Serialize, serde::Deserialize)]
pub struct SecretKey(pub String);
impl core::fmt::Debug for SecretKey {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        // Logging mask SecretKey.
        write!(f, "*********")
    }
}
impl fmt::Display for SecretKey {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        f.write_str(&self.0)
    }
}

/// Json store data format.
#[derive(Clone, serde::Serialize, serde::Deserialize, Debug)]
pub struct AccountStore {
    pub id: String,
    pub secret_key: SecretKey,
    pub account_name: String,
    pub issuer: String,
}

/// Form submit format.
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct AccountForm {
    id: String,
    secret_key: SecretKey,
    account_name: String,
    issuer: String,
}

/// Screen display format.
/// secret_key is not passed to the screen.
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct AccountDisplay {
    id: String,
    account_name: String,
    issuer: String,
}

// ---------------------------------------------
// Method
// ---------------------------------------------

/// Account save from Form.
#[tracing::instrument(skip(form))]
pub fn save_account(form: AccountForm) {
    debug!("save_account.");
    println!("{}", &form.secret_key);

    let mut accounts = load_file();

    if let Some(index) = accounts.iter().position(|a| a.id == form.id) {
        // Update
        let mut org = accounts[index].clone();
        org.account_name = form.account_name;
        org.issuer = form.issuer;
        accounts[index] = org;
    } else {
        // Add
        let save_data = AccountStore {
            id: Uuid::new_v4().to_string(),
            secret_key: form.secret_key,
            account_name: form.account_name,
            issuer: form.issuer,
        };
        accounts.push(save_data);
    }

    write_file(accounts);
}

/// Delete account.
#[tracing::instrument]
pub fn delete_account(id: String) {
    debug!("delete_account.");
    let mut accounts = load_file();
    if let Some(index) = accounts.iter().position(|a| a.id == id) {
        accounts.swap_remove(index);
    }
    write_file(accounts);
}

/// Load json store file.
#[tracing::instrument]
pub fn load_file() -> Vec<AccountStore> {
    debug!("load_file.");

    let mut accounts = Vec::<AccountStore>::new();

    let store_path = get_store_file_path();
    let mut file = if let Ok(f) = File::open(&store_path) {
        f
    } else {
        write_file(Vec::new());
        File::open(&store_path).unwrap()
    };
    let mut contents = String::new();
    file.read_to_string(&mut contents)
        .expect_or_log("Load file faild.");
    let datas =
        serde_json::from_str::<Vec<AccountStore>>(&contents).expect_or_log("Json format error.");
    for data in datas {
        accounts.push(data);
    }
    return accounts;
}

/// Convert to display.
#[tracing::instrument]
pub fn convert(accounts: Vec<AccountStore>) -> Vec<AccountDisplay> {
    debug!("convert.");
    accounts
        .iter()
        .map(|d| AccountDisplay {
            id: d.id.to_string(),
            account_name: d.account_name.to_string(),
            issuer: d.issuer.to_string(),
        })
        .collect()
}

/// Get json store file absolite path.
#[tracing::instrument]
pub fn get_store_file_path() -> PathBuf {
    debug!("get_store_file_path.");
    let mut path = get_app_path();
    path.push(FILE_NAME);
    info!(
        "{}",
        &path
            .to_str()
            .expect_or_log("Open store path faild.")
            .to_string()
    );
    path
}

/// Get app directory absolite path.
#[tracing::instrument]
pub fn get_app_path() -> PathBuf {
    debug!("get_app_path.");
    let mut path = env::current_dir().expect("Error current_dir not found.");
    if let Some(base_dirs) = BaseDirs::new() {
        path = base_dirs.config_dir().to_path_buf();
        // Linux:   /home/alice/.config
        // Windows: C:\Users\Alice\AppData\Roaming
        // macOS:   /Users/Alice/Library/Application Support
    }

    path.push("FlashAuth");
    if !path.exists() {
        fs::create_dir_all(&path).unwrap();
    }

    return path;
}

/// Write json store file.
#[tracing::instrument]
fn write_file(accounts: Vec<AccountStore>) {
    debug!("write_file.");
    debug!("{:?}", &accounts);
    let store_path = get_store_file_path();
    let serial = serde_json::to_string(&accounts).unwrap();
    let mut file = File::create(store_path).expect_or_log("Open store file faild.");
    file.write_all(serial.as_bytes()).expect("Write faild.");
}
