import { useEffect, useState } from 'react'

const Weather = () => {
  const [daysWeather, setDaysWeather] = useState(null)
  const [error, setError] = useState(null)
  const weatherURL = 'http://127.0.0.1:5000/weather'

  const fetchWeather = async () => {
    try {
      const response = await fetch(weatherURL)
      const data = await response.json()
      console.log('Fetched data:', data)
      setDaysWeather(data)

    } catch (err) {
      console.error(err)
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  const renderForecast = () => {

    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>

    if (!daysWeather) return <p>Loading...</p>

    const {time, temperature_2m_max, temperature_2m_min } = daysWeather.daily

    return time.map((date, index) => (
      <div key={date} style={{ marginBottom: '1rem' }}>
        <h4>{date}</h4>
        <p>Min: {temperature_2m_min[index]}°C</p>
        <p>Max: {temperature_2m_max[index]}°C</p>
      </div>
    ))
  }

  return (
    <>
      <h2>7-Day Forecast</h2>
      <div>{renderForecast()}</div>
    </>
  )
}

export default Weather
