import React, { Component } from 'react';
import { Navigate, withRouter } from 'react-router-dom';

export default class SignUp extends Component {
  
    constructor(props) {
      super(props);
  
      this.state = {
        name: '',
        surname: '',
        patronymic: '',
        username: '',
        role: '',
        email: '',
        password: '',
        successMessage: '',
        errorMessage: '',
      };
    }
  
    handleInputChange = (event) => {
      this.setState({ [event.target.name]: event.target.value });
    };
  
    handleSubmit = async (event) => {
      event.preventDefault();
  
      const { name, surname, patronymic, username, role, email, password } = this.state;
  
      // Password validation: minimum length of 8 characters
      if (password.length < 8) {
        this.setState({
          successMessage: '',
          errorMessage: 'Password must be at least 8 characters long.',
        });
        return;
      }
  
      // Email validation: using a simple regular expression for basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.setState({
          successMessage: '',
          errorMessage: 'Invalid email format.',
        });
        return;
      }
  
      try {
        const response = await fetch('https://localhost:7051/api/User/CreateUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            surname,
            role,
            email,
            password,
          }),
        });
  
        if (response.ok) {
          // Registration successful
          this.setState({
            successMessage: 'Registration successful. Redirecting to login...',
            errorMessage: '',
          });
  
        } else {
          // Registration failed
          this.setState({
            successMessage: '',
            errorMessage: 'Registration failed. Please try again.',
          });
        }
      } catch (error) {
        console.error('Error during signup:', error);
        this.setState({
          successMessage: '',
          errorMessage: 'Error during registration. Please try again.',
        });
      }
    };
  
    render() {
      const { name, surname, patronymic, username, role, email, password, successMessage, errorMessage } = this.state;
      if (successMessage === 'Registration successful. Redirecting to login...') {
        // Set a timeout to trigger the navigation after 2 seconds (adjust as needed)
        setTimeout(() => {
          // Use this.props.history.push for programmatic navigation
          //this.props.history.push("/log-in-form");
          //window.location.reload();
        }, 2000);
        // Note: The Navigate component is not used in this case
      }

      return (
        <form onSubmit={this.handleSubmit}>
          <h3>Sign Up</h3>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            name="name"
            value={name}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Surname</label>
          <input
            type="text"
            className="form-control"
            placeholder="Surname"
            name="surname"
            value={surname}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-control"
            name="role"
            value={role}
            onChange={this.handleInputChange}
          >
            <option value="">Select Role</option>
            <option value="Client">Client</option>
            {/* <option value="Admin">Admin</option> */}
          </select>
        </div>
        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            name="email"
            value={email}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            name="password"
            value={password}
            onChange={this.handleInputChange}
            required
          />
        </div>
        {this.state.errorMessage && (
          <div className="alert alert-danger">{this.state.errorMessage}</div>
        )}
        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/log-in-form">Log in?</a>
        </p>
      </form>
    );
  }
}
