import React, { useState } from 'react';
import axios from 'axios';

const EquipmentForm = () => {
    const [equipmentName, setEquipmentName] = useState('');
    const [condition, setCondition] = useState('Excellent');
    const [labId, setLabId] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const equipmentData = {
            equipment_name: equipmentName,
            condition,
            lab_id: labId,
            description,
        };

        try {
            await axios.post('http://localhost:3000/equipment', equipmentData);
            setSuccess('Equipment added successfully!');
            setEquipmentName('');
            setCondition('Excellent');
            setLabId('');
            setDescription('');
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred';
            setError('Failed to add equipment: ' + errorMessage);
        }
    };

    return (
        <div>
            <h2>Add Equipment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Equipment Name:</label>
                    <input type="text" value={equipmentName} onChange={(e) => setEquipmentName(e.target.value)} required />
                </div>
                <div>
                    <label>Condition:</label>
                    <select value={condition} onChange={(e) => setCondition(e.target.value)} required>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
                <div>
                    <label>Lab ID:</label>
                    <input type="text" value={labId} onChange={(e) => setLabId(e.target.value)} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
                <button type="submit">Add Equipment</button>
            </form>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default EquipmentForm;