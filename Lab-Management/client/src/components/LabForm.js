import React, { useState } from 'react';
import axios from 'axios';

const LabForm = () => {
    const [labId, setLabId] = useState('');
    const [labName, setLabName] = useState('');
    const [labAslab, setLabAslab] = useState({ name: '', email: '', major: '', semester: '', contact: '', nim: '' });
    const [labStaff, setLabStaff] = useState({ name: '', contact: '' });
    const [labKasublab, setLabKasublab] = useState({ name: '', email: '', department: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleAslabChange = (field, value) => {
        setLabAslab({ ...labAslab, [field]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const labData = {
            lab_id: labId,
            lab_name: labName,
            lab_aslab: {
                nim: labAslab.nim,
                name: labAslab.name,
                email: labAslab.email,
                major: labAslab.major,
                semester: labAslab.semester,
                contact: labAslab.contact,
            },
            lab_staff: {
                name: labStaff.name,
                contact: labStaff.contact,
            },
            lab_kasublab: {
                name: labKasublab.name,
                email: labKasublab.email,
                department: labKasublab.department,
            },
        };

        try {
            await axios.post('http://localhost:3000/lab', labData);
            setSuccess('Lab added successfully!');
            setLabId('');
            setLabName('');
            setLabAslab({ name: '', email: '', major: '', semester: '', contact: '', nim: '' });
            setLabStaff({ name: '', contact: '' });
            setLabKasublab({ name: '', email: '', department: '' });
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                setError('Failed to add lab: ' + error.response.data.message);
            } else {
                setError('Failed to add lab: ' + error.message);
            }
        }
    };

    return (
        <div>
            <h2>Add Lab</h2>
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
                    <label>Name:</label>
                    <input
                        type="text"
                        value={labAslab.name}
                        onChange={(e) => handleAslabChange('name', e.target.value)}
                        required
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        value={labAslab.email}
                        onChange={(e) => handleAslabChange('email', e.target.value)}
                        required
                    />
                    <label>Major:</label>
                    <input
                        type="text"
                        value={labAslab.major}
                        onChange={(e) => handleAslabChange('major', e.target.value)}
                        required
                    />
                                        <label>Semester:</label>
                    <input
                        type="text"
                        value={labAslab.semester}
                        onChange={(e) => handleAslabChange('semester', e.target.value)}
                        required
                    />
                    <label>Contact:</label>
                    <input
                        type="text"
                        value={labAslab.contact}
                        onChange={(e) => handleAslabChange('contact', e.target.value)}
                        required
                    />
                    <label>NIM:</label>
                    <input
                        type="text"
                        value={labAslab.nim}
                        onChange={(e) => handleAslabChange('nim', e.target.value)}
                        required
                    />
                </div>
                <div>
                    <h3>Lab Staff</h3>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={labStaff.name}
                        onChange={(e) => setLabStaff({ ...labStaff, name: e.target.value })}
                        required
                    />
                    <label>Contact:</label>
                    <input
                        type="text"
                        value={labStaff.contact}
                        onChange={(e) => setLabStaff({ ...labStaff, contact: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <h3>Lab Kasublab</h3>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={labKasublab.name}
                        onChange={(e) => setLabKasublab({ ...labKasublab, name: e.target.value })}
                        required
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        value={labKasublab.email}
                        onChange={(e) => setLabKasublab({ ...labKasublab, email: e.target.value })}
                        required
                    />
                    <label>Department:</label>
                    <input
                        type="text"
                        value={labKasublab.department}
                        onChange={(e) => setLabKasublab({ ...labKasublab, department: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Add Lab</button>
            </form>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}
        </div>
    );
};

export default LabForm;