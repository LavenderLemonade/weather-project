import React from 'react'
import { useState } from 'react'
import axios from 'axios'


export default function SearchLocation() {

    const [search, setSearch] = useState('');
    const [theError, setError] = useState('');
    const [currentLoc, setCurrentLoc] = useState<Array<number>>([]);
    const [currentWeatherValues, setCurrentWeatherValues] = useState<Array<WeatherObject>>([]);

    let baseLocURL = 'https://nominatim.openstreetmap.org/search?q=';
    let locFormatDetails = "&format=json&addressdetails=1";
    let baseWeatherURL = 'https://api.weather.gov/points/';

    class WeatherObject {

        name: string;
        temp: number;
        windSpeed: number;
        forecast: string;
        detailedForecast: string;

        constructor(name: string, temp: number, wind: number, fore: string, deet: string) {
            this.name = name;
            this.temp = temp;
            this.windSpeed = wind;
            this.forecast = fore;
            this.detailedForecast = deet;
        }
    }

    function getObjectDetails(data: any) {
        return new WeatherObject(data.name, data.temperature, data.windSpeed, data.shortForecast, data.detailedForecast);
    }

    function addObject(data: WeatherObject) {
        return setCurrentWeatherValues((oldValues) => [...oldValues, data]);
    }

    async function findWeatherConditions(url: string): Promise<Array<Object>> {
        try {
            const data = await axios.get(url);
            return data.data.properties.periods;
        }
        catch (error) {
            return [{}];
        }
    }

    async function findWeatherConditionData(location: string): Promise<any> {
        try {
            const data = await axios.get(baseWeatherURL + encodeURIComponent(location).replace(/%20/g, ","));
            return data.data;
        }

        catch (error) {
            setError(theError + error);
            return 'ERROR';
        }
    }

    async function findLongAndLat(search: string): Promise<Array<number>> {
        try {
            const data = await axios.get(baseLocURL + encodeURIComponent(search).replace(/%20/g, "+") + locFormatDetails);
            return [data.data[0].lat, data.data[0].lon];
        }

        catch (error) {
            setError(theError + error);
            return [];
        }
    }

    return (
        <div>
            <input className="outline outline-black" value={search} onChange={e => setSearch(e.target.value)} />
            <button className="text-xl pl-4" onClick={() => {
                findLongAndLat(search).then((data) => {
                    setCurrentLoc(data);
                    return findWeatherConditionData(data.toString());
                }).then((response) => {
                    return findWeatherConditions(response.properties.forecast);
                }).then((data) => {
                    setCurrentWeatherValues([]);
                    addObject(getObjectDetails(data[0]));
                    addObject(getObjectDetails(data[1]));
                    console.log(currentWeatherValues);
                });
            }}> Search </button>

            {theError && <h1> {theError} </h1>}

            {currentWeatherValues && currentLoc && currentWeatherValues.map((weather) =>
                <div>
                    <h4> {weather.name} the weather is going to be </h4>
                    <h4> {weather.temp} degrees Farenheit </h4>
                    <h4> with wind speeds of {weather.windSpeed} </h4>
                    <h4> the short forecast is that the weather will be {weather.forecast} </h4>
                    <h4> the details are that the weather will be: {weather.detailedForecast} </h4>
                </div>

            )}
        </div>
    )
}
