import React from 'react'
import { useState } from 'react'
import axios from 'axios'


export default function SearchLocation() {

    const [search, setSearch] = useState('');
    const [currentLoc, setCurrentLoc] = useState<Array<number>>([])
    const [currentForecast, setCurrentForecast] = useState('');

    let baseLocURL = 'https://nominatim.openstreetmap.org/search?q=';
    let locFormatDetails = "&format=json&addressdetails=1";
    let baseWeatherURL = 'https://api.weather.gov/points/';

    async function getCurrentWeather(location: string) {
        console.log(encodeURIComponent(location));
        await axios.get(baseWeatherURL + encodeURIComponent(location).replace(/%20/g, ",")).then((response) => {
            setCurrentForecast(response.data.properties.forecast);
        }).then(
            () => axios.get(currentForecast).then((response) => {
                console.log(response.data.properties.periods);
            })
        )


    }

    async function getLocationData(searchQuery: string) {
        const data = await axios.get(baseLocURL + encodeURIComponent(searchQuery).replace(/%20/g, "+") + locFormatDetails).then((response) => {
            let newLoc: number[] = [response.data[0].lat, response.data[0].lon];
            if (newLoc != null) {
                setCurrentLoc(newLoc);
                getCurrentWeather(currentLoc.toString());
            }

        })
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
            <button className="text-xl" onClick={() => { findLongAndLat(search).then((data) => { setCurrentLoc(data); }) }}> Search </button>

            <h1> Current Lat: {currentLoc[0]} </h1>
            <h1> Current Long: {currentLoc[1]} </h1>
        </div>
    )
}
