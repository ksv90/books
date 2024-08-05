/* eslint-disable @typescript-eslint/naming-convention */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: 'production' | 'development' | 'staging' | 'testing';
      WHITE_LIST: string;
      JWT_SECRET_KEY: string;
      POSTGRES_DB: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_HOST: string;
      POSTGRES_PORT: string;
    }
  }
}

export {};
