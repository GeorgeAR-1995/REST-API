import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import Admin from './Admin';
import Home from './Home';


function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar should be visible on all pages */}
        <Navbar />

        {/* Define Routes for Home and Admin */}
        <Routes>
          {/* Route for the Home page */}
          <Route path="/" element={<Home />} />

          {/* Route for the Admin page */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
};


export default App;
