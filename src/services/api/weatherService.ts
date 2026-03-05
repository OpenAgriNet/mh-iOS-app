import { apiClient } from './config';

// Types for weather data based on actual API response
export interface Temperature {
  min: string;
  max: string;
  wind: number;
  humidity: number;
  rainfall: string;
}

export interface ForecastItem {
  date: string;
  rain: string;
  temp_max: string;
  temp_min: string;
  humidity_1: number;
  humidity_2: number;
  wind_speed: number;
  wind_direction: string;
  cloud_cover: string;
}

export interface PreviousWeatherItem {
  date: string;
  rain: number;
  temp_max: number;
  temp_min: number;
  humidity_1: number;
  humidity_2: number;
  wind_speed: number;
}

export interface WeatherData {
  status: number;
  response: string;
  AgroMetAdvisory: string;
  Temperature: Temperature;
  Forcast: ForecastItem[];
  Previous: PreviousWeatherItem[];
}

export interface WeatherResponse {
  success: boolean;
  status?: number;
  response?: string;
  data?: WeatherData;
  message?: string;
}

/**
 * Get IMD forecast and previous weather details
 * @param talukaCode - Taluka code from user profile
 * @param lang - Language code ('en' or 'mr')
 */
export const getWeatherDetails = async (
  talukaCode: number,
  lang: string
): Promise<WeatherResponse> => {
  try {
    const response = await apiClient.post('/imdService/imd-forcast-previous-weather-details', {
      taluka_code: talukaCode,
      lang: lang,
    });

    // The API returns the data directly in response.data, not nested under response.data.data
    return {
      success: true,
      status: response.data.status,
      response: response.data.response,
      data: response.data, // The entire response.data is the weather data
    };
  } catch (error: any) {
    console.error('Weather API Error:', error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch weather details',
    };
  }
};

