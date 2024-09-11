export const checkUserPermissions = async (userId) => {
    let isAdmin = false;
    let isOrgAccount = false;

    try {
        // Verificar si el usuario es administrador
        const adminResponse = await fetch(`http://localhost:8000/api/isAdmin/?user_id=${userId}`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const adminData = await adminResponse.json();
        isAdmin = adminData;

        // Verificar si el usuario pertenece a una cuenta de organización
        const orgAccountResponse = await fetch(`http://localhost:8000/api/user/${userId}/check-usertype/`, { 
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const orgAccountData = await orgAccountResponse.json();
        if (orgAccountData.user_type === 2) {
            isOrgAccount = true;
        }
    } catch (error) {
        console.error("Error checking user permissions:", error);
    }

    return { isAdmin, isOrgAccount };
};
