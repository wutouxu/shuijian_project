
import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.text())
      .then(response => {
        setData(response);
      });
  }, []);


  return (
    <div>
      <h2>Data Dashboard</h2>
      <p>{data}</p>
    </div>
  );
}

export default Dashboard;



