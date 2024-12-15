import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LabList = () => {
    const [labs, setLabs] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Fetch labs
    const fetchLabs = async () => {
        try {
            const response = await axios.get('http://localhost:3000/lab');
            if (response.data.message === "Data fetch successfull") {
                setLabs(response.data.data);
            } else {
                setError('Failed to fetch labs: ' + response.data.message);
            }
        } catch (error) {
            setError('Failed to fetch labs: ' + error.message);
        }
    };

    useEffect(() => {
        fetchLabs();
    }, []);

    const handleInfoClick = (labId) => {
        navigate(`/lab/${labId}`); 
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Lab List</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            
            <div className="lab-list">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border">Lab ID</th>
                            <th className="px-4 py-2 border">Lab Name</th>
                            <th className="px-4 py-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labs.map(lab => (
                            <tr key={lab.lab_id}>
                                <td className="px-4 py-2 border">{lab.lab_id}</td>
                                <td className="px-4 py-2 border">{lab.lab_name}</td>
                                <td className="px-4 py-2 border">
                                    <button
                                        onClick={() => handleInfoClick(lab.lab_id)}
                                        className="edit-btn px-2 py-1 rounded"
                                    >
                                        Info
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LabList;