import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const navigate = useNavigate();

  // Fetch activities
  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:3000/activity');
      if (response.data.message === "Data fetch successfull") {
        setActivities(response.data.data);
      } else {
        setError('Failed to fetch activities: ' + response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch activities: ' + error.message);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await axios.delete(`http://localhost:3000/activity/${id}`);
        fetchActivities();
      } catch (error) {
        setError('Failed to delete activity: ' + error.message);
      }
    }
  };

  // Start editing
  const handleEdit = (activity) => {
    setEditingId(activity._id);
    setEditData({
      ...activity,
      start_time: activity.start_time.slice(0, 16),
      end_time: activity.end_time.slice(0, 16),
    });
  };

  // Handle update
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/activity/${editingId}`, editData);
      setEditingId(null);
      setEditData(null);
      fetchActivities();
    } catch (error) {
      setError('Failed to update activity: ' + error.message);
    }
  };

  const renderActivityRow = (activity) => {
    return editingId === activity._id ? (
      <>
        {/* Editing Row */}
        <td className="px-4 py-2 border">
          <input
            type="text"
            value={editData.lab_id}
            onChange={e => setEditData({ ...editData, lab_id: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </td>
        <td className="px-4 py-2 border">
          <input
            type="text"
            value={editData.activity_name}
            onChange={e => setEditData({ ...editData, activity_name: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </td>
        <td className="px-4 py-2 border">
          <select
            value={editData.activity_type}
            onChange={e => setEditData({ ...editData, activity_type: e.target.value })}
            className="w-full p-1 border rounded"
          >
            {['Research', 'Publication', 'Training', 'Final Project'].map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </td>
        <td className="px-4 py-2 border">
          <input
            type="text"
            value={editData.user.user_name}
            onChange={e => setEditData({
              ...editData,
              user: { ...editData.user, user_name: e.target.value }
            })}
            className="w-full p-1 border rounded"
          />
        </td>
        <td className="px-4 py-2 border">
          <input
            type="datetime-local"
            value={editData.start_time}
            onChange={e => setEditData({ ...editData, start_time: e.target.value })}
            className="w-full p-1 border rounded"
          />
        </td>
        <td className="px-4 py-2 border">
          <input
            type="datetime-local"
            value={editData.end_time}
            onChange={e => setEditData({ ...editData, end_time: e.target.value })}
            className="w-full p- 1 border rounded"
          />
        </td>
        <td className="px-4 py-2 border">
          <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Save</button>
          <button onClick={() => { setEditingId(null); setEditData(null); }} className="cancel-btn bg-gray-500 text-white px-2 py-1 rounded">Cancel</button>
        </td>
      </>
    ) : (
      <>
        <td className="px-4 py-2 border">{activity.lab_id}</td>
        <td className="px-4 py-2 border">{activity.activity_name}</td>
        <td className="px-4 py-2 border">{activity.activity_type}</td>
        <td className="px-4 py-2 border">{activity.user.user_name}</td>
        <td className="px-4 py-2 border">{new Date(activity.start_time).toLocaleString()}</td>
        <td className="px-4 py-2 border">{new Date(activity.end_time).toLocaleString()}</td>
        <td className="px-4 py-2 border">
          <button onClick={() => navigate(`/activity/${activity._id}`)} className="info-btn bg-blue-500 text-white px-2 py-1 rounded">Info</button>
          <button onClick={() => handleEdit(activity)} className="edit-btn">Edit</button>
          <button onClick={() => handleDelete(activity._id)} className="delete-btn">Delete</button>
        </td>
      </>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Activities List</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={() => navigate('/activitie')} className="add-list-btn bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Activity</button>
      <div className="activity-list">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Lab ID</th>
              <th className="px-4 py-2 border">Activity Name</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">User </th>
              <th className="px-4 py-2 border">Start Time</th>
              <th className="px-4 py-2 border">End Time</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map(activity => (
                <tr key={activity._id}>
                  {renderActivityRow(activity)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No activities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityList;