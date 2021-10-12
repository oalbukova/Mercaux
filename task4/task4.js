(function () {
  if (typeof window.CustomEvent === "function") return false;
  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: null };
    const e = document.createEvent("CustomEvent");
    e.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return e;
  }
  window.CustomEvent = CustomEvent;
})();

// базовые классы и селекторы
const WRAPPER_SELECTOR = ".slider__wrapper";
const ITEMS_SELECTOR = ".slider__items";
const ITEM_SELECTOR = ".slider__item";

// порог для переключения слайда (40%)
const SWIPE_THRESHOLD = 20;
// класс для отключения transition
const TRANSITION_NONE = "transition-none";

function SimpleAdaptiveSlider(selector, config) {
  // .slider
  this._$root = document.querySelector(selector);
  // .slider__wrapper
  this._$wrapper = this._$root.querySelector(WRAPPER_SELECTOR);
  // .slider__items
  this._$items = this._$root.querySelector(ITEMS_SELECTOR);
  // .slider__item
  this._$itemList = this._$root.querySelectorAll(ITEM_SELECTOR);
  // текущий индекс
  this._currentIndex = 0;
  // экстремальные значения слайдов
  this._minOrder = 0;
  this._maxOrder = 0;
  this._$itemWithMinOrder = null;
  this._$itemWithMaxOrder = null;
  this._minTranslate = 0;
  this._maxTranslate = 0;
  // направление смены слайдов (по умолчанию)
  this._direction = "next";
  // флаг, который показывает, что идёт процесс уравновешивания слайдов
  this._balancingItemsFlag = false;
  // текущее значение трансформации
  this._transform = 0;
  // swipe параметры
  // this._hasSwipeState = false;
  // this._swipeStartPosX = 0;
  // id таймера
  this._intervalId = null;
  // конфигурация слайдера (по умолчанию)
  this._config = {
    loop: true,
    autoplay: true,
    interval: 2000,
    swipe: true,
  };

  // добавляем к слайдам data-атрибуты
  for (let i = 0, length = this._$itemList.length; i < length; i++) {
    this._$itemList[i].dataset.order = i;
    this._$itemList[i].dataset.index = i;
    this._$itemList[i].dataset.translate = 0;
  }
  // перемещаем последний слайд перед первым
  if (this._config.loop) {
    const count = this._$itemList.length - 1;
    const translate = -this._$itemList.length * 100;
    this._$itemList[count].dataset.order = -1;
    this._$itemList[count].dataset.translate = -this._$itemList.length * 100;
    const transformValue = "translateX(".concat(translate, "%)");
    this._$itemList[count].style.transform = transformValue;
  }
  // обновляем экстремальные значения переменных
  this._refreshExtremeValues();
  // помечаем активные элементы
  // this._setActiveClass();
  // назначаем обработчики
  this._addEventListener();
  // запускаем автоматическую смену слайдов
  this._autoplay();
}

// смена слайдов
SimpleAdaptiveSlider.prototype._move = function () {
  if (this._direction === "none") {
    this._$items.classList.remove(TRANSITION_NONE);
    this._$items.style.transform = "translateX(".concat(this._transform, "%)");
    return;
  }
  if (!this._config.loop) {
    const condition = this._currentIndex + 1 >= this._$itemList.length;
    if (condition && this._direction === "next") {
      this._autoplay("stop");
      return;
    }
    if (this._currentIndex <= 0 && this._direction === "prev") {
      return;
    }
  }
  const step = this._direction === "next" ? -100 : 100;
  const transform = this._transform + step;
  if (this._direction === "next") {
    if (++this._currentIndex > this._$itemList.length - 1) {
      this._currentIndex -= this._$itemList.length;
    }
  } else {
    if (--this._currentIndex < 0) {
      this._currentIndex += this._$itemList.length;
    }
  }
  this._transform = transform;
  this._$items.style.transform = "translateX(".concat(transform, "%)");
  // this._setActiveClass();
};

// функция для перемещения к слайду по индексу
SimpleAdaptiveSlider.prototype._moveTo = function (index) {
  const currentIndex = this._currentIndex;
  this._direction = index > currentIndex ? "next" : "prev";
  for (const i = 0; i < Math.abs(index - currentIndex); i++) {
    this._move();
  }
};

// метод для автоматической смены слайдов
SimpleAdaptiveSlider.prototype._autoplay = function (action) {
  if (!this._config.autoplay) {
    return;
  }
  if (action === "stop") {
    clearInterval(this._intervalId);
    this._intervalId = null;
    return;
  }
  if (this._intervalId === null) {
    this._intervalId = setInterval(
      function () {
        this._direction = "next";
        this._move();
      }.bind(this),
      this._config.interval
    );
  }
};

// refresh extreme values
SimpleAdaptiveSlider.prototype._refreshExtremeValues = function () {
  const $itemList = this._$itemList;
  this._minOrder = parseInt($itemList[0].dataset.order);
  this._maxOrder = this._minOrder;
  this._$itemWithMinOrder = $itemList[0];
  this._$itemWithMaxOrder = this._$itemWithMinOrder;
  this._minTranslate = parseInt($itemList[0].dataset.translate);
  this._maxTranslate = this._minTranslate;
  for (let i = 0, length = $itemList.length; i < length; i++) {
    const $item = $itemList[i];
    const order = parseInt($item.dataset.order);
    if (order < this._minOrder) {
      this._minOrder = order;
      this._$itemWithMinOrder = $item;
      this._minTranslate = parseInt($item.dataset.translate);
    } else if (order > this._maxOrder) {
      this._maxOrder = order;
      this._$itemWithMaxOrder = $item;
      this._minTranslate = parseInt($item.dataset.translate);
    }
  }
};

// balancing items
SimpleAdaptiveSlider.prototype._balancingItems = function () {
  if (!this._balancingItemsFlag) {
    return;
  }
  const $wrapper = this._$wrapper;
  const wrapperRect = $wrapper.getBoundingClientRect();
  const halfWidthItem = wrapperRect.width / 2;
  const count = this._$itemList.length;
  let translate;
  let clientRect;
  if (this._direction === "next") {
    const wrapperLeft = wrapperRect.left;
    const $min = this._$itemWithMinOrder;
    translate = this._minTranslate;
    clientRect = $min.getBoundingClientRect();
    if (clientRect.right < wrapperLeft - halfWidthItem) {
      $min.dataset.order = this._minOrder + count;
      translate += count * 100;
      $min.dataset.translate = translate;
      $min.style.transform = "translateX(".concat(translate, "%)");
      this._refreshExtremeValues();
    }
  } else if (this._direction === "prev") {
    const wrapperRight = wrapperRect.right;
    const $max = this._$itemWithMaxOrder;
    translate = this._maxTranslate;
    clientRect = $max.getBoundingClientRect();
    if (clientRect.left > wrapperRight + halfWidthItem) {
      $max.dataset.order = this._maxOrder - count;
      translate -= count * 100;
      $max.dataset.translate = translate;
      $max.style.transform = "translateX(".concat(translate, "%)");
      this._refreshExtremeValues();
    }
  }
  requestAnimationFrame(this._balancingItems.bind(this));
};

// adding listeners
SimpleAdaptiveSlider.prototype._addEventListener = function () {
  const $items = this._$items;
  function onClick(e) {
    const $target = e.target;
    this._autoplay("stop");
    if ($target.classList.contains("slider__control")) {
      e.preventDefault();
      this._direction = $target.dataset.slide;
      this._move();
    } else if ($target.dataset.slideTo) {
      e.preventDefault();
      const index = parseInt($target.dataset.slideTo);
      this._moveTo(index);
    } else if ($target.classList.contains("slider__img")) {
      this._direction = "next";
      this._move();
    }
    if (this._config.loop) {
      this._autoplay();
    }
  }
  function onTransitionStart() {
    this._balancingItemsFlag = true;
    window.requestAnimationFrame(this._balancingItems.bind(this));
  }
  function onTransitionEnd() {
    this._balancingItemsFlag = false;
    this._$root.dispatchEvent(
      new CustomEvent("slider.transition.end", { bubbles: true })
    );
  }
  function onMouseEnter() {
    this._autoplay("stop");
  }
  function onMouseLeave() {
    if (this._config.loop) {
      this._autoplay();
    }
  }
  function onSwipeStart(e) {
    this._autoplay("stop");
    const event = e.type.search("touch") === 0 ? e.touches[0] : e;
    this._swipeStartPosX = event.clientX;
    this._swipeStartPosY = event.clientY;
    this._hasSwipeState = true;
    this._hasSwiping = false;
  }
  function onSwipeMove(e) {
    if (!this._hasSwipeState) {
      return;
    }
    const event = e.type.search("touch") === 0 ? e.touches[0] : e;
    const diffPosX = this._swipeStartPosX - event.clientX;
    const diffPosY = this._swipeStartPosY - event.clientY;
    if (!this._hasSwiping) {
      if (Math.abs(diffPosY) > Math.abs(diffPosX)) {
        this._hasSwipeState = false;
        return;
      }
      this._hasSwiping = true;
    }
    e.preventDefault();
    if (!this._config.loop) {
      if (this._currentIndex + 1 >= this._$itemList.length && diffPosX >= 0) {
        diffPosX = diffPosX / 4;
      }
      if (this._currentIndex <= 0 && diffPosX <= 0) {
        diffPosX = diffPosX / 4;
      }
    }
    const value = (diffPosX / this._$wrapper.getBoundingClientRect().width) * 100;
    const translateX = this._transform - value;
    this._$items.classList.add(TRANSITION_NONE);
    this._$items.style.transform = "translateX(".concat(translateX, "%)");
  }
  function onSwipeEnd(e) {
    if (!this._hasSwipeState) {
      return;
    }
    const event = e.type.search("touch") === 0 ? e.changedTouches[0] : e;
    const diffPosX = this._swipeStartPosX - event.clientX;
    if (!this._config.loop) {
      if (this._currentIndex + 1 >= this._$itemList.length && diffPosX >= 0) {
        diffPosX = diffPosX / 4;
      }
      if (this._currentIndex <= 0 && diffPosX <= 0) {
        diffPosX = diffPosX / 4;
      }
    }
    const value = (diffPosX / this._$wrapper.getBoundingClientRect().width) * 100;
    this._$items.classList.remove(TRANSITION_NONE);
    if (value > SWIPE_THRESHOLD) {
      this._direction = "next";
      this._move();
    } else if (value < -SWIPE_THRESHOLD) {
      this._direction = "prev";
      this._move();
    } else {
      this._direction = "none";
      this._move();
    }
    this._hasSwipeState = false;
    if (this._config.loop) {
      this._autoplay();
    }
  }
  function onDragStart(e) {
    e.preventDefault();
  }
  function onVisibilityChange() {
    if (document.visibilityState === "hidden") {
      this._autoplay("stop");
    } else if (document.visibilityState === "visible") {
      if (this._config.loop) {
        this._autoplay();
      }
    }
  }
  // click
  this._$root.addEventListener("click", onClick.bind(this));
  // transitionstart and transitionend
  if (this._config.loop) {
    $items.addEventListener("transitionstart", onTransitionStart.bind(this));
    $items.addEventListener("transitionend", onTransitionEnd.bind(this));
  }
  // mouseenter and mouseleave
  if (this._config.autoplay) {
    this._$root.addEventListener("mouseenter", onMouseEnter.bind(this));
    this._$root.addEventListener("mouseleave", onMouseLeave.bind(this));
  }
  // swipe
  if (this._config.swipe) {
    const supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, "passive", {
        get: function () {
          supportsPassive = true;
        },
      });
      window.addEventListener("testPassiveListener", null, opts);
    } catch (err) {}
    this._$root.addEventListener(
      "touchstart",
      onSwipeStart.bind(this),
      supportsPassive ? { passive: false } : false
    );
    this._$root.addEventListener(
      "touchmove",
      onSwipeMove.bind(this),
      supportsPassive ? { passive: false } : false
    );
    this._$root.addEventListener("mousedown", onSwipeStart.bind(this));
    this._$root.addEventListener("mousemove", onSwipeMove.bind(this));
    document.addEventListener("touchend", onSwipeEnd.bind(this));
    document.addEventListener("mouseup", onSwipeEnd.bind(this));
  }
  this._$root.addEventListener("dragstart", onDragStart.bind(this));
  // при изменении активности вкладки
  document.addEventListener("visibilitychange", onVisibilityChange.bind(this));
};

// перейти к следующему слайду
SimpleAdaptiveSlider.prototype.next = function () {
  this._direction = "next";
  this._move();
};

// перейти к предыдущему слайду
SimpleAdaptiveSlider.prototype.prev = function () {
  this._direction = "prev";
  this._move();
};

// управление автоматической сменой слайдов
SimpleAdaptiveSlider.prototype.autoplay = function (action) {
  this._autoplay("stop");
};
