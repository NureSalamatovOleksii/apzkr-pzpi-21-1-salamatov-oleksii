export const getUser = async (userId) => {
    const response = await fetch(`https://localhost:7051/api/User/GetUser/${Number(userId)}`);
    if (!response.ok) {
        throw new Error('Error fetching data');
    }
    return response.json();
};

export const updateUserPartially = async (userId, selectedFormData) => {
    const response = await fetch(`https://localhost:7051/api/User/UpdateUsertPartially/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedFormData),
    });
    if (!response.ok) {
        throw new Error('Error updating data');
    }
    return response.json();
};

export const deleteUser = async (userId) => {
    const response = await fetch(`https://localhost:7051/api/Users/DeleteUser/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to delete resource with ID ${userId}`);
    }
};
