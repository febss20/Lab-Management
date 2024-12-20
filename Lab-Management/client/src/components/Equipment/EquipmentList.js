import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

  const navigate = useNavigate();

  // Fetch equipments
  const fetchEquipments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/equipment');
      if (response.data.message === "Data fetch successfull") {
        setEquipments(response.data.data);
      } else {
        setError('Failed to fetch equipments: ' + response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch equipments: ' + error.message);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this equipment?')) {
      try {
        await axios.delete(`http://localhost:3000/equipment/${id}`);
        fetchEquipments();
      } catch (error) {
        setError('Failed to delete equipment: ' + error.message);
      }
    }
  };

  // Start editing
  const handleEdit = (equipment) => {
    setEditingId(equipment._id);
    setEditData({ ...equipment });
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/equipment/${editingId}`, editData);
      setEditingId(null);
      setEditData(null);
      fetchEquipments();
    } catch (error) {
      setError('Failed to update equipment: ' + error.message);
    }
  };

  const renderEquipmentRow = (equipment) => {
    return editingId === equipment._id ? (
      <>
        <td className="px-4 py-2 border">
          <input
            type="text"
            value={editData.equipment_name}
            onChange={e => setEditData({ ...editData, equipment_name: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </td>
        <td className="px-4 py-2 border">
          <select
            value={editData.condition}
            onChange={e => setEditData({ ...editData, condition: e.target.value })}
            className="w-full p-1 border rounded"
          >
            {['Excellent', 'Good', 'Fair', 'Poor', 'Critical'].map(condition => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </td>
        {['lab_id', 'last_used', 'first_added', 'last_maintanance'].map((field, index) => (
          <td className="px-4 py-2 border" key={index}>
            <input
              type={field.includes('used') || field.includes('added') || field === 'last_maintanance' ? 'date' : 'text'}
              value={editData[field]}
              onChange={e => setEditData({ ...editData, [field]: e.target.value })}
              className="w-full p-1 border rounded"
            />
          </td>
        ))}
        <td className="px-4 py-2 border">
          <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Save</button>
          <button onClick={() => { setEditingId(null); setEditData(null); }} className="cancel-btn bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
        </td>
      </>
    ) : (
      <>
        <td className="px-4 py-2 border">{equipment.equipment_name}</td>
        <td className="px-4 py-2 border">{equipment.condition}</td>
        <td className="px-4 py-2 border">{equipment.lab_id}</td>
        <td className="px-4 py-2 border">{equipment.last_used}</td>
        <td className="px-4 py-2 border">{equipment.first_added}</td>
        <td className="px-4 py-2 border">{equipment.last_maintanance}</td>
        <td className="px-4 py-2 border">
          <button onClick={() => handleEdit(equipment)} className="edit-btn px-2 py-1 rounded mr-2">Edit</button>
          <button onClick={() => handleDelete(equipment._id)} className="delete-btn px-2 py-1 rounded">Delete</button>
        </td>
      </>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Equipment List</h2>
      <button onClick={() => navigate('/equipment')} className="add-list-btn bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Equipment</button>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <div className="equipment-list">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Condition</th>
              <th className="px-4 py-2 border">Lab ID</th>
              <th className="px-4 py-2 border">Last Used</th>
              <th className="px-4 py-2 border">First Added</th>
              <th className="px-4 py-2 border">Last Maintenance</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipments.map(equipment => (
              <tr key={equipment._id}>
                {renderEquipmentRow(equipment)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentList;