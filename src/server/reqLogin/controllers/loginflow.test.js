const {test,expect} = require('@jest/globals');
const express = require('express');
const request = require('supertest');
const login = require('../login.js')


let app = null;
let server = null;
beforeAll(async()=>{
    app = express();
    app.use(express.json());
    login(app)
    server =app.listen(4000, () => {
      console.log(`Servidor rodando na porta ${4000}`);
  });      

});

afterAll(async()=>{
    await server.close();
})

test('GET /forgotPassword/ 200 OK' ,async()=>{
    const response = await request(server).
                            get('/forgotPassword/')
                            .set('Content-Type','application/json')
                            .send({email:'alex.matias@usp.br'})                                 
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
  })
  
  test('POST /resetPassword/ 200 OK' ,async()=>{
    const response = await request(server).
                            post('/resetPassword/')
                            .set('Content-Type','application/json')
                            .send(newPassword);
    
    expect(response.status).toEqual(422);
  })