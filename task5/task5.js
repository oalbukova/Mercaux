const headerMenuItem = document.querySelector(".header-menu__item");
const submenu = document.querySelector(".submenu");
const header = document.querySelector(".header");
const headerLogo = document.querySelector(".header__logo");
const sticky = header.offsetTop;


function submenuClassListToggle(elem) {
  if (document.documentElement.clientWidth < 500)
    elem.classList.toggle("submenu_active");
}

headerMenuItem.addEventListener("click", () => submenuClassListToggle(submenu));

window.onscroll = function () {
  myFunction();
};

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("header_scroll");
    headerLogo.classList.add("header__logo_scroll");
  } else {
    header.classList.remove("header_scroll");
    headerLogo.classList.remove("header__logo_scroll");
  }
}
