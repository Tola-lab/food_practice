/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js/modules/calc.js":
/*!****************************!*\
  !*** ./js/modules/calc.js ***!
  \****************************/
/***/ ((module) => {

function calc() {
    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'woman';
        localStorage.setItem('sex', 'woman');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings (selector, activeClass) {        // для переключения класса активности, если пользователь выбрал определенные данные и обновил или закрыл страницу (данные остаются, так как лежат в локалстораже)
        const elements = document.querySelectorAll(selector);

        elements.forEach(elem => {                          
            elem.classList.remove(activeClass);                 // удаляем класс активности везде
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {  // если у элемента уникальный идентификатор такой же, какой прописан в localStorage, то
                elem.classList.add(activeClass);                        // добавляем класс активности
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
                elem.classList.add(activeClass);
            }
        });
    };

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal () {
        if (!sex || !height || !weight || !age || !ratio) {         // тут проверяем, чтобы все данные были заполнены
            result.textContent = '____';
            return;                                                 // для того, чтобы прервать функцию, если выше будет false
        } 

        if (sex === 'woman') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);   // Math.round – округление до целого числа
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    };

    calcTotal();

    function getStaticInformation (selector, activeClass) {          // получаем информацию с 1 и 3 строки калькулятора. parentSelector – это или гендор или уровень активности
        const elements = document.querySelectorAll(selector);     // всех дивы в родителе

        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {       // делегирование события
                if (e.target.getAttribute('data-ratio')) {          // если кликнули на на див, в котором есть дата-атрибут
                    ratio = +e.target.getAttribute('data-ratio');   // то вытаскиваем значение этого дата-атрибута
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));  // записываем в локальное хранилище то, что выбрал пользователь
                } else {
                    sex = e.target.getAttribute('id');              // иначе назначаем пол через id идентификатор
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
    
                elements.forEach(item => {                          // удаление класса активности у всех элементов
                    item.classList.remove(activeClass);
                });
    
                e.target.classList.add(activeClass);                // назначаем класс активности на тот див, на который кликнули
    
                calcTotal();
            });
        });
    };

    getStaticInformation('#gender div', 'calculating__choose-item_active');     // функия для выбора гендера
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');     // функция для выбора уровня активности

    function getDynamicInformation (selector) {                 // фунция для работы со второй строкой калькулятора (вес, рост и возраст). selector – это тот див, на который мы кликаем 
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {                 // отслеживаем, что пишет пользователь в инпуте

            if (input.value.match(/\D/g)){                       // если инпут не число, то
                input.style.border = '1px solid red';            // делаем красную обводку
            } else {
                input.style.border = 'none';                     // тут убираем 
            }

            switch(input.getAttribute('id')) {                  // проверяем инупты по id идентификатору
                case 'height':                                  // если пишет в height, то и записывать будем в height и т.д
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    };

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

module.exports = calc;

/***/ }),

/***/ "./js/modules/cards.js":
/*!*****************************!*\
  !*** ./js/modules/cards.js ***!
  \*****************************/
/***/ ((module) => {

function cards() {
    class MenuCard {
        constructor (src, alt, title, descr, price, parentSelector, ...classes) {  // ...classes – оператор rest
            this.src = src;
            this.alt = alt; 
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);  // родитель карточек меню
            this.transfer = 27;     // доллар
            this.changeToUAH();     // для перевода в гривны
        }
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        render() {              // создаём див, в котором будет лежать карточка с меню
            const element = document.createElement('div');

            if(this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(item => element.classList.add(item));  //перебираем массив с новыми классами и добавляем их в див елемент
            }

            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);
        }
    }

    const getResource = async (url) => {   // настраиваем сбор данных с сервера (db.json), чтобы создать карточки с меню
        const res = await fetch(url);

        if (!res.ok) {      // если результат не ок, то
            throw new Error(`Could not fetch ${url}, status ${res.status}`);    // выдаём ошибку
        }

        return await res.json();     
    };

    getResource('http://localhost:3000/menu')   // собираем с сервера данные и формируем карточки с меню
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {    // деструктуризировали объект меню
                new MenuCard(img, altimg, title, descr, price, '.menu .container').render();    // '.menu .container' – родитель, куда поместим карточки
            });
        });

// создадим карточки с меню без конструктора с классами
//  getResource('http://localhost:3000/menu')
//    .then (data => createCard(data));
//
//  function createCard(data) {
//      data.forEach(({img, altimg, title, descr, price}) => {
//          const element = document.createElement('div');
//
//      element.classList.add('menu__item');
//
//      element.innerHTML = `
//          <img src=${img} alt=${altimg}>
//          <h3 class="menu__item-subtitle">${title}</h3>
//          <div class="menu__item-descr">${descr}</div>
//          <div class="menu__item-divider"></div>
//          <div class="menu__item-price">
//              <div class="menu__item-cost">Цена:</div>
//              <div class="menu__item-total"><span>${price}</span> грн/день</div>
//          </div>
//      `;
//      
//      document.querySelector('.menu .container').append(element);
//    });
//  }
}

module.exports = cards;

/***/ }),

/***/ "./js/modules/forms.js":
/*!*****************************!*\
  !*** ./js/modules/forms.js ***!
  \*****************************/
/***/ ((module) => {

function forms(){
    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg', 
        success: 'Спасибо! Скоро мы с вами свяжемся!', 
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {    // настраивает запрос на отпрвку данных на сервер. async - предупреждение, что дальше будет асинхронный код
        const res = await fetch(url, {          // await – позволяет подождать, пока выполнится код и только после пойдёт дальше
            method: "POST", 
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: data
        });
        return await res.json();      // возвращаем промис
    };

    function bindPostData(form) {       // функция по отправке формы
        form.addEventListener('submit', (e) => {     // событие по отправке формы в обычном формате
            e.preventDefault();

            let statusMessage = document.createElement('img');  
            statusMessage.src = message.loading;    // подгружается картинка
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);     // добавляем к форме сообщение

            const formData = new FormData(form);    // собираем все данные из формы

            const json = JSON.stringify(Object.fromEntries(formData.entries()));    // преобразование в json формат данных с формы

            postData('http://localhost:3000/requests', json)  
            .then(data => {   // с сервера возвращается какая-то дейта 
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            })
        });
    }

    function showThanksModal (message) {       // создаём модальное окно с благодарностью после отправки данные в форме
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.style.display = 'none';
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
        <div class="modal__content">
        <div data-close class="modal__close">&times;</div>
        <div class="modal__title">${message}</div>
        </div>
        `;
        document.querySelector('.modal').append(thanksModal);

        setTimeout (() => {
            thanksModal.remove();
            prevModalDialog.style.display = 'block';
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')     // работа с базой данных db.json 
    .then(data => data.json())
    .then(res => console.log(res));
}

module.exports = forms;

/***/ }),

/***/ "./js/modules/modal.js":
/*!*****************************!*\
  !*** ./js/modules/modal.js ***!
  \*****************************/
/***/ ((module) => {

function modal() {
    const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

    modalTrigger.forEach(item => {
        item.addEventListener('click', openModal);
    });

    function openModal () {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // чтобы не было прокрутки у модального окна.
        clearInterval(modalTimerId);
    };

    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };


    modal.addEventListener('click', (e) => {     // закрываем модальное окно
        if(e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal()
        }
    });

    document.addEventListener('keydown', (e) => {     // закрываем модальное окно нажатием на кнопку клавиатуры
        if (e.code === 'Escape') {
            closeModal()
        }
    });


    const modalTimerId = setTimeout(openModal, 50000);  // вызываем модальное окно через какое-то время

    function showModalByScroll () {  // вызываем модальное окно, когда доскроллили в самый низ
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll); // удали эту функцию, когда показал один раз
        } 
    };

    window.addEventListener('scroll', showModalByScroll);
}

module.exports = modal;

/***/ }),

/***/ "./js/modules/slider.js":
/*!******************************!*\
  !*** ./js/modules/slider.js ***!
  \******************************/
/***/ ((module) => {

function slider() {
    const slides = document.querySelectorAll('.offer__slide'),
    slider = document.querySelector('.offer__slider'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'), 
    current = document.querySelector('#current'),
    total = document.querySelector('#total'), 
    slidesWrapper = document.querySelector('.offer__slider-wrapper'), 
    slidesField = document.querySelector('.offer__slider-inner'), 
    width = window.getComputedStyle(slidesWrapper).width;   // ширина окна слайда 

let slideIndex = 1;     // индекс (номер) слайда
let offset = 0;         // сколько нужно отступить при смещении слайда

if (slides.length < 10) {        // кол-во всех слайдов
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
} else {
    total.textContent = slides.length;
    current.textContent = slideIndex;
}

slidesField.style.width = 100 * slides.length + '%';        // ширина всех слайдов. они будут стоять в одной линии, но показываться будет только один
slidesField.style.display = 'flex';
slidesField.style.transition = '0.5s all';      // слайды перемещаются плавно 

slidesWrapper.style.overflow = 'hidden';    // скрыли все элементы, которые за шириной окна слайда

slides.forEach(slide => {       // ширина всех слайдов в линии
    slide.style.width = width;
});

slider.style.position = 'relative';     // для того, чтобы все элементы, которые будут абсолютно спозиционированны внутри слайдера, нормально отображались

const indicators = document.createElement('ol');      // обертка для точек для слайдера
    dots = [];

indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
`;
slider.append(indicators);

for (let i = 0; i < slides.length; i++) {       // создаём точки
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', i + 1);         // устанавливаем атрибует 'data-slide-to' к каждой точке. 'i + 1' – нумерация точек (первый слайд == первая точка)
    dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
    `;
    if (i == 0) {
        dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
    };

function doActiveDot () {       // точка становится активной при перелистывании слайда
    dots.forEach(item => {              
    item.style.opacity = '.5';
});
    dots[slideIndex - 1].style.opacity = '1';
};

function addZeroToNumber () {       // добавляем 0 к однозначным числам
    if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
    } else {
        current.textContent = slideIndex;
    }
};

function shiftSlidesToLeft () {         //смещение линии со слайдами влево 
    slidesField.style.transform = `translateX(-${offset}px)`;
};

function removeNotNumber (str) {       // удаляем не числа + делаем из строки число
    return +str.replace(/\D/g, '')
};

next.addEventListener('click', () => {
    if (offset == removeNotNumber(width) * (slides.length -1)) { // ширина слайда * на все слайды минус 1. width.replace(/\D/g, '') – все не числа убираем. унарным плюсом (+width), превращаем строку в число 
        offset = 0;
    } else {
        offset += removeNotNumber(width);     // к видимому слайду добаили ширину нового слайда, тем самым вытеснив видимый влево
    }

    shiftSlidesToLeft ();

    if (slideIndex == slides.length) {
        slideIndex = 1;
    } else {
        slideIndex++;
    }

    addZeroToNumber ();
    doActiveDot();
});

prev.addEventListener('click', () => {
    if (offset == 0) { 
        offset = removeNotNumber(width) * (slides.length -1);
    } else {
        offset -= removeNotNumber(width);   
    }

    shiftSlidesToLeft ();

    if (slideIndex == 1) {
        slideIndex = slides.length;
    } else {
        slideIndex--;
    }

    addZeroToNumber ();
    doActiveDot();
});

dots.forEach(item => {              // кликаем на любую точку -> открываем слайд подходящий к этой точке
    item.addEventListener('click', (e) => {
        const slideTo = e.target.getAttribute('data-slide-to');

        slideIndex = slideTo;       // кликнули на 3ю точку, открылся 3й слайд
        offset = removeNotNumber(width) * (slideTo -1);

        shiftSlidesToLeft ();
        addZeroToNumber ();
        doActiveDot();
    });
});

// Создаём простой слайдер
    // const slides = document.querySelectorAll('.offer__slide'),
    //       prev = document.querySelector('.offer__slider-prev'),
    //       next = document.querySelector('.offer__slider-next'), 
    //       current = document.querySelector('#current'),
    //       total = document.querySelector('#total');


    // let slideIndex = 1;     // индекс (номер) слайда

    // showSlides(slideIndex);     // как изначально будет выглядеть слайдер

    // if (slides.length < 10) {        // кол-во всех слайдов
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = slides.length;
    // }

    // function showSlides (n) {   // n – slideIndex
    //     if (n > slides.length) {      // slides.length – это сколько всего у нас слайдов
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slides.length; 
    //     }

    //     slides.forEach(slide => {
    //         slide.style.display = 'none';
    //     })

    //     slides[slideIndex -1].style.display = 'block';

    //     if (slides.length < 10) {        // изменение номера текущего слайда
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // };

    // function plusSlides (n) {       // переключение слайдов 
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', () => {      // клик на стрелку назад
    //     plusSlides(-1);
    // });

    // next.addEventListener('click', () => {      // клик на стрелку вперед
    //     plusSlides(1);
    // });
}

module.exports = slider;

/***/ }),

/***/ "./js/modules/tabs.js":
/*!****************************!*\
  !*** ./js/modules/tabs.js ***!
  \****************************/
/***/ ((module) => {

function tabs() {
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent () {   // скрываем все не нужные пока табы
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {   // удаляем класс активности, когда скрываем не нужные табы
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent (i = 0) { // показываем нужный нам таб. i = 0 – это дефолтный показ первого слайда, если при вызове функции не передаём аргумент
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add('tabheader__item_active');  // добавляем класс активности
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {  // создаём делегирование события 
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => { // i - номер элемента по порядку
                if (target == item ) { // если таргет будет совпадать с элементом, который мы сейчас перебираем
                    hideTabContent(); // то скрываем те табы, которые не нужны
                    showTabContent(i); // и показываем тот, который нужен. i – это таб по порядку (на который кликнули)
                }
            });
        }
    }); 
}

module.exports = tabs;

/***/ }),

/***/ "./js/modules/timer.js":
/*!*****************************!*\
  !*** ./js/modules/timer.js ***!
  \*****************************/
/***/ ((module) => {

function timer(){
    const deadline = '2023-06-30';  // дата дедлайна

    function getTimeRemaning(endtime) { // получаем разницу между датами: дедлйан и сегодняшний день
        const t = Date.parse(endtime) - Date.parse(new Date()); // в переменную t получаем разницу между дедлайном и сегодняшней датой
        let days,
            hours,
            minutes,
            seconds;

            if (t <= 0) {
                days = 0;
                hours = 0,
                minutes = 0,
                seconds = 0;
            } else {
                days = Math.floor(t / (1000 * 60 * 60 * 24)),  // 1000 мс * на минуту * на час * на сутки = сколько суток до дедлайна. Math.floor() – округление до целого
                hours = Math.floor((t / (1000 * 60 * 60) % 24)),  // 1000 мс * на минуту * на час = сколько часов до дедлайна. % 24 – это деление часов до дедлайн на 24 и возвращения остатка
                minutes = Math.floor((t / (1000 * 60) % 60)),
                seconds = Math.floor((t / 1000) % 60);
            };


        return {
            'total': t,    // общее кол-во миллисекунд
            'days': days,
            'hours': hours, 
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero (num) {   // будет добавлять 0 к цифрам меньше 10
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock (selector, endtime) {   // устанавливаем таймер на страницу
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'), 
              timeInterval = setInterval(updateClock, 1000); 

        updateClock(); // запуск функции в ручную решит проблему с задеркой на секунду в обновлении страницы

    function updateClock () {   // меняет по секундно таймер
        const t = getTimeRemaning(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);
}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./js/script.js ***!
  \**********************/
window.addEventListener('DOMContentLoaded', () => {
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./js/modules/tabs.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./js/modules/cards.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./js/modules/timer.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./js/modules/modal.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./js/modules/forms.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./js/modules/slider.js"),
          calc = __webpack_require__(/*! ./modules/calc */ "./js/modules/calc.js");

    tabs();
    cards();
    timer();
    modal();
    forms();
    slider();
    calc();
});

})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map