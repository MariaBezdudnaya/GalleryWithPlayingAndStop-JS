const API_ENDPOINT = "https://api.unsplash.com/photos/random";
const API_KEY = "HA-9GyK10COOVoonWL1lVNNy3hPUu_hbXALbo9HLdBs"; // API ключ

let data = [];
let timerId;
let time = 100;
let selectedIndex = 0;
let loadingCount = 4; //количество загруженных изображений

// Функция, отвечающая за обновление таймера:
function updateTimer() {
  time -= 0.2;
  if (time <= 0) {
    selectImage(selectedIndex + 1);
    time = 100;
  }
  document.querySelector(".bar").style.width = time + "%";
  startTimer();
}

// Функция, которая меняет активность таймера:
function toggleTimer(event) {
  if (event.target.textContent === "STOP") {
    event.target.textContent = "PLAY";
    stopTimer();
  } else {
    event.target.textContent = "STOP";
    startTimer();
  }
}

// Функция, которая останавливает таймер:
function stopTimer() {
  time = 100;
  document.querySelector(".bar").style.width = time + "%";
  clearTimeout(timerId);
}

// Функция, которая запускает таймер:
function startTimer() {
  timerId = setTimeout(updateTimer, 10);
}

// Функция для получения случайных изображений с Unsplash
async function getImages() {
  const images = [];
  for (let i = 0; i < 4; i++) {
    try {
      const response = await fetch(`${API_ENDPOINT}?client_id=${API_KEY}&w=300&h=200`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      images.push({
        download_url: json.urls.regular,
        author: json.user.name || "Unknown",
      });
    } catch (error) {
      console.error("Error fetching from Unsplash:", error);
      // Handle the error appropriately, maybe use a fallback image
      images.push({
        download_url: "https://via.placeholder.com/300x200?text=Error",
        author: "Error",
      });
    }
  }
  return images;
}

// Функция, которая отвечает за выбор и отображение большого изображения
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

  // Remove the "selected" class from all thumbnail images
  const thumbImages = document.querySelectorAll(".thumb img");
  thumbImages.forEach((img) => img.classList.remove("selected"));

  // Add the "selected" class to the clicked thumbnail image
  thumbImages[index].classList.add("selected");
}

// Функция, отвечающая за загрузку новых изображений
function drawImages() {
  const images = document.querySelectorAll(".thumb img");
  data.forEach((item, i) => {
    images[i].src = item.download_url;
    images[i].classList.add("loading");
  });
  selectImage(0);
}

// Функция, отвечающая за данные новых загружаемых изображений
async function loadImages() {
  loadingCount = 4;
  stopTimer();
  try {
    data = await getImages();
    drawImages();
  } catch (error) {
    console.error("Error loading images:", error);
  }
}

// Функция, которая позволяет остановить таймер при нажатии на изображение из контейнера thumb
function onThumbClick(event) {
  if (event.target.tagName !== "IMG") return;
  stopTimer();
  document.querySelector(".play").textContent = "PLAY";
  selectImage(Array.from(document.querySelectorAll('.thumb img')).indexOf(event.target));
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