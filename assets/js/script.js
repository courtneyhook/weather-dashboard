var previousSearchEL = document.getElementById("previous-search");
var fiveDayEl = document.getElementById("five-day");
var currentCityEl = document.getElementById("current-city");
var tempEl = document.getElementById("temp");
var windEl = document.getElementById("wind");
var humidEl = document.getElementById("humid");
var descriptionEL = document.getElementById("description");
var searchedCityEl = document.getElementById("city-search");
var submitSearchEl = document.getElementById("submit-button");
var previousCityEL = document.querySelectorAll(".previous-btn");
var currentIconEl = document.getElementById("icon");
var currentCity = searchedCityEl.value;
var previousCitySearches = [];

var date = dayjs();
var currentDate = date.format("MM/DD/YYYY");
var currentTime = date.format("h:m:s A");

var lon, lat, state, temp, wind, humidity, description, icon, iconImg, iconVar;
var apiKey = "9f93286bb3109d48c225c107a2745543";

//this block gets a list of previously searched cities from local storage and displays them when the page is opened
var parsedCities = localStorage.getItem("cities");
if (parsedCities) {
  previousCitySearches = JSON.parse(parsedCities);
  for (i = 0; i < previousCitySearches.length; i++) {
    var cityName = document.createElement("button");
    cityName.setAttribute("id", previousCitySearches[i]);
    cityName.classList.add("previous-btn");
    cityName.textContent = previousCitySearches[i];
    previousSearchEL.append(cityName);
  }
}

//this function gets a city name from the user and finds the latitude and longitude
function getLocation(event, url = null, cityName = null) {
  if (event) {
    event.preventDefault();
  }
  currentCity = cityName ?? searchedCityEl.value;
  var urlGeo =
    url ??
    "//api.openweathermap.org/geo/1.0/direct?q=" +
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

//this function appends the city name to the top of a list and adds it to local storage
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
  if (parsedCities) {
    previousCitySearches = JSON.parse(parsedCities);
    for (i = 0; i < previousCitySearches.length; i++) {
      var cityName = document.createElement("button");
      var urlGeo =
        "api.openweathermap.org/geo/1.0/direct?q=" +
        previousCitySearches[i] +
        "&appid=" +
        apiKey;
      cityName.setAttribute("id", previousCitySearches[i]);
      cityName.setAttribute("data-url", urlGeo);
      cityName.classList.add("previous-btn");
      cityName.textContent = previousCitySearches[i];
      previousSearchEL.append(cityName);
    }
  }
}

//this function returns the current weather for a city
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

//this function updates the DOM for the current weather
function updateCurrentWeather(temp, wind, humidity) {
  tempEl.textContent = `Temp: ${temp}°F`;
  windEl.textContent = `Wind: ${wind} MPH`;
  humidEl.textContent = `Humidity: ${humidity}%`;
  currentIconEl.innerHTML = "";
  var pic = document.createElement("img");
  pic.setAttribute("src", `https://openweathermap.org/img/wn/${icon}@2x.png`);
  currentIconEl.append(pic);
  descriptionEL.textContent = description;
}

//this function finds and displays the future forecast for the next five days
function getFuture(lat, lon) {
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
      var today = dayjs();
      for (var i = 0; i < 5; i++) {
        var x = i + 1;
        var futureIcon = data.list[i].weather[0].icon;
        var futureIconSrc = document.createElement("img");
        futureIconSrc.setAttribute(
          "src",
          `https://openweathermap.org/img/wn/${futureIcon}@2x.png`
        );
        var tomorrow = today.add(x, "day");
        tomorrow = tomorrow.format("M/D/YYYY");
        document.getElementById(`day-${x}-icon`).innerHTML = "";
        document.getElementById(`day-${x}-icon`).append(futureIconSrc);
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

//when the user clicks on a previously searched city, it will become the current city
function searchCityAgain(event) {
  event.stopPropagation();
  if (event.target.matches("button")) {
    getLocation(null, event.target.dataset.url, event.target.id);
  }
}

submitSearchEl.addEventListener("click", getLocation);
previousSearchEL.addEventListener("click", searchCityAgain);
