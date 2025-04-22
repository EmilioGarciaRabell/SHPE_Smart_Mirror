import React, { useEffect, useState } from 'react';

function News({ country, city }) {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/local-news?country=${country}&city=${city}`)
      .then(res => res.json())
      .then(data => {
        setArticles(data.results || []);
      })
      .catch(err => {
        console.error('Error fetching news:', err);
      });
  }, [country, city]);

  const shorten = (text, max = 60) =>
    text.length > max ? text.slice(0, max) + '…' : text;

  const handleClick = (article) => {
    setSelectedArticle(article);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedArticle(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    // Handle day suffix
    const day = date.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
        ? 'rd'
        : 'th';
  
    // Get formatted month and year
    const options = { month: 'short', year: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);
    const [month, year] = formatted.split(' ');
  
    // Get formatted time
    const time = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).toLowerCase();
  
    return `${month} ${day}${suffix}, ${year} - ${time}`;
  };  

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* Top Centered Title */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
        Local News for {city}, {country.toUpperCase()}
      </h2>

      {/* Two-Column Layout */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '40px',
          height: 'calc(100% - 60px)',
        }}
      >
        {/* Left: News List */}
        <div style={{ width: '500px' }}>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {articles.map((article, i) => (
              <li
                key={i}
                onClick={() => handleClick(article)}
                style={{
                  marginBottom: '10px',
                  cursor: 'pointer',
                  color: selectedArticle === article ? 'orange' : 'white',
                  textAlign: 'left',
                }}
              >
                {shorten(article.title)}
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Text Window */}
        <div
          style={{
            width: '500px',
            borderRadius: '10px',
            padding: isOpen ? '15px' : '0px',
            maxHeight: '300px',
            overflowY: isOpen ? 'auto' : 'hidden',
            overflowX: 'hidden',
            wordWrap: 'break-word',
            backgroundColor: isOpen ? '#1e1e1e' : 'transparent',
            border: isOpen ? '1px solid #555' : 'none',
            position: 'relative',
            transition: 'all 0.3s ease',
          }}
        >
          {isOpen && selectedArticle && (
            <>
              {/* X Close Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: '10px 15px',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <button
                  onClick={handleClose}
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '-5px',
                    background: 'transparent',
                    border: 'none',
                    color: '#aaa',
                    fontSize: '18px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>

              <h3 style={{ marginTop: 5, textAlign: 'justify' }}>{selectedArticle.title}</h3>
              <p style={{textAlign: 'center'}}>{formatDate(selectedArticle.pubDate) || ""}</p>
              <p style={{textAlign: 'justify'}}>{selectedArticle.description || "No description available."}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default News;
