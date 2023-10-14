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

const unitsElement = document.getElementById("units");

// Get the parent element to append the clothing elements
const fashionForecast = document.getElementById("fashion-forecast");

// TODO: Fix bug in calculating percentage left of the day
const dayLightLeft = function (currentTime, sunrise, sunset) {
  let timeStamp = new Date(currentTime).getTime() / 1000;
  let timeDifference = sunset - sunrise;
  // Calc percentage of day that has already passed
  let percentage = (timeStamp - sunrise) / timeDifference;

  console.log(percentage);

  $(".progress").each(function () {
    let $bar = $(this).find(".bar");
    let $val = $(this).find("span");
    let perc = parseInt(percentage * 100, 10);

    $({ p: 0 }).animate(
      { p: perc },
      {
        duration: 3000,
        easing: "swing",
        step: function (p) {
          $bar.css({
            transform: "rotate(" + (45 + p * 1.8) + "deg)", // 100%=180° so: ° = % * 1.8
            // 45 is to add the needed rotation to have the green borders at the bottom
          });
          $val.text(p | 0);
        },
      }
    );
  });
};

//Function for fashion selection
const updateWardrobe = function (data) {
  // Get the parent element to append the clothing elements
  const fashionForecast = document.getElementById("fashion-forecast");

  while (fashionForecast.firstChild) {
    fashionForecast.removeChild(fashionForecast.firstChild);
  }

  // Loop through the first 4 feels_like values and calculate the average (4*3=12h)
  let feelsLike = 0;
  for (let i = 0; i < 4; i++) {
    feelsLike += data.list[i].main.feels_like;
  }

  feelsLike /= 4;

  // Check for rain chance.
  let rainLikely = false;
  for (let i = 0; i < 4; i++) {
    let pop = 0;
    pop = data.list[i].pop;
    if (pop > 0.2) {
      rainLikely = true;
      break;
    }
  }

  let rainWardrobe = [];

  let rainAmount = "";

  if (rainLikely) {
    // Check if any windspeed for next 12 h is greater than 6.7 m/s
    let canUseUmbrella = false;

    for (let i = 0; i < 4; i++) {
      let windSpeed = 0;
      windSpeed = data.list[i].wind.speed;
      if (windSpeed < 6.7) {
        canUseUmbrella = true;
        break;
      }
    }
    // Check if any rain 3h is greater than 9mm
    let canUseBoots = false;

    for (let i = 0; i < 4; i++) {
      // ? means that if data.list[] doesn't exist at all, leave it as undefined
      if (data.list[i].rain?.["3h"] !== undefined) {
        if (data.list[i].rain["3h"] > 9) {
          canUseBoots = true;
          break;
        }
      }
    }

    // Loop through all weather ids, and append them to an array
    rainOfDay = [];

    for (let i = 0; i < 4; i++) {
      let id = data.list[i].weather[0].id;
      switch (id) {
        case 201:
        case 501:
        case 520:
        case 522:
          // Append the word 'medium' to the array
          rainOfDay.push("medium");
          break;
        case 202:
        case 502:
        case 503:
        case 511:
        case 521:
        case 531:
          rainOfDay.push("heavy");
          break;
        default:
          rainOfDay.push("light");
          break;
      }

      // Check if the array contains the word "heavy"
      if (rainOfDay.includes("heavy")) {
        rainAmount = "heavy";
      } else if (rainOfDay.includes("medium")) {
        rainAmount = "medium";
      } else {
        rainAmount = "light";
      }
    }

    if (rainAmount == "heavy") {
      rainWardrobe.push("rain-coat.mp4");
      rainWardrobe.push("puddle.mp4");
    } else if (rainAmount == "medium") {
      if (canUseUmbrella) {
        rainWardrobe.push("umbrella.mp4");
      } else {
        rainWardrobe.push("rain-coat.mp4");
      }
      if (canUseBoots) {
        rainWardrobe.push("puddle.mp4");
      }
    } else {
      rainWardrobe.push("umbrella.mp4");
    }
  }

  let wardrobe = [];
  switch (true) {
    case feelsLike < 261:
      wardrobe = wardrobeOne;
      break;
    case feelsLike < 272:
      wardrobe = wardrobeTwo;
      break;
    case feelsLike < 278:
      wardrobe = wardrobeThree;
      break;
    case feelsLike < 284:
      wardrobe = wardrobeFour;
      wardrobe = rainWardrobe.concat(wardrobe);
      break;
    case feelsLike < 289:
      wardrobe = wardrobeFive;
      wardrobe = rainWardrobe.concat(wardrobe);
      break;
    default:
      wardrobe = wardrobeSix;
      wardrobe = rainWardrobe.concat(wardrobe);
      break;
  }

  // Loop through wardrobe of videos and append them to the div
  for (let i = 0; i < wardrobe.length; i++) {
    // Create a new <div class="fashion"> element
    const fashionDivElement = document.createElement("div");
    fashionDivElement.classList.add("fashion");

    // Create video element and set attributes
    const videoElement = document.createElement("video");
    videoElement.disablePictureInPicture = true;
    videoElement.src = `/static/clothingIcons/${wardrobe[i]}`;
    // Set event listener to the fashion div
    fashionDivElement.addEventListener("mouseenter", function () {
      videoElement.currentTime = 0;
      videoElement.muted = true;
      videoElement.play();
    });

    // Append the video element
    fashionDivElement.appendChild(videoElement);

    // Create fashion-info div
    const fashionInfoDivElement = document.createElement("div");
    fashionInfoDivElement.classList.add("fashion-info");

    // Create h4 and p element
    const h4Element = document.createElement("h4");
    h4Element.textContent = wardrobe[i];

    const pElement = document.createElement("p");
    pElement.textContent = wardrobe[i];
    // Append h4 and p element
    fashionInfoDivElement.appendChild(h4Element);
    fashionInfoDivElement.appendChild(pElement);

    fashionDivElement.appendChild(fashionInfoDivElement);
    fashionForecast.appendChild(fashionDivElement);
  }
};

// On click, units should update all values to fahrenheit or celcius using unitConverter():
unitsElement.addEventListener("click", function () {
  if (temperatureUnit === "c") {
    temperatureUnit = "f";
  } else {
    temperatureUnit = "c";
  }
  // Update content inside temperatureElement, feelsLikeElement, tempMiniElement and tempMaxElement:
  temperatureElement.innerHTML =
    unitConvert(weatherInfo.list[0].main.temp).toFixed(1) +
    "&deg;" +
    temperatureUnit.toUpperCase();
  feelsLikeElement.innerHTML =
    unitConvert(weatherInfo.list[0].main.feels_like).toFixed(1) +
    "&deg;" +
    temperatureUnit.toUpperCase();
  tempMinElement.innerHTML =
    unitConvert(weatherInfo.list[0].main.temp_min).toFixed(1) +
    "&deg;" +
    temperatureUnit.toUpperCase();
  tempMaxElement.innerHTML =
    unitConvert(weatherInfo.list[0].main.temp_max).toFixed(1) +
    "&deg;" +
    temperatureUnit.toUpperCase();
});

// Function to calculate celcius or fahrenheit from kelvin
const unitConvert = function (kelvin) {
  if (temperatureUnit === "c") {
    return kelvin - 273;
  } else {
    return ((kelvin - 273) * 9) / 5 + 32;
  }
};

const updateWeatherInfo = function (data) {
  document.getElementById("city-name").innerHTML = data.city.name;
  document.getElementById("description").innerHTML =
    data.list[0].weather[0].description;
  temperatureElement.innerHTML =
    unitConvert(data.list[0].main.temp).toFixed(1) +
    "&deg;" +
    temperatureUnit.toUpperCase();
  feelsLikeElement.innerHTML =
    unitConvert(data.list[0].main.feels_like).toFixed(1) +
    "&deg;" +
    temperatureUnit.toUpperCase();
  tempMinElement.innerHTML =
    unitConvert(data.list[0].main.temp_min).toFixed(1) +
    "&deg;" +
    temperatureUnit.toUpperCase();
  tempMaxElement.innerHTML =
    unitConvert(data.list[0].main.temp_max).toFixed(1) +
    "&deg;" +
    temperatureUnit.toUpperCase();
  document.getElementById("humidity").innerHTML = data.list[0].main.humidity;
  document.getElementById("wind").innerHTML = data.list[0].wind.speed;
  document.getElementById("sunrise").innerHTML = localTimestamp(
    data.city.sunrise,
    data.city.timezone
  );
  document.getElementById("sunset").innerHTML = localTimestamp(
    data.city.sunset,
    data.city.timezone
  );
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
    currentTime = localTime;
  }, 1000);
};

const localTimestamp = function (timestamp, timeZone) {
  let userTime = new Date(timestamp * 1000); // Get user's local time
  let gmtOffset = userTime.getTimezoneOffset() * 60; // Get the user's GMT offset in seconds
  let defaultTime = new Date(userTime.getTime() + gmtOffset * 1000);
  let defaultDate = new Date(defaultTime);

  let localTime = new Date(defaultDate.getTime() + timeZone * 1000);
  let hours = String(localTime.getHours()).padStart(2, "0");
  let minutes = String(localTime.getMinutes()).padStart(2, "0");
  let timestring = hours + ":" + minutes;
  return timestring;
};

// Function to determine day or night
const updateWeatherIcon = function (id, currentTime, sunrise, sunset) {
  // Convert current time to Unix timestamp format
  currentTime = Math.floor(Date.now() / 1000);
  let sunMoon = "";
  if (currentTime > sunrise && currentTime < sunset) {
    sunMoon = "sun";
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
          updateClock(data.city.timezone);
          dayLightLeft(currentTime, data.city.sunrise, data.city.sunset);
          updateWeatherIcon(
            data.list[0].weather[0].id,
            currentTime,
            data.city.sunrise,
            data.city.sunset
          );
          weatherInfo = data;
          updateWardrobe(weatherInfo);
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
          updateClock(data.city.timezone);
          dayLightLeft(currentTime, data.city.sunrise, data.city.sunset);
          updateWeatherIcon(
            data.list[0].weather[0].id,
            currentTime,
            data.city.sunrise,
            data.city.sunset
          );
          weatherInfo = data;
          updateWardrobe(weatherInfo);
        });
    });
  } else {
    input.innerHTML = "Geolocation is not supported by this browser.";
  }
});

// Main
// Run this code when the user first visits the site:
document.addEventListener("DOMContentLoaded", function () {
  // Setup initial temperature unit
  temperatureUnit = "c";

  // Setup time
  intervalId = null;
  let currentTime = updateClock(weatherInfo.city.timezone);
  let sunrise = weatherInfo.city.sunrise;
  let sunset = weatherInfo.city.sunset;
  dayLightLeft(currentTime, sunrise, sunset);
  updateWeatherIcon(
    weatherInfo.list[0].weather[0].id,
    currentTime,
    sunrise,
    sunset
  );

  // Setup history shortcut buttons
  loadHistory(searches);

  updateWeatherInfo(weatherInfo);

  //TODO: Update algorithm to find average of feels_like, instead of just the current one
  updateWardrobe(weatherInfo);
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
        updateClock(data[0].city.timezone);

        dayLightLeft(currentTime, data[0].city.sunrise, data[0].city.sunset);
        updateWeatherIcon(
          data[0].list[0].weather[0].id,
          currentTime,
          data[0].city.sunrise,
          data[0].city.sunset
        );
        weatherInfo = data[0];
        updateWardrobe(weatherInfo);

        // Clear existing buttons
        historyContainer.innerHTML = "";

        // Loop through the searches array in data and create buttons
        loadHistory(data[1]);
      }
    });
});

// Make wardrobes for the weather
const wardrobeOne = [
  "beanie.mp4",
  "hazmat.mp4",
  "base-clothing.mp4",
  "turtleneck.mp4",
  "cardigan.mp4",
  "pants.mp4",
  "jacket.mp4",
  "protective-wear.mp4",
  "mittens.mp4",
  "sneaker.mp4",
];

const wardrobeTwo = [
  "beanie.mp4",
  "base-clothing.mp4",
  "turtleneck.mp4",
  "pants.mp4",
  "protective-wear.mp4",
  "scarf.mp4",
  "mittens.mp4",
  "sneaker.mp4",
];

const wardrobeThree = [
  "beanie.mp4",
  "t-shirt.mp4",
  "turtleneck.mp4",
  "pants.mp4",
  "cardigan.mp4",
  "trench-coat.mp4",
  "glove.mp4",
  "shoes.mp4",
];

const wardrobeFour = [
  "cap.mp4",
  "long-sleeves.mp4",
  "cardigan.mp4",
  "pants.mp4",
  "shoes.mp4",
];

const wardrobeFive = ["cap.mp4", "t-shirt.mp4", "pants.mp4", "shoes.mp4"];

const wardrobeSix = [
  "sunhat.mp4",
  "t-shirt.mp4",
  "short.mp4",
  "flip-flops.mp4",
];
