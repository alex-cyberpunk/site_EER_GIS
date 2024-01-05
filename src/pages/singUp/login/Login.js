import React, { useState,useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import './Login.css';

const Login = ({setUserApp,setTokenJWT,setAppManager,Token}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (username && password) {
      localStorage.removeItem('jwt');
      axios.post('http://localhost:3002/login', { username, password })
        .then((response) => {
          const token = response.data.jwt;
          console.log(token)
          let decoded = jwt_decode(token);
          //setTokenJWT(decoded);
          localStorage.setItem('jwt', token);

          if (token) {
            decoded = jwt_decode(token);
            setUserApp({ userId: decoded.userId, userName: decoded.userName, userType: decoded.userType,email:decoded.email });
            debugger
            if(decoded.userType==='Lider Topografia' || decoded.userType==='Resources') navigate("/mapa");              
            else navigate("/pageForms");
                      
          }
          })
          .catch((error) => {
            console.error("Erro ao buscar informações do usuário:", error);
          });
    }
    };



  return (
    <div className="login-container">
      <Form onSubmit={handleSubmit} className="login-form">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/engeform.png" alt="Engeform" />
        </div>
  
        <div className="field-container">
          <Form.Group controlId="formUsername">
            <Form.Label>Nome de usuário</Form.Label>
            <Form.Control type="text" placeholder="Insira o nome de usuário" name="username" value={formData.username} onChange={handleInputChange} />
          </Form.Group>
  
          <Form.Group controlId="formPassword">
            <Form.Label>Senha</Form.Label>
            <Form.Control type="password" placeholder="Senha" name="password" value={formData.password} onChange={handleInputChange} />
          </Form.Group>
  
          <Button variant="primary" type="submit">
            Entrar
          </Button>
  
          <div className="link-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <Link to="/sign-up" className="btn btn-link">Inscreva-se</Link>
            <Link to="/forgot-password" className="btn btn-link">Esqueceu a senha?</Link>
          </div>
        </div>
      </Form>
    </div>
  );

};

export default Login;
