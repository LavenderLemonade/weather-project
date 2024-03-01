import React from 'react'
import { useState } from 'react'
import axios from 'axios'


export default function SearchLocation() {

    const [search, setSearch] = useState('');
    const [currentLoc, setCurrentLoc] = useState<Array<number>>([])

    let baseLocURL = 'https://nominatim.openstreetmap.org/search?q=';
    let locFormatDetails = "&format=json&addressdetails=1";


    function getLocationData(searchQuery: string) {
        axios.get(baseLocURL + encodeURIComponent(searchQuery).replace(/%20/g, "+") + locFormatDetails).then((response) => {
            let newLoc: number[] = [response.data[0].lat, response.data[0].lon];
            setCurrentLoc(newLoc);
        })
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
