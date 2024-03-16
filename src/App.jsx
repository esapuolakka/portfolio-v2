import './App.css';
import React from 'react';
import Bookstore from './Bookstore/Bookstore';
import SignUp from './Bookstore/Signup';
import LogIn from './Bookstore/Login';
import Homepage from './Homepage/Homepage';
import MovieTheater from './MovieTheater/MovieTheater';
import { AuthProvider } from './Contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoutes from './ProtectedRoutes';

export default function App() {

  return (
    <div className='app'>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Homepage/>}/>
            <Route path='/signup' element={<SignUp/>} />
            <Route path='/login' element={<LogIn/>} />
            <Route path='/bookstore' element={
              <ProtectedRoutes>
                <Bookstore />
              </ProtectedRoutes>} />
            <Route path="/movietheater" element={<MovieTheater />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  )
}