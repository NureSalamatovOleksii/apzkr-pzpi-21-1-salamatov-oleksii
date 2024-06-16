import React, { Component } from 'react';
import { Layout } from '../components/Layout';
import App from '../App';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { login } from '../services/authService';
import { handleInputChange } from '../utils/inputHandlers';

export default class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      buttonPressed: false,
      shouldRedirect: false,
    };
  }

  handleInputChange = (event) => {
    handleInputChange(this, event);
  };

  handleButtonPress = async (event) => {
    event.preventDefault();
    this.setState({ buttonPressed: true });

    const { email, password, rememberMe } = this.state;

    try {
      const data = await login(email, password, rememberMe);
      const accessToken = data.access_token;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('authorized', true);
      const decodedToken = jwtDecode(accessToken);
      localStorage.setItem('role', decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      localStorage.setItem('userId', decodedToken.sub);
      
      this.setState({ shouldRedirect: true });
      if (localStorage.getItem('role') === 'Admin') {
        window.location.href = "/data";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  render() {
    const { shouldRedirect } = this.state;

    if (shouldRedirect) {
      return null; // Or handle the redirection accordingly
    }

    return (
      <form>
        <h3>Log In</h3>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="mb-3">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
              name="rememberMe"
              checked={this.state.rememberMe}
              onChange={this.handleInputChange}
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={this.handleButtonPress}
          >
            Log In
          </button>
        </div>
      </form>
    );
  }
}
