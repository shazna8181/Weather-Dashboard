//The base URL for your API calls:
var apiURL = "https://api.openweathermap.org/data/2.5/weather?";
var apiURLF= "https://api.openweathermap.org/data/2.5/forecast?";
var key = "&appid=bf0b8d3057be40f6a4009489ca67dd3a";

//the array to hold town list
var townsList = [];

$("#search-button").on("click", function (){
    var town = $("#search-input").val();
     //to prevent duplicates and include new towns in the array
     if(!townsList.includes(town)){
      townsList.push(town);         
     }      
      todayWeather(town);
      weatherForecast(town);
      renderSearchButton();
      $("#search-input").val("");
});

function todayWeather(town){
  var queryURL = apiURL + "q=" + town + key;
  console.log('query: ', queryURL)

  fetch(queryURL)
  .then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    displayDayWeather(data);
  });
}

function displayDayWeather(data){
  var dayWeather = $("#today");
 
  if (data.cod !== 200) {
    dayWeather.html(`<p>NOT found, Please enter city name!!</p>`);
    return;
  }

  var dayWeatherHtml = `
      <div class="col-12 day-card">
        <h5> ${data.name} (${new Date().toLocaleDateString()}) </h5>
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
        <p>Temperature: ${Math.floor(data.main.temp - 273.15)} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} KPH</p>
        </div>
      `;
  dayWeather.html(dayWeatherHtml);
}

function weatherForecast(town){
  var queryURLF = apiURLF + "q=" + town + key;
  console.log('query: ', queryURLF)

  fetch(queryURLF)
  .then(function (response) {
    return response.json();
  }).then(function (data) {
    console.log(data);
    displayWeatherForecast(data);
  });
}

function displayWeatherForecast(data){
  var fiveDayWeather = $("#forecast");
 
  var fiveDayWeatherHtml = `<div class="col-12"><h3>5 Day Forecast:</h3></div>`;
      data.list.forEach((data, index)=>{
        if (index % 8 === 0) {
          fiveDayWeatherHtml +=`
              <div class="col-md-2 forecast-card">
                <h5>${new Date(data.dt_txt).toLocaleDateString()}</h5>   
                <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">     
                <p>Temperature: ${Math.floor(data.main.temp - 273.15)} °C</p>
                <p>Wind Speed: ${data.wind.speed} KPH</p>
                <p>Humidity: ${data.main.humidity}%</p>          
              </div>
            `;
          }
      });
      
  fiveDayWeather.html(fiveDayWeatherHtml);
}

function renderSearchButton(){
  $("#history").empty();

  for (var i = 0; i < townsList.length; i++) {
    var t = $("<button>");
    t.addClass("city");
    t.attr("data-name", townsList[i]);
    t.text(townsList[i]);
    $("#history").append(t);
  }
  console.log(townsList);
}    

//Display weather data of cities from search history
$("#history").on("click", '.city', function (event){
  // declare town for each city-button
   var town = $(event.target).attr('data-name')
    todayWeather(town);
    weatherForecast(town);
   
});

