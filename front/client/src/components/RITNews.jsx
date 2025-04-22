import React, {useEffect, useState} from 'react';
import './RITNews.css';

    const RITNews = () =>{
    const[ritnewsitems, setRITNewsItems] = useState([]);
    const[loading, setLoading]= useState(true);
    const[error, setError] = useState(null);
    const fetchRITNews = async() =>{
        try {
            const response = await fetch('http://127.0.0.1:5000/RITNews');
            if(!response.ok){
                throw new Error('Error fetching news: ${response.status}');
            }
            const data = await response.json();
            setRITNewsItems(data);
        } catch (error) {
            setError(error.message);
        }finally{
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRITNews();
    }, []);
    return (
        <div className="page-wrapper">
          <div className="ritnews-container">
            <h2>RIT Latest News</h2>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'white' }}>{error}</p>}
            <div>
              {ritnewsitems.length > 0 ? (
                ritnewsitems.map((news, index) => (
                  <div className="news-item" key={index}>
                    <h3>
                      <a href={news.link} target="_blank" rel="link_rel">
                        {news.title}
                      </a>
                    </h3>
                  </div>))) : 
                (<p>No news available at the moment.</p>)}
            </div>
          </div>
        </div>
      );
};
export default RITNews;


