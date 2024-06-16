// api.js
export const fetchData = async (url, options = {}) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };
  
  export const fetchTransportations = () => fetchData("https://localhost:7051/api/Transportation/GetTransportations", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  export const fetchOperations = () => fetchData("https://localhost:7051/api/Operation/GetOperations");
  
  export const fetchUsers = () => fetchData("https://localhost:7051/api/User/GetUsers");
  
  export const fetchCollectionPoints = () => fetchData("https://localhost:7051/api/CollectionPoint/GetCollectionPoints");
  