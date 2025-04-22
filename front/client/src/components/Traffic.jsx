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
      {loading ? (
        <p>Loading traffic data...</p>
      ) : traffic ? (
        <div>
          {/* Traffic near RIT */}
          <p>
            <strong>Near RIT:</strong>{' '}
            <span style={{ color: getColor(traffic.traffic_at_rit) }}>
              {traffic.traffic_at_rit}
            </span>
          </p>
          <p>
            Current Speed: {toMPH(traffic.current_speed_rit)} mph
          </p>
          <p>
            Free Flow Speed: {toMPH(traffic.free_flow_speed_rit)} mph
          </p>

          <br />

          {/* Traffic from Home to RIT */}
          <p>
            <strong>From Home to RIT:</strong>{' '}
            <span style={{ color: getColor(traffic.traffic_from_home) }}>
              {traffic.traffic_from_home}
            </span>
          </p>
          <p>
            Current Speed: {toMPH(traffic.current_speed_route)} mph
          </p>
          <p>
            Free Flow Speed: {toMPH(traffic.free_flow_speed_route)} mph
          </p>
        </div>
      ) : (
        <p>Traffic data not available.</p>
      )}
    </div>
  );
}

export default Traffic;
