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

pub mod account {

    use crate::{
        manager::AccountManager,
        service::{store, totp},
    };

    #[tracing::instrument]
    #[tauri::command]
    pub fn calc_totp(
        id: String,
        account_manager: tauri::State<'_, AccountManager>,
    ) -> totp::TotpData {
        totp::calc(id, account_manager.get_raw_data())
    }

    #[tracing::instrument]
    #[tauri::command]
    pub fn load_accounts(
        account_manager: tauri::State<'_, AccountManager>,
    ) -> Vec<store::AccountDisplay> {
        account_manager.init();
        account_manager.get_display_data()
    }

    #[tracing::instrument]
    #[tauri::command]
    pub fn save_account(
        form: store::AccountForm,
        account_manager: tauri::State<'_, AccountManager>,
    ) -> Vec<store::AccountDisplay> {
        account_manager.save(form)
    }

    #[tracing::instrument]
    #[tauri::command]
    pub fn delete_account(
        id: String,
        account_manager: tauri::State<'_, AccountManager>,
    ) -> Vec<store::AccountDisplay> {
        account_manager.delete(id)
    }
}
