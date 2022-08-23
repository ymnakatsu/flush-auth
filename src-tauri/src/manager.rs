use std::sync::Mutex;

use crate::service::store::{self};

#[derive(Debug)]
pub struct AccountManager {
    pub initialized: Mutex<bool>,
    pub accounts: Mutex<Vec<store::AccountStore>>,
}

impl AccountManager {
    #[tracing::instrument]
    pub fn new() -> Self {
        Self {
            initialized: Mutex::new(false),
            accounts: Mutex::new(Vec::<store::AccountStore>::new()),
        }
    }

    /// Init AccountManager.
    #[tracing::instrument(skip(self))]
    pub fn init(&self) {
        if *self.initialized.lock().unwrap() {
            return;
        }
        self.load_file();
        *self.initialized.lock().unwrap() = true
    }

    /// Get raw data.
    #[tracing::instrument(skip(self))]
    pub fn get_raw_data(&self) -> Vec<store::AccountStore> {
        self.accounts.lock().unwrap().to_vec()
    }

    /// Get display data.
    #[tracing::instrument(skip(self))]
    pub fn get_display_data(&self) -> Vec<store::AccountDisplay> {
        let list = self.accounts.lock().unwrap();
        store::convert(list.to_vec())
    }

    /// Load store file.
    #[tracing::instrument(skip(self))]
    pub fn load_file(&self) {
        let mut list = self.accounts.lock().unwrap();
        list.clear();
        for data in store::load_file() {
            list.push(data);
        }
    }

    /// Save to store file.
    #[tracing::instrument(skip(self, form))]
    pub fn save(&self, form: store::AccountForm) -> Vec<store::AccountDisplay> {
        store::save_account(form);
        self.load_file();

        let list = self.accounts.lock().unwrap();
        store::convert(list.to_vec())
    }

    /// Delete from store file.
    #[tracing::instrument(skip(self))]
    pub fn delete(&self, id: String) -> Vec<store::AccountDisplay> {
        store::delete_account(id);
        self.load_file();
        let list = self.accounts.lock().unwrap();
        store::convert(list.to_vec())
    }
}
