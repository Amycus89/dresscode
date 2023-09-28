document.addEventListener("DOMContentLoaded", function () {
  let x = document.getElementById("test");
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
      });
    });
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
});
