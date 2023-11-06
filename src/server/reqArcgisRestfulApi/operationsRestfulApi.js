const axios = require('axios');
const FormData = require('form-data');
let data = new FormData();
data.append('f', 'json');
data.append('username', 'Creator_GIS_EER');
data.append('password', 'Pec_energia_23');
data.append('client', 'referer');
data.append('referer', 'arcgis.com');
data.append('expiration', '21600');

async function postInFeatureLayer(stringAdds,urlFeatLayer){
  let data_kmz = new FormData();
  data_kmz.append('adds', stringAdds);
  data_kmz.append('returnEditResults', 'true');


  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://www.arcgis.com/sharing/rest/generateToken',
    headers: { 
      ...data.getHeaders()
    },
    data : data
  };

  axios.request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
    let config_kmz = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/Pedidos_TESTE/FeatureServer/0/applyEdits?token=${response.data.token}',
      headers: { 
        ...data_kmz.getHeaders()
      },
      data : data_kmz
    };
    axios.request(config_kmz)
    .then((response) => {
      console.log(JSON.stringify(response.data));
  })
  })
  .catch((error) => {
    console.log(error);
  });
}

