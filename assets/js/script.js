//variables
var previousSearchEL = document.getElementById("previous-search");
var fiveDayEl = document.getElementById("five-day");
var currentCityEl = document.getElementById("current-city");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidEl = document.getElementById("humid");
var searchedCityEl = document.getElementById("city-search");
var submitSearchEl = document.getElementById("submit-button");
var currentCity = searchedCityEl.value;
var previousCitySearches = [];

var date = dayjs();
var currentDate = date.format("MM/DD/YYYY");
var currentTime = date.format("h:m:s A");

var lon, lat, state, temp, wind, humidity;
var apiKey = "9f93286bb3109d48c225c107a2745543";

//api

//logic
//when the user types a city and clicks submit, an event is triggered.
//what will happen if there are two or more places with the same name in different states
//what will happen if the city name is misspelled
//the city name is saved into local storage
//the city name and weather info is displayed
//the five day forcast is displayed

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
      temp = Math.round(data.main.temp);
      wind = data.wind.speed;
      humidity = data.main.humidity;
      getFuture(lat, lon);
      updateCurrentWeather(temp, wind, humidity);
    });
}

function updateCurrentWeather(temp, wind, humidity) {
  tempEl.textContent = `Temp: ${temp}°F`;
  windEl.textContent = `Wind: ${wind} MPH`;
  humidEl.textContent = `Humidity: ${humidity}%`;
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
      for (var i = 0; i < 5; i++) {
        var day = document.createElement("div");
        day.textContent = data.list[i].main.temp;
        fiveDayEl.append(day);
        console.log(data.list[i].main.temp);
      }
    });
}
//local storage
//event listener
submitSearchEl.addEventListener("click", getLocation);
