import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const LabDetail = () => {
    const { labId } = useParams();
    const [lab, setLab] = useState(null);
    const [error, setError] = useState('');
<<<<<<< HEAD
    const [editingEntity, setEditingEntity] = useState(null);
    const [formData, setFormData] = useState({});
=======
    const [editingEntity, setEditingEntity] = useState(null); 
    const [formData, setFormData] = useState({}); 
>>>>>>> ad6dd34dd3999b01c0c947f7592ec1b4f2f66bcb
    const [isAdding, setIsAdding] = useState(false);
    const navigate = useNavigate();

    // Fetch lab details
    const fetchLabDetails = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:3000/lab/${labId}`);
            if (response.data.message === "Data fetch successfull") {
                setLab(response.data.data);
            } else {
                setError('Failed to fetch lab details: ' + response.data.message);
            }
        } catch (error) {
            setError('Failed to fetch lab details: ' + error.message);
        }
    }, [labId]);

    useEffect(() => {
        fetchLabDetails();
    }, [fetchLabDetails]);

    // Handle delete Aslab
    const handleDeleteAslab = async (nim) => {
        if (window.confirm('Are you sure you want to delete this Aslab?')) {
            try {
                await axios.delete(`http://localhost:3000/lab/${labId}/aslab/${nim}`);
                fetchLabDetails();
            } catch (error) {
                setError('Failed to delete aslab: ' + error.message);
            }
        }
    };

    // Handle Add/Edit Aslab, Staff, Kasublab
    const handleAddOrEdit = (entity, data = {}) => {
        setEditingEntity(entity);
        setIsAdding(!data.nim);
        setFormData({
            name: data.name || '',
            contact: data.contact || '',
            email: data.email || '',
            major: data.major || '',
            semester: data.semester || '',
            nim: data.nim || ''
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `http://localhost:3000/lab/${labId}/${editingEntity}`;
            if (editingEntity === 'aslab') {
                const method = isAdding ? 'post' : 'put';
                await axios[method](url + (isAdding ? '' : `/${formData.nim}`), formData);
            } else {
                await axios.put(url, formData);
            }
            setEditingEntity(null);
            setIsAdding(false);
            fetchLabDetails();
        } catch (error) {
            setError('Failed to update: ' + error.message);
        }
    };

    const handleCancel = () => {
        setEditingEntity(null);
        setIsAdding(false);
        setFormData({});
    };

    return (
        <div className="lab-detail-table">
            <h2 className="text-2xl font-bold mb-4">Details for Lab ID: {labId}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            {lab && (
                <>
                    <h4 className="font-semibold mt-4">Aslab</h4>
                    <button 
                        onClick={() => handleAddOrEdit('aslab')} 
                        className="add-aslab bg-green-500 text-white px-4 py-2 rounded mb-2">
                        Add Aslab
                    </button>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Contact</th>
                                <th>Email</th>
                                <th>Major</th>
                                <th>Semester</th>
                                <th>NIM</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lab.lab_aslab.length > 0 ? (
                                lab.lab_aslab.map(aslab => (
                                    <tr key={aslab.nim} className="border-b">
                                        <td>{aslab.name}</td>
                                        <td>{aslab.contact}</td>
                                        <td>{aslab.email}</td>
                                        <td>{aslab.major}</td>
                                        <td>{aslab.semester}</td>
                                        <td>{aslab.nim}</td>
                                        <td>
                                            <button onClick={() => handleAddOrEdit('aslab', aslab)} className="px-2 py-1 rounded bg-blue-500 text-white">Edit</button>
                                            <button onClick={() => handleDeleteAslab(aslab.nim)} className="delete-btn px-2 py-1 rounded bg-red-500 text-white">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">Tidak ada aslab</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <h4 className="font-semibold mt-4">Staff</h4>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Contact</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lab.lab_staff ? (
                                <tr>
                                    <td>{lab.lab_staff.name}</td>
                                    <td>{lab.lab_staff.contact}</td>
                                    <td>
                                        <button onClick={() => handleAddOrEdit('staff', lab.lab_staff)} className="edit-btn px-2 py-1 rounded">Edit</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="3">Tidak ada Staff</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <h4 className="font-semibold mt-4">Kasublab</h4>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lab.lab_kasublab ? (
                                <tr className="flex justify-between items-center border-b py-2">
                                    <td>{lab.lab_kasublab.name}</td>
                                    <td>{lab.lab_kasublab.email}</td>
                                    <td>{lab.lab_kasublab.department}</td>
                                    <td className="action-buttons">
                                        <button onClick={() => handleAddOrEdit('kasublab', lab.lab_kasublab)} className="edit-btn px-2 py-1 rounded">Edit</button>
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td colSpan="4">Tidak ada Kasublab</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <button onClick={() => navigate(-1)} className="delete-btn px-4 py-2 rounded">Back</button>

                    {/* Edit Form */}
                    {editingEntity && (
                        <div className="edit-form-overlay">
                            <div className="edit-form-container">
                                <h3>{isAdding ? 'Add' : 'Edit'} {editingEntity}</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label>Name:</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    {editingEntity === 'staff' && (
                                        <div className="form-group">
                                            <label>Contact:</label>
                                            <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                                        </div>
                                    )}
                                    {editingEntity === 'kasublab' && (
                                        <>
                                            <div className="form-group">
                                                <label>Email:</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Department:</label>
                                                <input type="text" name="department" value={formData.department} onChange={handleChange} required />
                                            </div>
                                        </>
                                    )}
                                    {editingEntity === 'aslab' && (
                                        <>
                                            <div className="form-group">
                                                <label>Contact:</label>
                                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Email:</label>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Major:</label>
                                                < input type="text" name="major" value={formData.major} onChange={handleChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Semester:</label>
                                                <input type="text" name="semester" value={formData.semester} onChange={handleChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label>NIM:</label>
                                                <input type="text" name="nim" value={formData.nim} onChange={handleChange} required disabled={!isAdding} />
                                            </div>
                                        </>
                                    )}
                                    <button type="submit" className="save-btn px-4 py-2 rounded">Save</button>
                                    <button type="button" onClick={handleCancel} className="cancel-btn px-4 py-2 rounded">Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LabDetail;
