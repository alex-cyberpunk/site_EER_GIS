import {loadForms,loadLayer} from "../Consultas.js" 

function formsProps(formDiv,appManager) {
  return new Promise((resolve, reject) => {
    loadLayer(null, appManager.formsPedidos.url, 0)
      .then((featureLayer) => {
        return loadForms(featureLayer, formDiv);
      })
      .then((form) => {
        debugger
        resolve(form); // Resolva a promessa com o formulário
      })
      .catch((error) => {
        reject(error);
        console.error("Erro ao carregar formulários e camada:", error);
      });
  });
}

export {formsProps};