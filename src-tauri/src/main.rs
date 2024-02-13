// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::{debug, error, info, warn, LevelFilter};
use tauri::{LogicalPosition, LogicalSize, Manager, Window, api};
use tauri_plugin_log::LogTarget;

#[tauri::command]
fn adjust_child_position(app: tauri::AppHandle, parent_window_label: String, child_window_label: String) {
    let parent_window: Window = app.get_window(&parent_window_label).unwrap();
    let child_window: Window = app.get_window(&child_window_label).unwrap();
    set_child_position(&parent_window, &child_window);
}

fn set_child_position(parent_window: &Window, child_window: &Window) {
    let scale_factor: f64 = match parent_window.scale_factor() {
        Ok(factor) => factor,
        Err(_) => 1.0,
    };

    let parent_position: LogicalPosition<i16> = parent_window
        .inner_position().unwrap()
        .to_logical(scale_factor);

    let child_size: LogicalSize<i16> = child_window
        .outer_size().unwrap()
        .to_logical(scale_factor);

    let child_position: LogicalPosition<i16> = {
        let x = parent_position.x - child_size.width;
        let y = parent_position.y;
        LogicalPosition::new(x, y)
    };

    child_window.set_position(child_position).unwrap();
}

#[tauri::command]
fn open_site(app: tauri::AppHandle, site_alias: String) {
    dbg!(&site_alias);
    if site_alias.is_empty() {
        error!("Function open_site() was called incorrectly, pass the alias when call.");
        return;
    }

    let url: &str = match site_alias.as_str() {
        "nightscout" => "https://diburn-cgm.fly.dev/",
        "poeditor" => "https://poeditor.com/join/project/PzcEMSOFc7",
        _ => ""
    };

    api::shell::open(&app.shell_scope(), url, None)
        .expect("Something went wrong in the open_site() function");
}

#[tauri::command]
async fn toggle_settings(app: tauri::AppHandle) {
    let settings_window_label: &str = "settings";

    if let Some(settings_window) = app.get_window(&settings_window_label) {
        if !settings_window.is_visible().unwrap_or(false) {
            set_child_position(&app.get_window("widget").unwrap(), &settings_window);
            settings_window.show().unwrap();
        } else {
            settings_window.hide().unwrap();
        }
    } else {
        error!("Failed to get window '{}'", &settings_window_label);
    }
}

#[tauri::command]
async fn close_window(app: tauri::AppHandle, win: Window) {
    if win.label() == "settings" {
        win.hide().unwrap();
    } else {
        info!("App was closed due to close-window event");
        app.exit(0);
    }
}

#[tauri::command]
async fn log_message(level: String, msg: String) {
    match level.as_str() {
        "info" => info!("{}", msg.clone()),
        "warn" => warn!("{}", msg.clone()),
        "error" => error!("{}", msg.clone()),
        "debug" => debug!("{}", msg.clone()),
        _ => info!("Unsupported log level: {}", level),
    }
}

fn main() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout])
                .level(LevelFilter::Info)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            toggle_settings,
            close_window,
            log_message,
            open_site,
            adjust_child_position
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
