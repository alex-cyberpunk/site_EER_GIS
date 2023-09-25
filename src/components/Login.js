import React, { useEffect, useRef } from "react";
import { signOut } from '../data/oauth.js';
import "@esri/calcite-components/dist/calcite/calcite.css";
import "./Login.css"
function Login({ user }) {
  const btnAuth = useRef(null);

  useEffect(() => {
    console.log("Login");
  }, [user]);

  return (
    <calcite-button color="blue">Add layer</calcite-button>
  );

}

export default Login;

/*            <calcite-button appearance="clear" onClick={signOut} color="blue">Sign Out</calcite-button>
*/
