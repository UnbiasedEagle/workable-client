import React from 'react';
import main from '../../assets/images/main.svg';
import { Wrapper } from './landing.styles';
import { Logo } from '../../components/index';
import { Link, Navigate } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';

const Landing = () => {
  const { user } = useAppContext();

  if (user) {
    return <Navigate to='/' />;
  }

  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>

      <div className='container page'>
        {' '}
        <div className='info'>
          <h1>
            Job <span>tracking</span> app
          </h1>
          <p>Track Your Job Search Process Now!</p>
          <Link to='/register' className='btn btn-hero'>
            Login/Register
          </Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  );
};

export default Landing;
