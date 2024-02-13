const { invoke } = window.__TAURI__.tauri;
const { appWindow, WebviewWindow } = window.__TAURI__.window;

export const mainAPI = {
    closeWindow: () => invoke(`close_window`, { appWindow }),
    log: {
        info: (msg) => invoke(`log_message`, { level: `info`, msg: `WebView: ${msg}` }),
        warn: (msg) => invoke(`log_message`, { level: `warn`, msg: `WebView: ${msg}` }),
        error: (msg) => invoke(`log_message`, { level: `error`, msg: `WebVew: ${msg}` }),
    },
    toggleSetting: () => invoke(`toggle_settings`),
    openSite: (siteAlias) => invoke(`open_site`, { siteAlias }),
    adjustWindowPosition: (parentWindowLabel) => invoke(`adjust_child_position`, 
        { parentWindowLabel, childWindowLabel: appWindow.label }),
}
