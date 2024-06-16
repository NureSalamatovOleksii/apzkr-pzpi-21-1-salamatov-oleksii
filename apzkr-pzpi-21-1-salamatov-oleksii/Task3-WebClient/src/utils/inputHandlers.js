export const handleInputChange = (component, event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    component.setState({ [name]: inputValue });
  };