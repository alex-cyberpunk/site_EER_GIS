// AuthComponent.js
import React, { useState, useEffect }  from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import Login from './login/Login.js';
import ForgotPassword from './forgotPassword/forgetPassword.js';
import SignUp from './singUp/singUP.js';
import ResetPassword from './resetPassword/resetPassword.js';
import axios from 'axios';

const AuthComponent = ({setUserApp, setTokenJWT, setAppManager,Token}) => {
  
  return (
    <Routes>
      <Route path="/" element={<Login 
                                  setUserApp={setUserApp} 
                                  setTokenJWT={setTokenJWT} 
                                  setAppManager={setAppManager}
                                  Token={Token}
                                   />} />
      <Route path="sign-up" element={<SignUp />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
    </Routes>
  );
};

export default AuthComponent;
