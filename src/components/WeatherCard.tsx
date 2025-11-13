import React, { useEffect, useMemo, useState } from "react"
import { FiEdit } from "react-icons/fi"
import { WiHumidity, WiCloudyWindy, WiTime5 } from "react-icons/wi"
import { SiProbot } from "react-icons/si"
import '@splinetool/viewer' // registers <spline-viewer>


declare global {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": any;
    }
  }
} 
   

type WeatherProps = {
  city: string
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  humidity: number
  pressure: number
  condition: string
  description: string
  windSpeed: number
  icon: string
}

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

function buildGreetingTinyFunny(
  condition: string,
  feels_like: number,
  humidity: number,
  icon: string
): string {
  const c = (condition || "").toLowerCase()
  const isNight = (icon || "").endsWith("n")

  // ---- SHORT CONDITION ----
  let conditionText = ""
  if (c.includes("rain")) conditionText = "Rainy."
  else if (c.includes("storm") || c.includes("thunder")) conditionText = "Stormy."
  else if (c.includes("snow")) conditionText = "Snowy."
  else if (c.includes("cloud")) conditionText = "Cloudy."
  else if (c.includes("clear") || c.includes("sun")) {
    conditionText = isNight ? "Clear night." : "Sunny."
  } else if (c.includes("fog") || c.includes("mist")) conditionText = "Foggy."
  else conditionText = `${condition || "Weather update."}`

  // ---- SHORT TEMP ----
  let tempText = ""
  if (feels_like >= 30) tempText = ` Feels like ${Math.round(feels_like)}°C, hot.`
  else if (feels_like >= 20) tempText = ` Feels like ${Math.round(feels_like)}°C, warm.`
  else if (feels_like >= 10) tempText = ` Feels like ${Math.round(feels_like)}°C, cool.`
  else tempText = ` Feels like ${Math.round(feels_like)}°C, cold.`

  // ---- SHORT HUMIDITY ----
  const humidityText =
    humidity >= 70 ? "Humid." :
      humidity >= 40 ? "Normal humidity." :
        "Dry air."

  
  // ---- WEATHER-BASED JOKES ----
  let jokePool: string[] = []

  if (c.includes("rain")) {
    jokePool = [
      "I think the clouds are crying again. ☔",
      "It's raining… perfect time to blame the weather. 😂",
      "Even the sky needed a bath today. 😅",
    ]
  } else if (c.includes("cloud")) {
    jokePool = [
      "The clouds are hiding the sun like it's a secret. ☁️",
      "Clouds today… the sky forgot to do its makeup. 😄",
      "Clouds are basically sky pillows. ☁️",
    ]
  } else if (c.includes("clear") || c.includes("sun")) {
    if (isNight) {
      jokePool = [
        "Clear night — even the moon is showing off. 🌙",
        "Stars are working overtime tonight. ⭐",
        "Perfect night to look up and overthink. 😅",
      ]
    } else {
      jokePool = [
        "So sunny even my thoughts need sunscreen. 😎",
        "Sun today be like: ‘I run this place.’ ☀️",
        "Too bright… even my future is jealous. 😄",
      ]
    }
  } else if (c.includes("storm") || c.includes("thunder")) {
    jokePool = [
      "If you hear thunder, it’s just sky drums. 🌩️",
      "Storm outside… someone angered the weather gods. 😂",
      "The wind is practicing WWE moves today. 🌪️",
    ]
  } else if (c.includes("fog") || c.includes("mist")) {
    jokePool = [
      "Fog so thick even maps are confused. 🌫️",
      "Today's mood: mysterious like fog. 🕵️",
      "If you can't see anything, congrats — it's fog day. 😅",
    ]
  } else if (c.includes("snow")) {
    jokePool = [
      "Snow: nature’s way of turning everything into a fridge. ❄️",
      "Tiny sky confetti incoming. 🎉",
      "Snow today… free AC from the universe. 😄",
    ]
  } else {
    jokePool = [
      "Weather is normal… just like me (I think).",
      "Can't predict this weather, but I can predict you're cool. 😎",
    ]
  }

  const joke = pick(jokePool)
  const prefix = isNight ? pick(["Good evening!", "Hello!", "Beautiful night!"]) : pick(["Good day!", "Hello!", "Hey there!"])

  return `${prefix} ${conditionText} ${tempText} ${humidityText} ${joke}`
}

const WeatherCard: React.FC<WeatherProps> = ({
  city,
  temp,
  feels_like,
  temp_min,
  temp_max,
  humidity,
  pressure,
  condition,
  description,
  windSpeed,
  icon,
}) => {
  const [greeting, setGreeting] = useState<string>('Loading weather mood...')

  useEffect(() => {
    // pass correct args: condition, feels_like, humidity, windSpeed, icon
    const g = buildGreetingTinyFunny(condition, feels_like, humidity,  icon)
    setGreeting(g)
  }, [condition, feels_like, humidity,  icon])

  const bubbleText = useMemo(() => greeting, [greeting])
  const windDisplay = Number.isFinite(windSpeed) ? windSpeed.toFixed(1) : "N/A"

  return (
    <div className="container py-4 text-white">
      <div className="row justify-content-center align-items-center gx-4">
        {/* Left column: Spline Robo */}
        <div className="col-12 col-md-6">
          <div
            className="position-relative w-100 overflow-hidden"
            style={{ height: 500, borderRadius: 20 }}
          >
            <spline-viewer
              url="https://prod.spline.design/YiJE1RXYk0aeLkyw/scene.splinecode"
              style={{ width: '100%', height: '100%', display: 'block' }}
            />

            {/* Robo greeting bubble */}
            <div
              className="robo-msg"
              aria-live="polite"
              style={{
                position: 'absolute',
                bottom: '12%',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.39), rgba(0, 0, 0, 0.6))',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24,
                padding: '12px 18px',
                color: '#fff',
                fontSize: '1rem',
                backdropFilter: 'blur(8px)',
                animation: 'floatIn 600ms ease-out',
                maxWidth: '100%',
                boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
                textAlign: 'center',
                gap: 8
              }}
            >
              <SiProbot className="mb-1" /> {bubbleText}
            </div>

          </div>
        </div>

        {/* Right column: weather info card */}
        <div className="col-12 col-md-6">
          <div className="glass-card p-3">
            {/* City + Temp */}
            <div className="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <span>{city}</span>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-light"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal1"
                    aria-label="Edit location"
                  >
                    <FiEdit className="fs-4" />
                  </button>
                </h2>
                <p className="mb-0 text-capitalize">{description}</p>
              </div>

              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={condition}
                width={70}
                height={70}
              />
            </div>

            <hr />

            {/* Temperature details */}
            <div className="d-flex align-items-end justify-content-start">
              <div className="display-1 fw-bold">{Math.round(temp)}°C</div>
              <p className="ms-3 mb-0">
                Feels like {Math.round(feels_like)}°C <br />
                Min: {Math.round(temp_min)}°C | Max: {Math.round(temp_max)}°C
              </p>
            </div>

            <hr />

            {/* Extra info */}
            <div className="row g-3 text-center">
              <div className="col-4">
                <p className="mb-1 fw-semibold">
                  <WiHumidity className="fs-3" /> Humidity
                </p>
                <p className="mb-0">{humidity}%</p>
              </div>
              <div className="col-4">
                <p className="mb-1 fw-semibold">
                  <WiCloudyWindy className="fs-3" /> Wind
                </p>
                <p className="mb-0">{windDisplay} m/s</p>
              </div>
              <div className="col-4">
                <p className="mb-1 fw-semibold">
                  <WiTime5 className="fs-3" /> Pressure
                </p>
                <p className="mb-0">{pressure} hPa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
