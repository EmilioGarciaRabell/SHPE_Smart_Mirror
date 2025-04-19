import React, { useEffect, useState } from 'react';

function News({ country, city }) {
  const [articles, setArticles] = useState([]);

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
   

  return (
    <div>
      <h2>Local News for {city}, {country.toUpperCase()}</h2>
      <ul>
        {articles.map((article, i) => (
          <li key={i}>
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default News;
