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