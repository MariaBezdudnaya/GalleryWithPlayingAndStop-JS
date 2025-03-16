//Вводим переменные:
let data = []; //массив
let timerId;
let time = 100; //значение таймера 100 процентов
let selectedIndex = 0;
let loadingCount = 4; //количество загруженных изображений

//Функция, отвечающая за обновление таймера:
function updateTimer() {
  time -= 0.3;
  if (time <= 0) {
    selectImage(selectedIndex + 1);
    time = 100;
  }
  document.querySelector(".bar").style.width = time + "%";
  startTimer();
}

//Функция, которая меняет активность таймера:
function toggleTimer(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    stopTimer();
  } else {
    event.target.textContent = "STOP";
    startTimer();
  }
}

//Функция, которая останавливает таймер:
function stopTimer() {
  time = 100;
  document.querySelector(".bar").style.width = time + "%";
  clearTimeout(timerId);
}

//Функция, которая запускает таймер:
function startTimer() {
  timerId = setTimeout(updateTimer, 10);
}

// Функция, отвечающая за выбор изображения из массива:
function selectImage(index) {
    if (index >= data.length) {
        index = 0;
    }
    selectedIndex = index;
    const previewImg = document.querySelector(".preview img");
    const authorTitleDiv = document.querySelector(".authorTitle");
    const authorDiv = document.querySelector(".author");

    previewImg.src = data[index].download_url;
    authorDiv.textContent = data[index].author;
    authorTitleDiv.textContent = "Author";

    const thumbImages = document.querySelectorAll(".thumb img");
    thumbImages.forEach((img) => img.classList.remove("selected"));

    thumbImages[index].classList.add("selected");
}

//Функция, отвечающая за загрузку новых изображений и их отображение:
function drawImages() {
  const images = document.querySelectorAll(".thumb img");
  let loadedImagesCount = 0;

  images.forEach((img, i) => {
    img.src = data[i].download_url;
    img.alt = data[i].author;
    img.classList.add("loading");

    img.onload = () => {
      loadedImagesCount++;
      img.classList.remove("loading");
      if (loadedImagesCount === images.length) {
        selectImage(0); // Вызываем selectImage только после загрузки всех изображений
      }
    };
    img.onerror = () => {
      console.error(`Failed to load image at index ${i}`);
      loadedImagesCount++;
      if (loadedImagesCount === images.length) {
        selectImage(0); // Вызываем selectImage даже если некоторые изображения не загрузились
      }
    };
  });
}

// Функция, отвечающая за данные новых загружаемых изображений
async function loadImages() {
    loadingCount = 4;
    stopTimer();

    try {
        const response = await fetch('mock.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        data = json;
        drawImages();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Функция, которая позволяет остановить таймер при нажатии на изображение из контейнера thumb
function onThumbClick(event) {
    if (event.target.tagName !== "IMG") return;
    stopTimer();
    document.querySelector(".play").textContent = "PLAY";
    selectImage(event.target.dataset.index);
}

// Функция, которая обновляет изображения на странице
function removeLoading(event) {
    loadingCount -= 1;
    if (loadingCount === 0 && document.querySelector(".play").textContent === "STOP") {
        startTimer();
    }
    event.target.classList.remove("loading");
}

// Эта функция позволила нам вынести в html-файле ссылку на js-файл в header и вызвать все обработчики событий перед загрузкой всего DOM-дерева:
function init() {
    loadImages();
    document.querySelector(".thumb").addEventListener("click", onThumbClick);
    document.querySelector(".new").addEventListener("click", loadImages);

    const thumbImages = document.querySelectorAll(".thumb img");
    thumbImages.forEach(item => {
        item.onload = removeLoading;
    });
    document.querySelector(".play").addEventListener("click", toggleTimer);
}

window.addEventListener("DOMContentLoaded", init);