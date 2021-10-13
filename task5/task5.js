const headerMenuItem = document.querySelector(".header-menu__item");
const submenu = document.querySelector(".submenu");

function submenuClassListToggle(elem) {
  if (document.documentElement.clientWidth < 500)
    elem.classList.toggle("submenu_active");
}
// }
headerMenuItem.addEventListener("click", () => submenuClassListToggle(submenu));

// document.addEventListener("DOMContentLoaded", (event) => {
//   headerMenuItem.addEventListener("click", () => submenuClassListToggle(submenu));

// });

// window.addEventListener("resize", (event) => {
//    headerMenuItem.addEventListener("click", () =>
//      submenuClassListToggle(submenu)
//    );
// });
