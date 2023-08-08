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