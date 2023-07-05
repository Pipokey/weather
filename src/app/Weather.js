import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ACCUWEATHER_API_KEY } from '../../public/config';

const Weather = () => {
  const [forecast, setForecast] = useState([]);
  const [screenWidth, setScreenWidth] = useState(null);

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `http://dataservice.accuweather.com/forecasts/v1/daily/5day/1825925?apikey=${ACCUWEATHER_API_KEY}`
      );
      setForecast(response.data.DailyForecasts);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    // Fetch data when the component mounts
    fetchWeatherData();

    // Attach resize event listener when the component mounts
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);

      // Cleanup: remove event listener when the component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toCelsius = (fahrenheit) => {
    return Math.round(((fahrenheit - 32) * 5) / 9);
  };

  const city = 'Beirut';

  const shouldWrapCards = screenWidth < 1028;

  return (
    <div className={`flex   ${shouldWrapCards ? 'flex-col' : 'justify-center'}`}>
      {forecast.map((day, index) => (
        <div
          key={index}
          className={`border p-4 drop-shadow container ${shouldWrapCards ? 'mx-0 w/2/3' : 'mx-5'} my-8 rounded-xl bg-cover bg-center bg-no-repeat`}
          style={{
            backgroundImage: 'url("/pp.jpg")',
          }}
        >
          <div className="flex justify-between font-bold">
            <div className="font-bold text-lg text-white">{formatDate(day.Date)}</div>
            <div className="font-bold text-lg text-white">{city}</div>
          </div>
          <div className="text-center mt-12 font-bold text-3xl">
            {toCelsius(day.Temperature.Maximum.Value)}
            <span className="text-white text-2xl">°C</span>
          </div>
          <div className="text-center text-white">{day.Day.IconPhrase.split(' ').slice(0, 2).join(' ')}</div>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col mt-5">
              <div className="flex">
                <img src="/pp1.png" className="w-3 h-6" alt="Precipitation" />
                <div className="flex ml-3 pt-2 text-white font-bold">
                  <span className="text-black text-xs">
                    {day.Day.HasPrecipitation ? '100%' : '0%'}
                  </span>
                </div>
              </div>
              <div className="flex">
                <img src="/pp2.png" className="w-5 h-5 -ml-2 mt-2 " alt="Image" />
                <div className="flex ml-1 pt-4 text-white font-bold">
                  <div className="flex ml-1 pt-4 text-white font-bold">
                    <span className={`text-black -mt-5 ${window.innerWidth >= 1028 && window.innerWidth <= 1300 ? 'text-[6px] ' : 'text-xs'}`}>
                      {day.IsDayTime
                        ? day.Day.IconPhrase.split(' ').slice(0, 2).join(' ')
                        : day.Night.IconPhrase.split(' ').slice(0, 2).join(' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex">
              <img
                src={`/pp${day.IsDayTime ? '3' : '4'}.png`}
                className="w-16 h-10 -ml-4 mt-3"
                alt="Day/Night Icon"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Weather;
