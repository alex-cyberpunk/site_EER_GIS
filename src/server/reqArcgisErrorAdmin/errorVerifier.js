module.exports=(app)=>{

    app.post('/seachIntersection',async(req, res) => {
        let nomeProjeto = req.body.projeto
        const portal = req.body.portal
        retornaListAreaCode(portal, true, nomeProjeto,3).then((props)=>{
            data.forEach((prop) => {
                const results = findIntersect(prop, props, 'area_code');
            })
            if(results.length>0){
                results.forEach((itemIntersect, index) => {
                    
                    });
                    displayMessage(string,'Alert','Warning');
            }
            else{
                console.log("nao ha interseccoes")
              }
                  
          })
    
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