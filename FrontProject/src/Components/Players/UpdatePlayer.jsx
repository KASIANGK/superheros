import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../General/Navbar';
import '../../style/UpdatePlayer.css';

export default function UpdatePlayer() {
  const { playerId } = useParams();
  const [formPlayer, setFormPlayer] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    country_of_origin: '',
    role: '',
    team: null, 
    image: null,
  });
  const [message, setMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchPlayerDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/players/${playerId}`);
        setFormPlayer(response.data.data);
        console.log(response.data + 'result player');
      } catch (error) {
        console.error('Error fetching player data:', error);
      }
    };

    fetchPlayerDetails();
  }, [playerId]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/roles');
        setRoles(response.data.data.roles);
        console.log(response.data + 'result role');
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/teams');
        setTeams(response.data.data.teams);
        console.log(response.data + 'result team');
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormPlayer({
      ...formPlayer,
      [name]: type === 'file' ? files[0] : (value === 'none' ? null : value), 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in formPlayer) {
      if (key === 'team' && formPlayer[key] === null) {
        formData.append(key, ''); 
      } else {
        formData.append(key, formPlayer[key]);
      }
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/players/update/${playerId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMessage('Player updated successfully');
      console.log('Player updated:', response.data);
    } catch (error) {
      console.error('Error updating player:', error);
      setMessage('Oops, try again');
    }
  };

  return (
    <div className='update'>
      <Navbar />
      {/* <h1>EDIT {formPlayer ? formPlayer.first_name : ''} {formPlayer ? formPlayer.last_name : ''}</h1> */}
      <div className='form-container'>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            value={formPlayer.first_name}
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="last_name"
            value={formPlayer.last_name}
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            value={formPlayer.age}
            placeholder="Age"
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            value={formPlayer.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <input
            type="text"
            name="country_of_origin"
            value={formPlayer.country_of_origin}
            placeholder="Country of Origin"
            onChange={handleChange}
            required
          />
          <select 
            name="role"
            value={formPlayer.role}
            onChange={handleChange}
            required
          >
            <option value="">SELECT A ROLE</option>
            {Array.isArray(roles) && roles.length > 0 ? (
              roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))
            ) : (
              <option value="">ANY ROLE</option>
            )}
          </select>
          <select
            name="team"
            value={formPlayer.team || ''} 
            onChange={handleChange}
          >
            <option value="">SELECT A TEAM (optional)</option>
            <option value="none">No team</option>  
            {Array.isArray(teams) && teams.length > 0 ? (
              teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))
            ) : (
              <option value="">ANY TEAM</option>
            )}
          </select>
          <label htmlFor="image">Image:</label>
          <input type="file" name="image" onChange={handleChange} />
          <button type="submit">SAVE</button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
}

