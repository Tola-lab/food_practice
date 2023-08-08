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