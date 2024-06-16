export const handleInputChange = (setFormData) => (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
        ...prevFormData,
        [name]: value,
    }));
};

export const handleFormSubmit = (updateProfile) => (e) => {
    e.preventDefault();
    updateProfile();
};