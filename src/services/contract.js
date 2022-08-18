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
  return axios.get(
    `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/5/json?key=8JY6MkByK0sBGwhG2w4VVaPYCAHGLjx0&point=${lat},${lng}&unit=mph`,
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    },
  );
};
