import { mainAPI } from "./ipc.js";
import { formDataToObject } from "./util.js";
const { appWindow } = window.__TAURI__.window;
const { listen } = window.__TAURI__.event;
const log = mainAPI.log;

const form = document.forms[`settings-form`];

const initialFormState = new FormData(form);

const FormButtons = {
  SUBMIT: form.querySelector(`#button-submit`),
  TEST: form.querySelector(`#button-test`),
  LOG: form.querySelector(`.settings__log-link`),
  CLOSE: document.querySelector(`#button-close`),
};

const isFormModified = (currentForm, initialForm) => {
  return JSON.stringify(formDataToObject(currentForm)) !== JSON.stringify(formDataToObject(initialForm));
};
  
FormButtons.CLOSE.addEventListener(`click`, () => {
  const currentFormState = new FormData(form);
  const modified = isFormModified(currentFormState, initialFormState);
 
  if (modified) {
    alert(`warning`, `Save settings`, `Save the settings before exit`, true);
    FormButtons.SUBMIT.focus();
  } else {
    appWindow.hide();
  }
});

await listen(`set_position`, async (evt) => {
  const visible = await appWindow.isVisible();
    if (visible) {
      log.info(`Settings: Received position ${evt.position.x}, ${evt.position.y}`);
      mainAPI.adjustWindowPosition(evt.windowLabel);
    }
}); 
// }
// unlisten();