//variables
var previousSearchEL = document.getElementById("previous-search");
var fiveDayEl = document.getElementById("five-day");
var currentCityEl = document.getElementById("current-city");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidEl = document.getElementById("humid");
var descriptionEL = document.getElementById("description");
var searchedCityEl = document.getElementById("city-search");
var submitSearchEl = document.getElementById("submit-button");
var currentCity = searchedCityEl.value;
var previousCitySearches = [];

var date = dayjs();
var currentDate = date.format("MM/DD/YYYY");
var currentTime = date.format("h:m:s A");

var lon, lat, state, temp, wind, humidity, description, icon, iconImg, iconVar;
var apiKey = "9f93286bb3109d48c225c107a2745543";

var parsedCities = localStorage.getItem("cities");
console.log(parsedCities);
if (parsedCities) {
  previousCitySearches = JSON.parse(parsedCities);
  for (i = 0; i < previousCitySearches.length; i++) {
    var cityName = document.createElement("button");
    cityName.classList.add("previous-btn");
    cityName.textContent = previousCitySearches[i];
    previousSearchEL.append(cityName);
  }
}
//api

//what will happen if there are two or more places with the same name in different states
//what will happen if the city name is misspelled

function getLocation(event) {
  event.preventDefault();
  currentCity = searchedCityEl.value;
  var urlGeo =
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
    currentCity +
    "&appid=" +
    apiKey;
  fetch(urlGeo)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      lat = data[0].lat;
      lon = data[0].lon;
      state = data[0].state;
      getWeather(lat, lon, state);

      updateCurrentCity();
    });
}

function updateCurrentCity() {
  currentCityEl.textContent = `${currentCity} (${currentDate})`;
  searchedCityEl.value = "";
  if (previousCitySearches.includes(currentCity)) {
    var indexCity = previousCitySearches.indexOf(currentCity);
    previousCitySearches.splice(indexCity, 1);
  }
  previousCitySearches.unshift(currentCity);
  var stringifiedCity = JSON.stringify(previousCitySearches);
  localStorage.setItem("cities", stringifiedCity);
  previousSearchEL.textContent = "";
  var parsedCities = localStorage.getItem("cities");
  console.log(parsedCities);
  if (parsedCities) {
    previousCitySearches = JSON.parse(parsedCities);
    for (i = 0; i < previousCitySearches.length; i++) {
      var cityName = document.createElement("button");
      cityName.classList.add("previous-btn");
      cityName.textContent = previousCitySearches[i];
      previousSearchEL.append(cityName);
    }
  }
  // var cityName = document.createElement("button");
  // cityName.classList.add("previous-btn");
  // cityName.textContent = previousCitySearches[0];
  // previousSearchEL.prepend(cityName);
}

function getWeather(lat, lon, state) {
  var urlCurrentWeather =
    "https://api.openweathermap.org/data/2.5/weather?units=imperial&lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;
  fetch(urlCurrentWeather)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      icon = data.weather[0].icon;
      temp = Math.round(data.main.temp);
      wind = Math.round(data.wind.speed);
      humidity = data.main.humidity;
      description = data.weather[0].description;
      getFuture(lat, lon);
      updateCurrentWeather(temp, wind, humidity);
    });
}

function updateCurrentWeather(temp, wind, humidity) {
  tempEl.textContent = `Temp: ${temp}°F`;
  windEl.textContent = `Wind: ${wind} MPH`;
  humidEl.textContent = `Humidity: ${humidity}%`;
  iconImg = document.createElement("img");
  iconImg.src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
}

function getFuture(lat, lon) {
  console.log("future");
  var urlFutureForecast =
    "https://api.openweathermap.org/data/2.5/forecast?units=imperial&cnt=5&lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    apiKey;
  fetch(urlFutureForecast)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var today = dayjs();
      for (var i = 0; i < 5; i++) {
        var x = i + 1;
        var tomorrow = today.add(x, "day");
        tomorrow = tomorrow.format("M/D/YYYY");
        document.getElementById(`day-${x}-date`).textContent = tomorrow;
        document.getElementById(
          `day-${x}-temp`
        ).textContent = `Temp: ${Math.round(data.list[i].main.temp)}°F`;
        document.getElementById(
          `day-${x}-wind`
        ).textContent = `Wind: ${Math.round(data.list[i].wind.speed)}MPH`;
        document.getElementById(
          `day-${x}-humidity`
        ).textContent = `Humidity: ${data.list[i].main.humidity}%`;
        document.getElementById(`day-${x}-description`).textContent =
          data.list[i].weather[0].description;
      }
    });
}
//local storage
//event listener
submitSearchEl.addEventListener("click", getLocation);
