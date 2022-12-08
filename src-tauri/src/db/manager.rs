use std::sync::Arc;

use diesel::r2d2::ConnectionManager;
use diesel::r2d2::{Pool, PooledConnection};
use diesel::SqliteConnection;
use tauri::Config;
use tracing::{error, info};

pub type ConnPool = Pool<ConnectionManager<SqliteConnection>>;
pub type ConnPooled = PooledConnection<ConnectionManager<SqliteConnection>>;

use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
use tracing_unwrap::OptionExt;

use crate::service::store;
pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!();

// ---------------------------------------------
// Property
// ---------------------------------------------

/// Save file name.
static DB_FILE_NAME: &'static str = "quick-auth.db";

pub fn establish_connection(config: &Arc<Config>) -> ConnPool {
    let mut path = store::get_app_path(config);
    path.push(DB_FILE_NAME);
    info!(
        "{}",
        &path
            .to_str()
            .expect_or_log("Failed to open database file path.")
            .to_string()
    );
    let manager = ConnectionManager::<SqliteConnection>::new(path.to_str().unwrap());
    Pool::builder()
        .build(manager)
        .map_err(|e| error!("Failed to create a connection pool. {}", e))
        .unwrap()
}

/// Run migration
pub fn run_migration(conn: &ConnPool) {
    // Get a connection from the connection pool
    conn.get()
        .map_err(|e| error!("Failed to get a connection from the connection pool. {}", e))
        .unwrap()
        .run_pending_migrations(MIGRATIONS)
        .map_err(|e| error!("Failed to migrations. {}", e))
        .unwrap();
}
