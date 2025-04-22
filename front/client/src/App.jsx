import './App.css';
import NewsPanel from './components/NewsPanel';
import TrafficPanel from './components/TrafficPanel';
import ArticlePanel from './components/ArticlePanel';
import { useState } from 'react';
import { FaNewspaper, FaCar } from 'react-icons/fa';

function App() {
  const [openPanels, setOpenPanels] = useState([]); // now an array, acts like a queue
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openPanel = (panelKey) => {
    let updated = [...openPanels];

    // Reset article if changing news view
    if (panelKey !== 'news') setSelectedArticle(null);

    // If it's already open, do nothing
    if (updated.includes(panelKey)) return;

    // Enforce max 2 panels
    if (updated.length >= 2) {
      updated.shift(); // remove oldest
    }

    updated.push(panelKey);
    setOpenPanels(updated);
  };

  const closePanel = (panelKey) => {
    const updated = openPanels.filter((key) => key !== panelKey);
    setOpenPanels(updated);
    if (panelKey === 'news') setSelectedArticle(null);
  };

  return (
    <div className="mirror">
      <div
        className="panel-container"
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          gap: '20px',
          position: 'absolute',
          bottom: '80px',
          left: '30px',
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
      >
        {openPanels.includes('news') && !selectedArticle && (
          <NewsPanel
            onClose={() => closePanel('news')}
            onArticleSelect={(article) => setSelectedArticle(article)}
          />
        )}

        {openPanels.includes('news') && selectedArticle && (
          <ArticlePanel
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}

        {openPanels.includes('traffic') && (
          <TrafficPanel onClose={() => closePanel('traffic')} />
        )}
      </div>
      <div className='bottom-bar-wrapper'>
        <div className="bottom-bar">
          <button onClick={() => openPanel('news')}>
            <FaNewspaper size={20} />
          </button>
          <button onClick={() => openPanel('traffic')}>
            <FaCar size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
