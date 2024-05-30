const [userDetails, setUserDetails] = useState(null);
const id = localStorage.getItem('id');


if (id) {
  fetchUserDetails(id);
}

async function fetchUserDetails(userId) {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`http://localhost:8000/api/user/${userId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
    const userDetails = await response.json();
    setUserDetails(userDetails);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}
