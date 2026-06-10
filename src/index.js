main().catch(error => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
});

async function main() {
    const { cityName, apiKey } = getInput();

    const { getDataset } = require('../services/dataService');
    const data = await getDataset(cityName, apiKey);
    
    const weatherForecast = processData(data);
    
    const { createCSV } = require('../services/OutputService');
    createCSV(cityName, weatherForecast);
}

/**
 * Get input from the command line arguments and environment variables
 * @returns cityName and apiKey
 */
function getInput() {
    require('dotenv').config();
    const cityName = process.argv[2], apiKey = process.env.KEY;

    if (!cityName) throw new Error("Missing input city name");
    if (!apiKey) throw new Error(`Missing environment variable`);
    return { cityName, apiKey };
}



/**
 * Process the dataset to get the weather forecast for each day
 * @param {dataset} data 
 * @returns weather forecast for each day
 */
function processData(data) {
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
    weatherForecast.forEach(row => {
        row.weather = Object.keys(row.weathers).reduce((a, b) => row.weathers[a] > row.weathers[b] ? a : b);
    });
    return weatherForecast;
}
