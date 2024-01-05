import React from 'react';
import TableLeaders from './components/tableLeaders.js';  // Adjust this import path to match your file structure
import SectionComponent from '../painelPedidos/components/SectionPedidos.js';

function PageLeaders({ appManager }) {
    return (
      <div>
        <SectionComponent></SectionComponent>
        <div style={{ color: '#000', backgroundColor: '#F0F0F0' }}>  
          <br></br>
          {appManager && appManager.Projetos && <TableLeaders Projetos={appManager.Projetos} appManager={appManager}/>}
        </div>
      </div>
            
      
    );
  }
  
  export default PageLeaders;