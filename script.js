// Weather API
const API_KEY = "2996bfc3e232bb07b1b6984a13191b58";
let serialPort;
let reader;
let arduinoConnected = false;

// DOM Elements
const searchBtn = document.getElementById('search-btn');
const connectBtn = document.getElementById('connect-btn');

// Event Listeners
searchBtn.addEventListener('click', getWeather);
connectBtn.addEventListener('click', connectToArduino);

// Weather Functions
async function getWeather() {
  const city = document.getElementById('city').value.trim();
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  try {
    // Fetch current weather
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();
    displayWeather(data);

    // Fetch forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastResponse.json();
    displayForecast(forecastData.list);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("Error fetching weather data");
  }
}

function displayWeather(data) {
  document.getElementById('temp-div').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('weather-desc').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = data.main.humidity;
  document.getElementById('wind-speed').textContent = data.wind.speed.toFixed(1);
  document.getElementById('weather-icon').src = 
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

function displayForecast(forecastData) {
  const forecastContainer = document.getElementById('forecast-items');
  forecastContainer.innerHTML = '';
  
  const next24Hours = forecastData.slice(0, 8);
  
  next24Hours.forEach(item => {
    const time = new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit' });
    const temp = Math.round(item.main.temp);
    const icon = `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
    
    const forecastItem = document.createElement('div');
    forecastItem.className = 'forecast-item';
    forecastItem.innerHTML = `
      <div>${time}</div>
      <img src="${icon}" alt="${item.weather[0].description}" width="40">
      <div>${temp}°C</div>
    `;
    
    forecastContainer.appendChild(forecastItem);
  });
}

// Arduino Connection Functions
async function connectToArduino() {
  if (!('serial' in navigator)) {
    alert("Web Serial API not supported in your browser. Try Chrome or Edge.");
    return;
  }

  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 9600 });
    reader = serialPort.readable.getReader();
    arduinoConnected = true;
    updateConnectionStatus(true);
    
    // Read data continuously
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // Handle Arduino data properly
      const moisture = value instanceof Uint8Array ? value[0] : parseInt(new TextDecoder().decode(value));
      updateSoilData(moisture);
    }
  } catch (error) {
    console.error("Arduino connection error:", error);
    updateConnectionStatus(false);
  }
}

function updateSoilData(moisture) {
  document.getElementById('moisture-level').textContent = moisture;
  const status = moisture > 500 ? "DRY" : "WET";
  const statusElement = document.getElementById('soil-status');
  statusElement.textContent = status;
  statusElement.className = `sensor-status ${status.toLowerCase()}`;
}

function updateConnectionStatus(connected) {
  const btn = document.getElementById('connect-btn');
  const status = document.getElementById('soil-status');
  
  if (connected) {
    btn.innerHTML = '<i class="fas fa-link"></i> Connected';
    status.textContent = "Connected";
    status.className = "sensor-status connected";
  } else {
    btn.innerHTML = '<i class="fas fa-unlink"></i> Connect Arduino';
    status.textContent = "Disconnected";
    status.className = "sensor-status disconnected";
    
    // Simulate data if not connected
    setInterval(() => {
      updateSoilData(Math.floor(Math.random() * 1023));
    }, 2000);
  }
}

// Initialize with simulated data
updateConnectionStatus(false);

