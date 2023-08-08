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