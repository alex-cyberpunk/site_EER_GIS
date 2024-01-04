/**
 * Performs the editing of features in ArcGIS Online given a feature,
* an array of features and an operation (add, update or delete)
* Sends email for the edition and to the users who are on the editing list
* As well as it can send a log to the server in MongoDB
 * @param {url} url_of_eatureLayer
 * @param {Feature[]} edits
 * @param {String} operation
 * @returns {Promise}
 */
class LayerEditor {
  constructor(editfeature, url, layerId, key, userId, report, operation = "update") {
    this.editfeature = editfeature;
    this.url = url;
    this.layerId = layerId;
    this.key = key;
    this.userId = userId;
    this.report = report;
    this.operation = operation;
  }

  async applyEdits(edits) {
    let key;
    switch (this.operation) {
      case 'add':
        features = { addFeatures: edits };
        key = addFeatureResults;
        break;
      case 'delete':
        features = { deleteFeatures: edits };
        key = deleteFeatureResults;
        break;
      case 'update':
        features = { updateFeatures: [edits] };
        key = updateFeatureResults;
        break;
    }

    const featureLayer = await loadLayer(this.url, item_id);
    return new Promise((resolve, reject) => {
      featureLayer
        .applyEdits(features)
        .then((editsResult) => {
          if (editsResult[key].length > 0) {
            let value;

            if (Array.isArray(this.editfeature)) value = this.editfeature[0];
            else value = this.editfeature;

            if (sendEmail) {
              axios.post('http://localhost:3002/enviarEmail',
                {
                  values: {
                    area_code: value.attributes.area_code,
                    Projeto: value.attributes.Projeto,
                    numPedido: value.attributes.OBJECTID,
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
            if (sendLog) {
              this.report.ObjectID = results;
              axios.post('http://localhost:3002/logReport',
                { json: { ...this.report } })
                .then(log => {
                  console.log(log);
                });
            }
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          console.log("error = ", error);
          reject(error);
        });
    });
  }
}
