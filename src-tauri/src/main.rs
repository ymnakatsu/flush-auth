#![cfg_attr(
    all(not(debug_assertions), target_os = "macos"),
    windows_subsystem = "windows"
)]

mod commands;
mod db;
mod schema;
mod service;

use std::sync::Arc;

use dotenvy::dotenv;
use service::store;
use tauri::AppHandle;
use tauri::Config;
use tauri::PhysicalPosition;
use tauri::PhysicalSize;
use tauri::RunEvent;
use tauri::WindowEvent;
use tauri::{Manager, SystemTray, SystemTrayEvent};
use tracing::Level;
use tracing_subscriber::prelude::*;
use tracing_subscriber::{fmt, layer::SubscriberExt};
use tracing_unwrap::ResultExt;

use crate::db::manager::ConnPool;

fn main() {
    dotenv().expect(".env file not found");

    tauri::Builder::default()
        .system_tray(
            SystemTray::new(), // .with_menu(tray_menu),
                               // .with_menu_on_left_click(false),
        )
        .on_window_event(move |global_event| match global_event.event() {
            tauri::WindowEvent::Focused(focused) => {
                if !focused {
                    // focus out event
                    global_event.window().hide().unwrap();
                }
            }
            _ => (),
        })
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick {
                position: pos,
                size: _,
                ..
            } => {
                // Calc system tray position.
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
                window.set_always_on_top(true).unwrap();
                window.set_always_on_top(false).unwrap();

                let screen = window.current_monitor().unwrap().unwrap();
                let screen_size = PhysicalSize::<f64> {
                    width: screen.size().width as f64,
                    height: screen.size().height as f64,
                };
                let window_size = PhysicalSize::<f64> {
                    width: window.outer_size().unwrap().width as f64,
                    height: window.outer_size().unwrap().height as f64,
                };
                // 1: Click_Coordinate.x + App_Width > Screen_Width ? Click_Coordinate.x - App_Width : Click_Coordinate.x
                let x = if pos.x + window_size.width - f64::from(100) > screen_size.width {
                    pos.x - window_size.width
                } else {
                    pos.x
                };
                // 2: Click_Coordinate.y + App_Width > Screen_Width ? Click_Coordinate.y - App_Width : Click_Coordinate.y
                let y = if pos.y + window_size.height > screen_size.height {
                    pos.y - window_size.height
                } else {
                    pos.y
                };
                window
                    .set_position(PhysicalPosition::<f64>::new(x, y))
                    .unwrap();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![
            commands::window::close,
            commands::window::hidden,
            commands::account::calc_totp,
            commands::account::load_accounts,
            commands::account::save_account,
            commands::account::delete_account,
        ])
        .setup(|app| {
            #[cfg(target_os = "macos")]
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);
            let window = app.get_window("main").unwrap();
            #[cfg(debug_assertions)]
            {
                window.open_devtools();
                window.close_devtools();
            }
            let config = app.config();
            // Setup logger settings.
            setup_logger(&config);
            // Run DB Migration.
            let conn = db::manager::establish_connection(&config);
            db::manager::run_migration(&conn);
            // Save global variable.
            app.manage::<ConnPool>(conn);
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect_or_log("Error while running tauri application")
        .run(bootstrap())
}

fn bootstrap() -> Box<dyn Fn(&AppHandle, RunEvent) + Send + Sync + 'static> {
    return Box::new(|app_handle, event| match event {
        RunEvent::WindowEvent { label, event, .. } => match event {
            WindowEvent::CloseRequested { api, .. } => {
                let window = app_handle.get_window(&label).unwrap();
                window.hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        },
        _ => {}
    });
}

/// Init Logger.
fn setup_logger(config: &Arc<Config>) {
    let mut log_file_path = store::get_app_path(&config);
    log_file_path.push("logs");
    let file_appender = tracing_appender::rolling::daily(log_file_path, "application.log");

    let subscriber = tracing_subscriber::registry()
        .with(
            fmt::Layer::new()
                .with_writer(std::io::stdout.with_max_level(Level::DEBUG))
                .with_ansi(false)
                .pretty(),
        )
        .with(
            fmt::Layer::new()
                .with_writer(file_appender.with_max_level(Level::DEBUG))
                .with_ansi(false)
                .pretty(),
        );
    tracing::subscriber::set_global_default(subscriber)
        .expect_or_log("Setting default subscriber failed.");
}
