use('api-gateway');
const arcgisUsers=[
    {  
    "username": "Creator_GIS_EER",
    "password": "Pec_energia_23",
    "license":"Creator"
    }
]

db.getCollection('usersGIS').insertMany(arcgisUsers);
    
    
