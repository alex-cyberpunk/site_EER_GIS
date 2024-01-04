import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './singUp.css';

const SignUp = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');  // Add this line
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if password and confirmPassword are the same
    if (password !== confirmPassword) {
      alert('As senhas não conferem');
      return;
    }
    if (!email.endsWith('@pecenergia.com.br')) {
      alert('Apenas emails que pertencem a empresa Pec Energia S.A. são permitidos. Por favor, tente novamente com um email válido ou contate o administrador do sistema.');
      return;
    }
    axios.post('http://localhost:3002/insertUser', {
        userName,
        password,
        email
      })
      .then((response) => {
        if (response.status === 200) {
          alert('Usuário criado com sucesso');
          navigate('/');
        } else {
          alert('Erro ao criar usuário');
        }
      })
      .catch((error) => {
        console.error('Error creating user:', error);
      })
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="signup-container">
      <Form className="signup-form" onSubmit={handleSubmit}>
        <h3>Cadastrar</h3>
  
        <Form.Group controlId="formUserName">
          <Form.Label>Nome de usuário</Form.Label>
          <Form.Control type="text" placeholder="Digite o nome de usuário" value={userName} onChange={(e) => setUserName(e.target.value)} />
        </Form.Group>
  
        <Form.Group controlId="formPassword">
          <Form.Label>Senha</Form.Label>
          <Form.Control type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
  
        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirmar senha</Form.Label>
          <Form.Control type="password" placeholder="Confirmar senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Form.Group>
  
        <Form.Group controlId="formEmail">
          <Form.Label>Endereço de email</Form.Label>
          <Form.Control type="email" placeholder="Digite o email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            Você receberá um email de confirmação em breve.
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

export default SignUp;