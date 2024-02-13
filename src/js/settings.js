import { mainAPI } from "./ipc.js";
import { formDataToObject } from "./util.js";
const { appWindow, PhysicalPosition } = window.__TAURI__.window;
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

const adjustWindowPosition = async (payload) => {
  const position = new PhysicalPosition(payload.position.x, payload.position.y);
  const logicalPosition = position.toLogical(payload.scaleFactor);
  const size = await appWindow.outerSize();
  const logicalSize = size.toLogical(payload.scaleFactor);
    appWindow.setPosition({ ...logicalPosition, x: logicalPosition.x - logicalSize.width });
}

await listen(`set_position`, async (evt) => {
  const visible = await appWindow.isVisible();
    if (visible) {
      // mainAPI.adjustWindowPosition();
      adjustWindowPosition(evt.payload);  
    }
});
