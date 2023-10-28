import axios from 'axios';



async function authenticateUser(username, password) {
  try {
    // Faça uma solicitação para o arquivo JSON (substitua 'users.json' pelo caminho correto do seu arquivo)
    const response = await axios.get('users.json');
    
    // Verifique se a solicitação foi bem-sucedida
    if (response.status === 200) {
      const users = response.data; // Dados do JSON

      const user = users.find((user) => user.userName === username && user.password === password);

      if (user) {
        // Imprimir o tipo de usuário
        console.log(`Tipo de usuário: ${user.userType}`);
        return user;
      } else {
        throw new Error('Usuário não encontrado');
      }
    } else {
      throw new Error('Erro ao recuperar dados do arquivo JSON');
    }
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return null; // Retorna null em caso de erro
  }
}

export { authenticateUser };
