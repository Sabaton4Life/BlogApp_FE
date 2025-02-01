import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../images/Logo.png';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.search);

  const handleClick = (category) => {
    setActiveLink(`?cat=${category}`);
  };

  return (
    <div className='navbar'>
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="coffee logo" />
          </Link>
        </div>
        <div className="links">
          {['Espresso', 'Aeropress', 'V60', 'Moka Pot', 'Cevze'].map((category) => (
            <Link 
              key={category} 
              className={`link ${activeLink === `?cat=${category}` ? 'active' : ''}`} 
              to={`/?cat=${category}`}
              onClick={() => handleClick(category)}
            >
              <h6>{category}</h6>
            </Link>
          ))}
          {currentUser ? (
            <>
              <Link className="link" to={`/profile/${currentUser.username}`}>
                <span className='username'>{currentUser.username}</span>
              </Link>
              <Link className="logout" to="/login">
                <span onClick={logout}>Logout</span>
              </Link>
            </>
          ) : (
            <Link className="login" to="/login">
              Login
            </Link>
          )}
          <span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
