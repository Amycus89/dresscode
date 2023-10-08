const temperatureElement = document.getElementById("temperature");
const feelsLikeElement = document.getElementById("feelsLike");
const tempMinElement = document.getElementById("temp_min");
const tempMaxElement = document.getElementById("temp_max");

const sunriseElement = document.getElementById("sunrise");
const sunsetElement = document.getElementById("sunset");
const weatherIconElement = document.getElementById("weatherIcon");

const input = document.getElementById("input");
const form = document.getElementById("search-form");
const historyContainer = document.querySelector(".history ul");

const updateWeatherInfo = function (data) {
  document.getElementById("city-name").innerHTML = data.name;
  document.getElementById("description").innerHTML =
    data.weather[0].description;
  temperatureElement.innerHTML = data.main.temp;
  feelsLikeElement.innerHTML = data.main.feels_like;
  tempMinElement.innerHTML = data.main.temp_min;
  tempMaxElement.innerHTML = data.main.temp_max;
  document.getElementById("humidity").innerHTML = data.main.humidity;
  document.getElementById("visibility").innerHTML = data.visibility;
  document.getElementById("wind").innerHTML = data.wind.speed;
  document.getElementById("pressure").innerHTML = data.main.pressure;
  console.log(data.sys.sunrise);
  console.log(data.sys.sunset);
};

// Function to get the time and date
const updateClock = function (timeZone) {
  // Clear any previous instance of updateClock() running
  clearInterval(intervalId);
  // Update the clock every second
  intervalId = setInterval(() => {
    let userTime = new Date(); // Get user's local time
    let gmtOffset = userTime.getTimezoneOffset() * 60; // Get the user's GMT offset in seconds
    let defaultTime = new Date(userTime.getTime() + gmtOffset * 1000);
    let defaultDate = new Date(defaultTime);
    let localTime = new Date(defaultDate.getTime() + timeZone * 1000);
    let hours = String(localTime.getHours()).padStart(2, "0");
    let minutes = String(localTime.getMinutes()).padStart(2, "0");
    let seconds = String(localTime.getSeconds()).padStart(2, "0");
    let timestring = hours + ":" + minutes + ":" + seconds;
    document.getElementById("clock").innerHTML = timestring;
    return localTime;
  }, 1000);
};

// Function to determine day or night
const updateWeatherIcon = function (id, currentTime, sunrise, sunset) {
  console.log(id);
  // Convert current time to Unix timestamp format
  currentTime = Math.floor(Date.now() / 1000);
  let sunMoon = "";
  if (currentTime > sunrise && currentTime < sunset) {
    sunMoon = "sun";
    console.log(currentTime);
  } else {
    sunMoon = "moon";
  }

  switch (sunMoon) {
    case "sun":
      switch (true) {
        case id > 199 && id < 203:
          weatherIconElement.src =
            "/static/weatherIcons/thunderstorms-day-rain.svg";
          weatherIconElement.alt = "Day with thunderstorm and rain";
          break;
        case id > 299 && id < 322:
          weatherIconElement.src = "/static/weatherIcons/thunderstorms-day.svg";
          weatherIconElement.alt = "Day with thunderstorm";
          break;
        case id > 229 && id < 233:
          weatherIconElement.src =
            "/static/weatherIcons/thunderstorms-day-snow.svg";
          weatherIconElement.alt = "Day with thunderstorm and drizzle";
          break;
        case id > 299 && id < 322:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-day-drizzle.svg";
          weatherIconElement.alt = "Day with drizzle";
          break;
        case id > 499 && id < 532:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-day-rain.svg";
          weatherIconElement.alt = "Day with rain";
          break;
        case id > 599 && id < 603:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-day-snow.svg";
          weatherIconElement.alt = "Day with snow";
          break;
        case id > 610 && id < 614:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-day-sleet.svg";
          weatherIconElement.alt = "Day with sleet";
          break;
        case id > 614 && id < 623:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-day-sleet.svg";
          weatherIconElement.alt = "Day with rain and snow";
          break;
        case id > 700 && id < 703:
          weatherIconElement.src = "/static/weatherIcons/mist.svg";
          weatherIconElement.alt = "Day with mist";
          break;
        case id > 710 && id < 712:
          weatherIconElement.src = "/static/weatherIcons/smoke-particles.svg";
          weatherIconElement.alt = "Day with smoke particles";
          break;
        case id > 720 && id < 723:
          weatherIconElement.src = "/static/weatherIcons/haze-day.svg";
          weatherIconElement.alt = "Day with haze";
          break;
        case (id > 730 && id < 732) || id == 761:
          weatherIconElement.src = "/static/weatherIcons/dust-day.svg";
          weatherIconElement.alt = "Day with dust whirls";
          break;
        case id > 740 && id < 742:
          weatherIconElement.src = "/static/weatherIcons/fog-day.svg";
          weatherIconElement.alt = "Day with fog";
          break;
        case id == 751:
          weatherIconElement.src = "/static/weatherIcons/dust-day.svg";
          weatherIconElement.alt = "Day with sand storms";
          break;
        case id == 762:
          weatherIconElement.src = "/static/weatherIcons/ash.svg";
          weatherIconElement.alt = "Day with ash";
          break;
        case id == 771:
          weatherIconElement.src = "/static/weatherIcons/squall.svg";
          weatherIconElement.alt = "Day with squalls";
          break;
        case id == 781:
          weatherIconElement.src = "/static/weatherIcons/tornado.svg";
          weatherIconElement.alt = "Day with tornado";
          break;
        case id == 800:
          weatherIconElement.src = "/static/weatherIcons/clear-day.svg";
          weatherIconElement.alt = "Day with clear sky";
          break;
        default:
          weatherIconElement.src = "/static/weatherIcons/partly-cloudy-day.svg";
          weatherIconElement.alt = "Cloudy day";
          break;
      }
      break;
    case "moon":
      switch (true) {
        case id > 199 && id < 203:
          weatherIconElement.src =
            "/static/weatherIcons/thunderstorms-night-rain.svg";
          weatherIconElement.alt = "Night with thunderstorm and rain";
          break;
        case id > 299 && id < 322:
          weatherIconElement.src =
            "/static/weatherIcons/thunderstorms-night.svg";
          weatherIconElement.alt = "Night with thunderstorm";
          break;
        case id > 229 && id < 233:
          weatherIconElement.src =
            "/static/weatherIcons/thunderstorms-night-snow.svg";
          weatherIconElement.alt = "Night with thunderstorm and drizzle";
          break;
        case id > 299 && id < 322:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-night-drizzle.svg";
          weatherIconElement.alt = "Night with drizzle";
          break;
        case id > 499 && id < 532:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-night-rain.svg";
          weatherIconElement.alt = "Night with rain";
          break;
        case id > 599 && id < 603:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-night-snow.svg";
          weatherIconElement.alt = "Night with snow";
          break;
        case id > 610 && id < 614:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-night-sleet.svg";
          weatherIconElement.alt = "Night with sleet";
          break;
        case id > 614 && id < 623:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-night-sleet.svg";
          weatherIconElement.alt = "Night with rain and snow";
          break;
        case id > 700 && id < 703:
          weatherIconElement.src = "/static/weatherIcons/mist.svg";
          weatherIconElement.alt = "Night with mist";
          break;
        case id > 710 && id < 712:
          weatherIconElement.src = "/static/weatherIcons/smoke-particles.svg";
          weatherIconElement.alt = "Night with smoke particles";
          break;
        case id > 720 && id < 723:
          weatherIconElement.src = "/static/weatherIcons/haze-night.svg";
          weatherIconElement.alt = "Night with haze";
          break;
        case (id > 730 && id < 732) || id == 761:
          weatherIconElement.src = "/static/weatherIcons/dust-night.svg";
          weatherIconElement.alt = "Night with dust whirls";
          break;
        case id > 740 && id < 742:
          weatherIconElement.src = "/static/weatherIcons/fog-night.svg";
          weatherIconElement.alt = "Night with fog";
          break;
        case id == 751:
          weatherIconElement.src = "/static/weatherIcons/dust-night.svg";
          weatherIconElement.alt = "Night with sand storms";
          break;
        case id == 762:
          weatherIconElement.src = "/static/weatherIcons/ash.svg";
          weatherIconElement.alt = "Night with ash";
          break;
        case id == 771:
          weatherIconElement.src = "/static/weatherIcons/squall.svg";
          weatherIconElement.alt = "Night with squalls";
          break;
        case id == 781:
          weatherIconElement.src = "/static/weatherIcons/tornado.svg";
          weatherIconElement.alt = "Night with tornado";
          break;
        case id == 800:
          weatherIconElement.src = "/static/weatherIcons/starry-night.svg";
          weatherIconElement.alt = "Night with clear sky";
          break;
        default:
          weatherIconElement.src =
            "/static/weatherIcons/partly-cloudy-night.svg";
          weatherIconElement.alt = "Cloudy night";
          break;
      }
  }
};

// Function to load history shortcut buttons
const loadHistory = function (searchData) {
  // Loop through the searches array in data and create buttons
  searchData.forEach((search) => {
    const li = document.createElement("li");
    const form = document.createElement("form");
    const input = document.createElement("input");
    const button = document.createElement("button");

    form.action = "/shortcut";
    form.method = "POST";
    input.type = "hidden";
    input.name = "city_name";
    input.value = search;
    button.type = "submit";
    button.textContent = search;

    form.appendChild(li);
    li.appendChild(input);
    li.appendChild(button);
    historyContainer.appendChild(form);
  });

  // Activate generated buttons
  let buttons = document.querySelectorAll(".history button");
  buttons.forEach((button) => {
    button.addEventListener("click", function (buttonClick) {
      buttonClick.preventDefault();
      let cityNameValue = this.textContent;
      let requestBody = new URLSearchParams();

      requestBody.append("city_name", cityNameValue);
      fetch("/shortcut", {
        method: "POST",
        body: requestBody,
      })
        .then((response) => response.json())
        .then((data) => {
          updateWeatherInfo(data);
          currentTime = updateClock(data.timezone);
          let sunrise = data.sys.sunrise;
          let sunset = data.sys.sunset;
          updateWeatherIcon(data.weather[0].id, currentTime, sunrise, sunset);
        });
    });
  });
};

/////////////
////////////

// Code for button to get user's location by geolocation
document.getElementById("getLocation").addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      fetch("/locate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lon,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          updateWeatherInfo(data);
          currentTime = updateClock(data.timezone);
          let sunrise = data.sys.sunrise;
          let sunset = data.sys.sunset;
          updateWeatherIcon(data.weather[0].id, currentTime, sunrise, sunset);
        });
    });
  } else {
    input.innerHTML = "Geolocation is not supported by this browser.";
  }
});

// Main
// Run this code when the user first visits the site:
document.addEventListener("DOMContentLoaded", function () {
  // Setup time
  intervalId = null;
  let currentTime = updateClock(weatherInfo.timezone);
  let sunrise = weatherInfo.sys.sunrise;
  let sunset = weatherInfo.sys.sunset;
  updateWeatherIcon(weatherInfo.weather[0].id, currentTime, sunrise, sunset);

  // Setup history shortcut buttons
  loadHistory(searches);

  // placeholders
});

// Search city name by typing
// Add event listener to form's submit event
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  // Make AJAX request to Flask route
  fetch("/", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      input.value = "";
      // Check if respons has weather_info
      if (data.cod == "404") {
        // If so, display an error message
        input.placeholder = "City not found";
        input.classList.add("red");

        setTimeout(function () {
          input.placeholder = "Enter a location...";
          input.classList.remove("red");
        }, 2000);
      } else {
        // else, display the weather info
        updateWeatherInfo(data[0]);
        currentTime = updateClock(data[0].timezone);
        let sunrise = data[0].sys.sunrise;
        let sunset = data[0].sys.sunset;
        updateWeatherIcon(data[0].weather[0].id, currentTime, sunrise, sunset);

        // Clear existing buttons
        historyContainer.innerHTML = "";

        // Loop through the searches array in data and create buttons
        loadHistory(data[1]);
      }
    });
});
