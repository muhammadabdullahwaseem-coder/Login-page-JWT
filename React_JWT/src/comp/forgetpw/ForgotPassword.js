import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { API_URL } from '../../config';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  

  const handleSendOtp = async (e) => {
    e.preventDefault();
    
const res = await fetch(`${API_URL}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
});

    if (res.ok) {
      alert('OTP sent! Check your email.');
      setStep(2);
    } else {
      alert('User not found or error sending email.');
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    
    const res = await fetch('http://localhost:5000/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    if (res.ok) {
      alert('Password reset successful! Please login.');
       navigate('/login');
    } else {
      const data = await res.json();
      alert(data.message || 'Invalid OTP or error.');
    }
  };

  return (
    <div className='nn'>
        {step === 1 ? (
          <Form onSubmit={handleSendOtp}>
            <h2>Reset Password</h2>
            <p>Enter your email to receive an OTP</p>
            <Form.Control 
              type="email" 
              placeholder="Enter email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="mb-3"
            />
            <Button type="submit" className="login-btn" >Send OTP</Button>
          </Form>
        ) : (
          <Form onSubmit={handleReset}>
            <h2>Enter OTP</h2>
            <p>Check your inbox for the code</p>
            <Form.Control 
              type="text" 
              placeholder="Enter OTP" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
              className="mb-3"
            />
            <Form.Control 
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
              className="mb-3"
            />
            <Button type="submit">Change Password</Button>
          </Form>
        )}
    </div>
  );
}

export default ForgotPassword;