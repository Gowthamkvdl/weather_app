import { useEffect, useRef, useState, } from 'react'
import axios from 'axios'
import './App.css'
import WeatherCard from './components/WeatherCard'
import Modal from 'bootstrap/js/dist/modal'
import { FiAlertTriangle } from "react-icons/fi";



function App() {
  interface WeatherData {
    name: string
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      humidity: number
    }
    weather: {
      main: string
      description: string
      icon: string
    }[]
    wind: {
      speed: number
      deg: number
      gust: number
    }
    sys: {
      country: string
      sunrise: number
      sunset: number
    }
  }

  const API_KEY = import.meta.env.VITE_WEATHER_KEY
  const [bgImage, setBgImage] = useState<string>('')
  const [location, setLocation] = useState<string>('tamilnadu')
  const [error, setError] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const [weather, setWeather] = useState<WeatherData>({
    name: "Loading...",
    main: {
      temp: 0,
      feels_like: 0,
      temp_min: 0,
      temp_max: 0,
      pressure: 0,
      humidity: 0,
    },
    weather: [
      {
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    wind: {
      speed: 0,
      deg: 0,
      gust: 0,
    },
    sys: {
      country: "IN",
      sunrise: 0,
      sunset: 0,
    },
  })

  // Load Spline Viewer script
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.10.51/build/spline-viewer.js";
    document.body.appendChild(script);
  }, []);


  useEffect(() => {
    if (!API_KEY) {
      console.error('Missing VITE_WEATHER_KEY in .env')
      return
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`

    axios.get(url)
      .then(res => {
        setError("")
        setWeather(res.data)

        const condition = res.data.weather[0].main.toLowerCase()
        const currentTime = res.data.dt
        const sunrise = res.data.sys.sunrise
        const sunset = res.data.sys.sunset

        // Determine if it's day or night at the location
        const isDay = currentTime >= sunrise && currentTime < sunset
        const timeOfDay = isDay ? "day" : "night"

        // Pick the correct background
        let bg = ""
        if (condition.includes('rain')) {
          bg = `${timeOfDay}-rainy.png`
        } else if (condition.includes('cloud')) {
          bg = `${timeOfDay}-cloudy.png`
        } else {
          bg = `${timeOfDay}-sunny.png`
        }

        setBgImage(`/${bg}`)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load weather data')
      })
  }, [API_KEY, location])


  const saveChanges = () => {
    if (input.current) {
      setLocation(input.current.value);
    }

    // Close modal
    if (modalRef.current) {
      // Get the existing modal instance
      const instance = Modal.getInstance(modalRef.current) || new Modal(modalRef.current)

      // Hide the modal
      instance.hide()

      // Also ensure backdrop is removed (Bootstrap sometimes keeps it)
      const backdrop = document.querySelector('.modal-backdrop')
      if (backdrop) backdrop.remove()
      document.body.classList.remove('modal-open')
      document.body.style.removeProperty('padding-right')
    }``
    setError(null)

  }

  

  console.log(weather)

  return (
    <>
      <div
        className="app d-flex justify-content-center align-items-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '100vh',
        }}
      >
        <WeatherCard condition={weather.weather[0].main} windSpeed={weather.wind.speed} city={weather.name} temp={weather.main.temp} temp_max={weather.main.temp_max} temp_min={weather.main.temp_min} icon={weather.weather[0].icon} pressure={weather.main.pressure} humidity={weather.main.humidity} feels_like={weather.main.feels_like} description={weather.weather[0].description} />
      </div>

      <div className="modal fade" ref={modalRef} id="exampleModal1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content p-3 glass-card text-light">
            <div className="header ">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Change Location</h1>
            </div>
            <hr />
            <input
              type="text"
              ref={input}
              className="form-control mb-3 location-input shadow-none broder-none"
              defaultValue={location}
              placeholder="Enter city name..."
            />
            {error && <span className='fs-6 text-light'> <FiAlertTriangle className='mb-1' /> {error}</span>}

            <div className="footer ">
              <button type="button" onClick={saveChanges} className="btn btn-primary float-end">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
