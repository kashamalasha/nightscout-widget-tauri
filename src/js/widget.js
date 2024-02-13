import { mainAPI } from "./ipc.js";

const { appWindow } = window.__TAURI__.window; 
const { emit } = window.__TAURI__.event;

const log = mainAPI.log;

const Fields = {
  sgv: document.querySelector(`.sgv`),
  last: document.querySelector(`.sgv__last`),
  delta: document.querySelector(`.sgv__delta`),
  trend: document.querySelector(`.sgv__trend`),
  age: document.querySelector(`.sgv__age`),
  ageValue: document.querySelector(`.sgv__age-value`),
};

const Buttons = {
  close: document.querySelector(`#button-close`),
  settings: document.querySelector(`#button-settings`),
  browse: document.querySelector(`#button-browse`),
};

Buttons.close.addEventListener(`click`, async () => await mainAPI.closeWindow());
Buttons.settings.addEventListener(`click`, async() => await mainAPI.toggleSetting());

Buttons.browse.addEventListener(`pointerdown`, async () => {
  Fields.last.classList.toggle(`sgv__last--accented`);

  log.info(`Open nightscout site was triggered`);
  await mainAPI.openSite(`nightscout`);
});

Buttons.browse.addEventListener(`pointerup`, () => {
  Fields.last.classList.toggle(`sgv__last--accented`);
});

appWindow.onMoved(async ({ payload: position }) => {
  const scaleFactor = await appWindow.scaleFactor();
  await emit(`set_position`, { position, scaleFactor });
});
