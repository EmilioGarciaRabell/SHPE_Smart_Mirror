
import { useEffect, useState } from 'react'
const Weather = () =>{

    const [daysWeather,setDaysWeather]  = useState(null)
    let weatherURL = 'http://127.0.0.1:5000/weather'
    
    const fetchWeather = async () => {
        try {
          const response = await fetch(weatherURL)
          const data = await response.json()
          console.log(data.daily.time)
          setDaysWeather(data)
        } catch (err) {
          setError(err.message)
        }
    }

    useEffect(() => {
        fetchWeather()
      }, [])


      const renderForecast = () => {
        const { time, temperature_2m_max, temperature_2m_min } = daysWeather.daily
        return time.map((date, index) => (
          <div className='forecast-div' key={date} style={{ marginBottom: '1rem' }}>
            <h4 className='date'>{date}</h4>
            <div className='"temprature div'>
            <p>Min: {temperature_2m_min[index]}°C</p>
            <p>Max: {temperature_2m_max[index]}°C</p>
            </div>
          </div>
        ))
      }
        
      

    return <>
        <h1>Forecast</h1>

        <div>
            {renderForecast()} 
        </div>
        
    </>
    
}

export default Weather;

