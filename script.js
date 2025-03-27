// Weather icon mapping
const weatherIcons = {
    '01d': 'fas fa-sun',          
    '01n': 'fas fa-moon',          
    '02d': 'fas fa-cloud-sun',     
    '02n': 'fas fa-cloud-moon',    
    '03d': 'fas fa-cloud',        
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',         
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',    
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',          
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',     
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',          
    '50n': 'fas fa-smog'
};

async function getWeather() {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert("Please enter a city name");
        return;
    }

    const apiKey = '2996bfc3e232bb07b1b6984a13191b58';
    const url = https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric;
    
    try {
        document.getElementById('weather').innerHTML = "<div class='weather-info'>Loading weather data...</div>";
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.cod === 200) {
            const iconCode = data.weather[0].icon;
            const iconClass = weatherIcons[iconCode] || 'fas fa-cloud';
            
            document.getElementById('weather').innerHTML = `
                <div class="weather-icon">
                    <i class="${iconClass}"></i>
                </div>
                <div class="temp">${Math.round(data.main.temp)}°C</div>
                <div class="weather-info">
                    <i class="fas fa-map-marker-alt"></i> ${data.name}, ${data.sys.country}
                </div>
                <div class="weather-info">
                    <i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%
                </div>
                <div class="weather-info">
                    <i class="fas fa-wind"></i> Wind: ${data.wind.speed} m/s
                </div>
                <div class="weather-info" style="text-transform: capitalize;">
                    ${data.weather[0].description}
                </div>
            `;
        } else {
            document.getElementById('weather').innerHTML = <div class="weather-info">Error: ${data.message}</div>;
        }
    } catch (error) {
        document.getElementById('weather').innerHTML = "<div class='weather-info'>Failed to load weather data</div>";
        console.error(error);
    }
}
