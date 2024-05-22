import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../General/Navbar';
import '../../style/CreateTeam.css';

function CreateTeam({ onTeamCreate }) {
  
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    max_players: '',
    continent: '', 
  })
  const [message, setMessage] = useState('')
  const [continents, setContinents] = useState([])

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/continents')
      .then((response) => {
        setContinents(response.data.data.continents)
      })
      .catch((error) => {
        console.error('Error fetching continents:', error);
      })
  }, [])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'file' ? files[0] : value 
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      for (const key in formData) {
        formDataObj.append(key, formData[key]);
      }
      const response = await axios.post('http://127.0.0.1:8000/api/teams/create', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.Success)
      setFormData({
        name: '',
        city: '',
        country: '',
        max_players: '',
        continent: '',
        image: null,
      });
      if (onTeamCreate) {
        onTeamCreate();
      }
    } catch (error) {
      console.error('Error creating team:', error);
      console.log('Response:', error.response.data);
      setMessage('Oops, ensure that there are a max of 7 players per team');
    }
  };
  
  return (
    <div>
      <Navbar />
      {/* <div className='msg'>
        {message && <p>{message}</p>}
      </div> */}
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>CREATE TEAM</h2>
          <label>NAME :</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          <label>CITY :</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          <label>COUNTRY :</label>
          <input type="text" name="country" value={formData.country} onChange={handleChange} required />
          <label>MAX PLAYERS:</label>
          <input type="number" name="max_players" value={formData.max_players} onChange={handleChange} required />
          <label htmlFor="image">Image :</label>
          <input type="file" name="image" className="urlInput" onChange={handleChange} />
          <label>CONTINENT:</label>
          <select name="continent" value={formData.continent} onChange={handleChange} required>
            <option value="">Select a continent</option>
            {Array.isArray(continents) && continents.length > 0 ? (
              continents.map(continent => (
                <option key={continent.id} value={continent.id}>{continent.name}</option>
              ))
            ) : (
              <option value="">ANY CONTINENT</option>
            )}
          </select>
          <button type="submit">SAVE</button>
        </form>
        
      </div>
      <div className='msg'>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}

export default CreateTeam



