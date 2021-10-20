const validationSelectors = {
  formSelector: ".popup__container",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button-save",
  inactiveButtonClass: "popup__button-save_type_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__span-error_type_active",
};

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.add(validationSelectors.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(validationSelectors.errorClass);
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  inputElement.classList.remove(validationSelectors.inputErrorClass);
  errorElement.classList.remove(validationSelectors.errorClass);
  errorElement.textContent = "";
};
const isValid = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const checkOpenedPopup = (popup) => {
  const formElement = popup.querySelector(validationSelectors.formSelector);
  const inputList = Array.from(
    formElement.querySelectorAll(validationSelectors.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationSelectors.submitButtonSelector
  );
  toggleButtonState(inputList, buttonElement);
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement);
  });
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationSelectors.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationSelectors.submitButtonSelector
  );
  inputList.forEach((inputElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });
    inputElement.addEventListener("input", () => {
      isValid(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(validationSelectors.inactiveButtonClass);
    buttonElement.setAttribute("disabled", "disabled");
  } else {
    buttonElement.classList.remove(validationSelectors.inactiveButtonClass);
    buttonElement.removeAttribute("disabled");
  }
};

const enableValidation = () => {
  const formList = Array.from(
    document.querySelectorAll(validationSelectors.formSelector)
  );
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
    });
    setEventListeners(formElement);
  });
};

enableValidation(validationSelectors);
