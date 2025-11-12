// Webflow webhook payload structure
export interface WebflowFormSubmission {
  name: string;
  site: string;
  data: {
    [key: string]: string | string[];
  };
  submittedAt: string;
}

export class WebflowWebhookDto {
  name: string;
  site: string;
  data: {
    [key: string]: string | string[];
  };
  submittedAt: string;
}

