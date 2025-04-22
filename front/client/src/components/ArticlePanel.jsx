import React from 'react';
import PanelWrapper from './PanelWrapper';

const formatDate = (dateString) => {
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

  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).toLowerCase();

  return `${month} ${day}${suffix}, ${year} - ${time}`;
};

function ArticlePanel({ article, onClose }) {
  return (
    <PanelWrapper title="Article" onClose={onClose}>
      <h3 style={{
        textAlign: 'left',
        fontSize: '14px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}>
        {article.title}
      </h3>

      <p style={{ textAlign: 'center', fontSize: '12px' }}>
        {formatDate(article.pubDate) || ''}
      </p>

      <p style={{
        textAlign: 'justify',
        fontSize: '13px',
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
