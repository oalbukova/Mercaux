//formElement — html-элемент формы, в которой находится проверяемое поле ввода. Он нужен для поиска элемента ошибки в форме.
//inputElement — проверяемое поле ввода.
const showInputError = (formElement, inputElement, errorMessage, {
  inputErrorClass,
  errorClass
}) => {
  // Функция, которая добавляет класс с ошибкой
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`); // Находим элемент ошибки внутри самой функции
  inputElement.classList.add(inputErrorClass); //добавляет класс popup__input_type_error(красную полоску)
  errorElement.textContent = errorMessage; // Заменим содержимое span с ошибкой на переданный параметр
  errorElement.classList.add(errorClass);
};

const hideInputError = (formElement, inputElement, {
  inputErrorClass,
  errorClass
}) => {
  // Функция, которая удаляет класс с ошибкой
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`); // Находим элемент ошибки
  inputElement.classList.remove(inputErrorClass); //убирает класс popup__input_type_error(красную полоску)
  errorElement.classList.remove(errorClass);
  errorElement.textContent = ""; //очистить текстовое содержимое
};

const checkInputValidity = (formElement, inputElement, {
  inputErrorClass,
  errorClass
}) => {
  // Функция checkInputValidity  принимает formElement и inputElement, внутри вызывает showInputError или hideInputError
  if (!inputElement.validity.valid) {
    // Если поле не проходит валидацию, покажем ошибку
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage, {
        inputErrorClass,
        errorClass
      }); //showInputError получает параметром форму, в которой находится проверяемое поле, и само это поле
  } else {
    // Если проходит, скроем
    hideInputError(formElement, inputElement, {
      inputErrorClass,
      errorClass
    }); // hideInputError получает  параметром форму, в которой находится проверяемое поле, и само это поле
  }
};

const hasInvalidInput = (inputList) => {
  //обходит массив полей и отвечает на вопрос: «Есть ли здесь хотя бы одно поле, которое не прошло валидацию?».
  return inputList.some((inputElement) => {
    //Функция возвращает true, если в массиве inputList есть хотя бы один невалидный input. Если все поля валидны — false.
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement, {
  inactiveButtonClass
}) => {
  // Функция принимает массив полей ввода и элемент кнопки, состояние которой нужно менять

  if (hasInvalidInput(inputList)) {
    // проверяем есть ли в массиве inputList невалидные поля
    buttonElement.classList.add(inactiveButtonClass); // делает кнопку неактивной
    buttonElement.setAttribute("disabled", true); //Если хотя бы одно из полей пустое, условие её заблокирует
  } else {
    buttonElement.classList.remove(inactiveButtonClass); // иначе делает кнопку активной
    buttonElement.removeAttribute("disabled", false); //Если с формой всё в порядке, условие разблокирует
  }
};

const setEventListeners = (formElement, {
  inputSelector,
  submitButtonSelector,
  ...rest
}) => {
  // Находим все поля внутри формы
  const inputList = Array.from(
    formElement.querySelectorAll(inputSelector)
  ); //сделаем из них массив методом Array.from
  const buttonElement = formElement.querySelector(submitButtonSelector); // Находим в текущей форме кнопку отправки
  formElement.checkForm = () => {
    toggleButtonState(inputList, buttonElement, rest);
  }

  inputList.forEach((inputElement) => {
      // Обойдем все элементы полученной коллекции
      inputElement.addEventListener("input", () => {
          // каждому полю добавим обработчик события input
          checkInputValidity(formElement, inputElement, rest); //Внутри колбэка вызовем checkInputValidity, передав ей форму и проверяемый элемент
          // formElement.checkForm = () => {
          toggleButtonState(inputList, buttonElement, rest);
     //   } // вызов проверит состояние кнопки при каждом изменении символа в любом из полей.
      });
  });
};

function enableValidation({
  formSelector,
  ...rest
}) {
  // Найдём все формы с указанным классом в DOM
  const formList = Array.from(document.querySelectorAll(formSelector)); // сделаем из них массив методом Array.from
  formList.forEach((formElement) => {
    //  Переберём полученную коллекцию
    formElement.addEventListener("submit", (evt) => {
      evt.preventDefault(); // У каждой формы отменим стандартное поведение
    });
    setEventListeners(formElement, rest); // Для каждой формы вызовем функцию setEventListeners, передав ей элемент формы
  });
};

enableValidation({ //вызываем функцию, передаем ей объект с полями форм, которые надо проверить
  //объект с полями форм, которые надо проверить
  formSelector: ".popup__container", //форма
  inputSelector: ".popup__input", //инпуты
  submitButtonSelector: ".popup__button-save", //кнопка сохранить/создать
  inactiveButtonClass: "popup__button-save_type_disabled", //неактивная кнопка
  inputErrorClass: "popup__input_type_error", //ошибка в инпуте
  errorClass: "popup__span-error_type_active", //ошибка в спане
});