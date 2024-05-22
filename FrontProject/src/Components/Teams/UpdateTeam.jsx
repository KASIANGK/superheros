import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../General/Navbar';

export default function UpdateTeam() {

  const { teamId } = useParams()
  const [formTeam, setFormTeam] = useState({
    name: '',
    city: '',
    country: '',
    max_players: '',
    continent: '',
    image: null,
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/teams/update/${teamId}`);
        setFormTeam(response.data)
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchTeamDetails()
  }, [teamId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormTeam({
      ...formTeam,
      [name]: type === 'file' ? files[0] : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in formTeam) {
      formData.append(key, formTeam[key]);
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/teams/update/${teamId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setMessage('Team ok');
      console.log('Team not ok:', response.data);
    } catch (error) {
      console.error('Error team:', error);
      setMessage('Error team')
    }
  }

  return (
    <div className='update'>
      <Navbar />
      <h1>EDIT {formTeam.name}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formTeam.name}
          placeholder="Team Name"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="city"
          value={formTeam.city}
          placeholder="City"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          value={formTeam.country}
          placeholder="Country"
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="max_players"
          value={formTeam.max_players}
          placeholder="Max Players"
          onChange={handleChange}
          required
        />
        {/* <select name="continent" value={formTeam.continent} onChange={handleChange} required>
        </select> */}
        <label htmlFor="image">Image:</label>
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">Save</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
