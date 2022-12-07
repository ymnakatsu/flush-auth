/// App window commands.
pub mod window {

    use tauri::Manager;

    #[tracing::instrument]
    #[tauri::command]
    pub fn close(app: tauri::AppHandle) {
        app.exit(0);
    }

    #[tracing::instrument]
    #[tauri::command]
    pub fn hidden(app: tauri::AppHandle) {
        let window = app.get_window("main").unwrap();
        window.hide().unwrap();
    }
}

/// Account data prosess commands.
pub mod account {

    use crate::{
        db::{
            account::{AccountDisplay, AccountForm},
            manager::ConnPool,
        },
        service::{account::AccountService, totp},
    };

    #[tracing::instrument]
    #[tauri::command]
    pub fn calc_totp(id: String, connection: tauri::State<'_, ConnPool>) -> totp::TotpData {
        let conn = &mut connection.get().expect("Connection not found.");
        totp::calc(id, AccountService::find_all(conn))
    }

    #[tracing::instrument]
    #[tauri::command]
    pub fn load_accounts(connection: tauri::State<'_, ConnPool>) -> Vec<AccountDisplay> {
        let conn = &mut connection.get().expect("Connection not found.");
        AccountService::find_all_display(conn)
    }

    #[tracing::instrument]
    #[tauri::command]
    pub fn save_account(
        form: AccountForm,
        connection: tauri::State<'_, ConnPool>,
    ) -> Vec<AccountDisplay> {
        let conn = &mut connection.get().expect("Connection not found.");
        AccountService.save(conn, form)
    }

    #[tracing::instrument]
    #[tauri::command]
    pub fn delete_account(
        id: String,
        connection: tauri::State<'_, ConnPool>,
    ) -> Vec<AccountDisplay> {
        let conn = &mut connection.get().expect("Connection not found.");
        AccountService.delete(conn, id)
    }
}
