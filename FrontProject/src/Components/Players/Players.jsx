import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../General/Navbar';
import '../../style/Players.css';

const Players = () => {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/players')
            .then((response) => {
                setPlayers(response.data.data.players);
            })
            .catch((error) => {
                console.error('Oops, error fetching players:', error);
            });
    }, []);

    const handleDelete = async (playerId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/players/delete/${playerId}`);
            setPlayers(players.filter(player => player.id !== playerId));
        } catch (error) {
            console.error('Error deleting Player:', error);
        }
    };

    const mapRoleNumberToName = (roleNumber) => {
        const roleMap = {
            310: 'Leader',
            311: 'Wizard',
            312: 'Archer',
            313: 'Fighter'
        };

        return roleMap[roleNumber] || 'Unknown'; 
    };

    const getColorByTeam = (teamId) => {
        switch (teamId) {
            case 526:
                return 'hsl(240, 44%, 36%)'; 
            case 527:
                return 'hsl(133, 42%, 27%)';
            case 528:
                return 'hsl(54, 46%, 31%)';
            case 529:
                return 'hsl(0, 58%, 46%)'; 
            default:
                return 'hsl(240, 67%, 8%)'; 
        }
    };

    return (
        <div className='playersall'>
            <div className='players'>
                <Navbar />
                <h1 className='titlee play-bold'>PLAYERS</h1>
                {Array.isArray(players) && players.length > 0 ? (
                    <div className="row">
                        {players.map((player) => (
                            <div className="col-md-4 col-sm-6 col-xs-12" key={player.id}>
                                <div className="card">
                                    <div 
                                        className="cover" 
                                        style={{ 
                                            backgroundImage: `url(http://127.0.0.1:8000${player.image})`, 
                                            borderColor: getColorByTeam(player.team_id) 
                                        }}
                                    >
                                        <h1>{player.first_name} {player.last_name}</h1>
                                        <span className="price">{mapRoleNumberToName(player.role)}</span>
                                        <div className="card-back">                                   
                                            <button onClick={() => handleDelete(player.id)}>❌</button>
                                            <Link to={`/players/${player.id}`}>👀</Link>                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>NO PLAYERS</p>
                )}
                <Link to="/players/create"><button>CREATE PLAYER</button></Link>
            </div>
        </div>
    )
}

export default Players;

