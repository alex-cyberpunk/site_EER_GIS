const request = require('supertest');
const express = require('express');
const repository = require('../repository/repository.js')
const sendEmail = require('./sendEmail.js')
let server = null;
let app = null;
beforeAll(async()=>{
  app = express();
  app.use(express.json());
  sendEmail(app)
  server =app.listen(4001, () => {
    console.log(`Servidor rodando na porta ${4001}`);
});
}); 
afterAll(async()=>{
  await server.close();
})
test('POST /enviarEmail', async() => {
    const response = await request(server)
      .post('/enviarEmail')
      .set('Content-Type','application/json')
      .send({
        userId: 1,
        values: {
          numPedido: '123',
          responsavelComercial: 'João',
          responsavelTopografia: 'Maria',
        },
        key: 'areaNovaTopografia',
      });

    expect(response.status).toBe(200);
    });
