import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../General/Navbar';
import '../../style/CreatePlayer.css'

function CreatePlayer({ onPlayerCreate }) {

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    age: '',
    gender: '',
    country_of_origin: '',
    role: '',
    team: null,
    image: null,
  })
  const [message, setMessage] = useState('')
  const [roles, setRoles] = useState([])
  const [teams, setTeams] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/roles')
      .then((response) => {
        setRoles(response.data.data.roles)
      })
      .catch((error) => {
        console.error('Error fetching roles', error);
      })
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/teams')
      .then((response) => {
        setTeams(response.data.data.teams)
      })
      .catch((error) => {
        console.error('Error fetching teams', error);
      })
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'file' ? files[0] : value 
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      for (const key in formData) {
        if (key === 'team' && !formData[key]) {
          continue; 
        }
        formDataObj.append(key, formData[key]);
      }

      const response = await axios.post('http://127.0.0.1:8000/api/players/create', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Player created successfully')
      setFormData({
        first_name: '',
        last_name: '',
        age: '',
        gender: '',
        country_of_origin: '',
        role: '',
        team: null, 
        image: null, 
      })

      if (onPlayerCreate) {
        onPlayerCreate();
      }
    } catch (error) {
      console.error('Error creating player:', error);
      if (error.response) {
        console.log('Response:', error.response.data);  
        setMessage(`Error: ${JSON.stringify(error.response.data)}`)
      } else {
        setMessage("Oops, try again")
      }
    }
  };

  return (
    <div className='createP'>
      <Navbar />
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>CREATE PLAYER</h2>
          <label>FIRST NAME :</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
          <label>LAST NAME :</label>
          <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
          <label>AGE :</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
          <label>GENDER :</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">SELECT GENDER</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <label>COUNTRY OF ORIGIN:</label>
          <input type="text" name="country_of_origin" value={formData.country_of_origin} onChange={handleChange} required />
          <label>ROLE :</label>
          <select 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          required>
            <option value="">SELECT A ROLE</option>
            {Array.isArray(roles) && roles.length > 0 ? (
              roles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))
            ) : (
              <option value="">ANY ROLE</option>
            )}
          </select>
          <label htmlFor="image">IMAGE :</label>
          <input type="file" name="image" className="urlInput" onChange={handleChange} />
          <label>TEAM :</label>
          <select 
          name="team" 
          value={formData.team || ''} 
          onChange={handleChange}>
            <option value="">SELECT A TEAM (optional)</option>
            <option value="">Pas d'équipe</option>
            {Array.isArray(teams) && teams.length > 0 ? (
              teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))
            ) : (
              <option value="">ANY TEAM</option>
            )}
          </select>
          <button type="submit">SAVE</button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  )
}

export default CreatePlayer

