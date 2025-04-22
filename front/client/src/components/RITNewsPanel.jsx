import React, { useEffect, useState } from 'react';
import PanelWrapper from './PanelWrapper';

function RITNews({ onClose, onArticleSelect }) {
  const [ritNewsItems, setRITNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRITNews = async () => {
    try {
      const response = await fetch('/RITNews');
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
    <PanelWrapper title="RIT News" onClose={onClose}>
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
                fontSize: '13px'
              }}
            >
              {news.title}
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
