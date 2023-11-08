require('dotenv-safe').config();
const MongoClient = require('mongodb').MongoClient;

// O QUE VALE E ESSE AQUI , ESSA AQUI E CONEXAO MAIS ATUALIZADA

let client=null;

async function connect(){
    console.log(process.env.MONGO_CONNECTION)
    if(!client)
        console.log("Tentativa de conexao")
        client = new MongoClient(process.env.MONGO_CONNECTION); 
    await client.connect();//so pode utilizar dentro de funcoes async
    
    return client.db(process.env.DATABASE);

}

async function disconnect(){
    if(! client) return true;
    await client.close();
    client=null;
    return true;
}

module.exports ={connect,disconnect}