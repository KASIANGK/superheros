import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../General/Navbar';
import '../../style/TeamDetails.css'; 

const TeamDetails = () => {
    const [team, setTeam] = useState(null);
    const { teamId } = useParams();

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/teams/${teamId}/`)
            .then(response => {
                setTeam(response.data.data);
                console.error('great');
            })
            .catch(error => {
                console.error('Error fetching player details:', error);
            });
    }, [teamId]);

    const mapRoleNumberToName = (roleNumber) => {
        const roleMap = {
            234: 'Leader',
            235: 'Wizard',
            236: 'Archer',
            237: 'Fighter'
        };
        return roleMap[roleNumber] || 'Unknown';
    };

    return (
        <div className="team-details-container">
            <Navbar />
            <div className='twoParts'>
                <div className='partOne'>
                    {team ? (
                        <div className="team-details">
                            <img src={`http://127.0.0.1:8000${team.image}`} alt={team.name} />
                            <div className="team-details-content">
                                <h1>{team.name}</h1>
                                <p>CITY: {team.city}</p>
                                <p>COUNTRY: {team.country}</p>
                                <p>PLAYERS: {team.max_players}</p>
                                <div className="team-details-buttons">
                                    <Link to="/teams/create"><button>CREATE TEAM</button></Link>
                                    <Link to={`/teams/update/${team.id}`}><button>UPDATE</button></Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p>LOADING...</p>
                    )}
                </div>
                <div className="team-players-container">
                    <h1 className='titlePlay play-bold'>PLAYERS</h1>
                    <div className="team-players">
                        {team && team.players.map(player => (
                            <div key={player.id} className="team-player">
                                <div className='imageT'>
                                    <img src={`http://127.0.0.1:8000${player.image}`} alt={player.first_name} />
                                </div>
                                <div className='detailsT'>
                                    <h2>{player.first_name} {player.last_name}</h2>
                                    <p>AGE: {player.age}</p>
                                    <p>GENDER: {player.gender}</p>
                                    <p>ROLE: {mapRoleNumberToName(player.role)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeamDetails;



