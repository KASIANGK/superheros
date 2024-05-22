import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../General/Navbar';

const TeamPlayers = () => {

  const [teamPlayers, setTeamPlayers] = useState([])
  const { teamId } = useParams()

  useEffect(() => {
    const fetchTeamPlayers = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/team/${teamId}/players`)
        const players = JSON.parse(response.data.players); // conversion donnees en objets 
        setTeamPlayers(players)
      } catch (error) {
        console.error('Error fetching team players:', error)
        setTeamPlayers([])
      }
    }
    fetchTeamPlayers()
  }, [teamId])



  const handlePlayerChoice = (playerId) => {
    window.location.href = `/players/${playerId}`
  }


  return (
    <div>
      <Navbar />
      <h1> TEAM'S PLAYERS - {teamId}</h1>
      <ul>
        {Array.isArray(teamPlayers) && teamPlayers.length > 0 ? (
          teamPlayers.map((player) => (
            <div key={player.pk}>
              <p onClick={() => handlePlayerChoice(player.pk)}> {player.fields.first_name} {player.fields.last_name}</p> 
            </div>
          ))
        ) : (
          <li>NO PLAYERS</li>
        )}
      </ul>
    </div>
  )
}


export default TeamPlayers
