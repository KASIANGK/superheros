import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from 'axios';


// COMPONENTS

import App from './App';
// import TestData from './Components/General/TestData'
import Home from './Components/General/Home'
import Navbar from './Components/General/Navbar';

import CreatePlayer from './Components/Players/CreatePlayer'
import Players from './Components/Players/Players';
import PlayerDetails from './Components/Players/PlayerDetails';
import UpdatePlayer from './Components/Players/UpdatePlayer';

import CreateTeam from './Components/Teams/CreateTeam';
import Teams from './Components/Teams/Teams';
import TeamPlayers from './Components/Teams/TeamPlayers';
import UpdateTeam from './Components/Teams/UpdateTeam';
import TeamDetails from './Components/Teams/TeamDetails';





export default function Main() {

  useEffect(() => {
    axios
      .get("")
      .then((res) => {
        setColors(res.data.data.colors);
        setCars(res.data.data.cars);
      })
      .catch((error) => console.log(error));
  }, []);


  const router = createBrowserRouter([
    {
      path: '/',
      element: <App />,
    },
    // {
    //   path: '/testdata',
    //   element: <TestData />,
    // },
    {
      path: '/teams',
      element: <Teams />,
    },
    {
      path: '/team/:teamId/players',
      element: <TeamPlayers />,
    },
    {
      path: '/players/:playerId',
      element: <PlayerDetails />,
    },
    {
      path: '/players/create',
      element: <CreatePlayer />,
    },
    {
      path: '/players',
      element: <Players />,
    },
    {
      path: '/teams/create',
      element: <CreateTeam />,
    },
    {
      path: '/teams/update/:teamId',
      element: <UpdateTeam />,
    },
    {
      path: '/home',
      element: <Home />,
    },
    {
      path: '/players/update/:playerId',
      element: <UpdatePlayer />,
    },
    {
      path: '/navbar',
      element: <Navbar />,
    },
    {
      path: '/teams/:teamId',
      element: <TeamDetails />,
    },
  ]);

  return <RouterProvider router={router} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);

