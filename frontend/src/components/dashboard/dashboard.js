import React from 'react';
import './dashboard.css';

var test_data = {
  "servers": [
    {
      'name': 'survival',
      'users_connected': 5,
      'max_users': 10
    },
    {
      'name': 'creative',
      'users_connected': 20,
      'max_users': 30
    }
  ]
};

function Dashboard() {
  return (
    <div className="dashboard-div">
    {test_data.servers.map((element) => {
      return (
        <div className="dashboard-div-card">
          <h2>{element.name}</h2>
        </div>
      )
    })}
    </div>
  )
}

export default Dashboard;
