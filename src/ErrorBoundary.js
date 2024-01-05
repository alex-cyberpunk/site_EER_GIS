import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    //logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Erro do servidor.</h1>;
    }

    return this.props.children; 
  }
}
export default ErrorBoundary;

/*fetch('https://services8.arcgis.com/20FPDKcmejqS25Vb/arcgis/rest/services/Pedidos/FeatureServer/0')
  .then(response => response.json())
  .then(data => {
    // Handle the data
  })
  .catch(error => {
    console.error('Error:', error);
    // Handle the error
  });*/