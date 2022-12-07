use crate::db::account::Account;
use crate::schema::accounts::dsl::*;
use diesel::{delete, prelude::*, result::Error, QueryDsl};
use tracing::error;

pub struct AccountRepository;

impl AccountRepository {
    /// Find all accounts.
    pub fn find_all(conn: &mut SqliteConnection) -> Vec<Account> {
        match accounts.load::<Account>(conn) {
            Ok(r) => r,
            Err(e) => {
                error!("{}", e.to_string());
                Vec::new()
            }
        }
    }

    /// Find by account id.
    pub fn find_by_id(conn: &mut SqliteConnection, account_id: &String) -> Result<Account, Error> {
        accounts.filter(id.eq(account_id)).first::<Account>(conn)
    }

    /// Detele from account table.
    pub fn delete(conn: &mut SqliteConnection, account_id: &String) -> bool {
        match delete(accounts).filter(id.eq(account_id)).execute(conn) {
            Ok(_r) => true,
            Err(e) => {
                error!("{}", e.to_string());
                false
            }
        }
    }
}
