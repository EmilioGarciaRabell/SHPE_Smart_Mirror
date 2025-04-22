import React, { useState, useEffect } from 'react';
import PanelWrapper from './PanelWrapper';

function NewsPanel({ onClose, onArticleSelect }) {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/api/local-news?country=us&city=Rochester')
      .then(res => res.json())
      .then(data => setArticles(data.results || []))
      .catch(err => console.error('Error fetching news:', err));
  }, []);

  const shorten = (text, max = 80) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  return (
    <PanelWrapper title="News" onClose={onClose}>
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        paddingRight: '8px',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
      }}>
        <style>{`::-webkit-scrollbar { display: none; }`}</style>

        {articles.slice(0, 5).map((article, i) => (
          <div
            key={i}
            onClick={() => onArticleSelect(article)}
            style={{
              cursor: 'pointer',
              padding: '8px 0',
              color: 'white',
              textAlign: 'left',
              fontSize: '13px',
            }}
          >
            {shorten(article.title)}
            {i < 4 && (
              <hr style={{
                border: 'none',
                borderTop: '1px solid #444',
                margin: '8px 0'
              }} />
            )}
          </div>
        ))}
      </div>
    </PanelWrapper>
  );
}

export default NewsPanel;
