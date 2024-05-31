export interface Template {
  templateName: string;
  owner: string;
  type: string;
  receiver: string;
  endpoint: string;
  params: string[];
  description: string;
  value: string;
  id: string;
}

export interface CreateTemplateDto {
  templateName: string;
  owner: string;
  type: string;
  receiver: string;
  endpoint: string;
  params: string[];
  description?: string;
  value: string;
}
