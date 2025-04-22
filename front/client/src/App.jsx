import { useState } from 'react';
import './App.css';
import News from './components/News';
import Traffic from './components/Traffic';

function App() {
  return (
    <div className="App">
      <h1>Traffic Conditions</h1>
      <Traffic />
      <hr style={{ margin: '40px 0' }} />
      <News country="us" city="Rochester" />
    </div>
  );
}

export default App;
