
import  esriConfig  from "@arcgis/core/config.js";
import { Link, useNavigate } from 'react-router-dom';
import { initialize, fetchUser} from '../../featuresArcgisJS/oauthPostFlow.js';
import { jwtDecode as jwt_decode } from 'jwt-decode';
import React, { useState, useEffect } from "react";
import axios from 'axios';
function AppManager({setAppManager,setUserApp,setTokenJWT,Token,appManager,userApp,setIsUrlsProcessed,isUrlsProcessed,setTokenGIS,user,setUser}) {
    const navigate = useNavigate(); 
    async function initializeUser() {
        let decoded;
            console.log(Token)
            const token = localStorage.getItem('jwt');
            console.log(token)
            if (token) { 
            decoded = jwt_decode(token);
            
            setTokenJWT(decoded);
            setTokenGIS(decoded.token);
            setUserApp({ userId: decoded.userId, userName: decoded.userName, userType: decoded.userType,email:decoded.email });
            initialize(decoded.token);
    
                try {
                const response = await axios.get('http://localhost:3002/appManager', {
                    params: {
                    userId: decoded.userId
                    }
                });
    
                const appManager = response.data;
                console.log(appManager)
                setAppManager(appManager);
    
                if (appManager) {
                    
                    const user = await fetchUser(Token); // Make sure fetchUser is defined
                    setUser(user);
                    console.log(appManager)
                    const urls = [
                    appManager.url,
                    ...Object.values(appManager.Projetos).map(projeto => projeto.url),
                    ];
                    console.log(urls)
                    console.log(decoded.token.token)
                    urls.forEach(url => {
                        esriConfig.request.interceptors.push({
                        urls: url,
                        before: function (params) {
                            params.requestOptions.query = params.requestOptions.query || {};
                            params.requestOptions.query.token = decoded.token.token;
                        },
                        after: function(response) {
                            //console.log('After function called', response);
                            if (response.error && response.error.name === 'request:server' && response.error.message === 'Invalid token.') {
                              navigate("/");
                            }
                          }
                        });
                    });
                    console.log(esriConfig.request.interceptors)
                    setIsUrlsProcessed(true);
        
                    
                }
                } catch (error) {
                console.error("Error fetching appManager:", error);
                }
            
            }
        
        }
    useEffect(() => {
        
        console.log('djafsfnkfn vjd v mfv ');
        console.log(Token)   
        if (!Token) {
            console.log('Token não existe');
            initializeUser();}
          }, [Token, userApp, appManager]); 
}

export default AppManager;