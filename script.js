async function fetchWeather() {
  let searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "b86a207f5e30eb636725d19512a68372"; 

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  // GETS LONG AND LAT
  async function getLonAndLat() {
    const countryCode = 1;
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(searchInput)}&limit=1&appid=${apiKey}`;
    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return null;
    }
    const data = await response.json();
    if (data.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return null;
    }
    return data[0]; 
  }

  // THIS IS TO GET THE WEATHER DATA
  async function getWeatherData(lat, lon) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }
    const data = await response.json();
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="100" />
      <div>
        <h2>${data.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(data.main.temp)}°C</p>
        <p><strong>Description:</strong> ${data.weather[0].description}</p>
      </div>
    `;
  }

  // Fetch the coordinates, then the weather
  
  const geocodeData = await getLonAndLat();
  if (geocodeData) {
    await getWeatherData(geocodeData.lat, geocodeData.lon);
  }

  // Clear input field
  document.getElementById("search").value = "";
}
