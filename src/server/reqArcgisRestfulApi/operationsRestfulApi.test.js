const {test,expect} = require('@jest/globals');
const express = require('express');
const request = require('supertest');

const postInFeatureLayer = require('./operationsRestfulApi.js')

/// Mocks
const urlMapa =  'https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/Pedidos_TESTE/FeatureServer/0';
const data={adds:[{
    geometry: {
      rings:[[[-38.4434538956639,-9.07133705545406],
              [-38.4504496894324,-9.09338394522013],
              [-38.4506663612823,-9.09337374176779],
              [-38.4436549494043,-9.07136514927273],
              [-38.4373119559629,-9.05705946222431],
              [-38.4372886940886,-9.05703825041346],
              [-38.4371137247292,-9.05710154519007],
              [-38.4434538956639,-9.07133705545406]]],    
      spatialReference: { "wkid": '4326' }
              },
    attributes: {
      Proprietario_principal: 'Teste',
      Matricula: '1234',
      Projeto: 'SGR',
      Status: 'MSD',
      Responsavel_Topografia: 'Bruno',
      Responsavel_Comercial: 'Comercial Fund - Bruno'
              }
    }],
    returnEditResults:true,
    returnEditMoment:true


  }

  let UserCreator={
    User:{
    username: process.env.USER_CREATOR,
    password: process.env.SENHA_CREATOR,
    client: 'referer',
    referer: 'arcgis.com',
    expiration: '1'
    }
  }
  let app=null;
  let server=null;
  let token='';

  beforeAll(async()=>{
    app = express();
    app.use(express.json());
    postInFeatureLayer(app);
    server =app.listen(4001, () => {
      console.log(`Servidor rodando na porta ${4001}`);
    });
    const response= await request(server).
                          post('/generateToken').
                          send(UserCreator);
    token=response.body.token;
                
});

  afterAll(async()=>{
    await server.close();
  })
  
  test('POST /generate Token 200 OK' ,async()=>{
    const response = await request(server).post('/generateToken').send(UserCreator);
    expect(response.status).toEqual(200);
    expect(response.body.token).toBeTruthy();
 }) 

 

/* Existe um limite para numero de logins seguidos cuidado
   

test('POST /generate Token 400 Unable to generate Token' ,async()=>{
    UserCreator.User.password='1'
    const response = await request(server).post('/generateToken').send(UserCreator);
    expect(response.body.error.code).toEqual(400);
 })

   test('POST /insertInMap 200 OK ' ,async()=>{
    const response = await request(app).
                          post('/insertInMap')
                          .send({data:data,urlFeatlyr:urlMapa,token:token});
    expect(response.status).toEqual(200);
    expect(response.body.length).toBeTruthy();
  }) 
  
  test('POST /insertInMap 404 ' ,async()=>{
    token=null
    const response = await request(app).
                          post('/insertInMap')
                          .send({data:data,urlFeatlyr:urlMapa,token:token});
  ;
    expect(response.status).toEqual(404);
  })  


*/





 