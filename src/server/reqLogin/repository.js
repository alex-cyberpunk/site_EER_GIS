const fs = require('fs');
const usersPath =  '../../public/users.json';

async function authenticateUser(username, password) {
    try {
      
      const usersData = fs.readFileSync(usersPath, 'utf8');
      const users = JSON.parse(usersData);
      
      const response = [
        {
          "_id":1,
          "userName": "Comercial Fund - Bruno",
          "password": "1234",
          "userType": "Comercial Fundiario",
          "responsavelTopografia":"Bruno",
          "email":"alex.matias@pecenergia.com.br"
        },
        {
           "_id":2,      
          "userName": "Bruno",
          "password": "1234",
          "userType": "Topografia",
          "email":"alex.matias@pecenergia.com.br"
        },
        {
            "_id":3,  
          "userName": "Luis",
          "password": "1234",
          "userType": "Resources",
          "email":"alex.matias@pecenergia.com.br"
        }
      ];
  
      const user = users.find((user) => user.userName === username && user.password === password);
  
      if (user) {
        // Imprimir o tipo de usuário
        console.log(`Tipo de usuário: ${user}`);
        return user;
      } else {
        throw new Error('Usuário não encontrado');
      }
    } catch (error) {
      console.error('Erro na autenticação:', error);
      return null; // Retorna null em caso de erro
    }
  }

module.exports={authenticateUser};