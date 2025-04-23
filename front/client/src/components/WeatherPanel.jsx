import React, { useEffect, useState } from 'react';
import PanelWrapper from './PanelWrapper';
import { FaCloudSun } from 'react-icons/fa';

const WeatherPanel = ({ onClose }) => {
  const [daysWeather, setDaysWeather] = useState(null);
  const [error, setError] = useState(null);
  const weatherURL = '/api/weather';

  const fetchWeather = async () => {
    try {
      const response = await fetch(weatherURL);
      const data = await response.json();
      setDaysWeather(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const renderForecastTable = () => {
    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (!daysWeather) {
      return <p>Loading...</p>;
    }

    const { time, temperature_2m_max, temperature_2m_min } = daysWeather.daily;

    return (
      <table style={{ width: '100%', color: 'white', fontSize: '18px', borderCollapse: 'collapse' }}>
        <thead style={{borderBottom: 'thin solid #444'}}>
          <tr>
            <th style={{paddingBottom: '8px' }}>
                <div style={{ margin: '0 auto', width: '60%', textAlign: 'left' }}>
                    Day
                </div>
            </th>
            <th style={{paddingBottom: '8px' }}>
                <div style={{ margin: '0 auto', width: '60%', textAlign: 'left' }}>
                    Min
                </div>
            </th>
            <th style={{paddingBottom: '8px' }}>
                <div style={{ margin: '0 auto', width: '60%', textAlign: 'left' }}>
                    Max
                </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {time.map((date, index) => (
            <tr key={date}>
            <td style={{ paddingBottom: '6px' }}>
                <div style={{ margin: '0 auto', width: '60%', textAlign: 'left' }}>
                    {new Date(date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    })}
                </div>
            </td>
              <td style={{ paddingBottom: '6px' }}>
                <div style={{ margin: '0 auto', width: '60%', textAlign: 'left' }}>
                    {temperature_2m_min[index]}°C
                </div>
              </td>
              <td style={{ paddingBottom: '6px' }}>
                <div style={{ margin: '0 auto', width: '60%', textAlign: 'left' }}>
                    {temperature_2m_max[index]}°C
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <PanelWrapper title="Weather Forecast" icon={<FaCloudSun />} onClose={onClose}>
      <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '6px' }}>
        {renderForecastTable()}
      </div>
    </PanelWrapper>
  );
};

export default WeatherPanel;
