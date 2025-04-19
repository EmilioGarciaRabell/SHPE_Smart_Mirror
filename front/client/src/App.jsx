import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import News from './components/News'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <News country="us" city="Rochester" />
    </>
  )  
}

export default App
