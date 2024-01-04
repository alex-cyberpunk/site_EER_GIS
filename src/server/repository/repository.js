const { ObjectId } = require('mongodb');
const database = require('../database/database.js');
const bcrypt = require('bcryptjs');
const CryptoJS = require("crypto-js");

async function decrypt(word){
  const keyBase64 = process.env.KEY;
  var key = CryptoJS.enc.Base64.parse(keyBase64);
  var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

async function getUser(identifier, password) {
  const db = await database.connect();
  const user = await db.collection('users').findOne({
    $or: [
      { userName: identifier },
      { email: identifier }
    ]
  });

  if (!user) throw new Error('User not found!');
  

  const isValid = bcrypt.compareSync(password, user.password);
  if (!isValid) throw new Error('Wrong user and/or password!')

  return user;
}

async function getUserInfo(identifier) {
  const db = await database.connect();
  const user = await db.collection('users').findOne({
    $or: [
      { userId: identifier },
      { userName: identifier },
      { email: identifier }
    ]
  });
  return user;
}
async function returnUsers() {
  const db = await database.connect();
  const users = await db.collection('users').find({}, { projection: { _id: 0, userId: 1, userName: 1,email:1 } }).toArray();
  return users;
}

async function findMax(){
  const db = await database.connect();
  const maxUserIdCursor  = await db.collection('users').find().sort({userId:-1}).limit(1)
  const maxUserId = await maxUserIdCursor.next(); 
  return maxUserId.userId
}

async function insertUserInfo(userId,userName,password,email){
  const db = await database.connect();
  const user = await db.collection('users').insertOne({userId,userName,password,email});
  if(user )return userId;
  else return null;
}

//Reset Password flow
async function setResetToken(userId, token) {
  const db = await database.connect();
  const result = await db.collection('reset-password').
                          insertOne({ userId:userId,token:token,creation:new Date() });

  if (result) return true;
  else return false;
}

async function findTokenResetPass(token) {
  const db = await database.connect();
  const result = await db.collection('reset-password').
                          findOne({ token:token });
  return result;  
}

async function resetPassword(userId, hash) {
    const db = await database.connect();
    const result = await db.collection('users').
                            updateOne({ userId: userId }, { $set: { password: hash } });
    console.log(result);
    if (result) return true;    
    else return false;
  
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
// GIS USER

async function findUserGIS(){
  const db = await database.connect();
  const usersGISCollection = db.collection('usersGIS_');
  const user = await usersGISCollection.findOne({ license:  'Creator' });
  return user;
}

async function arcgisUser(license=null) {
  const db = await database.connect();
  const arcgisUsersCollection = db.collection('arcgisUsers');//users of arcgis online using right now
  let usersGIS_Collection = db.collection('userGIS_');//users of arcgis online the db

  const arcgisUsers = await arcgisUsersCollection.find().toArray();

  const arcgisUsernames = arcgisUsers.map(user => user.username);

  let user;
  if(license) {
    user = await usersGIS_Collection.findOne({ license: license, username: { $nin: arcgisUsernames } });
  } else {
    user = await usersGIS_Collection.findOne({ username: { $nin: arcgisUsernames }});
  }

  if(user) user.password= await decrypt(user.password)
  console.log(user);
  return user;
}

async function updateArcgisUser(username, jwtToken) {
  const db = await database.connect();
  const arcgisUsersCollection = db.collection('arcgisUsers');

  const updateResult = await arcgisUsersCollection.updateOne(
    { username: username },
    { $set: { jwt: jwtToken, lastUsed: new Date() } }
  );

  if (updateResult.matchedCount > 0) {
    return await arcgisUsersCollection.findOne({ username: username });
  } else {
    return null;
  }
}

/// GIS APP

async function profileAcessControlAppMenager(userId){
  const userInfo=await getUserInfo(userId);
  const username=userInfo.userName;
  const users=await returnUsers();

  const db = await database.connectAPPG();
  const userProjetos = await db.collection('userNameProjetos').find({ [userInfo.userType.replace(' ','_')]: { $in: [username] } }).toArray();
  const featureLayers = await db.collection('Feature Layers').find({ "Projetos": { $exists: true } }).toArray();
  const controlComponents = await db.collection('controlComponents').findOne({userType:userInfo.userType});
  
  //console.log(userProjetos);
  //console.log(featureLayers);
  //console.log(controlComponents);

  let result = { "Projetos": {} };
  let projetosDB = featureLayers[0].Projetos;

  if(userInfo.userType==='Lider Topografia' || userInfo.userType==='Resources'){
    //o Lider Topografia tem acesso a todos os projetos
    for (let featureLayer in projetosDB) {
        result.Projetos[featureLayer] = projetosDB[featureLayer];
    }
    controlComponents.Projetos=result.Projetos;
    return controlComponents;
  }

  for (let projeto of userProjetos) {
    
      for (let featureLayer in projetosDB) {
        if (featureLayer === projeto.Projeto) {
          for (let layer of controlComponents.Layers) {
            console.log(projeto);
            console.log(projeto.Projeto);
            console.log(projetosDB[projeto.Projeto]);
            
            if(layer==='Areas') {
              projetosDB[projeto.Projeto].Areas.Topografia= projeto.Topografia
              for (let userDB of users) {
                if (projeto.Topografia === userDB.userName) {
                  projetosDB[projeto.Projeto].Areas.ID_Topografia= userDB.userId
                }
              
              }
              projetosDB[projeto.Projeto].Areas.Comercial_Fundiario= userInfo.userName
              projetosDB[projeto.Projeto].Areas.ID_Comercial_Fundiario= userInfo.userId
            }
            console.log(layer);
            console.log(projetosDB[projeto.Projeto]);
          }
          result.Projetos[projeto.Projeto] = projetosDB[projeto.Projeto];
    }
  }

  controlComponents.Projetos=result.Projetos;

  return controlComponents;
}
}


// Get emails templates
async function getEmailTemplate(identifier) {
  const db = await database.connectAPPG();
  const message = await db.collection('emailTemplates').findOne({
    messageType: identifier
  });
  return message;
}

//Logging
async function insertReport(json){
  const db = await database.connectLogs();
  const info = await db.collection('reports').insertOne({json});
  if(info )return info;
  else return null;
}

async function insertError(json){
  const db = await database.connectLogs();
  const info = await db.collection('errors').insertOne({json});
  if(info )return info;
  else return null;
}

module.exports = {getUser,
                  blacklisToken,
                  checkBlacklisToken,
                  getUserInfo,
                  insertUserInfo,
                  findMax,
                  profileAcessControlAppMenager,
                  getEmailTemplate,
                  setResetToken,
                  arcgisUser,
                  resetPassword,
                  updateArcgisUser,
                  findTokenResetPass,
                  returnUsers,
                  insertReport,
                  insertError}