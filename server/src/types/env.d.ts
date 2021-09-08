declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_STORAGE_BUCKET_NAME: string;
    AWS_S3_CUSTOM_DOMAIN: string;
    AWS_S3_REGION: string;
    GMAIL_USER: string;
    GMAIL_PASSWORD: string;
  }
}
