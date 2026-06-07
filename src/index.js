// Node v24
// input: city_name + api_key
// target: user's input -> API -> console
// output: date, weather, mid_temperature

async function main() {
    const { cityName, apiKey } = getInput();
    const { lat, lon } = await getCoordinates(cityName, apiKey);
    const data = await getDataset(lat, lon, apiKey);
    displayWeather(data);
}

function displayWeather(data) {
    var date = new Date().toLocaleDateString(), 
        weather = data.weather[0].main, 
        mid_temperature = (data.main.temp_max + data.main.temp_min) / 2;

    console.log(`${date}, ${weather}, ${mid_temperature.toFixed(0)}`);
}

async function getDataset(lat, lon, apiKey) {
    const EXCLUDE = "minutely,hourly,alerts";
    const UNITS = "metric";

    try {
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&exclude=${EXCLUDE}&units=${UNITS}`, response = await fetch(url);
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
        const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&appid=${apiKey}&limit=1`, 
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

function getInput() {
    require('dotenv').config();
    const cityName = process.argv[2], apiKey = process.env.KEY;

    if (!cityName) throw new Error("Missing input city name");
    if (!apiKey) throw new Error(`Missing environment variable`);
    return { cityName, apiKey };
}

main().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
});