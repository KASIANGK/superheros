import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../General/Navbar';
import '../../style/PlayerDetails.css';

const PlayerDetails = () => {
    const [player, setPlayer] = useState(null);
    const { playerId } = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/players/${playerId}/`)
            .then(response => {
                setPlayer(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching player details:', error);
            });
    }, [playerId]);

    return (
        <div className="player-details-container">
            <Navbar />
            {player ? (
                <div className="player-details">
                    <div className="player-details-content">
                        <h1  className='play-bold'>{player.first_name} {player.last_name}</h1>
                        <p>AGE: {player.age}</p>
                        <p>GENDER: {player.gender}</p>
                        <p>COUNTRY OF ORIGIN: {player.country_of_origin}</p>
                        <p>ROLE: {player.role}</p>
                        <p>TEAM: {player.team}</p>
                        <div className="player-details-buttons">
                            <Link to="/players/create"><button>Add player</button></Link>
                            <Link to={`/players/update/${player.id}`}><button>Update</button></Link>
                        </div>
                    </div>
                    <div className="player-details-img">
                        <img src={`http://127.0.0.1:8000${player.image}`} alt={player.name} />
                    </div>
                </div>
            ) : (
                <p>LOADING...</p>
            )}
        </div>
    );
};

export default PlayerDetails;
