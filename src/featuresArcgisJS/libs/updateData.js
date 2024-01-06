import FeatureLoader from './loadFeature.js';

class LayerEditor {
  constructor(editfeature, url, layerId, operation,userId, sendEmail,sendLog,axios) {
    this.editfeature = editfeature;
    this.url = url;
    this.layerId = layerId;
    this.userId = userId;
    this.sendLog = sendLog;
    this.operation = operation;
    this.axios = axios;
    this.sendEmail = sendEmail;
    
  }
  /**
    * Performs the editing of features in ArcGIS Online given a feature,
    * an array of features and an operation (add, update or delete)
    * Sends email for the edition and to the users who are on the editing list
    * As well as it can send a log to the server in MongoDB
    * @param {url} url of_featureLayer
    * @param {string} layerId of the featureLayer
    * @param {Feature[]} edits array of features to be edited
    * @param {["add","update","delete"]} operation type of operation to be performed
    * @returns {Promise} Promise with object id of the first feature edited and null if no feature was edited
    */
  async editFeatures(edits) {
    let key;
    let features;
    switch (this.operation) {
      case 'add':
        features = { addFeatures: [edits] };
        key = 'addFeatureResults';
        break;
      case 'delete':
        features = { deleteFeatures: [edits] };
        key = 'deleteFeatureResults';
        break;
      case 'update':
        features = { updateFeatures: [edits] };
        key = 'updateFeatureResults';
        break;
    }
    
    const featureLoader = new FeatureLoader();
    const featureLayer = await featureLoader.loadLayer(this.url, this.layerId);

    return new Promise((resolve, reject) => {
      featureLayer
        .applyEdits(features)
        .then((editsResult) => {
          console.log(editsResult[key])
          console.log(editsResult[key])
          if (editsResult[key].length > 0) {
            const value=edits;

            if (this.sendEmail) {
              this.axios.post('http://localhost:3002/enviarEmail',
                {
                  values: {
                    area_code: value.attributes.area_code,
                    Projeto: value.attributes.Projeto,
                    numPedido: editsResult[key].objectId,
                    responsavelTopografia: value.attributes.Responsavel_Topografia,
                    responsavelComercial: value.attributes.Responsavel_Comercial,
                  },
                  userIds: [this.userId],
                  key: this.key
                })
                .then(teste => {
                  console.log(teste);
                });
            }
            if (this.sendLog) {
              const log=value.attributes;
              this.axios.post('http://localhost:3002/logReport',
                { json: { ...log } })
                .then(idLog => {
                  console.log(idLog);
                });
            }
          }
        })
        .catch((error) => {
          console.log("error = ", error);
          reject(error);
        });
    });
  }
}
module.exports = LayerEditor;
