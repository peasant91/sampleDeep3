import axios from 'axios';
import Constant from '../constants/Constant';
import {get, post} from './baseApi';

export const applyContract = id => {
  return post('/v1/contract', {campaign_id: id});
};

export const getContractHistory = query => {
  return get('/v1/contract', query);
};

export const getContract = id => {
  return get(`/v1/contract/${id}/active`);
};

export const sendDistance = data => {
  return post('v1/contract/trip', data);
};

export const getTrafficFlow = (lat, lng) => {
  const slat = '-8.672767';
  const slong = '115.225246';
  const sample = `${(slat, slong)}`;
  const loc = `${(lat, lng)}`;
  //   console.log('tomtom latlng ', loc);
  //   try {
  //     const data = await axios.get(
  //       `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=8JY6MkByK0sBGwhG2w4VVaPYCAHGLjx0&point=-8.672767,115.225246`,
  //     );
  //     console.log('tomtom data here ', data);
  //     return data;
  //   } catch (error) {
  //     console.log('tomtom error ', error);
  //   }
  return axios.get(
    `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=8JY6MkByK0sBGwhG2w4VVaPYCAHGLjx0&point=${lat},${lng}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );
};
