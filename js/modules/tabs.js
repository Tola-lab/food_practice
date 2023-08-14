function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    const tabs = document.querySelectorAll(tabsSelector),
          tabsContent = document.querySelectorAll(tabsContentSelector),
          tabsParent = document.querySelector(tabsParentSelector);

    function hideTabContent () {   // скрываем все не нужные пока табы
        tabsContent.forEach(item => {
            item.style.display = 'none';
        });

        tabs.forEach(item => {   // удаляем класс активности, когда скрываем не нужные табы
            item.classList.remove(activeClass);
        });
    }

    function showTabContent (i = 0) { // показываем нужный нам таб. i = 0 – это дефолтный показ первого слайда, если при вызове функции не передаём аргумент
        tabsContent[i].style.display = 'block';
        tabs[i].classList.add(activeClass);  // добавляем класс активности
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {  // создаём делегирование события 
        const target = e.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {       // tabsSelector.slice(1) – удаление точки перед селектором, иначе будет ошибка 
            tabs.forEach((item, i) => { // i - номер элемента по порядку
                if (target == item ) { // если таргет будет совпадать с элементом, который мы сейчас перебираем
                    hideTabContent(); // то скрываем те табы, которые не нужны
                    showTabContent(i); // и показываем тот, который нужен. i – это таб по порядку (на который кликнули)
                }
            });
        }
    }); 
}

export default tabs;