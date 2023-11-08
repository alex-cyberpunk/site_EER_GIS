import React, { useState } from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Login = ({setUserApp}) => {
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
    e.preventDefault(); // Evita que o formulário seja enviado

    // Agora você pode acessar os valores de 'formData.username' e 'formData.password' para o nome de usuário e senha.
    const { username, password } = formData;
    console.log('Nome de Usuário:', username);
    console.log('Senha:', password);

    axios.post('http://localhost:3002/login', { username:username, password:password }).then(user => {
      console.log("logado no express");
      console.log(token);  
      if(token){
          //setUserApp(user.data);
          axios.get('http://localhost:3002/userInfo').then(userInfo => {
            setUserApp(userInfo.data)
            navigate("/pageForms");  
          }) 
          
        }    
    })
    /*
    const user = authenticateUser(username, password);
    user.then(logado => {
      localStorage.setItem('user', JSON.stringify(logado));
      if (logado) {
        navigate("/pageForms");
      }
    });
    
    */
        
  };

  return (
    <div className="calcite-maps calcite-nav-top">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nome de Usuário:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          /><br /><br />

          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          /><br /><br />

          <input type="submit" value="Entrar" />
        </form>
      </div>

      {/* Botão "Esqueci a senha" */}
      <div>
        <input
          type="button"
          value="Esqueci a senha"
          onClick={() => {
            window.location.href = 'recuperar_senha.html';
          }}
          className="btn-custom"
        />
      </div>
    </div>
  );
};

export default Login;
