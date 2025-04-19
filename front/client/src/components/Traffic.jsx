import React, { useEffect, useState } from 'react';

function Traffic() {
  const [traffic, setTraffic] = useState(null);
  const [loading, setLoading] = useState(true);

  const toMPH = (kmh) => Math.round(kmh * 0.621371);

  const getColor = (level) => {
    if (level === 'Low') return 'green';
    if (level === 'Moderate') return 'orange';
    if (level === 'High') return 'red';
    return 'black';
  };

  useEffect(() => {
    fetch('/api/traffic-level')
      .then(res => res.json())
      .then(data => {
        setTraffic(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching traffic data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Traffic Near RIT</h2>
      {loading ? (
        <p>Loading traffic data...</p>
      ) : traffic && traffic.traffic_level ? (
        <div>
          <p>
            Traffic Level:{" "}
            <strong style={{ color: getColor(traffic.traffic_level) }}>
              {traffic.traffic_level}
            </strong>
          </p>
          <p>Current Speed: {toMPH(traffic.current_speed)} mph</p>
          <p>Free Flow Speed: {toMPH(traffic.free_flow_speed)} mph</p>
        </div>
      ) : (
        <p>Traffic data not available.</p>
      )}
    </div>
  );
}

export default Traffic;
