import { Component } from 'react';
import './customWidget.css'

function CustomToggleButton({ isTableVisible, setTableVisibility }) {
  const toggleTableVisibility = () => {
    setTableVisibility((prevIsTableVisible) => !prevIsTableVisible);
  };

  return (
    <button
      id="toggleButton"
      title="Mostrar/Esconder tabela"
      className="custom-button" 
      onClick={toggleTableVisibility}
    >
      <calcite-icon icon="tables" scale="m"></calcite-icon>
    </button>
  );
}

export default CustomToggleButton;
