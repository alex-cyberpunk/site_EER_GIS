var https = require('follow-redirects').https;
const FormData = require('form-data');
const querystring = require('querystring');

function buildPostData(obj) {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let postData = '';

  for (const key in obj) {
    const value = obj[key];
    postData += `${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`;
  }

  postData += `${boundary}--`;
  return postData;
}




async function makePostRequest(options, data) {
  
}


module.exports=(app)=>{

  
  app.post('/inseritInMap',async(req, res) => {
    const urlFeatLyr = req.body.url; // url do feature layer
    const adds = req.body.adds; // dados no formato do arcgis online
    const options = {
      port: 443,
      method: 'POST',
      url: urlFeatLyr,
      headers: {},
      formData: JSON.stringify([adds])
    };  
    makePostRequest(options)
  });

  app.post('/generateToken', async(req, response) => {
    
    const Body = req.body.User;
    Body.f = "json";
    
    var https = require('follow-redirects').https;
  

    var options = {
      'method': 'POST',
      'hostname': 'www.arcgis.com',
      'path': '/sharing/rest/generateToken',
      'headers': {
        'Content-Type': 'application/json'
      },
      'maxRedirects': 20
    };
    
    
      
    var req = https.request(options, function (res) {
      var chunks = [];
      
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function (chunk) {
        var body = Buffer.concat(chunks);
        console.log(body.toString());
        response.send(body.toString());
      });

      res.on("error", function (error) {
        console.error(error);
      });
  });

  var postData = "------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"f\"\r\n\r\njson\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"username\"\r\n\r\nCreator_GIS_EER\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"password\"\r\n\r\nPec_energia_23\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"client\"\r\n\r\nreferer\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"referer\"\r\n\r\narcgis.com\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data; name=\"expiration\"\r\n\r\n0.5\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--";
  var postData2 = buildPostData(Body)
  console.log(postData)
  console.log(postData2)
  req.setHeader('content-type', 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW');

  req.write(postData);

  req.end();
        });

}

