const {test,expect} = require('@jest/globals');
const request = require('../../../node_modules/supertest');
const server = require('../server.js')

const postInFeatureLayer = require('./operationsRestfulApi.js')

/// Mocks
const urlMapa =  'https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/Pedidos_TESTE/FeatureServer/0/applyEdits?token=';
const adds={
    geometry: {
      rings:[[[-38.4434538956639,-9.07133705545406],
              [-38.4504496894324,-9.09338394522013],
              [-38.4506663612823,-9.09337374176779],
              [-38.4436549494043,-9.07136514927273],
              [-38.4373119559629,-9.05705946222431],
              [-38.4372886940886,-9.05703825041346],
              [-38.4371137247292,-9.05710154519007],
              [-38.4434538956639,-9.07133705545406]]],    
      spatialReference: { "wkid": 4326 }
              },
    attributes: {
      Proprietario_principal: 'Teste',
      Matricula: '1234',
      Projeto: 'SGR',
      Status: 'MSD',
      Responsavel_Topografia: 'Bruno',
      Responsavel_Comercial: 'Comercial Fund - Bruno'
    }
  }

  let UserCreator={
    User:{
    username: process.env.USER_CREATOR,
    password: process.env.SENHA_CREATOR,
    client: 'referer',
    referer: 'arcgis.com',
    expiration: 1
    }
  }
  let app=null;
  beforeAll(async()=>{
    process.env.PORT=3004;
    app = await server.start();
    postInFeatureLayer(app);
    });

  afterAll(async()=>{
        await server.stop();
    })

  console.log("CARARCACSVGH")  
  test('POST /generate Token 200 OK' ,async()=>{
      const response = await request(app).post('/generateToken').send(UserCreator);
      expect(response.status).toEqual(200);
      console.log("sim essa e a resposta")
      console.log(response.text)
   })    


test('POST /generate Token 400 Unauthorize' ,async()=>{
    UserCreator.User.password=''
    const response = await request(app).post('/generateToken').send(UserCreator);
    expect(response.status).toEqual(400);
 })


 /*
 
 test('POST /insertInMap 200 OK ' ,async()=>{
    const response = await request(app).post('/insertInMap');
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeTruthy();
 }) 
 test('POST /insertInMap 400 ' ,async()=>{
    const response = await request(app).post('/insertInMap');
    expect(response.status).toEqual(400);
    expect(response.body.length).toBeTruthy();
 }) 
 */


 