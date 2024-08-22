import { ApiNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { Address } from '@multiversx/sdk-core/out';
import { network, xSafeApiUrl } from 'src/config';
import axios from 'axios';

export class CreateTemplateDto {
  templateName!: string;
  owner!: string;
  type!: string;
  receiver!: string;
  endpoint!: string;
  params!: string[];
  description!: string;
  value!: number;
}

export class SaveTemplateDto {
  ownerAddress!: string; // This field will be used for either user address or organization address
  templateId!: number;
  type!: 'personal' | 'organization';
}

export class xSafeApiProvider extends ApiNetworkProvider {
  async getAddressDelegations(address: string) {
    if (!address || !Address.isValid(address)) return null;

    return axios
      .get(
        `${network.apiAddress}/accounts/${address}/delegation?forceRefresh=true`,
      )
      .then((r) => r.data);
  }

  async getAllTemplates(
    token: string,
    filters: { type?: string; receiver?: string; ownerAddress?: string },
  ) {
    const params = { ...filters };

    return axios
      .get(`${xSafeApiUrl}/templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      })
      .then((r) => r.data);
  }

  async saveTemplate(saveTemplateDto: SaveTemplateDto, token: string) {
    return axios.post(`${xSafeApiUrl}/templates/save`, saveTemplateDto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async createTemplate(createTemplateDto: CreateTemplateDto, token: string) {
    return axios.post(`${xSafeApiUrl}/templates`, createTemplateDto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}

export const SafeApi = new xSafeApiProvider(xSafeApiUrl ?? '');
