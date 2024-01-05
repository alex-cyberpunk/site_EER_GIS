const repository = require('../repository/repository.js');

module.exports=(app)=>{
    
    app.post('/logReport', async (req, res) => {
        const json= req.body.json
        const id = await repository.insertReport(json);
     if(id)
       res.json(id);  
     else 
       res.sendStatus(400);     
     }); 
    
    app.post('/logError', async (req, res) => {
        const json= req.body.json
        const id = await repository.insertError(json);
     if(id)
       res.json(id);  
     else 
       res.sendStatus(400);     
     }); 

    return app
}