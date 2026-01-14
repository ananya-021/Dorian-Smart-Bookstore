import React from 'react'
import './Login.css'
import Navbar from '../../components/Navbar/Navbar.jsx'

const Login = () => {
  return (
    <div className="login-page">
      <Navbar />

      <div className="login-container">
        <h1>Welcome Back</h1>
        <p className="subtitle">Your stories are waiting for you</p>

        <form className="login-form">
          <input type="email" placeholder="Email address" />
          <input type="password" placeholder="Password" />

          <button type="submit">Enter Dorian</button>
        </form>

        <p className="signup-text">
          New to Dorian? <span>Create an account</span>
        </p>
      </div>
    </div>
  )
}

export default Login
