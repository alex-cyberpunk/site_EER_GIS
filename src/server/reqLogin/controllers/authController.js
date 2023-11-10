//authCrontroller.js cinema-microservice

const jwt = require('jsonwebtoken'); 
const repository=require('../repository/repository.js')


async function doLogin(req,res,next){
    const username = req.body.username;
    const password = req.body.password;

    try{
        const user = await repository.getUser(username,password);
        const token = jwt.sign({userId:user.userName , userType: user.userType},
            process.env.SECRET,
            {expiresIn:parseInt(process.env.EXPIRES)});
        res.json({token})    
    }

    catch(error){
        res.sendStatus(401);
    }
}

async function validateBlacklist(req,res,next){
    let token = req.headers['authorization'];
    if(!token) return next();

    token = token.replace('Bearer','');
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
    token = token.replace('Beader','');
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

async function getInfoApp(req,res,next){
    const token = req.body.token;
    const {userId,userType}=jwt.verify(token,process.env.SECRET)
    res.json({userId,userType}) 
} 

module.exports={doLogin,doLogout,validateToken,validateLoginSchema,validateBlacklist,getInfoApp};