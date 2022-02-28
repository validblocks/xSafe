import axios from 'axios';
import { network } from '../config';

export const getEconomicsData = async () => {
  try {
    const response = await axios.get(`${network.apiAddress}/economics`);
    const { data } = response;
    return data;
  } catch (err) {
    console.error('could not get economics');
    return null;
  }
};
