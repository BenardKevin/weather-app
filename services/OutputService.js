module.exports = { consoleLog, createCSV };

/**
 * Log the weather forecast to the console
 * @param {json} data 
 * @param {table} weatherForecast 
 */
function consoleLog(data, weatherForecast) {
    console.log(`\nWeather forecast for ${data.city.name} (${data.city.country}):`);
    weatherForecast.forEach(row => {
        console.log(`${row.date}, ${row.weather}, ${row.temp}°C`);
    });
}

/**
 * Create a CSV file with the weather forecast data
 * @param {string} cityName 
 * @param {table} weatherForecast 
 */
function createCSV(cityName, weatherForecast) {
    const { writeFile } = require('fs/promises');
    const filename = `logs/${cityName}_forecast_${weatherForecast[0].date}.csv`
    const header = `date, weather, temperature\n`;

    const dataCSV = weatherForecast.reduce((acc, row) => {
        acc += `${row.date}, ${row.weather}, ${row.temp}\n`;
        return acc;
    }, header);

    writeFile(filename, dataCSV, 'utf8')
        .then(() => console.log(`CSV file created successfully: ${filename}`))
        .catch(error => console.error(`Error writing CSV file: ${error.message}`));
}
