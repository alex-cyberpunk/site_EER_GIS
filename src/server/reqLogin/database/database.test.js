require('dotenv-safe').config();
const  {test,expect} = require('@jest/globals');
const database = require('./database.js');

test('Connnection Database', async()=>{
    const connection = await database.connect();
    expect(connection).toBeTruthy();
})


test('Connnection Database', async()=>{
    const isDisconnected = await database.disconnect();
    expect(isDisconnected).toBeTruthy();
})

test('Connnection Database 2X', async()=>{
    await database.disconnect();
    const isDisconnected = await database.disconnect();
    expect(isDisconnected).toBeTruthy();
})