// key: e9adb5ecd7dff0e9e1999612c1c3fdfd

// api.openweathermap.org/data/2.5/forecast?q=San%20Francisco&appid=e9adb5ecd7dff0e9e1999612c1c3fdfd

// testing fetch data

// fetch('https://api.openweathermap.org/data/2.5/forecast?q=San%20Francisco&appid=e9adb5ecd7dff0e9e1999612c1c3fdfd')
// .then(r => r.json())
// .then(data => {
//   console.log(data)
// })

// will store search history 

let searchHistoryList = []
let currentSearch = null
// console.log(localStorage.getItem('searchHistoryList'))
if (localStorage.getItem('searchHistoryList')) {
  searchHistoryList = JSON.parse(localStorage.getItem('searchHistoryList'))
  renderHistory()
}
// fetching api city/and uv index
function setCurrentSearch(city) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=e9adb5ecd7dff0e9e1999612c1c3fdfd`)
    .then(r => r.json())
    .then(data => {
      currentSearch = data
      searchHistoryList.push(data)
      fetch(`http://api.openweathermap.org/data/2.5/uvi?appid=e9adb5ecd7dff0e9e1999612c1c3fdfd&lat=${data.city.coord.lat}&lon=${data.city.coord.lon}`)
        .then(r => r.json())
        .then(data => {
          document.getElementById('uvIndex').innerHTML = `
          UV Index: ${data.value}
          `
        })
      localStorage.setItem('searchHistoryList', JSON.stringify(searchHistoryList))
      renderHistory()
      renderCurrent()
      console.log(data)
    })
}
// will render history search list on column 1
function renderHistory() {
  document.getElementById('searchHistory').innerHTML = searchHistoryList.reduce(
    // allSearches = variable for initial value of reduce
    // cityObject = is each item within the list sequentially
    (allSearches, cityObject) => {
      return allSearches += `<li onclick='setCurrentSearch("${cityObject.city.name}")' class="list-group-item">${cityObject.city.name}</li>`
    }, '')
}

// adding 8 indexes up to get next day cast
function renderCurrent() {
  document.getElementById('currentCity').innerHTML = 
  `
  ${currentSearch.city.name} ${currentSearch.list[0].dt_txt}
  <p>${Math.round(currentSearch.list[0].main.temp * (9 / 5) - 459.67)}°F.</p>
  <p>Humidity: ${currentSearch.list[0].main.humidity}%</p>
  <p>Wind Speed: ${currentSearch.list[0].wind.speed}mph</p>
  <p id='uvIndex'></p>
  `
  document.getElementById('forecast').innerHTML = renderForecastItem(0) + renderForecastItem(8) + renderForecastItem(16) + renderForecastItem(24) + renderForecastItem(32)
}

//on submit function that will populate my search history/current search/forecast
document.getElementById('searchForm').onsubmit = (e) => {
  e.preventDefault()
  const city = document.getElementById('searchInput').value
  setCurrentSearch(city)
}

// function for what i want in index item which is boostrap card with 4 different items of day/icon/temp/humidity
function renderForecastItem(forecastIndex) {
  return `
    <div class="card text-white bg-primary mb-3" style="max-width: 18rem;">
      <div class="card-header">${currentSearch.list[forecastIndex].dt_txt}</div>
      <div class="card-body">
        <h5 class="card-title"><img src='http://openweathermap.org/img/wn/${currentSearch.list[forecastIndex].weather[0].icon}@2x.png'></h5>
        <p class="card-text">Temp 
        ${Math.round(currentSearch.list[forecastIndex].main.temp * (9 / 5) - 459.67)}°F
        </p>
        <p class="card-text">Humidity:
        ${currentSearch.list[forecastIndex].main.humidity}%
        </p>
      </div>
    </div>
  `
}



