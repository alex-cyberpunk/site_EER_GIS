const {test,expect} = require('@jest/globals');
const app = require('../server/index.js');
const request = require('supertest');
const repository = require('../repository/repository.js')
const {ObjectId} = require('mongodb')
const loginOK = {
    email:'alex.matias@usp.br',
    password:'123456'
   }
const loginNOK = {
    email:'alex.matias@usp.br',
    password:'1234567'
   }

let token=''
const tokenBlacklist=new ObjectId().toHexString();


beforeAll(async()=>{
    process.env.PORT=4001;
    const response = await request(app).
                            post('/login/')
                            .set('Content-Type','application/json')
                            .send(loginOK);
    token = response.body.token;
    await repository.blacklisToken(tokenBlacklist);
});

afterAll(async()=>{
    await app.close();
})


test('POST /login/ 200 OK' ,async()=>{
   const response = await request(app).
                            post('/login/')
                            .set('Content-Type','application/json')
                            .send(loginOK);
    
    expect(response.status).toEqual(200);
    expect(response.body).toBeTruthy();
})


  
  test('POST /login/ 422 UNPROCESSABLE ENTITY' ,async()=>{
    loginOK.data=new Date();

    const response = await request(app).
                            post('/login/')
                            .set('Content-Type','application/json')
                            .send(loginOK);
    
    expect(response.status).toEqual(422);
  })

  test('POST /login/ 401 Unauthorazide ' ,async()=>{
    
    const response = await request(app).
                            post('/login/')
                            .set('Content-Type','application/json')
                            .send(loginNOK);
    
    expect(response.status).toEqual(401);
 })

test('POST /logout/ 200 OK' ,async()=>{
    const response = await request(app).
                            post('/logout/')
                            .set('Content-Type','application/json')
                            .set('authorization',`Bearer ${token}`)
    console.log(response)                                 
    expect(response.status).toEqual(200);
   //expect(response.body).toBeTruthy();
  })

  test('POST /logout/ 401 Unautorazite' ,async()=>{
    const response = await request(app).
                            post('/logout/')
                            .set('Content-Type','application/json')
                            .set('authorization',`Bearer ${token}1`)
   expect(response.status).toEqual(401);
  })  

  test('POST /logout/ 401 Blacklist' ,async()=>{
    const response = await request(app).
                            post('/logout/')
                            .set('Content-Type','application/json')
                            .set('authorization',`Bearer ${tokenBlacklist}`)
   expect(response.status).toEqual(401);
  })    

