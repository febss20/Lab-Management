import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EquipmentForm = () => {
    const [formData, setFormData] = useState({
        equipmentName: '',
        condition: 'Excellent',
        labId: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const equipmentData = {
            equipment_name: formData.equipmentName,
            condition: formData.condition,
            lab_id: formData.labId,
            description: formData.description,
        };

        try {
            await axios.post('http://localhost:3000/equipment', equipmentData);
            setSuccess('Equipment added successfully!');
            setFormData({
                equipmentName: '',
                condition: 'Excellent',
                labId: '',
                description: '',
            });
        } catch (error) {
            const errorMessage = error.response ? error.response.data.message : 'An unexpected error occurred';
            setError('Failed to add equipment: ' + errorMessage);
        }
    };

    return (
        <div className="add-form">
            <h2 className="h2-txt">Add Equipment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Equipment Name:</label>
                    <input
                        type="text"
                        name="equipmentName"
                        value={formData.equipmentName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Condition:</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                    >
                        {['Excellent', 'Good', 'Fair', 'Poor', 'Critical'].map((condition) => (
                            <option key={condition} value={condition}>{condition}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Lab ID:</label>
                    <input
                        type="text"
                        name="labId"
                        value={formData.labId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Add Equipment</button>
            </form>
            <button onClick={() => navigate(-1)} className="delete-btn px-4 py-2 rounded">Back</button>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default EquipmentForm;