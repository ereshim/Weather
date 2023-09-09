import conditions from "./condition.js"; 
// api ключ
const apiKey = "a1f7241ab0fb41a3b1b81549232908";
//Подключение DOM 
const header = document.querySelector(".header");
const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

//удаление карточки
function remuveCard() {
  const remuveCard = document.querySelector(".card");
  if (remuveCard) remuveCard.remove();
}
//Создание карточки
function addCard({ name, country, temp, img, condition }) {
  const html = `<div class="card">
                    <h2 class="card-city">${name} <span>${country}</span></h2>

                        <div class="card-weather">
                        <div class="card-value">${temp}<sup>°c</sup></div>
                            <img class="card-img" src="./img/${img}.png" alt="Weather">
                        </div>

                            <div class="card-description">${condition}</div>
                </div>`;

  header.insertAdjacentHTML("afterend", html);
}
// При ошибке
function showError(error) {
  const html = `<div class="card"> ${error}</div>`;
  header.insertAdjacentHTML("afterend", html);
}
//Запрос на сервер
async function getWeather(city) {
  const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
  console.log(url);
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
//Добовление карточки 
form.onsubmit = async function (e) {
  e.preventDefault();
  let city = input.value.trim();
  let data = await getWeather(city);
  

  if (data.error) {
    remuveCard();
    showError(data.error.message);
  } else {
    remuveCard();

    const info = conditions.find((obj) => obj.code === data.current.condition.code);

    const condition = data.current.is_day ? info.languages[23]["day_text"] : info.languages[23]["night_text"];

    let img = data.current.is_day
      ? `./day/${info.icon}`
      : `./night/${info.icon}`;

    const weatherData = {
      name: data.location.name,
      country: data.location.country,
      temp: data.current.temp_c,
      img: img,
      condition: condition,
    };

    addCard(weatherData);
  }
};
