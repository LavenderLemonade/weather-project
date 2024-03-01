import React from 'react'
import { useState } from 'react'
import axios from 'axios'


export default function SearchLocation() {

    const [search, setSearch] = useState('');

    class LocationInfo {

        Lat: number;
        Long: number;

        constructor(lat: number, long: number) {
            this.Lat = lat;
            this.Long = long;
        }
    }

    return (
        <div>
            <input className="outline outline-black" value={search} />
            <button className="text-xl"> Search </button>
        </div>
    )
}
