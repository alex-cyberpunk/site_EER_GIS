import React,{ useRef,useEffect,useState } from "react";
import {formsProps} from "../../../featuresArcgisJS/formsPedidos/index.js"
import {handleSubmit,formsType} from "../../../featuresArcgisJS/formsPedidos/forms.js"

import { handleUserType } from "../../../featuresArcgisJS/users.js";
import './formsPedidos.css'
function Forms({ Tipo,Portal ,formLoaded, updateFormLoaded,form,setForm,userApp}) {
  console.log(Tipo)
  const formDiv = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const[id_mapa,setIDmapa] = useState(null)
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };
  
  const [userAppData, setUserAppData] = useState(null);//inicia 
  const[appManager,setAppManager]=useState(null);
  
  useEffect(() => {
    if (formDiv.current && !formLoaded) {
      setForm(null);
      console.log("forms")
      console.log(userApp)
      if (userApp){ 
            console.log("forms")
            handleUserType(userApp)
            .then((appManager) => {
              setAppManager(appManager);
              formsProps(formDiv.current,appManager)
              .then((loadedForm) => {
                const userType=userApp.userType
                if(userType==='Topografia' || userType==='Comercial Fundiario'){
                  formsType(Tipo, loadedForm,userApp.user,Portal);
                }
                else{
                  formsType(Tipo, loadedForm,null,Portal);
                }
                
                setForm(loadedForm); 
                updateFormLoaded(true);
                setIDmapa("967a2d2c37c74e26b5b8eb93375cad76");
                
                  
              })
        .catch((error) => {
          console.error("Erro ao carregar formulários e camada:", error);
        });
          })
       
          
      }
      
    }
  }, [formDiv, form, Tipo,formLoaded,userApp]);

  

  return (
    
    <div id="update" className="esri-widget">
  {formDiv && (
    Tipo === 'Inclusao' || Tipo === 'Edicao' ? (
      <div>
        <div className="scroller esri-component" ref={formDiv}></div>
        
        <label type="button" 
        htmlFor="fileInput" 
        className="custom-file-upload"
        style={{textAlign: 'center' ,backgroundColor: '#F0F0F0' ,border: '1px solid #000',padding: '5px'}}>
        <calcite-icon icon="upload" scale="m" title="(.kmz, .kml, or .zip with shapefiles)"></calcite-icon>  Upload da Propriedade em kmz/kml
        <input type="file" id="fileInput" accept=".kmz, .kml, .zip" 
        onChange={handleFileChange} style={{ display: 'none' }}/>
        </label>

        
        <p>
        <input type="button" 
        className="esri-button" 
        value="Enviar solicitação"  
        onClick={() => handleSubmit(selectedFile, form, Tipo, Portal, appManager)} 
        style={{ color: '#ffffff', backgroundColor: '#00A6A3' }}/>


            </p>
      </div>
    ) : null
  )}
  <div id="sucessMessageContainer"></div>
  
  </div>
  

  );
  
}
export default Forms;


/*<input type="button" className="esri-button" value="Enviar solicitação" id="btnUpdate" onClick={() => handleSubmit(selectedFile, form, Tipo, Portal, appManager)} />
      */