import {handleUserType} from ".././users.js"
import {returnUser} from '../login_arcgis.js'
import {loadForms,loadLayer} from "../Consultas.js" 

function formsProps(formDiv,appManager) {
  return new Promise((resolve, reject) => {
    loadLayer(null, appManager.Forms.id_mapa_painel_aprovacao, 0)
      .then((featureLayer) => {
        return loadForms(featureLayer, formDiv);
      })
      .then((form) => {
        resolve(form); // Resolva a promessa com o formulário
      })
      .catch((error) => {
        reject(error);
        console.error("Erro ao carregar formulários e camada:", error);
      });
  });
}

function formsPropsBase(formDiv,id) {
  return new Promise((resolve, reject) => {
    returnUser()
      .then((user) => {
        return handleUserType(user);
      })
      .then((appManager) => {
        console.log(appManager);
        return loadLayer(null, id, 3);
      })
      .then((featureLayer) => {
        return loadForms(featureLayer, formDiv);
      })
      .then((form) => {
        resolve(form); 
      })
      .catch((error) => {
        reject(error);
        console.error("Erro ao carregar formulários e camada:", error);
      });
  });
}

export {formsProps,formsPropsBase};