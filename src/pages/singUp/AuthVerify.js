import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const AuthVerify = (props) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      const decodedJwt = parseJwt(token);
      console.log("token expirado");
      console.log(Date.now());
      console.log(decodedJwt.exp*1000)
      if (decodedJwt.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwt');
        navigate("/");
        alert("Sua sessão expirou, faça login novamente"); 
        }
    }
  }, [props]);

  return <div></div>;
};

export default AuthVerify;