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

    const modalOpen = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal'),
          modalClose = document.querySelector('[data-close]');
   
    
        modalOpen.forEach(item => {
            item.addEventListener('click', () => {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';  // чтобы не было прокрутки у модального окна
            });
        });

        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {     // закрываем модальное окно, нажав на область вокруг него
            if(e.target === modal) {
                modal.style.display = 'none';
            }
        });

        document.addEventListener('keydown', (e) => {     // закрываем модальное окно нажатием на кнопку клавиатуры
            if (e.code === 'Escape') {
                modal.style.display = 'none';
            }
        })
});