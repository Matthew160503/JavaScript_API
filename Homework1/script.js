// Необходимо создать веб-страницу с динамическими элементами с расписанием занятий.

// На странице должна быть таблица с расписанием занятий, на основе JSON-данных.
// Каждая строка таблицы должна содержать информацию о занятии, а именно:
// - название занятия
// - время проведения занятия
// - максимальное количество участников
// - текущее количество участников
// - кнопка "записаться"
// - кнопка "отменить запись"

// Если максимальное количество участников достигнуто, либо пользователь уже записан на занятие, сделайте кнопку "записаться" неактивной.
// Кнопка "отменить запись" активна в случае, если пользователь записан на занятие, иначе она должна быть неактивна.

// Пользователь может записаться на один курс только один раз.

// При нажатии на кнопку "записаться" увеличьте количество записанных участников.
// Если пользователь нажимает "отменить запись", уменьшите количество записанных участников.
// Обновляйте состояние кнопок и количество участников в реальном времени.

// Если количество участников уже максимально, то пользователь не может записаться, даже если он не записывался ранее.

// Сохраняйте данные в LocalStorage, чтобы они сохранялись и отображались при перезагрузке страницы.

// Начальные данные (JSON):

const localStorageKey = "activities";
const localStorageKeyRegistration = "registration";

const initialData = `[
    {
        "id": 1,
        "name": "Йога",
        "time": "10:00 - 11:00",
        "maxParticipants": 15,
        "currentParticipants": 8
    },
    {
        "id": 2,
        "name": "Пилатес",
        "time": "11:30 - 12:30",
        "maxParticipants": 10,
        "currentParticipants": 5
    },
    {
        "id": 3,
        "name": "Кроссфит",
        "time": "13:00 - 14:00",
        "maxParticipants": 20,
        "currentParticipants": 15
    },
    {
        "id": 4,
        "name": "Танцы",
        "time": "14:30 - 15:30",
        "maxParticipants": 12,
        "currentParticipants": 10
    },
    {
        "id": 5,
        "name": "Бокс",
        "time": "16:00 - 17:00",
        "maxParticipants": 8,
        "currentParticipants": 6
    }
]`;

const checkingActivityRegistration = `[
    {
        "id": 1,
        "value": 0
    },
    {
        "id": 2,
        "value": 0
    },
    {
        "id": 3,
        "value": 0
    },
    {
        "id": 4,
        "value": 0
    },
    {
        "id": 5,
        "value": 0
    }
]`;

writeLocalStorage(localStorageKey, initialData);
writeLocalStorage(localStorageKeyRegistration, checkingActivityRegistration);

const activities = takeLocalStorage(localStorageKey);
const registration = takeLocalStorage(localStorageKeyRegistration);

const container = document.querySelector("div.container");

activities.forEach((activity) => {
    container.insertAdjacentHTML(
        "beforeend",
        `<div class="activity" data-id="${activity.id}">
            <h2 class="name">${activity.name}</h2>
            <p class="time">${activity.time}</p>
            <p class="max-count">${activity.maxParticipants}</p>
            <p class="current-count">${activity.currentParticipants}</p>
            <button class="addBtn">Записаться</button>
            <button class="removeBtn">Отменить запись</button>
        </div>`
    );
});

const addBtnEL = document.querySelectorAll("button.addBtn");
const removeBtnEl = document.querySelectorAll("button.removeBtn");
const maxParticipants = document.querySelectorAll(".max-count");
const currentParticipants = document.querySelectorAll(".current-count");

for (let i = 0; i < registration.length; i++) {
    if (registration[i].value === 1) {
        addAtributeDisabled(addBtnEL[i]);
    } else {
        addAtributeDisabled(removeBtnEl[i]);
    }

    if (maxParticipants[i].textContent === currentParticipants[i].textContent) {
        addAtributeDisabled(addBtnEL[i]);
        registration[i].value = 1;

        saveData(registration, localStorageKeyRegistration);
    }
}

container.addEventListener("click", ({ target }) => {
    if (target.matches(".addBtn")) {
        const fatherEl = target.closest(".activity");

        const resActivity = activities.find((item) => {
            return item.id === +fatherEl.dataset.id;
        });

        if (resActivity.currentParticipants === resActivity.maxParticipants) {
            addAtributeDisabled(addBtnEL[fatherEl.dataset.id - 1]);
            removeBtnEl[fatherEl.dataset.id - 1].removeAttribute("disabled");
            registration[fatherEl.dataset.id - 1].value = 1;
        } else {
            resActivity.currentParticipants += 1;
            currentParticipants[fatherEl.dataset.id - 1].textContent =
                resActivity.currentParticipants;

            addAtributeDisabled(addBtnEL[fatherEl.dataset.id - 1]);
            removeBtnEl[fatherEl.dataset.id - 1].removeAttribute("disabled");
            registration[fatherEl.dataset.id - 1].value = 1;

            saveData(activities, localStorageKey);
            saveData(registration, localStorageKeyRegistration);
        }
    } else if (target.matches(".removeBtn")) {
        const fatherEl = target.closest(".activity");

        const resActivity = activities.find((item) => {
            return item.id === +fatherEl.dataset.id;
        });

        resActivity.currentParticipants -= 1;

        currentParticipants[fatherEl.dataset.id - 1].textContent =
            resActivity.currentParticipants;

        addAtributeDisabled(removeBtnEl[fatherEl.dataset.id - 1]);
        addBtnEL[fatherEl.dataset.id - 1].removeAttribute("disabled");
        registration[fatherEl.dataset.id - 1].value = 0;

        saveData(activities, localStorageKey);
        saveData(registration, localStorageKeyRegistration);
    }
});

// Функции

function writeLocalStorage(key, value) {
    if (!localStorage.getItem(key)) {
        localStorage.setItem(key, value);
    }
}

function takeLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function addAtributeDisabled(button) {
    button.setAttribute("disabled", true);
}

function saveData(array, key) {
    localStorage.setItem(key, JSON.stringify(array));
}
