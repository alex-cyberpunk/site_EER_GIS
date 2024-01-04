import axios from 'axios';

async function logout() {
    try {
        console.log(localStorage.getItem('jwt'));
        const response = await axios.post('http://localhost:3002/logout', {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer${localStorage.getItem('jwt')}`
          }
        });
  
        if (response.status === 200) {
          localStorage.removeItem('jwt');
        } else {
          console.error('Logout failed:', response);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
}

export default logout;