var submitButtonEl = $('#search-btn');

function handleSearch(event) {
    event.preventDefault();
    query = $('#city-input').val();
    getCoordinates(query);
}

// create function to get coordinates based on city input. pass latitude and longitude into getFiveDayForecast and getCurrentWeather functions
var getCoordinates = function (query) {

    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=4709f071f7e8e51ca2c428e9f96726ca`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            getFiveDayForecast(data[0].lat, data[0].lon);
            getCurrentWeather(data[0].lat, data[0].lon);
            storeCity(data[0].lat, data[0].lon);
        })
}

var getCurrentWeather = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=4709f071f7e8e51ca2c428e9f96726ca`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var currentCity = $('#current-city');
            var currentDate = $('#current-date');
            var currentIcon = $('#current-icon');
            var currentTemp = $('#current-temp');
            var currentWind = $('#current-wind');
            var currentHumidity = $('#current-humidity');
            currentCity.text(data.name);
            currentDate.text(moment().format('MM/DD/YYYY'));
            currentIcon.html(`<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`);
            currentTemp.text('Temp: ' + data.main.temp + '°F');
            currentWind.text('Wind: ' + data.wind.speed + ' MPH');
            currentHumidity.text('Humidity: ' + data.main.humidity + '%');
        })
}

var getFiveDayForecast = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=4709f071f7e8e51ca2c428e9f96726ca`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var fiveDayLabel = $('#five-day-label');
            fiveDayLabel.text('5-Day Forecast:');
            var fiveDayForecast = $('#five-day-forecast');
            fiveDayForecast.empty();
            $('#city-form')[0].reset();
            for (var i = 0; i < data.list.length; i += 8) {
                var html = ` 
            <div class="card" style="width: 11rem; background-color: rgb(0, 157, 255); margin-bottom: 1em;">
            <div class="card-body">
            <h5 class="card-title" style="color:white;">${moment.unix(data.list[i].dt).format('MM/DD/YYYY')}</h5>
            <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png">
            <p class="card-text" style="color:white;">Temp: ${data.list[i].main.temp}°F</p>
            <p class="card-text" style="color:white;">Wind: ${data.list[i].wind.speed} MPH</p>
            <p class="card-text" style="color:white;">Humidity: ${data.list[i].main.humidity}%</p>
            </div>
            </div>
            `
                fiveDayForecast.append(html);
            }

        })
}

var storeCity = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=4709f071f7e8e51ca2c428e9f96726ca`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

            var city = data.name;
            var getStoredCities = getCities();
            if (getStoredCities === null) {
                var citiesArr = [];
            } else {
                var citiesArr = getStoredCities;
            }
            // if the array does not include city, add it to the array
            console.log(!citiesArr.includes(city));
            if (!citiesArr.includes(city)) {
                citiesArr.push(city);
            }
            localStorage.setItem('city', JSON.stringify(citiesArr));
            init();
        })
}

function getCities() {
    return JSON.parse(localStorage.getItem('city'));
}

// create global createButton function, argument will be city
function init() {
    $('#search-history').html('');
    var citiesArr = getCities();
    console.log(citiesArr);
    if (citiesArr) {
        console.log("success");
        for (var i = 0; i < citiesArr.length; i++) {
            var storedCityEl = $('<button class="btn btn-primary">');
            var storedCity = storedCityEl.text(citiesArr[i]);
            $('#search-history').append(storedCity);
        }
    }
}

init();

submitButtonEl.on('click', handleSearch);
$('#search-history').on('click', reSearch);

function reSearch(event) {
    getCoordinates(event.target.innerText)

}