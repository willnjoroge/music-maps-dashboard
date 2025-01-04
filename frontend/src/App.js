import './App.css';
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Game from './components/Game'

const App = () => {
  console.log('testing')
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/game" element={<Game />}/>
      </Routes>
    </Router>
  )
}

const Login = () => {
  console.log('login')
  return (
  <div>
    <h1>Music Guessing Game</h1>
    <a href="/game">
      <button disabled>Guess today's songy</button>
    </a>
    <a href="http://localhost:5000/login">
      <button disabled>Login with Spotify</button>
    </a>
  </div>
  )
}


export default App;
