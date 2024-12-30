// Initialize AOS
AOS.init({
    duration: 1000,  // Animation duration
    once: true,  // Animation should happen only once while scrolling down
    mirror: false  // Whether elements should animate out while scrolling past them
});

const apiKey = '524e7639f7db962d50b175dc66132873'; // OpenWeatherMap API key
let isCelsius = true; // Temperature unit state

document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search');
    const toggleTempButton = document.getElementById('toggle-temp');
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');
    const fiveDayForecastLink = document.getElementById('fiveDayForecastLink');

    searchButton.addEventListener('click', () => {
        const city = document.getElementById('city').value;
        fetchWeather(city);
    });

    toggleTempButton.addEventListener('click', () => {
        isCelsius = !isCelsius;
        toggleTempButton.innerText = `Convert to °${isCelsius ? 'F' : 'C'}`;
        updateTemperature();
    });

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    fiveDayForecastLink.addEventListener('click', () => {
        const city = document.getElementById('city').value || 'Livingstone';  // Use 'Livingstone' if no city entered
        window.location.href = `forecast.html?city=${city}`;
    });

    navigator.geolocation.getCurrentPosition(position => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
    }, () => {
        fetchWeather(); // Fallback to default city
    });
});

function fetchWeatherByCoords(lat, lon) {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            updateWeatherDisplay(data);
        })
        .catch(error => {
            alert('Unable to retrieve weather data.');
        });
}

function fetchWeather(city = 'London') {
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            updateWeatherDisplay(data);
        })
        .catch(error => {
            alert('City not found. Please try again.');
        });
}

function updateWeatherDisplay(data) {
    const { main, weather, wind, sys, name, dt } = data;
    const temp = isCelsius ? main.temp : (main.temp * 9/5) + 32;
    const currentTime = new Date(dt * 1000).toLocaleTimeString(); // Convert UNIX timestamp to time

    document.getElementById('weather').innerHTML = `
        <h3>${name}</h3>
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
        <p>Temperature: ${Math.round(temp)}°${isCelsius ? 'C' : 'F'}</p>
        <p id="current-time">Time: ${currentTime}</p>
    `;

    document.getElementById('wind-speed').innerText = `Wind Speed: ${wind.speed} m/s`;
    document.getElementById('humidity').innerText = `Humidity: ${main.humidity} %`;
    document.getElementById('sunrise').innerText = `Sunrise: ${new Date(sys.sunrise * 1000).toLocaleTimeString()}`;
    document.getElementById('sunset').innerText = `Sunset: ${new Date(sys.sunset * 1000).toLocaleTimeString()}`;

    changeBackground(weather[0].main);
}

function updateTemperature() {
    const tempElement = document.querySelector('.weather-box p');
    const tempText = tempElement.innerText;
    const tempValue = parseFloat(tempText.match(/-?\d+(\.\d+)?/)[0]);
    const newTemp = isCelsius ? (tempValue - 32) * 5/9 : (tempValue * 9/5) + 32;
    tempElement.innerText = `Temperature: ${Math.round(newTemp)}°${isCelsius ? 'C' : 'F'}`;
}

function changeBackground(weatherCondition) {
    const currentSection = document.getElementById('current');
    let backgroundImage = '';

    switch (weatherCondition) {
        case 'Clear':
            backgroundImage = 'url("./photos/clear.jpg")';
            break;
        case 'Clouds':
            backgroundImage = 'url("./photos/clouds.jpg")';
            break;
        case 'Rain':
            backgroundImage = 'url("./photos/rain.jpg")';
            break;
        case 'Snow':
            backgroundImage = 'url("./photos/snowy.jpg")';
            break;
        case 'Drizzle':
            backgroundImage = 'url("./photos/drizzles.jpg")';
            break;
        case 'Thunderstorm':
            backgroundImage = 'url("./photos/thunder.jpg")';
            break;
        default:
            backgroundImage = 'url("./photos/canyon.jpeg")';
            break;
    }
    currentSection.style.backgroundImage = backgroundImage;
}
