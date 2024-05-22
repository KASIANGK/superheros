import React from 'react';
import '../../style/Navbar.css'
import { Link, useLocation } from "react-router-dom";
import logo from '../../assets/Logo.png'




function Navbar() {

    const location = useLocation()

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="logo-container">
          <Link to='/'>
              <img src={logo} alt="Logo" />
          </Link>
        </div>
        <div className="navbar-content">
          <ul className="nav-links">
            <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to='/'>HOME</Link>
            </li>
            <li className={location.pathname === '/teams' ? 'active' : ''}>
            <Link to='/teams'>TEAMS</Link>
            </li>
            <li className={location.pathname === '/players' ? 'active' : ''}>
            <Link to='/players'>PLAYERS</Link>
            </li>

            {/* <li className={location.pathname === '/login' ? 'active' : ''}>
              {loggedInUser ? (
                <>
                  <span>Welcome</span>
                  <Link to="/"><button onClick={handleLogout}>LOG OUT</button></Link>
                </>
              ) : (
                <Link to="/login">LOG IN</Link>
              )}
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Navbar