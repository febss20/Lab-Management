import React, { useState } from 'react';
import axios from 'axios';

const ActivityForm = () => {
    const [labId, setLabId] = useState('');
    const [activityName, setActivityName] = useState('');
    const [activityType, setActivityType] = useState('Research');
    const [userNimNip, setUserNimNip] = useState('');
    const [userName, setUserName] = useState('');
    const [participantCount, setParticipantCount] = useState(1);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [equipmentUsed, setEquipmentUsed] = useState([{ equipment_id: '', conditionAfterUse: 'Excellent' }]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleEquipmentChange = (index, field, value) => {
        const newEquipmentUsed = [...equipmentUsed];
        if (field === 'equipment_id') {
            const equipment_id = value.toString(); 
            newEquipmentUsed[index]['equipment_id'] = equipment_id;
        } else {
            newEquipmentUsed[index][field] = value;
        }
        setEquipmentUsed(newEquipmentUsed);
    };

    const addEquipmentField = () => {
        setEquipmentUsed([...equipmentUsed, { equipment_id: '', conditionAfterUse: 'Excellent' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validasi equipment_used
        const equipmentUsedValid = equipmentUsed.every((equipment) => equipment.equipment_id !== '');

        if (!equipmentUsedValid) {
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
            equipment_used: equipmentUsed.map(equipment => ({
            equipment_id: equipment.equipment_id, // Ubah di sini
            condition_after_use: equipment.conditionAfterUse,
            })),
        };

        console.log('Equipment Used:', activityData.equipment_used); // tambahkan ini

        try { 
            await axios.post('http://localhost:3000/activity', activityData);
            setSuccess('Activity added successfully!');
            // Reset form fields
            setLabId('');
            setActivityName('');
            setActivityType('Research');
            setUserNimNip('');
            setUserName('');
            setParticipantCount(1);
            setStartTime('');
            setEndTime('');
            setEquipmentUsed([{ equipment_id: '', conditionAfterUse: 'Excellent' }]);
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                setError('Failed to add activity: ' + error.response.data.message);
            } else {
                setError('Failed to add activity: ' + error.message);
            }
        }
    };

    return (
        <div>
            <h2>Add Activity</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Lab ID:</label>
                    <input type="text" value={labId} onChange={(e) => setLabId(e.target.value)} required />
                </div>
                <div>
                    <label>Activity Name:</label>
                    <input type="text" value={activityName} onChange={(e) => setActivityName(e.target.value)} required />
                </div>
                <div>
                    <label>Activity Type:</label>
                    <select value={activityType} onChange={(e) => setActivityType(e.target.value)} required>
                        <option value="Research">Research</option>
                        <option value="Publication">Publication</option>
                        <option value="Training">Training</option>
                        <option value="Final Project">Final Project</option>
                    </select>
                </div>
                <div>
                    <label>User NIM/NIP:</label>
                    <input type="text" value={userNimNip} onChange={(e) => setUserNimNip(e.target.value)} required />
                </div>
                <div>
                    <label>User Name:</label>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required />
                </div>
                <div>
                    <label>Participant Count:</label>
                    <input type="number" value={participantCount} onChange={(e) => setParticipantCount(e.target.value)} required />
                </div>
                <div>
                    <label>Start Time:</label>
                    <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div>
                    <label>End Time:</label>
                    <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </div>
                <div>
                    <h3>Equipment Used</h3>
                    {equipmentUsed.map((equipment, index) => (
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
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Fair">Fair</option>
                                <option value="Poor">Poor</option>
                                <option value="Critical">Critical</option>
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