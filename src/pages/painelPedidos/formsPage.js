import React, { useState } from 'react';
import Forms from "./components/formsPedidos.js"
import StepProcess from './components/Steps.js';
import SummaryStatistics from './components/Contagem.js'
import SectionComponent from './components/SectionPedidos.js';
import "@esri/calcite-components/dist/calcite/calcite.css";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";

import "./formsPage.css"
function PageForms({Portal,userApp,appManager}) {
  const [tipoFormulario, setTipoFormulario] = useState('Edicao');
  const [formLoaded, setFormLoaded] = useState(false);
  const [form, setForm] = useState(null);
  const [currentFormKey, setCurrentFormKey] = useState(0);

  const options = appManager.formsPedidos.TiposOperacao//['Inclusao', 'Edicao', 'Inutilizacao']; // Add your options here

  const handleTipoFormulario = (tipo) => {
    setFormLoaded(false);
    setTipoFormulario(tipo);
    setForm(null)
    setCurrentFormKey(currentFormKey + 1);
  };

  return (
    <div className="forms-section">
      <SectionComponent></SectionComponent>  
      <SummaryStatistics
      appManager={appManager}
      userApp={userApp}
      />
      <StepProcess></StepProcess >
      <section style={{ color: '#aN', backgroundColor: '#F0F0F0' ,height: '800px'}}>
        <div className="forms-container" style={{ color: '#aN', backgroundColor: '#F0F0F0' }}>
          <div className="markdown-card ember-view">
            <h1 style={{ textAlign: 'center', backgroundColor: '#F0F0F0', color: '#00A6A3' }}>Formulários para inserção de KMZs para Inclusão ou Edição</h1>
          </div>
          {userApp.userType === 'Topografia' ||  userApp.userType === 'Comercial Fundiario' ? (
             <>
             <calcite-segmented-control width="full">
               {options.map((option, index) => (
                 <calcite-segmented-control-item
                   key={index}
                   class="block my-custom-class"
                   checked={index === 0}
                   value={option}
                   onClick={() => handleTipoFormulario(option)}
                 ></calcite-segmented-control-item>
               ))}
             </calcite-segmented-control>
         
             <Forms
               Tipo={tipoFormulario}
               Portal={Portal}
               formLoaded={formLoaded}
               updateFormLoaded={setFormLoaded}
               form={form}
               setForm={setForm}
               key={currentFormKey}
               userApp={userApp}
               appManager={appManager}
             />
           </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default PageForms;



          /*<calcite-loader text="Carregando Formulario..." ></calcite-loader>*/
          /*<Calendar></Calendar>*/