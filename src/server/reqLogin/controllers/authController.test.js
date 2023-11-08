const {test,expect} = require('@jest/globals');
const express = require('express');
const request = require('supertest');
const repository = require('../repository/repository.js')
const {ObjectId} = require('mongodb')
const login = require('../login.js')



const loginOK = {
    username:'Bruno',
    password:'1234'
   }
const loginNOK = {
    username:'Bruno',
    password:'1234567'
   }

let token=''
const tokenBlacklist=new ObjectId().toHexString();

let app = null;
let server = null;
beforeAll(async()=>{
    app = express();
    app.use(express.json());
    login(app)
    server =app.listen(4000, () => {
      console.log(`Servidor rodando na porta ${4000}`);
  });      
    const response = await request(server).
                            post('/login/')
                            .set('Content-Type','application/json')
                            .send(loginOK);
    token = response.body.token;
    console.log(token)
    await repository.blacklisToken(tokenBlacklist);
});

afterAll(async()=>{
    await server.close();
})


test('GET /userInfo/ 200 OK' ,async()=>{
  const response = await request(server).
                          get('/userInfo/')
                          .set('Content-Type','application/json')
                          .send({token:token})
  console.log(response)                                 
  expect(response.status).toEqual(200);
 //expect(response.body).toBeTruthy();
})

test('POST /login/ 200 OK' ,async()=>{
   const response = await request(server).
                            post('/login/')
                            .set('Content-Type','application/json')
                            .send(loginOK);
    
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
})


  
  test('POST /login/ 422 UNPROCESSABLE ENTITY' ,async()=>{
    loginOK.data=new Date();

    const response = await request(server).
                            post('/login/')
                            .set('Content-Type','application/json')
                            .send(loginOK);
    
    expect(response.status).toEqual(422);
  })

  test('POST /login/ 401 Unauthorazide ' ,async()=>{
    
    const response = await request(server).
                            post('/login/')
                            .set('Content-Type','application/json')
                            .send(loginNOK);
    
    expect(response.status).toEqual(401);
 })

 test('POST /logout/ 200 OK' ,async()=>{
  const response = await request(server).
                          post('/logout/')
                          .set('Content-Type','application/json')
                          .set('authorization',`Bearer ${token}`)
  console.log(response)                                 
  expect(response.status).toEqual(200);
 //expect(response.body).toBeTruthy();
})

test('POST /logout/ 401 Unautorazite' ,async()=>{
  const response = await request(server).
                          post('/logout/')
                          .set('Content-Type','application/json')
                          .set('authorization',`Bearer ${token}1`)
 expect(response.status).toEqual(401);
})  

test('POST /logout/ 401 Blacklist' ,async()=>{
  const response = await request(server).
                          post('/logout/')
                          .set('Content-Type','application/json')
                          .set('authorization',`Bearer ${tokenBlacklist}`)
 expect(response.status).toEqual(401);
})    
