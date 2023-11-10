var https = require('follow-redirects').https;
const FormData = require('form-data');
const querystring = require('querystring');
var request = require('request');

function convertObjectToStrings(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      // If the property is an object, recursively call the function
      obj[key] = convertObjectToStrings(obj[key]);
    } else {
      // Convert non-object properties to strings
      obj[key] = String(obj[key]);
    }
  }
  return obj;
}


module.exports=(app)=>{

  app.post('/insertInMap',async(req, res) => {
    console.log("estou aqui")
    let jsonData=req.body.data
    jsonData.f='json'
    //jsonData=JSON.stringify(jsonData)
    //jsonData.attributes= JSON.stringify(jsonData.attributes)
    //jsonData.geometry= JSON.stringify(jsonData.geometry)
    //jsonData = convertObjectToStrings(jsonData);
    let url = req.body.urlFeatlyr
    const token =req.body.token;    
    
    url = url.concat(`/applyEdits?token=${token}`);

    console.log(url);
    console.log(jsonData);
    console.log(token)
    var options = {
      'method': 'POST',
      'url': url,
      'headers': {
        'Content-Type': 'application/json'
      },
      formData: jsonData
  };
  if(token)
    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      res.json(JSON.parse(response.body))
    });
  else res.sendStatus(404)
  
  });

  app.post('/generateToken', async(req, res) => {
    let jsonData=req.body.User
    //jsonData.f='json'//formato de recebimento da resposta

    var options = {
      'method': 'POST',
      'url': 'https://www.arcgis.com/sharing/rest/generateToken',
      'headers': {
        'Content-Type': 'application/json'
      },
      formData: jsonData
  };
  
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    res.json(JSON.parse(response.body))
  });

  /*
  
  */
  
  

        });

}

