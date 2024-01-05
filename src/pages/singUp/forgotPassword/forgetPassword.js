import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './forgotPassword.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (event) => {
    event.preventDefault();  
    axios.post('http://localhost:3002/forgotPassword', { email:email })
    .then((response) => {
      if (response.status === 200) {
        alert('Reset password email sent successfully');
        navigate('/');  // Navigate to the login page
      } else {
        alert('Error sending reset password email');
      }
    })
    .catch((error) => {
      console.error('Error sending reset password email:', error);
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="forgot-password-container">
      <Form className="forgot-password-form" onSubmit={handleSubmit}>
        <h3>Esqueci a senha</h3>
  
        <Form.Group controlId="formEmail">
          <Form.Label>Endereço de email</Form.Label>
          <Form.Control type="email" placeholder="Digite o email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            Enviaremos instruções para redefinir sua senha.
          </Form.Text>
        </Form.Group>
  
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="primary" type="submit">
              Enviar
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;