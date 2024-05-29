const [userDetails, setUserDetails] = useState(null);
const token = localStorage.getItem('token');
let userInfo = null;

if (token) {
  userInfo = jwtDecode(token);
  fetchUserDetails(userInfo.user_id);
}

const fetchUserData = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/auth/users/me/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const userData = await response.json();
      console.log(userData); 
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  