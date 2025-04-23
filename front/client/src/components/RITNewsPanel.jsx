import React, { useEffect, useState } from 'react';
import PanelWrapper from './PanelWrapper';
import { FaUniversity } from 'react-icons/fa';

function RITNews({ onClose, onArticleSelect }) {
  const [ritNewsItems, setRITNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRITNews = async () => {
    try {
      const response = await fetch('/api/rit-news');
      if (!response.ok) {
        throw new Error(`Error fetching news: ${response.status}`);
      }
      const data = await response.json();
      setRITNewsItems(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRITNews();
  }, []);

  return (
    <PanelWrapper title="RIT News" icon={<FaUniversity />} onClose={onClose}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'white' }}>{error}</p>}
      <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>
        {ritNewsItems.length > 0 ? (
          ritNewsItems.map((news, index) => (
            <div
              key={index}
              onClick={() => onArticleSelect(news)}
              style={{
                cursor: 'pointer',
                padding: '8px 0',
                color: 'white',
                textAlign: 'left',
                fontSize: '18px'
              }}
            >
              <div style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {news.title}
              </div>
              {index < ritNewsItems.length - 1 && (
                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid #444',
                    margin: '8px 0'
                  }}
                />
              )}
            </div>
          ))
        ) : (
          <p>No news available at the moment.</p>
        )}
      </div>
    </PanelWrapper>
  );
}

export default RITNews;
