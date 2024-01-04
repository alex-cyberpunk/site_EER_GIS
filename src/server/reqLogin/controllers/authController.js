//authCrontroller.js cinema-microservice

const jwt = require('jsonwebtoken'); 
const repository=require('../../repository/repository.js')
const bcrypt = require('bcryptjs');
const {generateTokenGIS} = require('../../reqArcgisRestfulApi/arcgisAPIRestful.js')
const crypto = require('crypto');
const sendEmail = require('../../reqEmail/sendEmail.js');	
const exp = require('constants');
const algorithm = 'aes-256-cbc'; 
const CryptoJS = require("crypto-js");

//https://www.devglan.com/online-tools/aes-encryption-decryption#google_vignette

async function encrypt(word){
  const keyBase64 = process.env.KEY;
  var key = CryptoJS.enc.Base64.parse(keyBase64);
  var srcs = CryptoJS.enc.Utf8.parse(word);
  var encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  return encrypted.toString();
}
async function decrypt(word){
  const keyBase64 = process.env.KEY;
  var key = CryptoJS.enc.Base64.parse(keyBase64);
  var decrypt = CryptoJS.AES.decrypt(word, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}
// Validation of users

async function doLogin(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
  
    try {
      const user = await repository.getUser(username, password);
      if (user) {
        const arcgisUser = await repository.arcgisUser();
        if (arcgisUser) {
          
          /**
            *const senha = 'Editor1_ENG_PEC'
            *const senhaCriptografada = await encrypt(senha);
            *console.log(senhaCriptografada);
            *console.log(arcgisUser); 
          */
          
          let expires=process.env.EXPIRES/60;    
          const tokenGIS = await generateTokenGIS(arcgisUser, expires.toString());
          console.log(tokenGIS);
          const jwtPayload = { userId:user.userId,userName: user.userName, userType: user.userType,email:user.email, token: tokenGIS };
          const jwtToken = jwt.sign(jwtPayload,
            process.env.SECRET,
            {expiresIn:parseInt(process.env.EXPIRES)});

          repository.updateArcgisUser(user.usename, jwtToken);

          if(jwtToken) res.json({ jwt: jwtToken });
          else res.status(503).send('All ArcGIS users are currently in use , please try again in 30 minutes');
        } else {
          res.status(503).send('All ArcGIS users are currently in use, please try again in 30 minutes');
        }
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

async function validateBlacklist(req,res,next){
    let token = req.headers['authorization'];
    if(!token) return next();
    token = token.replace('Bearer','');
    console.log(token)
    const isBlacklisted=await repository.checkBlacklisToken(token);

    if(isBlacklisted)
        return res.sendStatus(401);
    else
        next()
}


async function validateLoginSchema(req,res,next){
    const schema = require('../schemas/schema.js')
    const { error } = schema.validate(req.body);
    if(error){
        const { details } = error;
        return res.status(422).json(details.map(d=>d.message));
    }

    next();
}

async function validateToken(req,res,next){
    let token= req.headers['authorization'];
    token = token.replace('Bearer','');
    
    try{
        const {userName,userType}=jwt.verify(token,process.env.SECRET)
        res.locals.userName=userName;
        res.locals.userType=userType;
        next();
    }
    catch(error){
        console.log(error)
        res.sendStatus(401);
    }
    
}

async function doLogout(req,res,next){
    let token= req.headers['authorization'];
    token = token.replace('Bearer','');
    await repository.blacklisToken(token)
    res.sendStatus(200);
}

//FLow for reset password
async function generateResetPasswordToken(req, res, next) {
    const email = req.body.email;
    const token = crypto.randomBytes(20).toString('hex');
    const user = await repository.getUserInfo(email);
  
    const resetPasswordToken = token;
    const result=await repository.setResetToken(user.userId, resetPasswordToken);

    if(!result) return res.sendStatus(500);
    else {
      const email = await sendEmail.sendMessageWithTemplate('redefinirSenha', { token },user.userId);
      if(email) res.sendStatus(200);
      else res.sendStatus(500);
    }
    
}


async function resetPassword(req, res, next) {
  const { token, password } = req.body;
  const tokenResetPass = await repository.findTokenResetPass(token);
  
  if(tokenResetPass) {
    const hash = await bcrypt.hashSync(password, 14);
    const result = await repository.resetPassword(tokenResetPass.userId,hash);
    if(result) return res.sendStatus(200);
    else return res.sendStatus(500);
  } else {
    return res.sendStatus(401);
  }
}


//operations with info of users
async function getInfoApp(req,res,next){
    const token = req.body.token;
    const {userId,userType}=jwt.verify(token,process.env.SECRET)
    res.json({userId,userType}) 
}

async function insertUser(req,res,next){
    const userName = req.body.userName;
    //const userType = req.body.userType;
    let password = req.body.password;
    const email = req.body.email;
    let userId = await repository.findMax();
    userId=userId+1
    
    const salt=bcrypt.genSaltSync(14)
    const hash = await bcrypt.hashSync(password,salt );
    
    let newUserId = null;
    newUserId = await repository.insertUserInfo(userId,userName,hash,email);
    
    if (newUserId){
      const email = await sendEmail.sendMessageWithTemplate('novoUsuario', { userName:userName },newUserId);
      if(email) res.sendStatus(200);
      else res.sendStatus(500);
    }  
    else res.sendStatus(400);
}   

module.exports={doLogin,
                doLogout,
                validateToken,
                validateLoginSchema,
                validateBlacklist,
                getInfoApp,
                insertUser,
                generateResetPasswordToken,
                resetPassword};