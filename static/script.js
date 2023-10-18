// TODO: Show rain chance
// TODO: Change rain logic to give umbrella if surprise rain
// TODO: Adjust CSS for date elements
// TODO: Restyle overall CSS sections
// TODO: Make progress bar change when sun goes down, using suncalc logic.

const temperatureElement = document.getElementById("temperature");
const feelsLikeElement = document.getElementById("feelsLike");
const tempMinElement = document.getElementById("temp_min");
const tempMaxElement = document.getElementById("temp_max");
const cityNameElement = document.getElementById("city-name");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const rainElement = document.getElementById("rain");
const sunriseElement = document.getElementById("sunrise");
const sunsetElement = document.getElementById("sunset");
const countryElement = document.getElementById("country");
const weekdayElement = document.getElementById("weekday");
const dateElement = document.getElementById("date");

const weatherIconElement = document.getElementById("weatherIcon");

const input = document.getElementById("input");
const form = document.getElementById("search-form");
const historyContainer = document.querySelector(".history ul");

const progressElement = document.querySelector(".progress");
const trackElement = document.querySelector(".track");
const goodNightElement = document.querySelector(".gnight");

const unitsElement = document.getElementById("units");

// Get the parent element to append the clothing elements
const fashionForecast = document.getElementById("fashion-forecast");

// Initialize counter variable to keep track of how many hours are left of the day, to use with the countHours() function
let counter;
// Initialize global variable for rain chance
let rainChance = 0;

const maxRainChance = function (list) {
  // WIP Check for rain chance.
  let topPop = 0;
  for (let i = 0; i < counter; i++) {
    let pop = 0;
    pop = list[i].pop;
    if (topPop < pop) {
      topPop = pop;
    }
  }
  // Save the highest recorded pop as percentage value
  rainChance = topPop * 100;
  rainElement.innerHTML = rainChance + "%";
};

const capitalizeFirstLetter = function (string) {
  return string[0].toUpperCase() + string.slice(1);
};

const dayLightLeft = function (sunrise, sunset, timeZone) {
  let localSunRise = localTimestamp(sunrise, timeZone);
  let localSunSet = localTimestamp(sunset, timeZone);
  // Find current local time
  let userTime = new Date(); // Get user's local time
  let gmtOffset = userTime.getTimezoneOffset() * 60; // Get the user's GMT offset in seconds
  let defaultTime = new Date(userTime.getTime() + gmtOffset * 1000);
  let defaultDate = new Date(defaultTime);
  let localTime = defaultDate.getTime() + timeZone * 1000;
  // Calculate percentage
  let totalDuration = localSunSet - localSunRise;
  let elapsedTime = localTime - localSunRise;
  // Calc percentage of day that has already passed
  let percentage = elapsedTime / totalDuration;
  // Set default color of trackElement to #f59e0b for daylight hours and hide gnight element
  trackElement.style.stroke = "#f59e0b";
  goodNightElement.style.display = "none";

  let oldValue = 0;
  if (percentage > oldValue) {
    oldValue = percentage;
  } else {
    percentage = oldValue;
  }

  if (percentage > 1) {
    percentage = 1;
    // Day is over, change color of trackElement to #72b9d5 amd display the gnight element
    trackElement.style.stroke = "#72b9d5";
    goodNightElement.style.display = "block";
  }

  let radius = progressElement.r.baseVal.value;
  // Calc circumference
  let circumference = 2 * Math.PI * radius;
  progressElement.style.strokeDasharray = circumference;

  // inverse percentage
  percentage = 1 - percentage;

  let finalOffset = circumference - (percentage * circumference) / 2;
  let bar = 0;

  const animateProgress = () => {
    bar += finalOffset / 100;
    progressElement.style.strokeDashoffset = bar;

    if (bar <= finalOffset) {
      requestAnimationFrame(animateProgress);
    }
  };

  animateProgress();
};

//Function for fashion selection
const updateWardrobe = function (data) {
  // Get the parent element to append the clothing elements
  const fashionForecast = document.getElementById("fashion-forecast");

  while (fashionForecast.firstChild) {
    fashionForecast.removeChild(fashionForecast.firstChild);
  }

  // Loop through the first 4 feels_like values and calculate the average (4*3=12h)
  // Change 4 to the counter variable, that is, the hours left before midnight. More accurate than simply stating 4 for all
  let feelsLike = 0;
  for (let i = 0; i < counter; i++) {
    feelsLike += data.list[i].main.feels_like;
  }

  feelsLike /= counter;

  let rainLikely = false;
  if (rainChance > 30) {
    rainLikely = true;
  }

  let rainWardrobe = [];

  let rainAmount = "";

  if (rainLikely) {
    // Check if any windspeed for next 12 h is greater than 6.7 m/s
    let canUseUmbrella = false;

    for (let i = 0; i < counter; i++) {
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
      rainWardrobe.push({
        name: "Rain-coat",
        mp4: "rain-coat.mp4",
        description: "When the umbrella isn't enough",
      });
      rainWardrobe.push({
        name: "Rubber boots",
        mp4: "puddle.mp4",
        description: "Ready to jump in some puddles?",
      });
    } else if (rainAmount == "medium") {
      if (canUseUmbrella) {
        rainWardrobe.push({
          name: "Umbrella",
          mp4: "umbrella.mp4",
          description: "Your trusty old umbrella",
        });
      } else {
        rainWardrobe.push({
          name: "Rain-coat",
          mp4: "rain-coat.mp4",
          description: "When the umbrella isn't enough",
        });
      }
      if (canUseBoots) {
        rainWardrobe.push({
          name: "Rubber boots",
          mp4: "puddle.mp4",
          description: "Ready to jump in some puddles?",
        });
      }
    } else {
      rainWardrobe.push({
        name: "Umbrella",
        mp4: "umbrella.mp4",
        description: "Your trusty old umbrella",
      });
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
    videoElement.src = `/static/clothingIcons/${wardrobe[i].mp4}`;
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
    h4Element.textContent = wardrobe[i].name;

    const pElement = document.createElement("p");
    pElement.textContent = wardrobe[i].description;
    // Append h4 and p element
    fashionInfoDivElement.appendChild(h4Element);
    fashionInfoDivElement.appendChild(pElement);

    fashionDivElement.appendChild(fashionInfoDivElement);
    fashionForecast.appendChild(fashionDivElement);
  }
};

// Function to count hours left until midnight... times 3, due to how the api call works.
// This is so that the numbers that the clothing choices are based on are based on when the user is likely to be active
const countHours = function (list) {
  // Set global variable "counter" to 0
  counter = 0;
  let previousHour = null;

  for (let i = 0; i < list.length; i++) {
    // Target only the part of the string which lists the hours
    let currentHour = parseInt(list[i].dt_txt.substring(11, 13));

    if (previousHour < currentHour) {
      counter++;
    } else {
      break; // Stop counting and break the loop to return the counter
    }
    previousHour = currentHour;
  }
  // Min value should be 1
  if (counter < 1) {
    counter = 1;
  }
  return counter;
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
  cityNameElement.innerHTML = data.city.name;

  descriptionElement.innerHTML = capitalizeFirstLetter(
    data.list[0].weather[0].description
  );

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

  humidityElement.innerHTML = data.list[0].main.humidity;

  windElement.innerHTML = data.list[0].wind.speed;

  sunriseElement.innerHTML = timeString(
    localTimestamp(data.city.sunrise, data.city.timezone)
  );
  sunsetElement.innerHTML = timeString(
    localTimestamp(data.city.sunset, data.city.timezone)
  );

  countryElement.innerHTML = data.city.country;
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
    let currentTime = defaultDate.getTime() + timeZone * 1000;
    let localTime = new Date(currentTime);
    let hours = String(localTime.getHours()).padStart(2, "0");
    let minutes = String(localTime.getMinutes()).padStart(2, "0");
    let seconds = String(localTime.getSeconds()).padStart(2, "0");
    let timestring = hours + ":" + minutes + ":" + seconds;
    document.getElementById("clock").innerHTML = timestring;

    updateDate(localTime);
  }, 1000);
};

// Function to get date info
const updateDate = function (date) {
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let weekday = weekdays[date.getDay()];
  let dayOfMonth = date.getDate();
  let year = date.getFullYear();

  weekdayElement.innerHTML = weekday;

  dateElement.innerHTML =
    months[date.getMonth()] + " " + dayOfMonth + "<br>" + year;
};

const localTimestamp = function (timestamp, timeZone) {
  let userTime = new Date(timestamp * 1000); // Get user's local time
  let gmtOffset = userTime.getTimezoneOffset() * 60; // Get the user's GMT offset in seconds
  let defaultTime = new Date(userTime.getTime() + gmtOffset * 1000);
  let defaultDate = new Date(defaultTime);

  let localTime = defaultDate.getTime() + timeZone * 1000;
  return localTime;
};

const timeString = function (timestamp) {
  let time = new Date(timestamp);
  let hours = String(time.getHours()).padStart(2, "0");
  let minutes = String(time.getMinutes()).padStart(2, "0");
  let timestring = hours + ":" + minutes;
  return timestring;
};

// Function to determine day or night
const updateWeatherIcon = function (id, timeZone, sunrise, sunset) {
  // Find current local time
  let userTime = new Date(); // Get user's local time
  let gmtOffset = userTime.getTimezoneOffset() * 60; // Get the user's GMT offset in seconds
  let defaultTime = new Date(userTime.getTime() + gmtOffset * 1000);
  let defaultDate = new Date(defaultTime);
  let localTime = defaultDate.getTime() + timeZone * 1000;
  let localSunrise = localTimestamp(sunrise, timeZone);
  let localSunset = localTimestamp(sunset, timeZone);

  let sunMoon = "";

  if (localTime > localSunrise && localTime < localSunset) {
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
          // Update global variable "counter"
          counter = countHours(data.list);
          updateWeatherInfo(data);
          maxRainChance(data.list);
          updateClock(data.city.timezone);
          dayLightLeft(data.city.sunrise, data.city.sunset, data.city.timezone);
          updateWeatherIcon(
            data.list[0].weather[0].id,
            data.city.timezone,
            data.city.sunrise,
            data.city.sunset
          );
          updateWardrobe(data);
          weatherInfo = data;
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
          counter = countHours(data.list);
          updateWeatherInfo(data);
          maxRainChance(data.list);
          updateClock(data.city.timezone);
          dayLightLeft(data.city.sunrise, data.city.sunset, data.city.timezone);
          updateWeatherIcon(
            data.list[0].weather[0].id,
            data.city.timezone,
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
  counter = countHours(weatherInfo.list);
  updateClock(weatherInfo.city.timezone);
  dayLightLeft(
    weatherInfo.city.sunrise,
    weatherInfo.city.sunset,
    weatherInfo.city.timezone
  );
  updateWeatherIcon(
    weatherInfo.list[0].weather[0].id,
    weatherInfo.city.timezone,
    weatherInfo.city.sunrise,
    weatherInfo.city.sunset
  );

  maxRainChance(weatherInfo.list);

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
        counter = countHours(data[0].list);
        updateWeatherInfo(data[0]);
        maxRainChance(data[0].list);
        updateClock(data[0].city.timezone);

        dayLightLeft(
          data[0].city.sunrise,
          data[0].city.sunset,
          data[0].city.timezone
        );

        updateWeatherIcon(
          data[0].list[0].weather[0].id,
          data[0].city.timezone,
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
  { name: "Beanie", mp4: "beanie.mp4", description: "Keeps your ears warm" },
  {
    name: "Balaclava",
    mp4: "hazmat.mp4",
    description: "Definitely a balaclava icon, absolutely not a hazmat mask",
  },
  {
    name: "Underclothes",
    mp4: "base-clothing.mp4",
    description: "A base layer of long underwear is certain to help",
  },
  {
    name: "Sweater",
    mp4: "turtleneck.mp4",
    description: "Oh, is that real wool?",
  },
  {
    name: "Cardigan",
    mp4: "cardigan.mp4",
    description: "Easy to add and remove, as the day demands",
  },
  {
    name: "Pants",
    mp4: "pants.mp4",
    description: "Please just put them on before you are arrested",
  },
  { name: "Jacket", mp4: "jacket.mp4", description: "A jacket. Yes." },
  {
    name: "Jumpsuit",
    mp4: "protective-wear.mp4",
    description: "Time for the heavy artillery",
  },
  {
    name: "Mittens",
    mp4: "mittens.mp4",
    description: "Make sure they have a cute pattern",
  },
  {
    name: "Winter Boots",
    mp4: "sneaker.mp4",
    description: "Don't forget your feet!",
  },
];

const wardrobeTwo = [
  { name: "Beanie", mp4: "beanie.mp4", description: "Keeps your ears warm" },
  {
    name: "Underclothes",
    mp4: "base-clothing.mp4",
    description: "A base layer of long underwear is certain to help",
  },
  {
    name: "Sweater",
    mp4: "turtleneck.mp4",
    description: "Oh, is that real wool?",
  },
  {
    name: "Pants",
    mp4: "pants.mp4",
    description: "Please just put them on before you are arrested",
  },
  {
    name: "Jumpsuit",
    mp4: "protective-wear.mp4",
    description: "Time for the heavy artillery",
  },
  { name: "Scarf", mp4: "scarf.mp4", description: "Try not to lose it" },
  {
    name: "Mittens",
    mp4: "mittens.mp4",
    description: "Make sure they have a cute pattern",
  },
  {
    name: "Winter Boots",
    mp4: "sneaker.mp4",
    description: "Don't forget your feet!",
  },
];

const wardrobeThree = [
  { name: "Beanie", mp4: "beanie.mp4", description: "Keeps your ears warm" },
  {
    name: "T-shirt",
    mp4: "t-shirt.mp4",
    description: "Just grab one from the stack",
  },
  {
    name: "Sweater",
    mp4: "turtleneck.mp4",
    description: "Oh, is that real wool?",
  },
  {
    name: "Pants",
    mp4: "pants.mp4",
    description: "Please just put them on before you are arrested",
  },
  {
    name: "Cardigan",
    mp4: "cardigan.mp4",
    description: "Easy to add and remove, as the day demands",
  },
  {
    name: "Trench-coat",
    mp4: "trench-coat.mp4",
    description: "Please wear something underneath too",
  },
  { name: "Gloves", mp4: "glove.mp4", description: "Like a true gentleman" },
  {
    name: "Shoes",
    mp4: "shoes.mp4",
    description: "Never leave the home without them",
  },
];

const wardrobeFour = [
  { name: "Cap", mp4: "cap.mp4", description: "Gotta catch 'em all" },
  {
    name: "T-shirt with long sleeves",
    mp4: "long-sleeves.mp4",
    description: "Why is it that one seems to never have enough of these?",
  },
  {
    name: "Cardigan",
    mp4: "cardigan.mp4",
    description: "Easy to add and remove, as the day demands",
  },
  {
    name: "Pants",
    mp4: "pants.mp4",
    description: "Please just put them on before you are arrested",
  },
  {
    name: "Shoes",
    mp4: "shoes.mp4",
    description: "Never leave the home without them",
  },
];

const wardrobeFive = [
  { name: "Cap", mp4: "cap.mp4", description: "Gotta catch 'em all" },
  {
    name: "T-shirt",
    mp4: "t-shirt.mp4",
    description: "Just grab one from the stack",
  },
  {
    name: "Pants",
    mp4: "pants.mp4",
    description: "Please just put them on before you are arrested",
  },
  {
    name: "Shoes",
    mp4: "shoes.mp4",
    description: "Never leave the home without them",
  },
];

const wardrobeSix = [
  { name: "Sunhat", mp4: "sunhat.mp4", description: "Watch the sun!" },
  {
    name: "T-shirt",
    mp4: "t-shirt.mp4",
    description: "Just grab one from the stack",
  },
  {
    name: "Shorts",
    mp4: "short.mp4",
    description: "Time to show off those hairy legs of yours",
  },
  {
    name: "Flip Flops",
    mp4: "flip-flops.mp4",
    description: "...People actually wear these things?",
  },
];
