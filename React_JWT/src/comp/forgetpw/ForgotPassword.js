import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reset link sent!");
    navigate('/login');
  };

  return (
    <div className="auth-body">
  
      <div className="circle circle-1"></div>
      <div className="circle circle-2"></div>


      <div className="glass-card">
        <h1 style={{color: '#333', marginBottom: '10px'}}>Recover Password</h1>
        <p style={{color: '#666', marginBottom: '30px'}}>
          Enter your email and we'll send you a link to reset your password.
        </p>
<div class="container">
  <div class="bg-box">
    Your centered text here!
  </div>
</div>
        <Form onSubmit={handleSubmit} style={{width: '100%'}}>
          <Form.Group className="mb-4">
            <Form.Control 
              type="email" 
              placeholder="Enter your email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control" 
            />
          </Form.Group>

          <Button type="submit" className="btn-primary" style={{width: '100%'}}>
            Send Reset Link
          </Button>
        </Form>

        <div style={{marginTop: '20px'}}>
          <Link to="/login" style={{color: '#333', fontWeight: 'bold'}}>
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;