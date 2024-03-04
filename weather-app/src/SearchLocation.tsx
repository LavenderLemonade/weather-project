import React from 'react'
import { useState } from 'react'
import axios from 'axios'


export default function SearchLocation() {

    const [search, setSearch] = useState('');
    const [currentLoc, setCurrentLoc] = useState<Array<number>>([])

    let baseLocURL = 'https://nominatim.openstreetmap.org/search?q=';
    let locFormatDetails = "&format=json&addressdetails=1";
    let baseWeatherURL = 'https://api.weather.gov/points/';

    interface IWeather {
        name: string,
        temp: number,
        windSpeed: number,
        forecast: string,
        detailedForecast: string
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
            return '';
        }
    }

    async function findLongAndLat(search: string): Promise<Array<number>> {
        try {
            const data = await axios.get(baseLocURL + encodeURIComponent(search).replace(/%20/g, "+") + locFormatDetails);
            return [data.data[0].lat, data.data[0].lon];
        }

        catch (error) {
            return [];
        }
    }

    return (
        <div>
            <input className="outline outline-black" value={search} onChange={e => setSearch(e.target.value)} />
            <button className="text-xl" onClick={() => {
                findLongAndLat(search).then((data) => {
                    setCurrentLoc(data);
                    return findWeatherConditionData(data.toString());
                }).then((response) => {
                    return findWeatherConditions(response.properties.forecast);
                }).then((data) => { console.log(data[0]) });
            }}> Search </button>

            <h1> Current Lat: {currentLoc[0]} </h1>
            <h1> Current Long: {currentLoc[1]} </h1>
        </div>
    )
}
