export interface MCloudResponse {
  success: boolean;
  media: {
    sources: MCloudResponseSource[];
  };
}

export interface MCloudResponseSource {
  file: string;
  label?: string;
}
