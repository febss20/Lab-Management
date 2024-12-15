import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EquipmentList = () => {
  const [equipments, setEquipments] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Equipment List</h2>
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
                {editingId === equipment._id ? (
                  // Edit mode
                  <>
                    <td className="px-4 py-2 border">
                      <input
                        type="text"
                        value={editData.equipment_name}
                        onChange={e => setEditData({...editData, equipment_name: e.target.value})}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <select
                        value={editData.condition}
                        onChange={e => setEditData({...editData, condition: e.target.value})}
                        className="w-full p-1 border rounded"
                      >
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 border">
                    <input
                        type="text"
                        value={editData.lab_id}
                        onChange={e => setEditData({...editData, lab_id: e.target.value})}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="date"
                        value={editData.last_used}
                        onChange={e => setEditData({...editData, last_used: e.target.value})}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="date"
                        value={editData.first_added}
                        onChange={e => setEditData({...editData, first_added: e.target.value})}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="date"
                        value={editData.last_maintanance}
                        onChange={e => setEditData({...editData, last_maintanance: e.target.value})}
                        className="w-full p-1 border rounded"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditData(null);
                        }}
                        className="cancel-btn bg-gray-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  // View mode
                  <>
                    <td className="px-4 py-2 border">{equipment.equipment_name}</td>
                    <td className="px-4 py-2 border">{equipment.condition}</td>
                    <td className="px-4 py-2 border">{equipment.lab_id}</td>
                    <td className="px-4 py-2 border">{equipment.last_used}</td>
                    <td className="px-4 py-2 border">{equipment.first_added}</td>
                    <td className="px-4 py-2 border">{equipment.last_maintanance}</td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleEdit(equipment)}
                        className="edit-btn px-2 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(equipment._id)} 
                        className="delete-btn px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EquipmentList;