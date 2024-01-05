
class createFeatureFromJSON{
    constructor(json,wkid){
        this.update = json;
        this.createFeatures();
    }
    /**
     * Create feature from object with attributes and coordinates
     * the coordinates must be in an key called rings
     * @param {Object} json
     * @param {Object} json.attributes 
     */
    createFeatures(update, wkid = 4326){
        let graphics = [];
          
            updates.forEach(update => {
              const attributes = {};
              for (let chave in update) {
                if (update.hasOwnProperty(chave)) {
                  if (chave !== 'rings') {
                    attributes[chave] = update[chave];
                  }
                }
              }
          
              let graphic = new Graphic({
                geometry: {
                  type: 'polygon',
                  rings: update.rings,
                  spatialReference: wkid // 4326 para kml
                },
                attributes: attributes
              });
          
              graphics.push(graphic);
            });
          
            return graphics;
        
    }
}