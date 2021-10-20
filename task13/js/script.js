const openBtn = document.querySelector(".add-button");
const saveBtn = document.querySelector("#save");
const registerCloseBtn = document.querySelector("#form-close");
const confirm = document.querySelector("#confirm");
const popupConfirm = document.querySelector("#popupConfirm");
const confirmCloseBtn = document.getElementById("confirm-close");
const popup = document.querySelector("#popup");
const form = document.querySelector("#form");
const nameInput = document.querySelector("#name-input");
const surnameInput = document.querySelector("#surname-input");
const emailInput = document.querySelector("#email-input");
const ESCAPE_KEY = "Escape";
const popupOpenedClass = "popup_opened";

function clearInput() {
  surnameInput.value = "";
  nameInput.value = "";
  emailInput.value = "";
}

function openPopup(evt) {
  evt.classList.add("popup_opened");
  document.addEventListener("keyup", closePopupEsc);
}

function closePopup(elem) {
  elem.classList.remove("popup_opened");
  document.removeEventListener("keyup", closePopupEsc);
}

function closePopupEsc(evt) {
  const popupOpened = document.querySelector(".popup_opened");
  if (evt.key === ESCAPE_KEY) {
    closePopup(popupOpened);
  }
}

function closePopupOverlay(evt) {
  const popupOpened = document.querySelector(".popup_opened");
  if (evt.target.classList.contains("popup_opened")) {
    closePopup(popupOpened);
  }
}

function handleSubmit(evt) {
  evt.preventDefault();
  closePopup(popup);
  openPopup(popupConfirm);
}

openBtn.addEventListener("click", () => {
  clearInput();
  checkOpenedPopup(popup);
  openPopup(popup);
});

registerCloseBtn.addEventListener("click", () => closePopup(popup));
confirmCloseBtn.addEventListener("click", () => closePopup(popupConfirm));
form.addEventListener("submit", handleSubmit);
document.addEventListener("mousedown", closePopupOverlay);
