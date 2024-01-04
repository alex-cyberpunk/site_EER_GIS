import fs from 'fs';
import path from 'path';
import KmlConverter from '../../libs/convertKMZData.js'

const kmlFile = fs.readFileSync(
                    path.resolve(__dirname, 
                        '../mocks/kmzs/NAO-intersecta-featureLayer.kmz')).
                        toString('utf8').replace(/\r\n/g, '\n');
global.FileReader = jest.fn(() => ({
    readAsText: jest.fn().mockImplementation(function(file) {
      this.onload({
        target: {
          result: kmlFile,
        },
      });
    }),
    onload: null,
    onerror: null,
}));
  

describe('KmlConverter', () => {
  test.todo('convertToGeoJson', () => {
    const converter = new KmlConverter(kmlFile);
    return converter.convertToGeoJson().then(geoJson => {
        console.log(geoJson)    
    }).catch(error => {
        console.log(error)
    });
    });
    
});