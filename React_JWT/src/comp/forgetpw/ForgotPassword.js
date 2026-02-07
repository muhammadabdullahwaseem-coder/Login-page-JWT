import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // 1. Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    // REPLACE WITH YOUR BACKEND URL
    const res = await fetch('https://your-backend.onrender.com/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    if (res.ok) {
      alert('OTP sent! Check your email.');
      setStep(2); // Move to next step
    } else {
      alert('User not found or error sending email.');
    }
  };

  // 2. Reset Password
  const handleReset = async (e) => {
    e.preventDefault();
    const res = await fetch('https://your-backend.onrender.com/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword })
    });

    if (res.ok) {
      alert('Password reset successful! Please login.');
      navigate('/login');
    } else {
      alert('Invalid OTP or error.');
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