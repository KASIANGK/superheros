import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Components/General/Navbar';
import './style/Home.css';
// import bg from '../src/assets/bg.mp4'

const App = () => {
    const [data, setData] = useState({
        teams_full: [],
        teams_not_full: [],
        players_without_team: [],
        players_with_team: [],
        europe_teams: [],
        non_europe_teams: [],
        female_players_with_team: [],
        male_players_with_team: []
    });

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/home')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.error('Oops, error fetching data', error);
            });
    }, []);

    const renderSection = (title, items, isPlayer = false) => (
        <section className="ag-courses_item">
            <div className="ag-courses-item_link">
                <div className="ag-courses-item_bg"></div>
                <div className="ag-courses-item_title">{title}</div>
                <div className="ag-courses-item_content">
                    {items.length > 0 ? (
                        items.map(item => (
                            <div key={item.id}>
                                {isPlayer ? (
                                    <Link to={`/players/${item.id}`}>
                                        <div className='content-sections'>
                                            <p className='boutonsH'>{item.first_name}</p>
                                        </div>
                                    </Link>
                                ) : (
                                    <Link to={`/teams`}>
                                        <p>{item.name}</p>
                                    </Link>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No {isPlayer ? 'Players' : 'Teams'}</p>
                    )}
                </div>
            </div>
        </section>
    );

    return (
        <div className='home'>
            <Navbar />
            <div className='ag-format-container'>
                <div className='ag-courses_box '>
                    {renderSection('COMPLETE TEAM(S)', data.teams_full)}
                    {renderSection('UNDERSTAFFED TEAM(S)', data.teams_not_full)}
                    {renderSection('4 PLAYERS WITHOUT TEAM', data.players_without_team, true)}
                    {renderSection('4 PLAYERS WITH TEAM', data.players_with_team, true)}
                    {renderSection('TEAM(S) FROM EUROPE', data.europe_teams)}
                    {renderSection('TEAM(S) OUTSIDE EUROPE', data.non_europe_teams)}
                    {renderSection('5 GIRLS PLAYERS WITH TEAM', data.female_players_with_team, true)}
                    {renderSection('5 BOYS PLAYERS WITH TEAM', data.male_players_with_team, true)}
                </div>
            </div>
        </div>
    );
};

export default App;
