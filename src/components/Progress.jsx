import React from 'react';
import './Progress.css'; // Import CSS for animations and styles

const Progress = ({ progress, status }) => {
    return (
        <div className="progress-container">
            <h2 className="progress-title">Progress Overview</h2>
            <div className="progress-bar" style={{ width: `${progress}%`, background: 'linear-gradient(to right, #6c63ff, #3f8c9d)' }}>
                <span className="progress-percentage">{progress}%</span>
            </div>
            <div className="status-buttons">
                <button className={`status-button ${status === 'completed' ? 'active' : ''}`}>Completed</button>
                <button className={`status-button ${status === 'in-progress' ? 'active' : ''}`}>In Progress</button>
                <button className={`status-button ${status === 'pending' ? 'active' : ''}`}>Pending</button>
            </div>
        </div>
    );
};

export default Progress;