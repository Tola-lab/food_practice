// * использую style вместо classlist, так как не прописывала новые классы для ccs

window.addEventListener('DOMContentLoaded', () => {
// Tabs

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

// Timer

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

// Modal

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
    }
    

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

// Используем классы для карточек с меню

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

// Forms

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

// Создаём более сложный слайдер 

    const slides = document.querySelectorAll('.offer__slide'),
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

    next.addEventListener('click', () => {
        if (offset == +width.slice(0, width.length - 2) * (slides.length -1)) { // ширина слайда * на все слайды минус 1.  +width.slice(0, width.length - 2) – в width строка выглядит примерно так: "500px". методом slice мы вырезаем с 0, до width.length - 2 – а это количество символов у width минус 2. и в самом конце, унарным плюсом (+width), превращаем строку в число 
            offset = 0;
        } else {
            offset += +width.slice(0, width.length - 2);     // к видимому слайду добаили ширину нового слайда, тем самым вытеснив видимый влево
        }

        slidesField.style.transform = `translateX(-${offset}px)`;   //смещение линии со слайдами влево 

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });

    prev.addEventListener('click', () => {
        if (offset == 0) { 
            offset = +width.slice(0, width.length - 2) * (slides.length -1);
        } else {
            offset -= +width.slice(0, width.length - 2);   
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }
    });
});
