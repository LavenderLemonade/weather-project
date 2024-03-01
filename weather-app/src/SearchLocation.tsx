import React from 'react'
import { useState } from 'react'
import axios from 'axios'


export default function SearchLocation() {

    const [search, setSearch] = useState('');
    const [currentLoc, setCurrentLoc] = useState<Array<number>>([])
    const [currentForecastInfo, setCurrentForecastInfo] = useState('');


    let baseLocURL = 'https://nominatim.openstreetmap.org/search?q=';
    let locFormatDetails = "&format=json&addressdetails=1";
    let baseWeatherURL = 'https://api.weather.gov/points/';

    class forecastInfo {
        Name: string;
        Temp: number;
        Description: string;
        Speed: number;
        DetailedForecast: string;

        constructor(name: string, temp: number, desc: string, speed: number, details: string) {
            this.Name = name;
            this.Temp = temp;
            this.Description = desc;
            this.Speed = speed;
            this.DetailedForecast = details;
        }
    }

    class ForecastFactory {
        createForecast(props: any) {
            return new forecastInfo(props.name, props.temperature, props.shortForecast, props.windSpeed, props.detailedForecast);
        }
    }

    const factory = new ForecastFactory();

    const [forecastToday, setForecastToday] = useState<Array<forecastInfo>>([]);


    function getCurrentWeather(location: string) {
        console.log(encodeURIComponent(location));
        axios.get(baseWeatherURL + encodeURIComponent(location).replace(/%20/g, ",")).then((response) => {
            setCurrentForecastInfo(response.data.properties.forecast);
        }).then(
            () => axios.get(currentForecastInfo).then((response) => {
                console.log(response.data.properties.periods);
                for (let i = 0; i < 2; i++) {
                    setForecastToday(forecastToday => [...forecastToday, factory.createForecast({
                        name: response.data.properties.periods[i].name,
                        temperature: response.data.properties.periods[i].temperature,
                        shortForecast: response.data.properties.periods[i].shortForecast,
                        windSpeed: response.data.properties.periods[i].windSpeed,
                        detailedForecast: response.data.properties.periods[i].detailedForecast
                    })]);
                }

                console.log(forecastToday);
            })
        )


    }

    function getLocationData(searchQuery: string) {
        axios.get(baseLocURL + encodeURIComponent(searchQuery).replace(/%20/g, "+") + locFormatDetails).then((response) => {
            let newLoc: number[] = [response.data[0].lat, response.data[0].lon];
            setCurrentLoc(newLoc);
        })

        getCurrentWeather(currentLoc.toString());
    }

    return (
        <div>
            <input className="outline outline-black" value={search} onChange={e => setSearch(e.target.value)} />
            <button className="text-xl" onClick={() => { getLocationData(search) }}> Search </button>

            <h1> Current Lat: {currentLoc[0]} </h1>
            <h1> Current Long: {currentLoc[1]} </h1>
        </div>
    )
}
