//Вводим переменные:
let data = []; //массив
let timerId;
let time = 100; //значение таймера 100 процентов
let selectedIndex = 0;
let loadingCount = 5; //количество загруженных изображений

//Функция, отвечающая за обновление таймера:
function updateTimer() {
  time -= 0.3; //уменьшаем значение таймера на 0.3 процента (скорость загрузки изображений)
  if (time <= 0) {
    //когда время таймера заканчивается, выбирается следующее изображение,
    selectImage(selectedIndex + 1);
    time = 100; //и таймер сбрасывается и возвращается на 100 процентов
  }
  document.querySelector(".bar").style.width = time + "%"; //меняется ширина полосы в зависимости от времени
  startTimer(); //вызывается функция startTimer у следующего изображения
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
}

//Функция, которая запускает таймер:
function startTimer() {
  timerId = setTimeout(updateTimer, 10); //обновление через 0,01 секунду
}

//Функция, которая выбирает изображение в зависимости от индекса:
function selectImage(index) {
  selectedIndex = Number(index); //selectedIndex присваиваем значение, равное любому индексу из массива??
  if (selectedIndex === data.length) {
    //если выбрано первое изображение (с индексом 0),
    loadImages(); //то загружается следующее
  }
  document.querySelectorAll(".thumb div").forEach((item, i) => {
    //выбираем контейнер с изображениями
    if (i === selectedIndex) {
      //если какой-либо из изображений выбрано, то присваиваем ему класс selected
      item.classList.add("selected");
    } else {
      //если нет, то убираем его
      item.classList.remove("selected");
    }
  });
  document.querySelector(".preview img").src = data[selectedIndex].download_url; //большому изображению (превью) присваиваем адрес выбранного изображения
  document.querySelector(".preview img").classList.add("loading"); //и также его класс
  document.querySelector(".preview .author").textContent =
    data[selectedIndex].author; //и контент тот, который у выбранного изображения с внешнего ресурса под свойством author
}

//Функция, которая отвечает за загрузку новых изображений, внешний вид их во время загрузки:
function drawImages() {
  const images = document.querySelectorAll(".thumb img"); //выбираем все изображения и для каждого из них...
  data.forEach((item, i) => {
    images[i].src = item.download_url; //меняем url
    images[i].classList.add("loading"); //и добавляем класс loading, чтобы применить стиль во время загрузки
  });
  selectImage(0); //и автоматом всегда выбирается изображение с индексом 0, то есть самое первое
}

//Функция, отвечающая за данные новых загружаемых изображений:
function loadImages() {
  loadingCount = 5; //количество загружаемых изображений, 5 штук
  stopTimer(); //потом таймер останавливается
  const page = Math.floor(Math.random() * (800 / 4)); //случайная страница с ресурса LoremIpsum
  const url = "https://picsum.photos/v2/list?page=" + page + "&limit=4"; //с лимитом в 4 изображения
  fetch(url) //отправляем и получаем сетевой запрос
    .then((res) => res.json()) //получаем результаты (данные) из внешнего файла json
    .then((json) => {
      data = json; //задаём переменную data, которой присваиваем данные объектов из внешнего файла
      drawImages(); //и с этими данными загружаем новые изображения
    });
}

//Функция, которая позволяет остановить таймер при нажатии на изображение из контейнера thumb:
function onThumbClick(event) {
  //когда событие нажатия происходит на изображении из данного контейнера,
  if (event.target.tagName !== "IMG") return; //прекращается выполнение всего цикла воспроизведения
  stopTimer(); //и таймер останавливается
  document.querySelector(".play").textContent = "PLAY"; //кнопка stop меняется на play
  selectImage(event.target.dataset.index); //можно смотреть другие изображения???
}

//Функция, которая обновляет изображения на странице:
function removeLoading(event) {
  loadingCount -= 1; //количество загружаемых изображений уменьшается,
  if (
    //и когда становится равно нулю, а также кнопка play меняется на stop,
    loadingCount === 0 &&
    document.querySelector(".play").textContent === "STOP"
  ) {
    startTimer(); //срабатывает функция возобновления таймера и загружаются следующие изображения???
  }
  event.target.classList.remove("loading"); //и удаляется стиль loading у элемента
}

//Эта функция позволила нам вынести в html-файле ссылку на js-файл в header и вызвать все обработчики событий перед загрузкой всего DOM-дерева:
function init() {
  loadImages();
  document.querySelector(".thumb").addEventListener("click", onThumbClick);
  document.querySelector(".new").addEventListener("click", loadImages); //загружает новые изображения при нажатии на кнопку NEW
  document.querySelectorAll("img").forEach((item) => {
    item.onload = removeLoading;
  });
  document.querySelector(".play").addEventListener("click", toggleTimer);
}
window.addEventListener("DOMContentLoaded", init);
