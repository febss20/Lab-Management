import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EquipmentList from './components/EquipmentList.js';
import EquipmentForm from './components/EquipmentForm.js';
import ActivityList from './components/ActivityList.js';
import ActivityForm from './components/ActivityForm.js';
import LabList from './components/LabList.js';
import LabDetail from './components/LabDetail.js';
import LabForm from './components/LabForm.js';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <aside className="sidebar">
                    <h1>Lab Management System</h1>
                    <nav>
                        <ul>
                            <li><Link to="/lab">Lab Form</Link></li>
                            <li><Link to="/activitie">Activity Form</Link></li>
                            <li><Link to="/equipment">Equipment Form</Link></li>
                            <li><Link to="/labs">Lab List</Link></li>
                            <li><Link to="/activities">Activity List</Link></li>
                            <li><Link to="/equipments">Equipment List</Link></li>
                        </ul>
                    </nav>
                </aside>
                <main className="content">
                    <Routes>
                        <Route path="/activitie" element={<ActivityForm />} />
                        <Route path="/equipment" element={<EquipmentForm />} />
                        <Route path="/labs" element={<LabList />} />
                        <Route path="/lab" element={<LabForm />} />
                        <Route path="/activities" element={<ActivityList />} />
                        <Route path="/equipments" element={<EquipmentList />} />
                        <Route path="/lab/:labId" element={<LabDetail />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;