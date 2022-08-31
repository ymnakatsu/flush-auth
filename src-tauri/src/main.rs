#![cfg_attr(
    all(not(debug_assertions), target_os = "macos"),
    windows_subsystem = "windows"
)]

mod commands;
mod manager;
mod service;

use service::store;
use tauri::AppHandle;
use tauri::PhysicalPosition;
use tauri::PhysicalSize;
use tauri::RunEvent;
use tauri::WindowEvent;
use tauri::{Manager, SystemTray, SystemTrayEvent};
use tracing::info;
use tracing::Level;
use tracing_subscriber::prelude::*;
use tracing_subscriber::{fmt, layer::SubscriberExt};
use tracing_unwrap::ResultExt;

fn main() {
    setup_logger();
    info!("Start");

    tauri::Builder::default()
        .manage(manager::AccountManager::new())
        .system_tray(
            SystemTray::new(), // .with_menu(tray_menu),
                               // .with_menu_on_left_click(false),
        )
        .on_window_event(move |global_event| match global_event.event() {
            tauri::WindowEvent::Focused(focused) => {
                if !focused {
                    // focus out event
                    // global_event.window().hide().unwrap();
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
                // println!("({}:{})", pos.x.to_string(), pos.y.to_string());
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                // window
                //     .set_position(PhysicalPosition::<f64>::new(pos.x - f64::from(260), pos.y))
                //     .unwrap();
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

                // 1、クリック座標x + アプリ横幅 > 画面横幅 ? クリック座標x - アプリ横幅 : クリック座標x
                let x = if pos.x + window_size.width - f64::from(100) > screen_size.width {
                    pos.x - window_size.width
                } else {
                    pos.x
                };
                // 2、クリック座標y + アプリ長さ > 画面縦幅 ? クリック座標y - アプリ長さ : クリック座標y
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
            {
                #[cfg(target_os = "macos")]
                app.set_activation_policy(tauri::ActivationPolicy::Accessory);
                let window = app.get_window("main").unwrap();
                #[cfg(debug_assertions)]
                {
                    window.open_devtools();
                    window.close_devtools();
                }
            }
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
fn setup_logger() {
    let mut log_file_path = store::get_app_path();
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
