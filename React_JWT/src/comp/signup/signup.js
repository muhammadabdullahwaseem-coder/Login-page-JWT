import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
     
      const response = await fetch('https://login-page-jwt.onrender.com/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created! Please log in.");
        navigate('/login');
      } else {
        alert("Signup failed: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong connecting to the server.");
    }
  };

  return (
    <Form className="auth-form" onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <span>use your email for registration</span>
      
      <Form.Control 
        type="text" placeholder="Name" name='name' 
        value={formData.name} onChange={handleChange} className="mb-3" style={{color: 'black'}}
      />
      <Form.Control 
        type="email" placeholder="Email" name='email' 
        value={formData.email} onChange={handleChange} className="mb-3" style={{color: 'black'}}
      />
      <Form.Control 
        type="password" placeholder="Password" name='password' 
        value={formData.password} onChange={handleChange} className="mb-3" style={{color: 'black'}}
      />
      
      <Button type="submit" variant="primary">Sign Up</Button>
    </Form>
  );
}

export default Signup;