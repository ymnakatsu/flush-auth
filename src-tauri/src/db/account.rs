use std::fmt;

use crate::schema::accounts;
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

// ------------------------------
// Database structs
// ------------------------------
#[derive(Queryable, Debug, Serialize, Deserialize)]
pub struct Account {
    pub id: String,
    pub secret_key: String,
    pub account_name: String,
    pub issuer: String,
    pub sort: i32,
    pub created_at: String,
    pub updated_at: String,
}

/// Account create and update struct
#[derive(Insertable)]
#[table_name = "accounts"]
pub struct AccountData<'a> {
    pub id: &'a String,
    pub secret_key: &'a String,
    pub account_name: &'a String,
    pub issuer: &'a String,
    pub sort: &'a i32,
    pub created_at: &'a String,
    pub updated_at: &'a String,
}

// ------------------------------
// Display form structs
// ------------------------------
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
/// Form screen display submit format.
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct AccountForm {
    pub id: String,
    pub secret_key: SecretKey,
    pub account_name: String,
    pub issuer: String,
}

/// Screen display format.
/// secret_key is not passed to the screen.
#[derive(serde::Serialize, serde::Deserialize, Debug)]
pub struct AccountDisplay {
    pub id: String,
    pub account_name: String,
    pub issuer: String,
}
