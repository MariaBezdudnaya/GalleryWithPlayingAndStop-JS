//Вводим переменные:
let data = []; //массив
let timerId;
let time = 100; //значение таймера 100 процентов
let selectedIndex = 0;
let isTimerRunning = false; // Флаг для контроля работы таймера
let loadedCount = 0;

//Функция, отвечающая за обновление таймера:
function updateTimer() {
  timerId = setTimeout(updateTimer, 10); // Устанавливаем следующий таймер через 30 мс
  time -= 0.3;
  if (time <= 0) {
    selectImage(selectedIndex + 1);
    time = 100; //и таймер сбрасывается и возвращается на 100 процентов
  }
  document.querySelector(".bar").style.width = time + "%"; //меняется ширина полосы в зависимости от времени
}

//Функция, которая меняет активность таймера:
function toggleTimer(event) {
  if (event.target.textContent === "STOP") {
    //если на кнопке stop происходит действие..
    event.target.textContent = "PLAY"; //то кнопка меняется на PLAY
    stopTimer(); //и таймер останавливается
  } else {
    event.target.textContent = "STOP"; //кнопка меняется на STOP
    startTimer(); //и таймер идёт
  }
}

//Функция, которая останавливает таймер:
function stopTimer() {
  time = 100; //таймер возобновляется
  document.querySelector(".bar").style.width = time + "%"; //и ширина индикатора тоже возобновляется
  clearTimeout(timerId); //отменяется таймаут, установленный вызовом setTimeout
  isTimerRunning = false; // Сбрасываем флаг, чтобы в будущем можно было запустить новый таймер
}

//Функция, которая запускает таймер:
function startTimer() {
  if (isTimerRunning) return; // Если таймер уже запущен, не запускаем новый
  isTimerRunning = true; // Устанавливаем флаг, что таймер запущен
  timerId = setTimeout(updateTimer, 10); //обновление через 0,01 секунду
}

//Функция, которая выбирает изображение в зависимости от индекса:
function selectImage(index) {
  selectedIndex = Number(index);
  if (selectedIndex === data.length) {
    loadImages();
  } else {
    const previewImg = document.querySelector(".preview img");
    const authorTitleDiv = document.querySelector(".authorTitle");
    const authorDiv = document.querySelector(".author");

    previewImg.src = data[selectedIndex].photo;
    authorDiv.textContent = data[selectedIndex].author;
    authorTitleDiv.textContent = "Author";

    const thumbImages = document.querySelectorAll(".thumb img");
    thumbImages.forEach((item, i) => {
      if (i === selectedIndex) {
        item.classList.add("selected"); // Если это выбранное изображение, добавляем класс "selected"
      } else {
        item.classList.remove("selected"); // Убираем класс "border" с других изображений
      }
    });
  }
}

function drawImages() {
  const images = document.querySelectorAll(".thumb img");

  images.forEach((img, i) => {
    img.src = data[i].photo;
    img.alt = data[i].author;
    img.classList.add("loading");

    const checkAllImagesLoaded = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        selectImage(0);
      }
    };

    img.onload = () => {
        img.classList.remove("loading");
        checkAllImagesLoaded();
    };

    img.onerror = () => {
      console.error(`Failed to load image at index ${i}`);
      checkAllImagesLoaded();
    };
  });
}

async function loadImages() {
  const initialTimerState = isTimerRunning;
  if (initialTimerState) {
    stopTimer();
  }

  try {
    const response = await fetch('mocks.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    loadedCount = 0;
    const json = await response.json();
    data = Array.from({ length: 4 }, () => json[Math.floor(Math.random() * json.length)]);
    drawImages();
    if (initialTimerState) {
      startTimer();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

//Функция, которая позволяет остановить таймер при нажатии на изображение из контейнера thumb:
function onThumbClick(event) {
  //когда событие нажатия происходит на изображении из данного контейнера,
  if (event.target.tagName !== "IMG") return; //прекращается выполнение всего цикла воспроизведения
  stopTimer(); //и таймер останавливается
  document.querySelector(".play").textContent = "PLAY"; //кнопка stop меняется на play
  selectImage(event.target.dataset.index); //можно смотреть другие изображения???
}

//Эта функция позволила нам вынести в html-файле ссылку на js-файл в header и вызвать все обработчики событий перед загрузкой всего DOM-дерева:
function init() {
  loadImages();
  document.querySelector(".thumb").addEventListener("click", onThumbClick);
  document.querySelector(".new").addEventListener("click", loadImages); //загружает новые изображения при нажатии на кнопку NEW
  document.querySelector(".play").addEventListener("click", toggleTimer);
}

window.addEventListener("DOMContentLoaded", init);
