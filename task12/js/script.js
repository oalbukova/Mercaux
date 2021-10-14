const addButton = document.querySelector(".add-button");
const form = document.querySelector("#form");
const popup = document.querySelector("#popup");
const formCloseBtn = document.getElementById("form-close");

const confirm = document.querySelector("#confirm");
const popupConfirm = document.querySelector("#popupConfirm");
const confirmCloseBtn = document.getElementById("confirm-close");

const formInput = Array.from(document.querySelectorAll(".popup__input"));
const spanError = Array.from(document.querySelectorAll(".popup__span-error"));

function handleEscapeKeydown(evt) {
  const formOpen = document.querySelector(".popup_opened");
  if (evt.key === "Escape") {
    togglePopup(formOpen);
  }
}

function handleOverlayClick(evt) {
  const formOpen = document.querySelector(".popup_opened");
  if (evt.target.classList.contains("popup")) {
    togglePopup(formOpen);
  }
}

function togglePopup(elem) {
  const isOpen = elem.classList.contains("popup_opened");
  if (!isOpen) {
    document.addEventListener("keydown", handleEscapeKeydown);
    document.addEventListener("click", handleOverlayClick);
  } else {
    document.removeEventListener("keydown", handleEscapeKeydown);
    document.removeEventListener("click", handleOverlayClick);
  }
  elem.classList.toggle("popup_opened");
}

function checkForm(elem) {
  const form = elem.querySelector("form");
  if (form) {
    elem.querySelector("form").checkForm();
  }
}

function placeSubmitHandler(evt) {
  evt.preventDefault();
  togglePopup(popup);
  togglePopup(popupConfirm);
}

addButton.addEventListener("click", () => {
  form.reset();
  checkForm(popup);
  togglePopup(popup);
});

form.addEventListener("submit", placeSubmitHandler);
formCloseBtn.addEventListener("click", () => togglePopup(popup));
confirmCloseBtn.addEventListener("click", () => togglePopup(popupConfirm));
