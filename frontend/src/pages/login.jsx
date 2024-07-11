import React, { useState } from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';

import image from '../assets/southema.png';
import '../component/stylelog.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simple validation for demonstration
    if (email === 'user@example.com' && password === 'password') {
      navigate('/home');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <MDBContainer className="login-container p-3 my-5 d-flex flex-column w-50">
      <img src={image} alt="Southema image" className="your-image-class" />
      <MDBInput
        wrapperClass='mb-4'
        label='Email address'
        id='form1'
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <MDBInput
        wrapperClass='mb-4'
        label='Password'
        id='form2'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="d-flex justify-content-between mx-3 mb-4">
        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
      </div>

      <MDBBtn className="mb-4" onClick={handleLogin}>Sign in</MDBBtn>
    </MDBContainer>
  );
}

export default Login;
