const postData = async (url, data) => {    // настраивает запрос на отпрвку данных на сервер. async - предупреждение, что дальше будет асинхронный код
    let res = await fetch(url, {          // await – позволяет подождать, пока выполнится код и только после пойдёт дальше
        method: "POST", 
        headers: {
            'Content-type': 'application/json; charset=utf-8'
        },
        body: data
    });
    return await res.json();      // возвращаем промис
};

const getResource = async (url) => {   // настраиваем сбор данных с сервера (db.json), чтобы создать карточки с меню
    let res = await fetch(url);

    if (!res.ok) {      // если результат не ок, то
        throw new Error(`Could not fetch ${url}, status ${res.status}`);    // выдаём ошибку
    }

    return await res.json();     
};

export {postData};
export {getResource};

