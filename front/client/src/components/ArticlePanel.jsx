import React from 'react';
import PanelWrapper from './PanelWrapper';

const formatDate = (dateString) => {
    if (!dateString) return '';
  
    const date = new Date(dateString);
  
    const day = date.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? 'st'
        : day === 2 || day === 22
        ? 'nd'
        : day === 3 || day === 23
        ? 'rd'
        : 'th';
  
    const options = { month: 'short', year: 'numeric' };
    const formatted = date.toLocaleDateString('en-US', options);
    const [month, year] = formatted.split(' ');
  
    // Only include time if it was in the original string
    const hasTime =
      dateString.includes('T') && !dateString.endsWith('T00:00:00');
  
    const time = hasTime
      ? date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).toLowerCase()
      : null;
  
    return time
      ? `${month} ${day}${suffix}, ${year} - ${time}`
      : `${month} ${day}${suffix}, ${year}`;
};  

function ArticlePanel({ article, onClose }) {
  return (
    <PanelWrapper title="Article" onClose={onClose}>
      <h3 style={{
        textAlign: 'left',
        fontSize: '19px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {article.title}
      </h3>

      <p style={{ textAlign: 'center', fontSize: '17px' }}>
        {formatDate(article.pubDate) || ''}
      </p>

      <p style={{
        textAlign: 'justify',
        fontSize: '18px',
        maxHeight: '250px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 8,
        WebkitBoxOrient: 'vertical'
      }}>
        {article.description || 'No description available.'}
      </p>
    </PanelWrapper>
  );
}

export default ArticlePanel;
