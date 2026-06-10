# Weather Forecast CLI Exporter
Node.js command-line interface (CLI) application that retrieves 5-day weather forecasts for a given city via the OpenWeatherMap API and automatically exports the data into a structured CSV file. The application aggregates 3-hourly forecast data to generate a daily summary featuring the dominant weather condition and the average temperature.

## Features
* Integrated Geocoding: Automatically converts the city name into geographical coordinates (Latitude/Longitude).
* Data Aggregation: Computes the daily average temperature and extracts the most frequent weather condition for each day.
* Automatic CSV Export: Generates a structured .csv file saved into a dedicated logs directory.
* Secure Configuration: Uses environment variables via .env to keep your API key secure.

## Prerequisites
Before running the application, ensure you have:
* Node.js installed (Version 18+ for native fetch support).
* An active API key from OpenWeatherMap (Free tier: 3-hourly forecast for 5 days API, allowing up to 60 calls/minute and 1,000,000 calls/month).

## Installation & Configuration
1. Clone or download this project to your local machine.
2. Open a terminal in the project root directory and install the required dependency:

```bash
npm install dotenv
```
Create the .env file in the root directory of the project and add your OpenWeatherMap API key:

```bash
KEY=your_openweathermap_api_key_here
```

## Usage
To run the application, execute the following command and pass the city name as an argument:

```bash
node src/index.js "Paris"
```
(Replace "Paris" with any city of your choice)

The script generates a file using the following naming convention: logs/[CityName]_forecast_[CurrentDate].csv.

Content Format:

```bash
date, weather, temperature
2026-06-10, Clouds, 19
2026-06-11, Rain, 15
2026-06-12, Clear, 22
```

## Technical Specifications
Module System: CommonJS (require/module.exports).
Aggregation Logic: The script groups the 3-hour interval data by date (YYYY-MM-DD). The final temperature represents a rolling average rounded to the nearest integer, and the weather status is determined by the most frequent condition (statistical mode) occurring throughout that day.