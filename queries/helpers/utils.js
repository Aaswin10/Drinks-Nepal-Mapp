import axios from '../../src/middlewares/axiosConfig';

export const fetchPost = async (url, params, headers = {}) => {
  const { data } = await axios.post(url, params, { headers });
  return data;
};

export const fetchGet = async (url, headers = {}) => {
  const { data } = await axios.get(url, { headers });
  return data;
};

export const fetchPut = async (url, params, headers = {}) => {
  const { data } = await axios.put(url, params, { headers });
  return data;
};

export const fetchDelete = async (url, headers = {}) => {
  const { data } = await axios.delete(url, { headers });
  return data;
};
