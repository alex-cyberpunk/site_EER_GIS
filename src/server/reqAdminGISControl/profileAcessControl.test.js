const request = require('supertest');
const express = require('express');
const repository = require('../repository/repository.js');
const profileAcessControl = require('./profileAcessControl.js');
const login = require('../reqLogin/login.js')

let server = null;
let app = null;

const loginOK = {
    username:'Bruno',
    password:'1234'
   }

beforeAll(async()=>{
  app = express();
  app.use(express.json());
  profileAcessControl(app);
  login(app)
    
  server =app.listen(4002, () => {
    console.log(`Servidor rodando na porta ${4002}`);
});
}); 
afterAll(async()=>{
  await server.close();
})
test('GET /userInfo/ 200 OK' ,async()=>{
    const response = await request(server).
                            get('/appManager/')
                            .set('Content-Type','application/json')
                            .send({userName:'1'})
    console.log(response)                                 
    expect(response.status).toEqual(200);
   //expect(response.body).toBeTruthy();
  })
