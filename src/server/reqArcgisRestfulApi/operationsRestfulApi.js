const fs = require('fs');
const arcgisAPIRestful = require('./arcgisAPIRestful');
const { convert } = require('geojson2shp');
const path = require('path');


module.exports=(app)=>{

  
  app.post('/generateSHP', async(req, res) => {
    const layer=req.body.layer;
    const token=req.body.token;
    const projeto=req.body.projeto;
    const objectIds=req.body.objectIds;
    const outFields=req.body.outFields;
    
    arcgisAPIRestful.featureLayerToGeoJSON(layer.url,layer.IdLayer,token,outFields,objectIds).
    then(async(geojson)=>{
      const outputPath = path.join(__dirname, `${projeto}.shp`);
      await convert(geojson, outputPath);
  
      // Read the SHP file
      const shpBuffer = fs.readFileSync(outputPath);
  
      // Send SHP as a download
      res.setHeader('Content-Disposition', `attachment; filename=${projeto}.shp`);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.send(shpBuffer);
      
      // Delete the temporary SHP file
      fs.unlinkSync(outputPath);
    });
  });

}

