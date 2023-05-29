import React from 'react';
import "./loading.css";
export default function Loading () {
    console.log("Im loading!");
    return (
        <div className="loading">
            <img id="discord-svg" width="70" height="70" src="https://img.icons8.com/ios-filled/50/FFFFFF/discord-logo.png" alt="discord-logo"/>
            <p>Discord was almost called Bonfire before we picked our name. It was meant to be nice and cozy.</p>
        </div>
    )
}
