import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';

const TestData = () => {

    const [roles, setRoles] = useState([])
    const [continents, setContinents] = useState([])
    const [teams, setTeams] = useState([])
    const [selectedTeamPlayers, setSelectedTeamPlayers] = useState([])


    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/roles') 
        .then((response) => {
          setRoles(response.data.data.roles)
        })
        .catch((error) => {
          console.error('ooops error fetchin roles', error);
        })
    }, [])

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/continents') 
        .then((response) => {
          setContinents(response.data.data.continents)
        })
        .catch((error) => {
          console.error('ooops error fetchin continents', error);
        })
    }, [])

    useEffect(() => {
      axios.get('http://127.0.0.1:8000/api/teams') 
        .then((response) => {
          setTeams(response.data.data.teams)
        })
        .catch((error) => {
          console.error('ooops error fetchin teams', error);
        })
    }, [])


    const handleTeamPlayer = async (teamId) => {
      try {
          const response = await axios.get(`http://127.0.0.1:8000/api/teams/${teamId}/players`);
          setSelectedTeamPlayers(response.data.data.players)
      } catch (error) {
          console.error('ooops error fetching team players', error);
          setSelectedTeamPlayers([])
      }
  };

  return (
    <div>
        <div className='title'>
            <h1> API ROLES </h1>
        </div>
        <div>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(roles) && roles.length > 0 ? (
                    roles.map((role) => (
                    <tr key={role.id}>
                        <td>{role.id}</td>
                        <td>{role.name}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="3">LOADING...</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>


        <div className='title'>
            <h1> API CONTINENTS </h1>
        </div>
        <div>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>COUNTRIES</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(continents) && continents.length > 0 ? (
                    continents.map((continent) => (
                    <tr key={continent.id}>
                        <td>{continent.id}</td>
                        <td>{continent.name}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="3">LOADING...</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>


        <div className='title'>
            <h1> API TEAMS </h1>
        </div>
        <div>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>CITY</th>
                    <th>COUNTRY</th>
                    <th>CONTINENT</th>
                </tr>
                </thead>
                <tbody>
                {Array.isArray(teams) && teams.length > 0 ? (
                    teams.map((team) => (
                    <tr key={team.id}>
                        <td>{team.id}</td>
                        <td>{team.name}</td>
                        <td>{team.city}</td>
                        <td>{team.country}</td>
                        <td>{team.continent}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="3">LOADING...</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>

    
        

    </div>
  )
}

export default TestData







