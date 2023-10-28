import React, { useState } from 'react';
import Forms from "../components/formsPedidos.js"
import Calendar from '../components/InputCalendar.js';
import StepProcess from '../components/Steps.js';
import SummaryStatistics from '../components/Contagem.js'
import SectionComponent from '../components/SectionPedidos.js';
import "@esri/calcite-components/dist/calcite/calcite.css";
import "@esri/calcite-components/dist/components/calcite-label";
import "@esri/calcite-components/dist/components/calcite-segmented-control";
import "@esri/calcite-components/dist/components/calcite-segmented-control-item";

import "./formsPage.css"
function PageForms({Portal,userApp}){
    const [tipoFormulario, setTipoFormulario] = useState('Inclusao'); // Defina um estado para o tipo de formulário
    console.log(Portal)
    const [formLoaded, setFormLoaded] = useState(false);
    const [form, setForm] = useState(null);
    const [currentFormKey, setCurrentFormKey] = useState(0);

    const handleTipoFormulario = (tipo) => {
      setFormLoaded(false);
      setTipoFormulario(tipo);
      setForm(null)
      setCurrentFormKey(currentFormKey + 1);

    };
    
  
    return (
      <div className="forms-section" >
      <SectionComponent></SectionComponent>  
      <SummaryStatistics></SummaryStatistics>
      <StepProcess></StepProcess >
      <section style={{ color: '#aN', backgroundColor: '#F0F0F0' ,height: '800px'}}>
      <div className="forms-container" style={{ color: '#aN', backgroundColor: '#F0F0F0' }}>
      <div className="markdown-card ember-view">
          <h1 style={{ textAlign: 'center', backgroundColor: '#F0F0F0', color: '#00A6A3' }}>Formulários para inserção de KMZs para Inclusão ou Edição</h1>
        </div>

        <calcite-segmented-control width="full">
        <calcite-segmented-control-item
          appearance={{backgroundColor: '#00A6A3' ,color: '#FFFFFF'}}
          class="block my-custom-class"     
          checked value="Inclusão"
          onClick={() => handleTipoFormulario('Inclusao')}
        
        ></calcite-segmented-control-item>
        <calcite-segmented-control-item
          class="block my-custom-class"    value="Edição"
          onClick={() => handleTipoFormulario('Edicao')}
        ></calcite-segmented-control-item>
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
        /> 
      </div>
      </section>
    </div>
    
    );
  }
  
  export default PageForms;



          /*<calcite-loader text="Carregando Formulario..." ></calcite-loader>*/
          /*<Calendar></Calendar>*/