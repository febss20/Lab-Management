import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ActivityDetail = () => {
    const { activityId } = useParams();
    const [activity, setActivity] = useState({ user: {}, equipment_used: [] });
    const [error, setError] = useState('');
    const [editingEntity, setEditingEntity] = useState(null);
    const [formData, setFormData] = useState({});
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    // Fetch activity details
    const fetchActivityDetails = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3000/activity/${activityId}`);
            if (response.data.message === "Data fetch successfull") {
                setActivity(response.data.data);
            } else {
                setError(`Failed to fetch activity details: ${response.data.message}`);
            }
        } catch (error) {
            setError(`Failed to fetch activity details: ${error.message}`);
        }
    }, [activityId]);

    useEffect(() => {
        fetchActivityDetails();
    }, [fetchActivityDetails]);

    const handleEditUser  = (data = {}) => {
        setEditingEntity('user');
        setIsAdding(!data.user_nim_nip);
        setFormData({
            user_nim_nip: data.user_nim_nip || '',
            user_name: data.user_name || '',
            participant_count: data.participant_count || '',
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitUser  = async (e) => {
        e.preventDefault();
        try {
            const updatedActivity = {
                ...activity,
                user: { ...activity.user, ...formData },
            };
            await axios.put(`http://localhost:3000/activity/${activityId}`, updatedActivity);
            resetEditing();
            fetchActivityDetails();
        } catch (error) {
            setError(`Failed to update user: ${error.message}`);
        }
    };

    const handleEditEquipment = (data = {}) => {
        setEditingEntity('equipment');
        setIsAdding(!data.equipment_id);
        setFormData({
            equipment_id: data.equipment_id || '',
            condition_after_use: data.condition_after_use || '',
        });
    };

    const handleSubmitEquipment = async (e) => {
        e.preventDefault();
        try {
            const updatedActivity = {
                ...activity,
                equipment_used: activity.equipment_used.map(equipment =>
                    equipment.equipment_id === formData.equipment_id
                        ? { ...equipment, ...formData }
                        : equipment
                ),
            };

            if (!activity.equipment_used.some(equipment => equipment.equipment_id === formData.equipment_id)) {
                updatedActivity.equipment_used.push({
                    equipment_id: formData.equipment_id,
                    condition_after_use: formData.condition_after_use,
                });
            }

            await axios.put(`http://localhost:3000/activity/${activityId}`, updatedActivity);
            resetEditing();
            fetchActivityDetails();
        } catch (error) {
            setError(`Failed to update equipment: ${error.message}`);
        }
    };

    const handleDeleteEquipment = async (equipmentId) => {
        if (window.confirm('Are you sure you want to delete this equipment?')) {
            try {
                const updatedActivity = {
                    ...activity,
                    equipment_used: activity.equipment_used.filter(equipment => equipment.equipment_id !== equipmentId),
                };
                await axios.put(`http://localhost:3000/activity/${activityId}`, updatedActivity);
                fetchActivityDetails();
            } catch (error) {
                setError(`Failed to delete equipment: ${error.message}`);
            }
        }
    };

    const resetEditing = () => {
        setEditingEntity(null);
        setIsAdding(false);
        setFormData({});
    };

    return (
        <div className="activity-detail-table">
            <h2 className="text-2xl font-bold mb-4">Details for Activity ID: {activityId}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {activity && (
                <>
                    <h4 className="h4-txt font-semibold mt-4">User </h4>
                    <UserTable user={activity.user} onEdit={handleEditUser } />
                    <h4 className="font-semibold mt-4">Equipment Used</h4>
                    <button 
                        onClick={handleEditEquipment} 
                        className="add-equipment bg-green-500 text-white px-4 py-2 rounded mb-2">
                        Add Equipment
                    </button>
                    <EquipmentTable 
                        equipmentUsed={activity.equipment_used} 
                        onEdit={handleEditEquipment} 
                        onDelete={handleDeleteEquipment} 
                    />

                    {editingEntity === 'user' && (
                        <EditForm 
                            title={isAdding ? 'Add User' : 'Edit User'} 
                            formData={formData} 
                            onChange={handleChange} 
                            onSubmit={handleSubmitUser } 
                            onCancel={resetEditing} 
                        />
                    )}

                    {editingEntity === 'equipment' && (
                        <EditForm 
                            title={isAdding ? 'Add Equipment' : 'Edit Equipment'} 
                            formData={formData} 
                            onChange={handleChange} 
                            onSubmit={handleSubmitEquipment} 
                            onCancel={resetEditing} 
                        />
                    )}

                    <button onClick={() => navigate(-1)} className="delete-btn mt-4 bg-gray-300 text-black px-4 py-2 rounded">Back</button>
                </>
            )}
        </div>
    );
};

const UserTable = ({ user, onEdit }) => (
    <table className="w-full border-collapse mb-4">
        <thead>
            <tr>
                <th>NIM/NIP</th>
                <th>User Name</th>
                <th>Participant Count</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {user.user_name ? (
                <tr>
                    <td>{user.user_nim_nip}</td>
                    <td>{user.user_name}</td>
                    <td>{user.participant_count}</td>
                    <td>
                        <button onClick={() => onEdit(user)} className="px-2 py-1 rounded bg-blue-500 text-white">Edit</button>
                    </td>
                </tr>
            ) : (
                <tr>
                    <td colSpan="4">Tidak ada pengguna</td>
                </tr>
            )}
        </tbody>
    </table>
);

const EquipmentTable = ({ equipmentUsed, onEdit, onDelete }) => (
    <table className="w-full border-collapse">
        <thead>
            <tr>
                <th>Equipment ID</th>
                <th>Condition After Use</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {equipmentUsed.length > 0 ? (
                equipmentUsed.map(equipment => (
                    <tr key={equipment.equipment_id} className="border-b">
                        <td>{equipment.equipment_id}</td>
                        <td>{equipment.condition_after_use}</td>
                        <td>
                            <button onClick={() => onEdit(equipment)} className="px-2 py-1 rounded bg-blue-500 text-white">Edit</button>
                            <button onClick={() => onDelete(equipment.equipment_id)} className="delete-btn px-2 py-1 rounded bg-red-500 text-white">Delete</button>
                        </td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="3">Tidak ada peralatan yang digunakan</td>
                </tr>
            )}
        </tbody>
    </table>
);

const EditForm = ({ title, formData, onChange, onSubmit, onCancel }) => (
    <div className="edit-form-overlay">
        <div className="edit-form-container">
            <form onSubmit={onSubmit} className="mt-4">
                <h5 className="font-semibold">{title}</h5>
                {Object.keys(formData).map((key) => (
                    <div key={key}>
                        <label htmlFor={key}>{key.replace(/_/g, ' ').toUpperCase()}:</label>
                        {key === 'condition_after_use' ? (
                            <select
                                value={formData[key]}
                                onChange={onChange}
                                name={key}
                                required
                            >
                                {['Excellent', 'Good', 'Fair', 'Poor', 'Critical'].map((condition) => (
                                    <option key={condition} value={condition}>{condition}</option>
                                ))}
                            </select>
                        ) : (
                            <input 
                                type={key === 'participant_count' ? 'number' : 'text'} 
                                name={key} 
                                value={formData[key]} 
                                onChange={onChange} 
                                required 
                                class ="border rounded px-2 py-1"
                            />
                        )}
                    </div>
                ))}
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
                    {title.includes('Add') ? 'Add' : 'Save'}
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-300 text-black px-4 py-2 rounded mt-2 ml-2">
                    Cancel
                </button>
            </form>
        </div>
    </div>
);

export default ActivityDetail;