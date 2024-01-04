use('adminGISAPP');

const Projetos=[
        {"Pedidos":{
            "url":"https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/Pedidos_TESTE/FeatureServer/",        
            "id":"967a2d2c37c74e26b5b8eb93375cad76",
            "Pedidos em Espera":{
                "IdLayer":[0]
            },
            "Pedidos Reprovados":{
                "IdLayer":[1]
            },    
        }},
        {"Projetos":{
            "SSB": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/BRE/FeatureServer/",
                "id": "2f480bf5cc0c49138352727449f3b949",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "CUN": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/CUN/FeatureServer/",
                "id": "f5cbc5e53f7a4b8dae7a5856e7f8769e",
                "IdLayer": [3],
                "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
            }
            },
            "ESV": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/ESV/FeatureServer/",
                "id": "91ee685c035b452a99015ed497a4a8d2",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "ALG": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/JAG/FeatureServer/",
                "id": "e7a453b379f04abf87234a5db923cb0e",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "PAC": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/MEL/FeatureServer/",
                "id": "a10f0d50a350481bbfaf011a2cc0c1c8",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SAL": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SAL/FeatureServer/",
                "id": "bca9dd064f8e4b77b13e187a4ffb2b29",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SAS": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SAS/FeatureServer/",
                "id": "ba9d9059140845f0800876add239877d",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SCA": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SCA/FeatureServer/",
                "id": "1275610d5682478598fff9d401333e9f",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SCR": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SCR/FeatureServer/",
                "id": "cfabb758b5a6404ba60d64eab43eac91",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SDJ": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SDJ/FeatureServer/",
                "id": "9740053d5072453381116f0bd7d08e4b",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SEC": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SEC/FeatureServer/",
                "id": "a3cc49f77b6e449bb35213af26733d27",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SGA": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SGA/FeatureServer/",
                "id": "2f45eb57719546b2a994b400b8007fa8",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SGE": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SGE/FeatureServer/",
                "id": "fabc4a457b1543758bcf15064294656b",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SGO": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SGO/FeatureServer/",
                "id": "c00121a1e06543b68fff8a38f607a6e3",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SGW": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SGW/FeatureServer/",
                "id": "6ab4cfab9e2c4c6eaa8fcea92ff0b770",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SIB": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SIB/FeatureServer/",
                "id": "bac65208c13540a297df5259cc3327f6",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SMA": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SMA/FeatureServer/",
                "id": "64e3c945887243c78c25051d1e942660",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'], 
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SPA": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SPA/FeatureServer/",
                "id": "4a1b80a78e4d4d2fbccc1c1ea5cd9997",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'], 
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SSE": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SSE/FeatureServer/",
                "id": "321b745d574348b3874d8ed21e376fee",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'], 
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SSV": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SSV/FeatureServer/",
                "id": "851e4764a5ba4995aa19c3e4ad6fb9db",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'], 
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "STE": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/STE/FeatureServer/",
                "id": "aac87563ec2f44bfb4987ae1c9e47dc0",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "TDV": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/TDV/FeatureServer/",
                "id": "775e78b0abfe4191b52c6eaca00b2eac",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SGR": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/VCH/FeatureServer/",
                "id": "ff1beab5be6b4496a83986e2c5c1be66",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "ARN": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/VES/FeatureServer/",
                "id": "b2c0191407eb4d5caa6447657dc9a370",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "STA": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/STA/FeatureServer/",
                "id": "58ee4cb9e6d0482685c2911678143597",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SCB": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SCB/FeatureServer/",
                "id": "4c4ef47d60994c1ea1fbf1aa54571b1e",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "OUR": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SOU/FeatureServer/",
                "id": "654d03d9c19e492bad581a4dfc4ae35f",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SVD": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SDV/FeatureServer/",
                "id": "9d19e37994d94a279aad5d3fb26adff5",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "BJL": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/BJL/FeatureServer/",
                "id": "d110c855899d47dcae261dba4e1b736a",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SDB": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SDB/FeatureServer/",
                "id": "2bc185f454ac4298bcf2de793a1aba11",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "SAG": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SAG/FeatureServer/",
                "id": "ab7508bb2de344e59a5866daddf78c27",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "BXA": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/BXA/FeatureServer/",
                "id": "09d56c65dfe44c478fdd70e48c927460",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            },
            "BQR": {
              "Areas": {
                "url": "https://services.arcgis.com/UFhefLcRQpBCvtQB/arcgis/rest/services/SOB/FeatureServer/",
                "id": "e7a8d494014a40b79eab0fe297986abc",
                "IdLayer": [3],
                    "visibleFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status'],
                    "lockFields": ['area_code', 'Proprietario_principal', 'Imovel', 'Matricula', 'Status']
              }
            }
          }
        }    
]

db.getCollection('Feature Layers').insertMany(Projetos);

