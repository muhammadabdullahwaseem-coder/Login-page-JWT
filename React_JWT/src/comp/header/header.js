import React from 'react'
import './header.css'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'


function Header({ theme, toggleTheme }) {
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <>
      
      <Navbar className="liquid-navbar" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to=""> 
            Galaxy App
          </Navbar.Brand>

          <Nav className='ml-auto align-items-center'>
            {token ? (
              <>
                <Nav.Link as={Link} to='/dashboard' className='nav-link'>Dashboard</Nav.Link>
                <Nav.Link onClick={handleLogout} className='nav-link'>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to='/login' className='nav-link'>Login</Nav.Link>
                <Nav.Link as={Link} to='/register' className='nav-link'>Signup</Nav.Link>
              </>
            )}
            
          
            <button onClick={toggleTheme} className="theme-btn">
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
            
          </Nav>
      </Container>
      </Navbar>
    </>
  );
}

export default Header