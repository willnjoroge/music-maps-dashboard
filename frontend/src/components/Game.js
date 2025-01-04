import React, { useState, useEffect } from 'react';

const Game = () => {
    const [track, setTrack] = useState(null)

    // useEffect(() => {
    //     fetch('http://localhost:5000/random-track', {
    //         headers: { Authorization: `Bearer ${localStorage.getItem('spotifyToken')}`}
    //     })
    //     .then((res) => res.json())
    //     .then((data) => setTrack(data))
    // }, [])

    useEffect(() => {
        fetch('http://localhost:5000/today-track')
        .then((res) => res.json())
        .then((data) => setTrack(data))
    }, [])


    if (!track) return <p>Loading....</p>

    return (
        <div>
            <h2>Guess the Song</h2>
            <audio controls src={track.snippet}></audio>
            <div>
                {/* <button>{track.artists[0]}</button>
                <button>Other Artist</button> */}
            </div>
        </div>
    )
}

export default Game