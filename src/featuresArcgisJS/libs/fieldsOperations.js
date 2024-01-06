class FieldOperations {
    constructor(feat) {
        this.feat = feat;
    }

    deleteaAndFilterFields(featureLayer, appManager) {
        featureLayer.load().then(() => {
  
        if(appManager.mapaPedidos.hasOwnProperty('whereClause')) {
      
          let replacedQuery = appManager.mapaPedidos.whereClause.replace(/{/g, "'");
          replacedQuery = replacedQuery.replace(/}/g, "'");
          replacedQuery = replacedQuery.replace(/user/g, userApp.userName);
          replacedQuery = replacedQuery.replace(/"/g, "'");
          featureLayer.definitionExpression =replacedQuery;
          }
          if(appManager.mapaPedidos.hasOwnProperty('fields'))  deleteFields(featureLayer, appManager.mapaPedidos.fields);
        });
      }

    lockFieldsTable(lockFields, editable) {
        this.feat.layer.fields.forEach((field) => {
            if (lockFields.includes(field.name)) {
                field.editable = editable;
            }
        });
    }

    hideFieldsTable(visibleFields) {
        this.feat.hiddenFields = []; // Inicialize um array vazio para hiddenFields
        this.feat.layer.fields.forEach((field) => {
            if (!visibleFields.includes(field.name)) {
                this.feat.hiddenFields.push(field.name);
            }
        });
    }

    hideFields(visibleFields) {
        this.feat.layer.fields.forEach((field) => {
            if (!visibleFields.includes(field.name)) {
                field.visible = false;
            }
        });
    }

    findField(searchField) {
        return new Promise((resolve, reject) => {
            let foundField = null;
            this.feat.layer.fields.forEach((field) => {
                if (field.name === searchField) {
                    foundField = field;
                }
            });

            if (foundField) {
                resolve(foundField);
            } else {
                reject(new Error("Campo não encontrado"));
            }
        });
    }

    deleteFields(searchFields) {
        this.feat.fields = this.feat.fields.filter(field => searchFields.includes(field.name));
    }
}