use chrono::Utc;
use diesel::result::Error;
use diesel::{insert_into, ExpressionMethods, RunQueryDsl, SqliteConnection};
use tracing::debug;
use uuid::Uuid;

use crate::db::account::{Account, AccountData, AccountDisplay, AccountForm};
use crate::schema::accounts::dsl::*;

use crate::db::account_repository::AccountRepository;
use crate::db::manager::ConnPooled;

extern crate diesel;

pub struct AccountService;

impl AccountService {
    // ---------------------------
    // Find
    // ---------------------------
    /// Find all accounts.
    #[tracing::instrument(skip(conn))]
    pub fn find_all(conn: &mut SqliteConnection) -> Vec<Account> {
        AccountRepository::find_all(conn)
    }

    /// Convert to display object.
    #[tracing::instrument(skip(conn))]
    pub fn find_all_display(conn: &mut SqliteConnection) -> Vec<AccountDisplay> {
        AccountService::convert(AccountService::find_all(conn))
    }

    /// Find by account id.
    #[tracing::instrument(skip(conn))]
    pub fn find_by_id(conn: &mut SqliteConnection, account_id: &String) -> Result<Account, Error> {
        AccountRepository::find_by_id(conn, &account_id)
    }

    // ---------------------------
    // Persistence
    // ---------------------------
    /// Save to store file.
    #[tracing::instrument(skip(self, conn, form))]
    #[warn(unused_must_use)]
    pub fn save(&self, conn: &mut ConnPooled, form: AccountForm) -> Vec<AccountDisplay> {
        let mut account_id = form.id;
        let mut secret = form.secret_key.0;
        match AccountService::find_by_id(conn, &account_id) {
            Ok(o) => {
                account_id = o.id;
                secret = o.secret_key;
            }
            Err(_e) => {
                // Publish new ID because data not found.
                account_id = Uuid::new_v4().to_string();
            }
        }
        let now = Utc::now().to_rfc3339();
        let data = AccountData {
            id: &account_id,
            secret_key: &secret,
            account_name: &form.account_name,
            issuer: &form.issuer,
            sort: &0,
            created_at: &now,
            updated_at: &now,
        };

        conn.immediate_transaction(|conn| {
            // insert or update. Update if id is conflicted.
            insert_into(accounts)
                .values(&data)
                .on_conflict(id)
                .do_update()
                .set((
                    account_name.eq(data.account_name),
                    issuer.eq(data.issuer),
                    updated_at.eq(&now),
                ))
                .execute(conn)
        })
        .expect("Transaction Error.");
        AccountService::find_all_display(conn)
    }

    /// Delete from database.
    #[tracing::instrument(skip(self, conn))]
    pub fn delete(&self, conn: &mut ConnPooled, account_id: String) -> Vec<AccountDisplay> {
        if !AccountRepository::delete(conn, &account_id) {
            print!("{}", "Delete falied.")
        }
        AccountService::find_all_display(conn)
    }

    /// Convert to display object.
    #[tracing::instrument]
    pub fn convert(datas: Vec<Account>) -> Vec<AccountDisplay> {
        debug!("convert.");
        datas
            .iter()
            .map(|d| AccountDisplay {
                id: d.id.to_string(),
                account_name: d.account_name.to_string(),
                issuer: d.issuer.to_string(),
            })
            .collect()
    }
}
