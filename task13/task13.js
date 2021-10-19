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

const showInputError = (input) => {
  input.classList.add("popup__input_type_error");
};

const hideInputError = (input) => {
  input.classList.remove("popup__input_type_error");
};

function isValid(input) {
  if (input.value.length < 3) {
    showInputError(input);
  } else {
    hideInputError(input);
    return true;
  }
}

function validateEmail(emailInput) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailInput.value);
}

function isEmailValid(emailInput) {
  if (validateEmail(emailInput)) {
    hideInputError(emailInput);
  } else {
    showInputError(emailInput);
  }
}

function validate() {
  isValid(nameInput);
  isValid(surnameInput);
  isEmailValid(emailInput);
  if (
    isValid(nameInput) &&
    isValid(surnameInput) &&
    validateEmail(emailInput)
  ) {
    closePopup(popup);
    openPopup(popupConfirm);
    clearInput();
  }
}

function handleSubmit(evt) {
  evt.preventDefault();
  validate();
}

openBtn.addEventListener("click", () => openPopup(popup));
registerCloseBtn.addEventListener("click", () => closePopup(popup));
confirmCloseBtn.addEventListener("click", () => closePopup(popupConfirm));
form.addEventListener("submit", handleSubmit);
document.addEventListener("mousedown", closePopupOverlay);
