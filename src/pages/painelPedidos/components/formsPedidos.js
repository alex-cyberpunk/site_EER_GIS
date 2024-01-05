import React,{ useRef,useEffect,useState } from "react";
import {formsProps} from "../../../featuresArcgisJS/formsPedidos/index.js"
import {handleSubmit,formsType} from "../../../featuresArcgisJS/formsPedidos/forms.js"

import './formsPedidos.css'
function Forms({ Tipo,Portal ,formLoaded, updateFormLoaded,form,setForm,userApp,appManager}) {
  
  const formDiv = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const[id_mapa,setIDmapa] = useState(null)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  
  useEffect(() => {
    if (formDiv.current && !formLoaded) {
      setForm(null);
      console.log("forms")
      console.log(userApp)
      if (userApp){ 
          formsProps(formDiv.current,appManager)
          .then((loadedForm) => {
            formsType(Tipo, loadedForm,appManager);
            setForm(loadedForm); 
            updateFormLoaded(true);
          })
        .catch((error) => {
          console.error("Erro ao carregar formulários e camada:", error);
        });
      }
    }
  }, [formDiv, form, Tipo,formLoaded,userApp]);
  return (
    
    <div id="update" className="esri-widget">
  {formDiv && (
    Tipo === 'Inclusao' || Tipo === 'Edicao' ||  Tipo === 'Inutilizacao'? (
      <div>
        <div className="scroller esri-component" ref={formDiv}></div>
        
        {Tipo !== 'Inutilizacao' && (
          <label type="button" 
            htmlFor="fileInput" 
            className="custom-file-upload"
            style={{ backgroundColor: '#F0F0F0', textAlign: 'center', border: '1px solid #000', padding: '5px', display: 'inline-block', width: '100%', boxSizing: 'border-box', marginBottom: '10px'}}>
            <calcite-icon icon="upload" scale="m" title="(.kmz, .kml, or .zip with shapefiles)"></calcite-icon>  Upload da Propriedade em kmz/kml
            <input type="file" id="fileInput" accept=".kmz, .kml, .zip" 
            onChange={handleFileChange} style={{ display: 'none' }}/>
          </label>
        )}
        
        <p>
        <input type="button" 
        className="esri-button" 
        value="Enviar solicitação"  
        onClick={() => handleSubmit(selectedFile, form, Tipo, userApp, appManager)} 
        style={{ color: '#ffffff', backgroundColor: '#00A6A3' }}/>


            </p>
      
      <div id="Alert"></div>
          
      </div>
      
    ) : null
  )}
  
  </div>
  

  );
  
}
export default Forms;


/*<input type="button" className="esri-button" value="Enviar solicitação" id="btnUpdate" onClick={() => handleSubmit(selectedFile, form, Tipo, Portal, appManager)} />
      */