import './App.css';
import NewsPanel from './components/NewsPanel';
import TrafficPanel from './components/TrafficPanel';
import RITNews from './components/RITNewsPanel';
import ArticlePanel from './components/ArticlePanel';
import { useState } from 'react';
import { FaNewspaper, FaCar, FaUniversity } from 'react-icons/fa';

function App() {
  const [openPanels, setOpenPanels] = useState([]); // panel queue
  const [selectedArticle, setSelectedArticle] = useState(null); // article to show
  const [articleSourcePanel, setArticleSourcePanel] = useState(null); // 'news' or 'rit'

  const openPanel = (panelKey) => {
    let updated = [...openPanels];

    // Reset article if switching to a non-article panel
    if (panelKey !== 'news' && panelKey !== 'rit') {
      setSelectedArticle(null);
      setArticleSourcePanel(null);
    }

    // Already open? do nothing
    if (updated.includes(panelKey)) return;

    // Enforce max 2 panels
    if (updated.length >= 2) {
      updated.shift();
    }

    updated.push(panelKey);
    setOpenPanels(updated);
  };

  const closePanel = (panelKey) => {
    const updated = openPanels.filter((key) => key !== panelKey);
    setOpenPanels(updated);

    // Clear article only if its source is closing
    if (panelKey === articleSourcePanel) {
      setSelectedArticle(null);
      setArticleSourcePanel(null);
    }
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
        {[...openPanels].reverse().map((panelKey) => {
          if (panelKey === 'news') {
            return articleSourcePanel === 'news' && selectedArticle ? (
              <ArticlePanel
                key="article-from-news"
                article={selectedArticle}
                onClose={() => {
                  setSelectedArticle(null);
                  setArticleSourcePanel(null);
                }}
              />
            ) : (
              <NewsPanel
                key="news"
                onClose={() => closePanel('news')}
                onArticleSelect={(article) => {
                  setSelectedArticle(article);
                  setArticleSourcePanel('news');
                }}
              />
            );
          }

          if (panelKey === 'rit') {
            return articleSourcePanel === 'rit' && selectedArticle ? (
              <ArticlePanel
                key="article-from-rit"
                article={selectedArticle}
                onClose={() => {
                  setSelectedArticle(null);
                  setArticleSourcePanel(null);
                }}
              />
            ) : (
              <RITNews
                key="rit"
                onClose={() => closePanel('rit')}
                onArticleSelect={(article) => {
                  setSelectedArticle(article);
                  setArticleSourcePanel('rit');
                }}
              />
            );
          }

          if (panelKey === 'traffic') {
            return (
              <TrafficPanel
                key="traffic"
                onClose={() => closePanel('traffic')}
              />
            );
          }

          return null;
        })}
      </div>



      <div className="bottom-bar-wrapper">
        <div className="bottom-bar">
          <button onClick={() => openPanel('news')}>
            <FaNewspaper size={20} />
          </button>
          <button onClick={() => openPanel('rit')}>
            <FaUniversity size={20} />
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
