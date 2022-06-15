import axios from 'axios';
import { network } from '../config';

export async function getAccountData(address: string) {
  try {
    const response = await axios.get(
      `${network.apiAddress}/accounts/${address}`,
    );
    if (response && response.data) {
      return response.data;
    }
    return null;
  } catch (err) {
    console.error('error fetching account data');
    return null;
  }
}
