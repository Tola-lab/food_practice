function openModal (modalSelector, modalTimerId) {
    const modal = document.querySelector(modalSelector);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // чтобы не было прокрутки у модального окна.

    if (modalTimerId) {
        clearInterval(modalTimerId);
    }
};

function closeModal(modalSelector) {
    const modal = document.querySelector(modalSelector);
    modal.style.display = 'none';
    document.body.style.overflow = '';
};

function modal(triggerSelector, modalSelector, modalTimerId) {
    const modalTrigger = document.querySelectorAll(triggerSelector),
          modal = document.querySelector(modalSelector);

    modalTrigger.forEach(item => {
        item.addEventListener('click', () => openModal(modalSelector, modalTimerId));     
    });

    
    modal.addEventListener('click', (e) => {     // закрываем модальное окно
        if(e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal(modalSelector)
        }
    });

    document.addEventListener('keydown', (e) => {     // закрываем модальное окно нажатием на кнопку клавиатуры
        if (e.code === 'Escape') {
            closeModal(modalSelector)
        }
    });


    function showModalByScroll () {  // вызываем модальное окно, когда доскроллили в самый низ
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal(modalSelector, modalTimerId);
            window.removeEventListener('scroll', showModalByScroll); // удали эту функцию, когда показал один раз
        } 
    };

    window.addEventListener('scroll', showModalByScroll);
}

export default modal;
export {openModal};
export {closeModal};