import './App.css';
import NewsPanel from './components/NewsPanel';
import TrafficPanel from './components/TrafficPanel';
import ArticlePanel from './components/ArticlePanel';
import { useState } from 'react';
import { FaNewspaper, FaCar } from 'react-icons/fa';

function App() {
  const [openPanels, setOpenPanels] = useState(new Set());
  const [selectedArticle, setSelectedArticle] = useState(null);

  const togglePanel = (panelKey) => {
    const newSet = new Set(openPanels);
    if (newSet.has(panelKey)) {
      newSet.delete(panelKey);
    } else {
      newSet.add(panelKey);
    }
    setSelectedArticle(null); // always reset article view on toggle
    setOpenPanels(newSet);
  };

  const closePanel = (panelKey) => {
    const newSet = new Set(openPanels);
    newSet.delete(panelKey);
    setOpenPanels(newSet);
  };

  return (
    <div className="mirror">
      {/* Panel stack (bottom-up) */}
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
        {openPanels.has('news') && !selectedArticle && (
          <NewsPanel
            onClose={() => closePanel('news')}
            onArticleSelect={(article) => setSelectedArticle(article)}
          />
        )}

        {openPanels.has('news') && selectedArticle && (
          <ArticlePanel
            article={selectedArticle}
            onClose={() => setSelectedArticle(null)}
          />
        )}

        {openPanels.has('traffic') && (
          <TrafficPanel onClose={() => closePanel('traffic')} />
        )}
      </div>

      {/* Bottom button bar */}
      <div className='bottom-bar-wrapper'>
        <div className="bottom-bar">
          <button onClick={() => togglePanel('news')}>
            <FaNewspaper size={20} />
          </button>
          <button onClick={() => togglePanel('traffic')}>
            <FaCar size={20} />
          </button>
          {/* Add more panel buttons here */}
        </div>
      </div>
    </div>
  );
}

export default App;
