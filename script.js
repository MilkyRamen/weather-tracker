const apiKey = "934db6202c8211ffa9dae59978099302";
const form = document.querySelector("form");
const input = document.querySelector("#city-input");
const cityName = document.querySelector("#city-name");
const date = document.querySelector("#date");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const windspeed = document.querySelector("#wind-speed");
const forecastDays = document.querySelectorAll("#forecast-day > div");

function fetchCurrentWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        cityName.textContent = data.name;
        date.textContent = new Date(data.dt * 1000).toLocaleDateString();
        temperature.textContent = `${Math.round(data.main.temp - 273.15)}°C (${Math.round((data.main.temp - 273.15) * 1.8 + 32)}°F)`;
        humidity.textContent = `${data.main.humidity}%`;
        windspeed.textContent = `${data.wind.speed.toFixed(1)} m/s`;
    })
}
function addSearchHistory(city) {
    const historyList = document.querySelector("#history-list");
    const newHistoryItem = document.createElement("li");
    newHistoryItem.textContent = city;
    newHistoryItem.addEventListener("click", () => {
        input.value = city;
        form.dispatchEvent(new Event("submit"));
    });
    historyList.appendChild(newHistoryItem);

    let  searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
}

let searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
const historyList = document.querySelector("#history-list");
searchHistory.forEach(city => {
    const historyItem = document.createElement("li");
    historyItem.textContent = city;
    historyItem.addEventListener("click", () => {
        input.value = city;
        form.dispatchEvent(new Event("submit"));
    });
    historyList.appendChild(historyItem);
});

form.addEventListener("submit", event => {
    event.preventDefault();
    const city = input.value.trim();
    if (city) {
        fetchCurrentWeather(city);
        fetchForecast(city);
        addSearchHistory(city);
        input.value = ""
    }
});

function fetchForecast(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const forecastItems = document.querySelectorAll("forecast-day > div");
        for (let i = 0; i < forecastItems.length; i++) {
            const forecast = data.list[i * 8];
            forecastItems[i].querySelector(".date").textContent = new Date(forecast.dt * 1000).toLocaleDateString();
            forecastItems[i].querySelector(".temperature").textContent = `${Math.round(forecast.main.temp - 273.15)}°C (${Math.round((forecast.main.temp - 273.15) * 1.8 + 32)}°F)`;
            forecastItems[i].querySelector(".humidity").textContent = `${forecast.main.humidity}%`;
            forecastItems[i].querySelector(".wind-speed").textContent = `${forecast.wind.speed.toFixed(1)} m/s`;
        }
    })
}