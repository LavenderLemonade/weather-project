import React from 'react'
import { useState } from 'react'
import axios from 'axios'


export default function SearchLocation() {
    return (
        <div>
            <input className="outline outline-black" />
            <button className="text-xl"> Search </button>
        </div>
    )
}
