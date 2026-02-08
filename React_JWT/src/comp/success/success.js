import React from 'react';
import { useNavigate } from 'react-router-dom';
import './success.css';

function Success() {
  const navigate = useNavigate();

  return (
    <div className='mm'>
          You have successfully signed up. Your journey begins now.
        
        <button className="login-btn" onClick={() => navigate('/login')}>
          Login Now
        </button>
     
    </div>
  );
}

export default Success;