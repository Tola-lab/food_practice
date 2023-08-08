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