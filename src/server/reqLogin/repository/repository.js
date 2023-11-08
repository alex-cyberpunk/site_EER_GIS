const { ObjectId } = require('mongodb');
const database = require('../database/database.js');
const bcrypt = require('bcryptjs')

async function getUser(username,password){
    const db = await database.connect();
    const user = await db.collection('users').findOne({userName:username});
    if(!user) throw new Error('User not found!');
    console.log(user);
    const isValid=bcrypt.compareSync(password,user.password);
    if(!isValid) throw new Error('Wrong user and/or password!')
    return user;
}

async function getUserInfo(UserId){
  const db = await database.connect();
  const user = await db.collection('users').findOne({UserId});
  return user;
}

async function blacklisToken(token){
    const db = await database.connect();
    return db.collection('blacklist')
    .insertOne({_id:token,toke:token,data: new Date() });
}


async function checkBlacklisToken(token){
  const db = await database.connect();
  const qtd = db.collection('blacklist')
  .countDocuments({_id:token});
  return qtd>0;
}


module.exports = {getUser,blacklisToken,checkBlacklisToken,getUserInfo}