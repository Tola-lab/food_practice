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