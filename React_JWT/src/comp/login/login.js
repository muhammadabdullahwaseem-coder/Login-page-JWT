import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../config';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
   
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); 
        navigate('/dashboard');
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Are you sure the backend is running?");
    }
  };

  return (
    <Form className="auth-form" onSubmit={handleSubmit}>
      <h1>Sign in</h1>
      <span>use your account</span>
      
      <Form.Control 
        type="email" placeholder="Email" name='email' 
        value={formData.email} onChange={handleChange} className="mb-3" style={{color: 'black'}}
      />
      <Form.Control 
        type="password" placeholder="Password" name='password' 
        value={formData.password} onChange={handleChange} className="mb-3" style={{color: 'black'}}
      />
      
      <Link 
        to="/forgot-password" 
        style={{ fontSize: '12px', marginBottom: '15px', display: 'block', color: '#0076f4' }}
      >
        Forgot your password?
      </Link>
      <Button type="submit" variant="primary">Sign In</Button>
    </Form>
  );
}

export default Login;