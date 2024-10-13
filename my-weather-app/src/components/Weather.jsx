import React, { useState,useEffect } from 'react'
import './Weather.css'
import {
  Box,
  Input,
  Button,
  Image,
  Text,
  Flex,
  Spinner,
  VStack,
  HStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import search_icon  from '../assets/search_icon.png'
import sun_icon  from '../assets/sun.png'
import cloudy_icon  from '../assets/cloudy.png'
import drizzle_icon  from '../assets/drizzle.png'
import storm_icon  from '../assets/storm.png'
import snowy_icon  from '../assets/snowy.png'
import wind_icon  from '../assets/wind.png'
import weather_icon  from '../assets/weather.png'

const MotionBox = motion(Box); 
const MotionHStack = motion(HStack);
const MotionImage = motion(Image);  // For animated images
const MotionText = motion(Text); 

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState(''); 
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const allIcons = {
        "01d" : sun_icon,
        "01n" : sun_icon,
        "02d" : cloudy_icon,
        "02n" : cloudy_icon,
        "03d" : cloudy_icon,
        "03n" : cloudy_icon,
        "04d" : drizzle_icon,
        "04n" : drizzle_icon,
        "09d" : storm_icon,
        "09n" : storm_icon,
        "10d" : storm_icon,
        "10n" : storm_icon,
        "13d" : snowy_icon,
        "13n" : snowy_icon,
        "50d" : wind_icon,
        "50n" : wind_icon,
    };
    const search = async (city) => {
     try {
       setIsLoading(true); 
       const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
       const response = await fetch(url)
       const data = await response.json();
       

       if(response.ok){
        const iconCode = data.weather[0].icon;
        const icon = allIcons[iconCode] || sun_icon;
        setWeatherData({
            humidity:data.main.humidity,
            windSpeed:data.wind.speed,
            temprature:Math.floor(data.main.temp),
            location:data.name,
            icon: icon,
        });
        setError(''); 
      } else {
        setError('Please enter a city name to get the weather data.');
        setWeatherData(null); // Reset data
      }
       } catch(error){
        setError('Failed to fetch weather data. Please check your internet connection.');
        setWeatherData(null)
     } finally {
      setIsLoading(false); // Stop loading
    }
  };
 
      useEffect(()=>{
      search("");
    },[])
  
    const handleSearch = (e) => {
        e.preventDefault();
        if (city.trim() !== '') {
          search(city); 
        } else {
          setError('Please enter a city name.');
          setWeatherData(null); 
        }
      };

    return (
      <Box
      p={6}
      borderRadius="lg"
      bgGradient="linear(to-r, #e07bda, #2c2081)"
      color="white"
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={5}
    >
    <MotionHStack
        as="form"
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 20 }} // Start position
        animate={{ opacity: 1, y: 0 }} // End position
        transition={{ duration: 0.6 }} // Smooth transition
      >
     <Input
      type='text' 
      placeholder='Enter your location'  
      value={city}
      onChange={(e) => setCity(e.target.value)}
      borderRadius="md"
      bg="white"
      color="black"
      />
       <Button type="submit"  bg="transparent" _hover={{ bg: 'transparent', transform: 'scale(1.2)' }} transition="0.2s"
       >
       <Image src={search_icon} alt="search_icon" boxSize="25px" />
         </Button>
         </MotionHStack>
      {error && (
        <Alert status="error" borderRadius="md" w="full">
          <AlertIcon />
          {error}
        </Alert>
      )}
      
      {isLoading && <Spinner color="white" size="lg" />}
    
      {weatherData  && !isLoading && (
         <MotionBox
         initial={{ opacity: 0, scale: 0.8 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.6 }}
       >
        <VStack spacing={3}>
        <MotionImage
              src={weatherData.icon}
              alt=""
              boxSize="60px"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1.1 }}
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 1.2,
              }}
            />
              <MotionText
              fontSize="80px"
              color="white"
              lineHeight="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
            {weatherData.temprature}&deg;C
            </MotionText>
            <MotionText
              fontSize="40px"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {weatherData.location}
            </MotionText>
            <Flex justify="space-around" w="full">
              
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <VStack>
                  <Image src={weather_icon} alt="" boxSize="40px" />
                  <Text>{weatherData.humidity}%</Text>
                  <Text mt={2}>Humidity</Text>
                </VStack>
              </MotionBox>
              <MotionBox
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <VStack>
                  <Image src={wind_icon} alt="" boxSize="40px" />
                  <Text>{weatherData.windSpeed} Km/h</Text>
                  <Text mt={2}>Wind Speed</Text>
                </VStack>
              </MotionBox>
            </Flex>
          </VStack>
        </MotionBox>
      )}

      {!weatherData && !error && !isLoading && (
        <Text bgColor={'black'}>Please enter a city name to get the weather data.</Text>
      )}
    </Box>
  );
};

export default Weather