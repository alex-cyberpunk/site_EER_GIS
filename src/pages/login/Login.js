import React, { useState } from 'react';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { password } from 'dojo/_base/url';


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
  
    const { username, password } = formData; // Obtém os valores de username e password do formData
  
    if (username && password) {
      
      axios.post('http://localhost:3002/login', { username, password })
        .then((response) => {
          const token = response.data.token; // Obtém o token da resposta
          
          if (token) {
            debugger
            let data2 = JSON.stringify({
              "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJDb21lcmNpYWwgRnVuZCAtIEJydW5vIiwidXNlclR5cGUiOiJDb21lcmNpYWwgRnVuZGlhcmlvIiwiaWF0IjoxNjk5NTcyMTAxLCJleHAiOjE2OTk1NzM5MDF9.5I8GgHk6G4hUFjcub4zyTYjFPV46H2HuFRr3UpdXy28"
            })
            let Data,config;
            Data = {token:token}
            
            debugger
            config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: 'http://localhost:3002/userInfo/',
              headers: { 
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}` 
              },
              data : Data
            };
            debugger
            if(config)
              axios.request(config)
              .then((userInfoResponse) => {
                const userInfo = userInfoResponse.data;
                  setUserApp(userInfo);
                  navigate("/pageForms");
                console.log(JSON.stringify(response.data));
              })  
            .catch((error) => {
              console.error("Erro ao buscar informações do usuário:", error);
            });
          }
        })
        .catch((error) => {
          console.error("Erro ao fazer login:", error);
          // Trate o erro de maneira apropriada
        });
    }
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
