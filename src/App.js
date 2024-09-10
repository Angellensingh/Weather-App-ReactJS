import logo from './logo.svg';
import './App.css';
import searchIcon from './assets/search.png';
import sunIcon from './assets/sun.png';
import snowIcon from './assets/snow.jpeg';
import windIcon from './assets/wind.jpeg';
import rainIcon from './assets/rainy.jpeg';
import humidityIcon from './assets/humidity.jpeg';
import cloudIcon from './assets/cloud.jpeg';
import { useEffect, useState } from 'react';


const WeatherDetails =({icon,temp,city,country,lat,log,humidity,wind})=>
{
  return(
    <>
      <div className='image'>
        <img src={icon} alt='sun'/>
      </div>
      <div className="temp">{temp}°C</div>
      <div className="location">{city}</div>
      <div className="country">{country}</div>
      <div className="cord">
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'> 
          <img src={humidityIcon} alt='humidity' className='icon'/>
          <div className="data">
            <div className='humidity-percent'>{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className='element'> 
          <img src={windIcon} alt='wind' className='icon'/>
          <div className="data">
            <div className='wind-percent'>{wind} Km/hr</div>
            <div className="text">Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}

function App() {


  const [icon,setIcon]=useState(rainIcon)
  const [temp,setTemp]=useState(0)
  const [city,setCity]=useState("Chennai")
  const [country,setCountry]=useState("IN")
  const [lat,setLat]=useState(0)
  const [log,setLog]=useState(0)
  const [humidity,setHumidity]=useState(0)
  const [wind,setWind]=useState(0)
  const [cityNotFound,setCityNotFound]=useState(false)
  const [loading,setLoading]=useState(false)
  const[text,setText]=useState("Chennai")
  const [error,setError]=useState(null)

  const weatherIconMap={
    "02d":cloudIcon,
    "02n":cloudIcon,
    "03d":windIcon,
    "03n":rainIcon,
    "04d":rainIcon,
    "04n":rainIcon,
    "09d":rainIcon,
    "10n":rainIcon,
    "10d":rainIcon,
    "09n":rainIcon,
    "13d":snowIcon,
    "13n":snowIcon
  }

  const search = async ()=>{
    setLoading(true)
    let url=`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=cd18d24d89d7db182a3e9c79ccdf263d&units=Metric`;
    try{
      let response = await fetch(url)
      let data =await response.json()
      if(data.cod === "404"){
        setCityNotFound(true)
        setLoading(false)
        return
      }
      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)
      const weatherIconCode=data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || cloudIcon)
      setCityNotFound(false)

    }
    catch(error){
      console.error("An error occured:", error.message);
    }
    finally{
      setLoading(false)
    }   
  }

  const handleCity=(e)=>{
    setText(e.target.value)
  }
  const handleKeyDown=(e)=>{
    if (e.key === "Enter"){
      search()
    }
  } 
  useEffect(function(){
    search()} ,[])
  
  return (
    <>
    <div className='container'>
      <div className='input-container'>
        <input type='text' className='cityInput' placeholder='search city' onChange={handleCity} value={text}
        onKeyDown={handleKeyDown}/>
        <div className='search-Icon' onClick={()=> search()}> 
          <img src={searchIcon} alt='search'/>
        </div>
      </div>
      
      {loading && <div className="loading-message">Loading.....</div>}
      {error && <div className="error">{error}</div>}
      {cityNotFound && <div className="city-not-found">City Not Found</div>}
      {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind}/>}
    </div>
    </>
  );
}

export default App;
