import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = () => {
    const [formData, setFormData] = useState({
        labId: '',
        activityName: '',
        activityType: 'Research',
        userNimNip: '',
        userName: '',
        participantCount: 1,
        startTime: '',
        endTime: '',
        equipmentUsed: [{ equipment_id: '', conditionAfterUse: 'Excellent' }],
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleEquipmentChange = (index, field, value) => {
        const newEquipmentUsed = [...formData.equipmentUsed];
        newEquipmentUsed[index][field] = value;
        setFormData((prevData) => ({ ...prevData, equipmentUsed: newEquipmentUsed }));
    };

    const addEquipmentField = () => {
        setFormData((prevData) => ({
            ...prevData,
            equipmentUsed: [...prevData.equipmentUsed, { equipment_id: '', conditionAfterUse: 'Excellent' }],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const { equipmentUsed, labId, activityName, activityType, userNimNip, userName, participantCount, startTime, endTime } = formData;

        if (!equipmentUsed.every((equipment) => equipment.equipment_id)) {
            setError('Failed to add activity: Equipment ID is required');
            return;
        }

        const activityData = {
            lab_id: labId,
            activity_name: activityName,
            activity_type: activityType,
            user: {
                user_nim_nip: userNimNip,
                user_name: userName,
                participant_count: participantCount,
            },
            start_time: startTime,
            end_time: endTime,
            equipment_used: equipmentUsed.map(({ equipment_id, conditionAfterUse }) => ({
                equipment_id,
                condition_after_use: conditionAfterUse,
            })),
        };

        try {
            await axios.post('http://localhost:3000/activity', activityData);
            setSuccess('Activity added successfully!');
            setFormData({
                labId: '',
                activityName: '',
                activityType: 'Research',
                userNimNip: '',
                userName: '',
                participantCount: 1,
                startTime: '',
                endTime: '',
                equipmentUsed: [{ equipment_id: '', conditionAfterUse: 'Excellent' }],
            });
        } catch (error) {
            setError(error.response ? `Failed to add activity: ${error.response.data.message}` : `Failed to add activity: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Add Activity</h2>
            <form onSubmit={handleSubmit}>
                {['labId', 'activityName', 'userNimNip', 'userName'].map((field) => (
                    <div key={field}>
                        <label>{field.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</label>
                        <input
                            type="text"
                            name={field}
                            value={formData[field]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <div>
                    <label>Activity Type:</label>
                    <select name="activityType" value={formData.activityType} onChange={handleChange} required>
                        {['Research', 'Publication', 'Training', 'Final Project'].map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Participant Count:</label>
                    <input
                        type="number"
                        name="participantCount"
                        value={formData.participantCount}
                        onChange={handleChange}
                        required
                    />
                </div>
                {['startTime', 'endTime'].map((timeField) => (
                    <div key={timeField}>
                        <label>{timeField.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}:</label>
                        <input
                            type="datetime-local"
                            name={timeField}
                            value={formData[timeField]}
                            onChange={handleChange}
                            required
                            />
                            </div>
                        ))}
                        <div>
                            <h3>Equipment Used</h3>
                            {formData.equipmentUsed.map((equipment, index) => (
                                <div key={index}>
                                    <label>Equipment ID:</label>
                                    <input
                                        type="text"
                                        value={equipment.equipment_id}
                                        onChange={(e) => handleEquipmentChange(index, 'equipment_id', e.target.value)}
                                        required
                                    />
                                    <label>Condition After Use:</label>
                                    <select
                                        value={equipment.conditionAfterUse}
                                        onChange={(e) => handleEquipmentChange(index, 'conditionAfterUse', e.target.value)}
                                        required
                                    >
                                        {['Excellent', 'Good', 'Fair', 'Poor', 'Critical'].map((condition) => (
                                            <option key={condition} value={condition}>{condition}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                            <button type="button" onClick={addEquipmentField}>Add Equipment</button>
                        </div>
                        <button type="submit">Add Activity</button>
                    </form>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                </div>
            );
        };
        
        export default ActivityForm;