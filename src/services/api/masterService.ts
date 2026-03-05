import { apiClient, API_CONFIG } from './config';

// Types for master data
export interface District {
  code: number;
  name: string;
}

export interface Taluka {
  code: number;
  name: string;
}

export interface Village {
  code: number;
  name: string;
}

export interface DistrictResponse {
  success: boolean;
  status?: number;
  response?: string;
  data?: District[];
  message?: string;
}

export interface TalukaResponse {
  success: boolean;
  status?: number;
  response?: string;
  data?: Taluka[];
  message?: string;
}

export interface VillageResponse {
  success: boolean;
  status?: number;
  response?: string;
  data?: Village[];
  message?: string;
}

/**
 * Get all districts based on selected language
 * @param lang - Language code ('en' or 'mr')
 */
export const getAllDistricts = async (lang: string): Promise<DistrictResponse> => {
  try {
    const response = await apiClient.post('/masterService/get-all-district', {
      lang: lang,
    });
    
    return {
      success: true,
      status: response.data.status,
      response: response.data.response,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch districts',
    };
  }
};

/**
 * Get all talukas for a specific district
 * @param lang - Language code ('en' or 'mr')
 * @param districtCode - District code
 */
export const getTalukaOnDistrict = async (
  lang: string,
  districtCode: number
): Promise<TalukaResponse> => {
  try {
    const response = await apiClient.post('/masterService/get-taluka-on-district', {
      lang: lang,
      district_code: districtCode,
    });
    
    return {
      success: true,
      status: response.data.status,
      response: response.data.response,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch talukas',
    };
  }
};

/**
 * Get all villages for a specific taluka
 * @param lang - Language code ('en' or 'mr')
 * @param talukaCode - Taluka code
 */
export const getVillageOnTaluka = async (
  lang: string,
  talukaCode: number
): Promise<VillageResponse> => {
  try {
    const response = await apiClient.post('/masterService/get-village-on-taluka', {
      lang: lang,
      taluka_code: talukaCode,
    });
    
    return {
      success: true,
      status: response.data.status,
      response: response.data.response,
      data: response.data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch villages',
    };
  }
};

