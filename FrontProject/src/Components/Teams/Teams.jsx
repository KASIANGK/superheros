import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../General/Navbar';
import '../../style/Teams.css';

const Teams = () => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/teams')
            .then((response) => {
                setTeams(response.data.data.teams);
            })
            .catch((error) => {
                console.error('Oops, error fetching teams:', error);
            });
    }, []);

    const handleDelete = async (teamId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/teams/delete/${teamId}`);
            setTeams(teams.filter(team => team.id !== teamId));
        } catch (error) {
            console.error('Error deleting team:', error);
        }
    };

    const getColorByTeam = (teamId) => {
        switch (teamId) {
            case 538:
                return 'hsl(240, 44%, 36%)'; 
            case 539:
                return 'hsl(133, 42%, 27%)';
            case 540:
                return 'hsl(54, 46%, 31%)';
            case 544:
                return 'hsl(0, 58%, 46%)'; 
            default:
                return 'hsl(240, 67%, 8%)'; 
        }
    };

    return (
        <div className='teamsall'>
            <div className='teams'>
                <Navbar />
                <h1 className='titlee play-bold'>TEAMS</h1>
                {Array.isArray(teams) && teams.length > 0 ? (
                    <div className="row">
                        {teams.map((team) => (
                            <div className="col-md-4 col-sm-6 col-xs-12" key={team.id}>
                                <div className="card">
                                    <div 
                                        className="cover" 
                                        style={{ 
                                            backgroundImage: `url(http://127.0.0.1:8000${team.image})`, 
                                            borderColor: getColorByTeam(team.id) 
                                        }}
                                    >
                                        <h1>{team.name}</h1>
                                        <div className="card-back">
                                            <button onClick={() => handleDelete(team.id)}>❌</button>
                                            <Link to={`/teams/${team.id}`}>👀</Link>                                        
                                            <Link to={`/teams/update/${team.id}`}>⚙️</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>NO TEAMS</p>
                )}
                <Link to="/teams/create"><button>CREATE TEAM</button></Link>
            </div>
        </div>
    );
};

export default Teams;
