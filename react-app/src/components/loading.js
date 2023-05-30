import React from 'react';
import "./loading.css";
export default function Loading () {
    console.log("Im loading!");
    const messages = [
"Discord was almost called Bonfire before we picked our name. It was meant to be nice and cozy.",
"Our logo's name is Clyde.",
"Discord started as a game company making a mobile game called Fates Forever.",
"Discord’s official birthday is May 13, 2015.",
    ]
    const randomIndex = Math.floor(Math.random() * messages.length);
    const message = messages[randomIndex];
    return (
        <div className="loading">
            <img id="discord-svg" width="70" height="70" src="https://img.icons8.com/ios-filled/50/FFFFFF/discord-logo.png" alt="discord-logo"/>
            <p>{message}</p>
        </div>
    )
}
