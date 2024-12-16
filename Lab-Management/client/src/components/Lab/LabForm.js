import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LabForm = () => {
    const [labId, setLabId] = useState('');
    const [labName, setLabName] = useState('');
    const [labAslab, setLabAslab] = useState({ name: '', email: '', major: '', semester: '', contact: '', nim: '' });
    const [labStaff, setLabStaff] = useState({ name: '', contact: '' });
    const [labKasublab, setLabKasublab] = useState({ name: '', email: '', department: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleChange = (setter) => (field) => (value) => {
        setter((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const labData = {
            lab_id: labId,
            lab_name: labName,
            lab_aslab: labAslab,
            lab_staff: labStaff,
            lab_kasublab: labKasublab,
        };

        try {
            await axios.post('http://localhost:3000/lab', labData);
            setSuccess('Lab added successfully!');
            resetForm();
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to add lab: ' + (error.response ? error.response.data.message : error.message));
        }
    };

    const resetForm = () => {
        setLabId('');
        setLabName('');
        setLabAslab({ name: '', email: '', major: '', semester: '', contact: '', nim: '' });
        setLabStaff({ name: '', contact: '' });
        setLabKasublab({ name: '', email: '', department: '' });
    };

    return (
        <div className="add-form">
            <h2 className="h2-txt">Add Lab</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Lab ID:</label>
                    <input type="text" value={labId} onChange={(e) => setLabId(e.target.value)} required />
                </div>
                <div>
                    <label>Lab Name:</label>
                    <input type="text" value={labName} onChange={(e) => setLabName(e.target.value)} required />
                </div>
                <div>
                    <h3>Lab Aslab</h3>
                    {['name', 'email', 'major', 'semester', 'contact', 'nim'].map((field) => (
                        <div key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                value={labAslab[field]}
                                onChange={(e) => handleChange(setLabAslab)(field)(e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <h3>Lab Staff</h3>
                    {['name', 'contact'].map((field) => (
                        <div key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                            <input
                                type="text"
                                value={labStaff[field]}
                                onChange={(e) => handleChange(setLabStaff)(field)(e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>
                <div>
                    <h3>Lab Kasublab</h3>
                    {['name', 'email', 'department'].map((field) => (
                        <div key={field}>
                            <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                value={labKasublab[field]}
                                onChange={(e) => handleChange(setLabKasublab)(field)(e.target.value)}
                                required
                            />
                        </div>
                    ))}
                </div>
                <button type="submit">Add Lab</button>
            </form>
            <button onClick={() => navigate(-1)} className="delete-btn px-4 py-2 rounded">Back</button>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default LabForm;