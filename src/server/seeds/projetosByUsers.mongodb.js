use('adminGISAPP');

const usersProjetos=[   
    {
        "Bruno": {
            "Projeto": [
              "SSB",
              "CUN",
              "ESV",
              "ALG"
            ],
            "Layers": ["Areas"]
          }

    }   
]

db.getCollection('userNameProjetos').insertMany(usersProjetos);


