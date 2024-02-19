// Вашей задачей является создание веб-слайдера для отображения изображений на веб-странице.

// Создайте интерфейс веб-страницы, который включает в себя следующие элементы:
// a. Контейнер для отображения текущего изображения.
// b. Кнопки "Предыдущее изображение" и "Следующее изображение" для переключения между изображениями.
// c. Навигационные точки (индикаторы) для быстрого переключения между изображениями.

// Для создания элементов интерфейса используйте HTML.
// При клике на кнопку "Предыдущее изображение" должно отображаться предыдущее изображение.
// При клике на кнопку "Следующее изображение" должно отображаться следующее изображение.
// При клике на навигационные точки, слайдер должен переключаться к соответствующему изображению.

// Слайдер должен циклически переключаться между изображениями, то есть после последнего изображения должно отображаться первое, и наоборот.

// Добавьте стилизацию для слайдера и элементов интерфейса с использованием CSS для улучшения внешнего вида.

const initialData = [
    "./img/slide1.jpg",
    "./img/slide2.jpg",
    "./img/slide3.jpg",
];

if (initialData.length === 0) {
    document.body.textContent = "Не загрузились фото с сервера";
} else {
    const sliderBoxEl = document.querySelector(".slider");
    const sliderDotsEl = document.querySelector(".dots");
    let slideIndex = 1;

    initialData.forEach((slide) => {
        sliderBoxEl.insertAdjacentHTML(
            "beforeend",
            `<div class="slides">
        <a class="slider__button left-btn">&#10094</a>
        <a class="slider__button right-btn">&#10095</a>
        <img src=${slide} style="width:100%" alt="">
        </div>`
        );

        sliderDotsEl.insertAdjacentHTML(
            "beforeend",
            `<span class="dot" id="${slideIndex++}"></span>`
        );
    });

    const slides = document.querySelectorAll(".slides");
    const dots = document.querySelectorAll(".dot");

    slideIndex = 1;
    slides[slideIndex - 1].classList.add("view");
    dots[slideIndex - 1].classList.add("active");

    sliderBoxEl.addEventListener("click", function ({ target }) {
        if (target.matches(".right-btn")) {
            slideIndex = changeSlide(++slideIndex);
        }

        if (target.matches(".left-btn")) {
            slideIndex = changeSlide(--slideIndex);
        }
    });

    sliderDotsEl.addEventListener("click", function ({ target }) {
        if (target.matches(".dot")) {
            if (!target.classList.contains("active")) {
                for (let i = 0; i < dots.length; i++) {
                    slides[i].classList.remove("view");
                    dots[i].classList.remove("active");
                }
                slideIndex = target.id;
                slides[slideIndex - 1].classList.add("view");
                target.classList.add("active");
            }
        }
    });

    function changeSlide(numberSlide) {
        if (numberSlide > initialData.length) {
            numberSlide = 1;
        }

        if (numberSlide < 1) {
            numberSlide = slides.length;
        }

        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove("view");
            dots[i].classList.remove("active");
        }

        slides[numberSlide - 1].classList.add("view");
        dots[numberSlide - 1].classList.add("active");

        return numberSlide;
    }
}
