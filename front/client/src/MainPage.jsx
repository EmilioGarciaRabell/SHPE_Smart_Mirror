import './App.css';
import NewsPanel from './components/NewsPanel';
import TrafficPanel from './components/TrafficPanel';
import RITNews from './components/RITNewsPanel';
import ArticlePanel from './components/ArticlePanel';
import DateTime from './components/DateTime';
import { useState } from 'react';
import { FaNewspaper, FaCar, FaUniversity, FaClock } from 'react-icons/fa';
import WeatherPanel from './components/WeatherPanel';
import { FaCloudSun } from 'react-icons/fa';
import JokeGenerator from './components/JokeGenerator';
import { FaLaughBeam } from 'react-icons/fa';
import CameraPanel from './components/CameraPanel';
import { FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';


function App() {
  const [openPanels, setOpenPanels] = useState([]); // panel queue
  const [selectedArticle, setSelectedArticle] = useState(null); // article to show
  const [articleSourcePanel, setArticleSourcePanel] = useState(null); // 'news' or 'rit'
  const [showDateTime, setShowDateTime] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setSelectedArticle(null);
    setArticleSourcePanel(null);
    setOpenPanels([]);
    navigate("/");
  };


  const openPanel = (panelKey) => {
    let updated = [...openPanels];

    // Reset article if switching to a non-article panel
    if (panelKey !== 'news' && panelKey !== 'rit') {
      setSelectedArticle(null);
      setArticleSourcePanel(null);
    }

    // Already open? then close
    if (updated.includes(panelKey)) {
      closePanel(panelKey);
      return;
    }

    // Enforce max 3 panels
    if (updated.length >= 3) {
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
      {/* DateTime bar at top */}
      {showDateTime && (
        <>
        <div
          style={{
            position: 'absolute',
            top: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: '90%',
            }}
          >
            <DateTime />
          </div>
        </div>

        </>
      )}

      {/* Panels */}
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

          if (panelKey === 'weather') {
            return (
              <WeatherPanel
                key="weather"
                onClose={() => closePanel('weather')}
              />
            );
          }

          if (panelKey === 'joke') {
            return (
              <JokeGenerator
                key="joke"
                onClose={() => closePanel('joke')}
              />
            );
          }

          if (panelKey === 'camera') {
            return (
              <CameraPanel
                key="camera"
                onClose={() => closePanel('camera')}
              />
            );
          }

          return null;
        })}
      </div>

      <div style={{
        position: 'absolute',
        bottom: '90px',
        right: '30px',
        zIndex: 999,
      }}>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          <FaSignOutAlt size={40} />
        </button>
      </div>


      {/* Bottom buttons */}
      <div className="bottom-bar-wrapper">
        <div className="bottom-bar">
          <button onClick={() => openPanel('news')}>
            <FaNewspaper size={40} />
          </button>
          <button onClick={() => openPanel('rit')}>
            <FaUniversity size={40} />
          </button>
          <button onClick={() => openPanel('weather')}>
            <FaCloudSun size={40} />
          </button>
          <button onClick={() => setShowDateTime(!showDateTime)}>
            <FaClock size={40} />
          </button>
          <button onClick={() => openPanel('traffic')}>
            <FaCar size={40} />
          </button>
          <button onClick={() => openPanel('joke')}>
            <FaLaughBeam size={40} />
          </button>
          <button onClick={() => openPanel('camera')}>
            <FaCamera size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;