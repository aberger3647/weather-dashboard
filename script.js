var submitButtonEl = $('#search-btn');
var currentTemp = $('#current-temp');
var currentWind = $('#current-wind');
var currentHumidity = $('#current-humidity');

var getWeather = function (lat, lon) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=4709f071f7e8e51ca2c428e9f96726ca`;
    fetch(apiUrl)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
        var fiveDayForecast = $('#five-day-forecast');
        for (var i = 0; i < data.list.length; i+=8) {
            var html = ` <div class="card" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">Date: ${moment.unix(data.list[i].dt).format('MM/DD/YYYY')}</h5>
              <img src="http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">
              <p class="card-text">Temp: ${data.list[i].main.temp}</p>
              <p class="card-text">Wind: ${data.list[i].wind.speed}</p>
              <p class="card-text">Humidity: ${data.list[i].main.humidity}</p>
            </div>
          </div>`
          fiveDayForecast.append(html);
        }
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
        currentTemp.text('Temp: ' + data.main.temp);
        currentWind.text('Wind: ' + data.wind.speed);
        currentHumidity.text('Humidity: ' + data.main.humidity);
    })
}

var getCoordinates = function(event) {
    
    event.preventDefault();
    var cityInputEl = $('#city');
    console.log(cityInputEl);
    var apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInputEl.val()}&appid=4709f071f7e8e51ca2c428e9f96726ca`;
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            getWeather(data[0].lat, data[0].lon);
            getCurrentWeather(data[0].lat, data[0].lon);
        })
}

submitButtonEl.on('click', getCoordinates);