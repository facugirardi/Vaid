






export default async function fetchUserDetails(userId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8000/api/user/${userId}/`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch user details');
        }
        const userDetails = await response.json();
        return userDetails;
    } catch (error) {
        return null;
    }
}
