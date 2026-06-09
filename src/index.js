// input: city_name + api_key
// target: user's input -> API -> console
// output: [date, weather, mid_temperature]
// openweathermap free access : 60 calls/minute, 1 000 000 calls/month | 3-hourly forecast for 5 days API

const SERVICE = `https://api.openweathermap.org`;

main().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
});

async function main() {
    const { cityName, apiKey } = getInput();
    const data = await getDataset(cityName, apiKey);
    displayWeather(data);
}


function getInput() {
    require('dotenv').config();
    const cityName = process.argv[2], apiKey = process.env.KEY;

    if (!cityName) throw new Error("Missing input city name");
    if (!apiKey) throw new Error(`Missing environment variable`);
    return { cityName, apiKey };
}
async function getDataset(cityName, apiKey) {
    const { lat, lon } = await getCoordinates(cityName, apiKey);
    const EXCLUDE = "minutely,hourly,alerts", UNITS = "metric";

    try {
        const url = `${SERVICE}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=${EXCLUDE}&units=${UNITS}`, response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const dataset = await response.json();

        return dataset;

    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        process.exit(1);
    }
}
async function getCoordinates(cityName, apiKey) {
    try {
        const url = `${SERVICE}/geo/1.0/direct?q=${cityName}&appid=${apiKey}&limit=1`, 
        response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const dataset = await response.json();
        var lat = dataset[0].lat, lon = dataset[0].lon;

        return { lat, lon };

    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        process.exit(1);
    }
}
function displayWeather(data) {
    var weatherForecast = [];

    for (let i = 0; i < data.list.length; i++) {
        const row = data.list[i];

        let date = row.dt_txt.split(" ")[0];
        let weather = row.weather[0].main;
        let temp = Math.round(row.main.temp);

        if (weatherForecast && weatherForecast.findIndex(row => row.date === date) === -1) {
            weatherForecast.push({ date, "weathers" : {weather: 1}, temp });
        } else {
            const existingRow = weatherForecast.find(row => row.date === date);
            existingRow.weathers[weather] = (existingRow.weathers[weather] || 0) + 1;
            existingRow.temp = Math.round(((existingRow.temp + temp) / 2));
        }
    }

    // console.log(weatherForecast);
    console.log(`\nWeather forecast for ${data.city.name} (${data.city.country}):`);
    weatherForecast.forEach(row => {
        row.weather = Object.keys(row.weathers).reduce((a, b) => row.weathers[a] > row.weathers[b] ? a : b);
        console.log(`${row.date}, ${row.weather}, ${row.temp}°C`);
    });
}
