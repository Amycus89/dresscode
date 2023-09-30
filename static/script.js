// Add eventlistener for id="getLocation" on click:
document.getElementById("getLocation").addEventListener("click", function () {
  console.log(weatherInfo.name);
  let apology = document.getElementById("apology");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      fetch("/", {
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
          weatherInfo = data;
          console.log(weatherInfo.name);
        });
    });
  } else {
    apology.innerHTML = "Geolocation is not supported by this browser.";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let sunMoon = weatherInfo.sun_moon;
  let id = weatherInfo.id;
  console.log(sunMoon);
  console.log(id);

  let weatherImage = document.getElementById("weatherIcon");

  if (sunMoon == "sun") {
    if (id > 199 && id < 203) {
      weatherImage.src = "/static/weatherIcons/thunderstorms-day-rain.svg";
      weatherImage.alt = "Day with thunderstorm and rain";
    } else if (id > 299 && id < 322) {
      weatherImage.src = "/static/weatherIcons/thunderstorms-day.svg";
      weatherImage.alt = "Day with thunderstorm";
    } else if (id > 229 && id < 233) {
      weatherImage.src = "/static/weatherIcons/thunderstorms-day-snow.svg";
      weatherImage.alt = "Day with thunderstorm and drizzle";
    } else if (id > 299 && id < 322) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-day-drizzle.svg";
      weatherImage.alt = "Day with drizzle";
    } else if (id > 499 && id < 532) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-day-rain.svg";
      weatherImage.alt = "Day with rain";
    } else if (id > 599 && id < 603) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-day-snow.svg";
      weatherImage.alt = "Day with snow";
    } else if (id > 610 && id < 614) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-day-sleet.svg";
      weatherImage.alt = "Day with sleet";
    } else if (id > 614 && id < 623) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-day-sleet.svg";
      weatherImage.alt = "Day with rain and snow";
    } else if (id > 700 && id < 703) {
      weatherImage.src = "/static/weatherIcons/mist.svg";
      weatherImage.alt = "Day with mist";
    } else if (id > 710 && id < 712) {
      weatherImage.src = "/static/weatherIcons/smoke-particles.svg";
      weatherImage.alt = "Day with smoke particles";
    } else if (id > 720 && id < 723) {
      weatherImage.src = "/static/weatherIcons/haze-day.svg";
      weatherImage.alt = "Day with haze";
    } else if ((id > 730 && id < 732) || id == 761) {
      weatherImage.src = "/static/weatherIcons/dust-day.svg";
      weatherImage.alt = "Day with dust whirls";
    } else if (id > 740 && id < 742) {
      weatherImage.src = "/static/weatherIcons/fog-day.svg";
      weatherImage.alt = "Day with fog";
    } else if (id == 751) {
      weatherImage.src = "/static/weatherIcons/dust-day.svg";
      weatherImage.alt = "Day with sand storms";
    } else if (id == 762) {
      weatherImage.src = "/static/weatherIcons/ash.svg";
      weatherImage.alt = "Day with ash";
    } else if (id == 771) {
      weatherImage.src = "/static/weatherIcons/wind.svg";
      weatherImage.alt = "Day with squalls";
    } else if (id == 781) {
      weatherImage.src = "/static/weatherIcons/tornado.svg";
      weatherImage.alt = "Day with tornado";
    } else if (id == 800) {
      weatherImage.src = "/static/weatherIcons/clear-day.svg";
      weatherImage.alt = "Day with clear sky";
    } else {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-day.svg";
      weatherImage.alt = "Cloudy day";
    }
  } else {
    // Else if moon:
    if (id > 199 && id < 203) {
      weatherImage.src = "/static/weatherIcons/thunderstorms-night-rain.svg";
      weatherImage.alt = "Night with thunderstorm and rain";
    } else if (id > 299 && id < 322) {
      weatherImage.src = "/static/weatherIcons/thunderstorms-night.svg";
      weatherImage.alt = "Night with thunderstorm";
    } else if (id > 229 && id < 233) {
      weatherImage.src = "/static/weatherIcons/thunderstorms-night-snow.svg";
      weatherImage.alt = "Night with thunderstorm and drizzle";
    } else if (id > 299 && id < 322) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-night-drizzle.svg";
      weatherImage.alt = "Night with drizzle";
    } else if (id > 499 && id < 532) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-night-rain.svg";
      weatherImage.alt = "Night with rain";
    } else if (id > 599 && id < 603) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-night-snow.svg";
      weatherImage.alt = "Night with snow";
    } else if (id > 610 && id < 614) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-night-sleet.svg";
      weatherImage.alt = "Night with sleet";
    } else if (id > 614 && id < 623) {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-night-sleet.svg";
      weatherImage.alt = "Night with rain and snow";
    } else if (id > 700 && id < 703) {
      weatherImage.src = "/static/weatherIcons/mist.svg";
      weatherImage.alt = "Night with mist";
    } else if (id > 710 && id < 712) {
      weatherImage.src = "/static/weatherIcons/smoke-particles.svg";
      weatherImage.alt = "Night with smoke particles";
    } else if (id > 720 && id < 723) {
      weatherImage.src = "/static/weatherIcons/haze-night.svg";
      weatherImage.alt = "Night with haze";
    } else if ((id > 730 && id < 732) || id == 761) {
      weatherImage.src = "/static/weatherIcons/dust-night.svg";
      weatherImage.alt = "Night with dust whirls";
    } else if (id > 740 && id < 742) {
      weatherImage.src = "/static/weatherIcons/fog-night.svg";
      weatherImage.alt = "Night with fog";
    } else if (id == 751) {
      weatherImage.src = "/static/weatherIcons/dust-night.svg";
      weatherImage.alt = "Night with sand storms";
    } else if (id == 762) {
      weatherImage.src = "/static/weatherIcons/ash.svg";
      weatherImage.alt = "Night with ash";
    } else if (id == 771) {
      weatherImage.src = "/static/weatherIcons/wind.svg";
      weatherImage.alt = "Night with squalls";
    } else if (id == 781) {
      weatherImage.src = "/static/weatherIcons/tornado.svg";
      weatherImage.alt = "Night with tornado";
    } else if (id == 800) {
      weatherImage.src = "/static/weatherIcons/starry-night.svg";
      weatherImage.alt = "Night with clear sky";
    } else {
      weatherImage.src = "/static/weatherIcons/partly-cloudy-night.svg";
      weatherImage.alt = "Cloudy night";
    }
  }
});
