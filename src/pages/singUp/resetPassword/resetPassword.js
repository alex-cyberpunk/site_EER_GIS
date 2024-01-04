import React, { useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';

import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './resetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  

  const handleSubmit = (event) => {
    event.preventDefault();

    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Make a POST request to the /resetPassword endpoint
    axios.post('http://localhost:3002/resetPassword', {
      password: password,
      token
    })
    .then((response) => {
      if (response.status === 200) {
        alert('Senha redefinida com sucesso');
        navigate('/');  // Navigate to the login page
      } else {
        alert('Erro ao redefinir senha');
      }
    })
    .catch((error) => {
      console.error('Error resetting password:', error);
    });
  };


  return (
    <div className="reset-password-container">
      <Form className="reset-password-form" onSubmit={handleSubmit}>
        <div className="form-inner">
          <Form.Group controlId="formPassword">
            <Form.Label>Nova Senha</Form.Label>
            <Form.Control type="password" placeholder="Nova Senha" name="password" onChange={(e) => setPassword(e.target.value)}  />
          </Form.Group>
  
          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirme a Nova Senha</Form.Label>
            <Form.Control type="password" placeholder="Confirme a Nova Senha" name="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} />
          </Form.Group>
  
          <Button variant="primary" type="submit">
            Redefinir Senha
          </Button>
  
          <div className="link-container">
            <Link to="/" className="btn btn-link">Voltar ao Login</Link>
          </div>
        </div> 
      </Form>
    </div>
  );
};

export default ResetPassword;