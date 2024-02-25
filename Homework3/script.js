// Разработка веб-приложения:
// • Создайте HTML-страницу с элементами: изображение, имя фотографа, кнопка "лайк" и счетчик лайков.
// • Используя JavaScript и ваш API-ключ, получите случайное изображение из Unsplash каждый раз, когда пользователь загружает страницу. Обратите внимание, что должно подгружаться всегда случайное изображение, для этого есть отдельная ручка (эндпоинт) у API.
// • Отобразите информацию о фотографе под изображением.
// • Реализуйте функционал "лайка". Каждый раз, когда пользователь нажимает кнопку "лайк", счетчик должен увеличиваться на единицу. Одну фотографию пользователь может лайкнуть только один раз. Также должна быть возможность снять лайк, если ему разонравилась картинка.
// • Добавьте функцию сохранения количества лайков в локальное хранилище, чтобы при новой загрузке страницы счетчик не сбрасывался, если будет показана та же самая картинка.
// • Реализуйте возможность просмотра предыдущих фото с сохранением их в истории просмотров в localstorage.
// • Реализовать все с помощью async/await, без цепочем then.
const CLIENT_ID = "BXZdQeSafvj4bSUD0NA0AElobsFeJyjCiewwjNXx-gg";
const containerEl = document.querySelector(".container");
let randomPhoto = {
    name: "",
    discription: "",
    img: "",
    isLiked: false,
    likes: null,
};

const fetchPhoto = async () => {
    try {
        const url = `https://api.unsplash.com/photos/random?client_id=${CLIENT_ID}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error("Сервер встал!");
        }

        randomPhoto.name = data.user.name;
        randomPhoto.discription = data.user.country;
        randomPhoto.isLiked = data.liked_by_user;
        randomPhoto.likes = data.likes;
        randomPhoto.img = data.urls.small;
        saveData(randomPhoto);
        containerEl.insertAdjacentHTML("beforeend", renderItem(randomPhoto));
    } catch (err) {
        console.log(err);
    }
};

function renderItem() {
    return `<div class="photoBox">
                <img clas="img" src="${randomPhoto.img}">
                <div class="info">
                    <h2 class="author">Author:${randomPhoto.name}</h2>
                    <p class="discription">Country:${randomPhoto.discription}</p>
                    <p class="likes">Likes: ${randomPhoto.likes}</p>
                    <span class="btn">&#9825</span>
                </div>
            </div>`;
}

containerEl.addEventListener("click", function ({ target }) {
    if (target.matches(".btn")) {
        const buttonEl = document.querySelector(".btn");
        const discriptionEl = document.querySelector(".likes");

        if (!randomPhoto.isLiked) {
            buttonEl.classList.add("active");
            randomPhoto.isLiked = true;
            discriptionEl.textContent = `Likes: ${++randomPhoto.likes}`;
            updateData(randomPhoto);
        } else {
            randomPhoto.isLiked = false;
            buttonEl.classList.remove("active");
            discriptionEl.textContent = `Likes: ${--randomPhoto.likes}`;
            updateData(randomPhoto);
        }
    }
});

function saveData(array) {
    localStorage.setItem(++localStorage.length, JSON.stringify(array));
}

function updateData(array) {
    localStorage.setItem(localStorage.length, JSON.stringify(array));
}

function takeLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function saveLocal(data) {
    randomPhoto.name = data.name;
    randomPhoto.discription = data.discription;
    randomPhoto.isLiked = data.isLiked;
    randomPhoto.likes = data.likes;
    randomPhoto.img = data.img;
}

fetchPhoto();

const previousPhotoBtn = document.querySelector(".previous");

previousPhotoBtn.addEventListener("click", function () {
    if (localStorage.length > 1) {
        const prevPhoto = takeLocalStorage(localStorage.length - 1);
        saveLocal(prevPhoto);
        containerEl.innerHTML = "";
        containerEl.insertAdjacentHTML("beforeend", renderItem());
        if (randomPhoto.isLiked) {
            const buttonEl = document.querySelector(".btn");
            buttonEl.classList.add("active");
        }
        localStorage.removeItem(localStorage.length);
    } else {
        alert("Хранилище пустое!");
    }
});
