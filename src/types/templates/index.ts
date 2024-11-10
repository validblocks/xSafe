import { TemplateType } from 'src/components/Modals/Templates/SaveTemplateModalContent';

export interface Template {
  templateName: string;
  owner: string;
  type:
    | typeof TemplateType.Personal
    | typeof TemplateType.Organization
    | typeof TemplateType.Public;
  receiver: string;
  endpoint: string;
  params: string[];
  description: string;
  value: string;
  id: number;
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
