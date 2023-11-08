//import ArcGISMap from "@arcgis/core/Map"
import { returnProjetos, retornaListAreaCode,returnEditFeatures,applyEditsToLayer,loadLayer,loadTable,loadForms,findField,hideFields,lockFieldsTable,hideFieldsTable,findFeatLyr} from './Consultas.js';


jest.mock('@arcgis/core/Map')
jest.mock('@arcgis/core/views/MapView')


/*

test('loadLayer com mapa', async()=>{
    loadLayer(returnView().map, returnItemID(), 0).then((featureLayer)=>{
        expect(ArcGISMap).toHaveBeenCalledTimes(1);
        expect(FeatureLayer).toHaveBeenCalledTimes(1);
        expect(Array.isArray(featureLayer)).toBeTruthy();
    })

})

test('loadLayer sem mapa', async()=>{
    loadLayer(null, returnItemID(), 0).then(()=>{
        expect(Array.isArray(movies)).toBeTruthy();
        expect(ArcGISMap).toHaveBeenCalledTimes(1);

        expect(FeatureLayer).toHaveBeenCalledTimes(1);
        expect(Array.isArray(featureLayer)).toBeTruthy();
    })
})

*/
/*
test('loadTable', async()=>{
       expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})
test('loadForms', async()=>{
       expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})

test('applyEditsToLayer', async()=>{
    //testa se os edits sao executados como o esperado 
    // Usa mocks de entrada com  a saida de applyEditsToLayer()
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})

test('returnEditFeatures', async()=>{
       expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})


test('returnProjetos', async()=>{
       expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})
test('retornaListAreaCode', async()=>{
     
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})

test('lockFieldsTable', async()=>{
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})

test('hideFieldsTable', async()=>{
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})

test('hideFields', async()=>{
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})

test('findField', async()=>{
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})
test('findFeatLyr', async()=>{
    expect(Array.isArray(movies)).toBeTruthy();
    expect(movies.length).toBeTruthy();

})

*/
