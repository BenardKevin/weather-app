const SERVICE = `https://api.openweathermap.org`;

module.exports = { getDataset };

/**
 * Get the weather forecast dataset for the city
 * @param {string} cityName 
 * @param {string} apiKey 
 * @returns dataset of the city
 */
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

/**
 * Get the coordinates of the city using a Geocoding API
 * @param {string} cityName 
 * @param {string} apiKey 
 * @returns latitude and longitude of the city
 */
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
