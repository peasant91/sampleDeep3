import {get, getRaw} from './baseApi';

export const getCampaignList = (search, query) => {
  return getRaw(`v1/campaign?search=${search}`, query);
};

export const getCampaignDetail = (id, query) => {
  return get(`v1/campaign/${id}`, query);
};
