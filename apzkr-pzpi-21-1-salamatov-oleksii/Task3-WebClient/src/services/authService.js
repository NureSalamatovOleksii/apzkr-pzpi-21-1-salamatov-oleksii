export const login = async (email, password, rememberMe) => {
    const url = `https://localhost:7051/token?email=${email}&password=${password}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, rememberMe }),
    });
  
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Authentication failed');
    }
  };