
import { useEffect, useState } from 'react'
const Weather = () =>{

    const [daysWeather,setdaysWeather]  = useState([])
    let weatherURL = 'http://127.0.0.1:5000/weather'
    

    async function fetchWeatherApi(){
        try {
            const response = await fetch(weatherURL)
            setdaysWeather(response.json())
        } catch (error) {
           console.log(error) 
        }
       
    }
    useEffect(() =>{
        fetchWeatherApi()
        console.log(daysWeather)
    },[])

    


    return <>
        <h1>forecast</h1>

        <div>

        </div>
        
    </>
    
}

export default Weather;

