import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/Layout';
import App from '../App';
import jwtDecode from 'jwt-decode';
import { useTranslation } from 'react-i18next';
import { getUser, updateUserPartially, deleteUser } from '../services/userService';
import { handleInputChange, handleFormSubmit } from '../utils/formHandlers';

const Profile = () => {
    const userId = localStorage.getItem('userId');
    const { t } = useTranslation();

    const [userData, setUserData] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        role: '',
        email: '',
        address: '',
        phone: '',
        recycled: '',
        bonuses: '',
        operations: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await getUser(userId);
                let initialFormData = {
                    name: data.name,
                    surname: data.surname,
                    role: data.role,
                    email: data.email,
                    address: data.address,
                    phone: data.phone,
                };

                if (localStorage.getItem('role') !== 'Admin') {
                    initialFormData.recycled = data.userStatistics.recycled;
                    initialFormData.bonuses = data.userStatistics.bonuses;
                    initialFormData.operations = data.operations;
                }

                setUserData(data);
                setFormData(initialFormData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleInputChangeLocal = handleInputChange(setFormData);

    const updateProfile = useCallback(async () => {
        const selectedFormData = {
            name: formData.name,
            surname: formData.surname,
            address: formData.address,
            phone: formData.phone,
        };

        try {
            const updatedData = await updateUserPartially(userId, selectedFormData);
            setUserData(updatedData);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }, [formData, userId]);

    const deleteProfile = useCallback(async () => {
        try {
            await deleteUser(userId);
            // Handle successful deletion, e.g., redirect or show a message
        } catch (error) {
            console.error('Error deleting resource:', error);
        }
    }, [userId]);

    const inputStyle = {
        position: 'absolute', left: '320px',
        outline: 0,
        backgroundColor: '#F1F1F1',
    };

    let role = localStorage.getItem('role');

    return (
        <div>
            <h3>{t('yourProfile')}</h3>
            <form onSubmit={handleFormSubmit(updateProfile)}>
                <div className='mt-1'>
                    <label>
                        {t('name')}
                        <input
                            className='border-top-0 border-left-0 border-right-0'
                            style={inputStyle}
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChangeLocal}
                        />
                    </label>
                </div>
                <div className='mt-1'>
                    <label>
                        {t('surname')}
                        <input
                            className='border-top-0 border-left-0 border-right-0'
                            style={inputStyle}
                            type="text"
                            name="surname"
                            value={formData.surname}
                            onChange={handleInputChangeLocal}
                        />
                    </label>
                </div>
                <div className='mt-1'>
                    <label>
                        {t('role')}
                        <input
                            className='border-top-0 border-left-0 border-right-0'
                            style={inputStyle}
                            type="text"
                            name="role"
                            value={formData.role}
                            readOnly
                        />
                    </label>
                </div>
                <div className='mt-1'>
                    <label>
                        {t('email')}
                        <input
                            className='border-top-0 border-left-0 border-right-0'
                            style={inputStyle}
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChangeLocal}
                        />
                    </label>
                </div>
                {role !== "Admin" && (
                    <>
                        <div className='mt-1'>
                            <label>
                                {t('address')}
                                <input
                                    className='border-top-0 border-left-0 border-right-0'
                                    style={inputStyle}
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChangeLocal}
                                />
                            </label>
                        </div>
                        <div className='mt-1'>
                            <label>
                                {t('phone')}
                                <input
                                    className='border-top-0 border-left-0 border-right-0'
                                    style={inputStyle}
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChangeLocal}
                                />
                            </label>
                        </div>
                        <div className='mt-1'>
                            <label>
                                {t('birthday')}
                                <input
                                    className='border-top-0 border-left-0 border-right-0'
                                    style={inputStyle}
                                    type="text"
                                    name="birthday"
                                    value={formData.birthday}
                                    onChange={handleInputChangeLocal}
                                />
                            </label>
                        </div>
                    </>
                )}
                
                <div>
                    <button type="submit" className='btn btn-primary mr-3 mt-3'>{t('updateProfile')}</button>
                    <button type='button' className='btn btn-outline-danger mt-3' onClick={deleteProfile}>{t('deleteAccount')}</button>
                </div>
            </form>
            {role !== "Admin" && (
                <div style={{position: 'absolute', top: '72px', left: '700px'}}>
                    <h3>{t('statistics')}</h3>
                    <p>{t('recycled')}: {formData.recycled}</p>
                    <p>{t('bonuses')}: {formData.bonuses}</p>
                </div>
            )}

            {role !== "Admin" && (
                <div style={{position: 'absolute', top: '190px', left: '700px', maxWidth: '500px' }}>
                    <h3>{t('operations')}</h3>
                    <table className="table table-striped" style={{ fontSize: '14px' }}>
                        <thead>
                            <tr>
                                <th>{t('id')}</th>
                                <th>{t('trashType')}</th>
                                <th>{t('weight')}</th>
                                <th>{t('volume')}</th>
                                <th>{t('time')}</th>
                                <th>{t('point')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(formData.operations).map((operation, index) => (
                                <tr key={index}>
                                    <td>{operation.id}</td>
                                    <td>{operation.trashType}</td>
                                    <td>{operation.weight}</td>
                                    <td>{operation.volume}</td>
                                    <td>{operation.time}</td>
                                    <td>{operation.collectionPointID}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Profile;
